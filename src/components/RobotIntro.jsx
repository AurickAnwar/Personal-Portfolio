import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroAssemblyScene from './robotIntro/IntroAssemblyScene';

const CYAN = '#7bf0ff';
const CANVAS = '#0a0f14';
const LOAD_DURATION_MS = 2800;
const TICK_MS = 40;

const STEPS = [
  {
    id: 1,
    title: 'Core Systems Check',
    status: '[SYSTEM: ONLINE]',
    threshold: 0,
    icon: 'cpu',
  },
  {
    id: 2,
    title: 'Content Modules',
    status: '[HOME, PROJECTS, CONTACT, LIFE]: LINKED',
    threshold: 18,
    icon: 'link',
    showProgress: true,
  },
  {
    id: 3,
    title: 'Deployment',
    status: '[LIVE]: SYNCING...',
    threshold: 58,
    icon: 'gear',
  },
];

const CALLOUTS = [
  { label: 'CORE-SPINE', value: 'MOUNTED', top: '78%', left: '10%', minProgress: 12 },
  { label: 'JOINT-SERVO', value: 'OK', top: '22%', left: '8%', minProgress: 38 },
  { label: 'POWER-LINK', value: 'ACTIVE', top: '48%', right: '6%', minProgress: 58 },
  { label: 'ARMOR-MESH', value: 'SYNC', top: '68%', left: '12%', minProgress: 88 },
];

function HudFrame() {
  return (
    <div className="pointer-events-none absolute inset-6 sm:inset-[24px]" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none" fill="none">
        <rect
          x="1"
          y="1"
          width="998"
          height="698"
          rx="6"
          stroke={CYAN}
          strokeWidth="1.2"
          strokeOpacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
        <path d="M24 1 H120 M880 1 H976" stroke={CYAN} strokeWidth="2" strokeOpacity="0.85" />
        <path d="M24 699 H120 M880 699 H976" stroke={CYAN} strokeWidth="2" strokeOpacity="0.85" />
        <path d="M1 24 V72 M1 628 V676" stroke={CYAN} strokeWidth="2" strokeOpacity="0.85" />
        <path d="M999 24 V72 M999 628 V676" stroke={CYAN} strokeWidth="2" strokeOpacity="0.85" />
        <rect x="8" y="8" width="10" height="10" stroke={CYAN} strokeWidth="1" strokeOpacity="0.45" />
        <rect x="982" y="8" width="10" height="10" stroke={CYAN} strokeWidth="1" strokeOpacity="0.45" />
        <rect x="8" y="682" width="10" height="10" stroke={CYAN} strokeWidth="1" strokeOpacity="0.45" />
        <rect x="982" y="682" width="10" height="10" stroke={CYAN} strokeWidth="1" strokeOpacity="0.45" />
      </svg>
    </div>
  );
}

function StepIcon({ type, active }) {
  const stroke = active ? CYAN : 'rgba(123, 240, 255, 0.25)';
  const glow = active ? 'drop-shadow(0 0 6px rgba(123,240,255,0.85))' : 'none';

  if (type === 'cpu') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: glow }} aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" stroke={stroke} strokeWidth="1.2" />
        <path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3" stroke={stroke} strokeWidth="1.2" />
      </svg>
    );
  }

  if (type === 'link') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: glow }} aria-hidden="true">
        <path d="M10 14a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke={stroke} strokeWidth="1.2" fill="none" />
        <path d="M14 10a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke={stroke} strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: glow }} aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.2" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

function DataPanel({ lines, className }) {
  return (
    <div
      className={`rounded border border-[#7bf0ff]/25 bg-[#0a0f14]/80 px-3 py-2 font-mono text-[9px] leading-relaxed tracking-wide text-[#7bf0ff]/80 backdrop-blur-sm sm:text-[10px] ${className}`}
      style={{ boxShadow: '0 0 24px rgba(123,240,255,0.08)' }}
    >
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function RobotVisualizer({ progress, armsRetracted }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px]">
      <div
        className="absolute inset-x-[10%] bottom-[8%] h-[22%] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(123,240,255,0.18) 0%, transparent 72%)' }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <IntroAssemblyScene
          progress={progress}
          armsRetracted={armsRetracted}
          className="h-full w-full"
        />
      </motion.div>

      <AnimatePresence>
        {progress > 8 &&
          CALLOUTS.filter((c) => progress >= c.minProgress).map((callout, i) => (
            <motion.div
              key={callout.label}
              className="pointer-events-none absolute font-mono text-[8px] tracking-wider text-[#7bf0ff]/70 sm:text-[9px]"
              style={{
                top: callout.top,
                left: callout.left,
                right: callout.right,
                filter: 'drop-shadow(0 0 4px rgba(123,240,255,0.5))',
              }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <span className="text-[#7bf0ff]/45">{callout.label}:</span> {callout.value}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Cinematic robot assembly & system initialization intro.
 * @param {{ onComplete: () => void }} props
 */
export default function RobotIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [armsRetracted, setArmsRetracted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    setIsReady(false);
    setArmsRetracted(false);
    setProgress(0);

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += TICK_MS;
      const pct = Math.min(100, Math.round((elapsed / LOAD_DURATION_MS) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 320);
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [loadKey]);

  const restartSequence = useCallback(() => {
    setLoadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setArmsRetracted(true), 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isReady]);

  const finishIntro = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => onComplete?.(), 650);
  }, [isExiting, onComplete]);

  const handleSkip = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => onComplete?.(), 400);
  }, [isExiting, onComplete]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSkip]);

  const getStepState = (threshold) => {
    if (progress < threshold) return 'pending';
    if (progress >= 100 && threshold <= 58) return 'complete';
    if (progress >= threshold) return 'active';
    return 'pending';
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden font-mono text-[#7bf0ff]"
      style={{
        backgroundColor: CANVAS,
        backgroundImage:
          'linear-gradient(rgba(123,240,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(123,240,255,0.035) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      role="dialog"
      aria-label="Portfolio system initialization"
    >
      <HudFrame />

      <DataPanel
        className="absolute left-8 top-8 hidden max-w-[190px] sm:block lg:left-10 lg:top-10"
        lines={['DATA-ANALYSIS: OK', 'RUNTIME: OK', 'SYSTEM CORE-7: ACTIVE', 'DATAFLOW: STREAMING']}
      />

      <DataPanel
        className="absolute bottom-8 right-8 hidden max-w-[210px] sm:block lg:bottom-10 lg:right-10"
        lines={[
          'SYSTEM OPERATING-STATUS: NORM',
          'LINK-STATE: SYNC',
          'CORE-DATA-STREAM: 07-E4',
          'SYSTEM: 300487',
        ]}
      />

      <p
        className="absolute right-8 top-8 text-[10px] tracking-widest text-[#7bf0ff]/45 sm:right-10 sm:top-10"
        aria-hidden="true"
      >
        press <kbd className="rounded border border-[#7bf0ff]/25 px-1.5 py-0.5">^C</kbd> to skip
      </p>

      <div className="flex h-full items-center justify-center px-6 py-16 sm:px-10 sm:py-[72px]">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — Telemetry HUD */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="mb-8 space-y-2">
              <p
                className="text-[11px] font-medium uppercase tracking-[0.22em] sm:text-xs"
                style={{ filter: 'drop-shadow(0 0 8px rgba(123,240,255,0.45))' }}
              >
                Initiating Aurick&apos;s Portfolio:
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] sm:text-xs">
                <span className="text-[#7bf0ff]/55">[</span>
                System Status:{' '}
                <span className="animate-pulse text-[#7bf0ff]" style={{ filter: 'drop-shadow(0 0 6px rgba(123,240,255,0.8))' }}>
                  ACTIVE
                </span>
                <span className="text-[#7bf0ff]/55">]</span>
              </p>
            </div>

            <ol className="space-y-7">
              {STEPS.map((step, index) => {
                const state = getStepState(step.threshold);
                const active = state !== 'pending';
                const bright = state === 'active' && progress < 100;

                return (
                  <motion.li
                    key={step.id}
                    className="relative pl-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
                  >
                    {index < STEPS.length - 1 && (
                      <span
                        className="absolute left-[10px] top-7 h-[calc(100%+12px)] w-px"
                        style={{
                          background: active
                            ? 'linear-gradient(to bottom, rgba(123,240,255,0.55), rgba(123,240,255,0.08))'
                            : 'rgba(123,240,255,0.08)',
                        }}
                        aria-hidden="true"
                      />
                    )}

                    <span className="absolute left-0 top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded border border-[#7bf0ff]/20 bg-[#0a0f14]/60">
                      <StepIcon type={step.icon} active={active} />
                    </span>

                    <div
                      className="transition-all duration-500"
                      style={{
                        opacity: active ? 1 : 0.28,
                        filter: bright ? 'drop-shadow(0 0 10px rgba(123,240,255,0.55))' : 'none',
                      }}
                    >
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#7bf0ff]/90 sm:text-xs">
                        Step {step.id}: {step.title}
                      </p>
                      <p className="mt-1 text-[10px] tracking-wide text-[#7bf0ff]/70 sm:text-[11px]">{step.status}</p>

                      {step.showProgress && (
                        <div className="mt-3 space-y-1.5">
                          <div className="h-[3px] w-full max-w-[280px] overflow-hidden rounded-full bg-[#7bf0ff]/10">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, rgba(123,240,255,0.35), ${CYAN})`,
                                boxShadow: '0 0 12px rgba(123,240,255,0.75)',
                              }}
                              initial={{ width: '0%' }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.12, ease: 'linear' }}
                            />
                          </div>
                          <p className="text-[9px] tracking-[0.2em] text-[#7bf0ff]/50">
                            [PROGRESS: {progress}%]
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            <AnimatePresence>
              {isReady && (
                <motion.div
                  className="mt-10 space-y-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <div
                    className="rounded border border-[#7bf0ff]/35 px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
                    style={{ boxShadow: '0 0 28px rgba(123,240,255,0.12)' }}
                  >
                    System ready for initialization.
                  </div>

                  <p className="text-center text-[10px] tracking-wide text-[#7bf0ff]/65 sm:text-[11px]">
                    Continue to main interface?
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      onClick={finishIntro}
                      className="rounded border border-[#7bf0ff] bg-[#7bf0ff]/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#7bf0ff]/20 sm:text-[11px]"
                      style={{
                        boxShadow: '0 0 24px rgba(123,240,255,0.35), inset 0 0 12px rgba(123,240,255,0.08)',
                        filter: 'drop-shadow(0 0 8px rgba(123,240,255,0.45))',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      [Yes] Initialize Workspace
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={restartSequence}
                      className="rounded border border-[#7bf0ff]/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#7bf0ff]/55 transition-colors hover:border-[#7bf0ff]/45 hover:text-[#7bf0ff]/80 sm:text-[11px]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      [No]
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT — Robot assembly visualizer */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
          >
            <RobotVisualizer progress={progress} armsRetracted={armsRetracted} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
