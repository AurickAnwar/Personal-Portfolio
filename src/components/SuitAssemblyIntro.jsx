import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTRO_DURATION_MS, INTRO_HOLD_MS } from './robotIntro/intro3dConfig';
import './SuitAssemblyIntro.css';

const IntroAssemblyScene = lazy(() => import('./robotIntro/IntroAssemblyScene'));

const TICK_MS = 40;

const STORY_STEPS = [
  {
    id: 1,
    threshold: 0,
    label: 'Panel 01',
    title: 'Walk to Gantry',
    caption: 'Tablet indicates readiness. Step onto the activation plate.',
    sfx: 'SFX: HYDRAULICS ACTIVATE',
  },
  {
    id: 2,
    threshold: 18,
    label: 'Panel 02',
    title: 'Torso Segment',
    caption: 'Robotic arms position and secure the torso over normal attire.',
    sfx: 'SFX: CLAMPING · COMPRESSION',
  },
  {
    id: 3,
    threshold: 44,
    label: 'Panel 03',
    title: 'Primary Lock',
    caption: 'Leg plates, shin guards, and boots lock in. Shoulder reactors online.',
    sfx: 'SFX: POWER UP HUM · RECTIFIER SYNC',
  },
  {
    id: 4,
    threshold: 72,
    label: 'Panel 04',
    title: 'Build Complete',
    caption: 'CAD shell locked. Arc reactor online.',
    sfx: 'SFX: PNEUMATIC SEAL · FLARE · DEPLOYMENT TONE',
  },
];

function getActiveStep(progress) {
  let active = STORY_STEPS[0];
  STORY_STEPS.forEach((step) => {
    if (progress >= step.threshold) active = step;
  });
  return active;
}

export default function SuitAssemblyIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [armsRetracted, setArmsRetracted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const activeStep = useMemo(() => getActiveStep(progress), [progress]);

  const beginExit = useCallback(() => {
    setIsExiting((prev) => {
      if (prev) return prev;
      window.setTimeout(() => onComplete?.(), 650);
      return true;
    });
  }, [onComplete]);

  useEffect(() => {
    setArmsRetracted(false);
    setProgress(0);
    setIsExiting(false);

    let elapsed = 0;
    const interval = window.setInterval(() => {
      elapsed += TICK_MS;
      const pct = Math.min(100, Math.round((elapsed / INTRO_DURATION_MS) * 100));
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
      }
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100 || isExiting) return undefined;

    const retractArms = window.setTimeout(() => setArmsRetracted(true), 350);
    const exitTimer = window.setTimeout(() => beginExit(), INTRO_HOLD_MS);

    return () => {
      window.clearTimeout(retractArms);
      window.clearTimeout(exitTimer);
    };
  }, [progress, isExiting, beginExit]);

  const handleSkip = useCallback(() => {
    beginExit();
  }, [beginExit]);

  useEffect(() => {
    if (isExiting) return undefined;

    let wheelAccum = 0;
    let touchStartY = null;
    let skipped = false;

    const trySkip = () => {
      if (skipped) return;
      skipped = true;
      handleSkip();
    };

    const onWheel = (event) => {
      wheelAccum += Math.abs(event.deltaY);
      if (wheelAccum > 90) trySkip();
    };

    const onTouchStart = (event) => {
      if (event.touches.length === 1) {
        touchStartY = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event) => {
      if (touchStartY == null) return;
      const deltaY = touchStartY - event.touches[0].clientY;
      if (Math.abs(deltaY) > 52) trySkip();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [handleSkip, isExiting]);

  return (
    <motion.div
      className="suit-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      role="dialog"
      aria-label="Suit assembly sequence"
    >
      <Suspense
        fallback={<div className="suit-intro__loading">Loading assembly bay…</div>}
      >
        <IntroAssemblyScene
          progress={progress}
          armsRetracted={armsRetracted}
          className="suit-intro__canvas"
        />
      </Suspense>

      <div className="suit-intro__vignette" aria-hidden="true" />

      <div className="suit-intro__hud">
        <div className="suit-intro__top">
          <p className="suit-intro__title">Suit Assembly Sequence</p>
          <button
            type="button"
            className="suit-intro__skip"
            onClick={handleSkip}
            aria-label="Skip suit assembly intro"
          >
            Scroll to skip
          </button>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              className="suit-intro__panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <p className="suit-intro__step-label">{activeStep.label}</p>
              <h2 className="suit-intro__step-title">{activeStep.title}</h2>
              <p className="suit-intro__step-caption">{activeStep.caption}</p>
              <p className="suit-intro__sfx">{activeStep.sfx}</p>
            </motion.div>
          </AnimatePresence>

          <div className="suit-intro__progress-wrap">
            <div className="suit-intro__progress-track">
              <div className="suit-intro__progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="suit-intro__progress-label">Assembly progress · {progress}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
