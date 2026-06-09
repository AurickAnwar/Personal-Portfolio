import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const MOVE_IDLE_MS = 120;

/**
 * Small dot cursor — 1:1 with pointer; cyan glow while moving.
 */
export default function CustomCursor({ active }) {
  const trackRef = useRef(null);
  const moveTimerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnabled(media.matches && !reduced);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!active || !enabled) {
      document.body.classList.remove('custom-cursor-active');
      return undefined;
    }

    document.body.classList.add('custom-cursor-active');

    const onMove = (event) => {
      const { clientX, clientY } = event;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      setVisible(true);
      setHidden(!!event.target.closest('input, textarea, select, [contenteditable="true"]'));

      trackRef.current?.classList.add('custom-cursor__track--moving');
      window.clearTimeout(moveTimerRef.current);
      moveTimerRef.current = window.setTimeout(() => {
        trackRef.current?.classList.remove('custom-cursor__track--moving');
      }, MOVE_IDLE_MS);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.clearTimeout(moveTimerRef.current);
    };
  }, [active, enabled]);

  if (!active || !enabled) {
    return null;
  }

  return (
    <div
      className={`custom-cursor${visible ? ' custom-cursor--visible' : ''}${
        hidden ? ' custom-cursor--hidden' : ''
      }`}
      aria-hidden="true"
    >
      <span ref={trackRef} className="custom-cursor__track">
        <span className="custom-cursor__glow" />
        <span className="custom-cursor__glow custom-cursor__glow--outer" />
        <span className="custom-cursor__dot" />
      </span>
    </div>
  );
}
