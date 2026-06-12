import React, { Suspense, useCallback, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroSceneContent, { CAMERA } from './HeroSceneContent';
import { getCanvasDpr, getDevice3DTier } from '../../../utils/device3d';

/**
 * Transparent WebGL canvas sized to the hero stage (matches former PNG footprint).
 */
export default function HeroCanvas({ killshotActive, className, onLoad }) {
  const pointer = useRef({ x: 0, y: 0 });
  const tier = useMemo(() => getDevice3DTier(), []);
  const isLite = tier === 'lite';

  const onPointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  const onPointerLeave = useCallback(() => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  }, []);

  return (
    <Canvas
      className={className}
      dpr={getCanvasDpr(tier)}
      gl={{
        alpha: true,
        antialias: !isLite,
        powerPreference: isLite ? 'default' : 'high-performance',
      }}
      camera={{
        position: CAMERA.idle.position,
        fov: CAMERA.idle.fov,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 0.92;
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Suspense fallback={null}>
        <HeroSceneContent
          killshotActive={killshotActive}
          pointer={pointer}
          onReady={onLoad}
          qualityTier={tier}
        />
      </Suspense>
    </Canvas>
  );
}
