import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Hero3DErrorBoundary from './hero3d/Hero3DErrorBoundary';
import HeroCanvasFallback from './hero3d/HeroCanvasFallback';
import { getDevice3DTier, getModelLoadTimeoutMs } from '../../utils/device3d';
import './BatmanHeroPortrait.css';

const HeroCanvas = lazy(() =>
  import('./hero3d/HeroCanvas').catch((err) => {
    console.warn('[hero3d] Chunk load failed:', err);
    return { default: HeroCanvasFallback };
  })
);

const BatmanHeroPortrait = () => {
  const tier = useMemo(() => getDevice3DTier(), []);
  const isLite = tier === 'lite';
  const [killshotActive, setKillshotActive] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const toggleKillshot = useCallback(() => {
    if (isLite) return;
    setKillshotActive((prev) => !prev);
  }, [isLite]);

  const handleCanvasReady = useCallback(() => setCanvasReady(true), []);

  useEffect(() => {
    if (canvasReady) return undefined;
    const timeout = window.setTimeout(() => {
      setLoadTimedOut(true);
    }, getModelLoadTimeoutMs(tier));
    return () => window.clearTimeout(timeout);
  }, [canvasReady, tier]);

  const showFallback = loadTimedOut && !canvasReady;
  const showingProfile = isLite && (showFallback || !canvasReady);

  return (
    <motion.div
      className={`batman-hero${showingProfile ? ' batman-hero--profile' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div className="batman-hero__stage">
        <motion.div className="batman-hero__art batman-hero__art--3d">
          <Hero3DErrorBoundary>
            {showFallback ? (
              <HeroCanvasFallback />
            ) : (
              <Suspense fallback={<HeroCanvasFallback />}>
                <HeroCanvas
                  killshotActive={killshotActive}
                  className="batman-hero__canvas"
                  onLoad={handleCanvasReady}
                />
              </Suspense>
            )}
          </Hero3DErrorBoundary>
        </motion.div>

        <motion.div className="batman-hero__controls">
          {!isLite && (
            <button
              type="button"
              className={`batman-hero__toggle ${killshotActive ? 'batman-hero__toggle--active' : ''}`}
              onClick={toggleKillshot}
              aria-pressed={killshotActive}
              aria-label={killshotActive ? 'Deactivate Killshot mode' : 'Activate Killshot mode'}
            >
              <span
                className={`batman-hero__toggle-status ${
                  killshotActive ? 'batman-hero__toggle-status--active' : ''
                }`}
                aria-hidden="true"
              />
              <span className="batman-hero__toggle-label">
                {killshotActive ? 'Killshot Active' : 'Activate Killshot'}
              </span>
            </button>
          )}
          {!canvasReady && !showFallback && (
            <span className="batman-hero__loading-hint">Loading model…</span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BatmanHeroPortrait;
