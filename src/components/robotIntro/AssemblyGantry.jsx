import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { clamp01, easeOutCubic } from './assemblyUtils';

/** Minimal assembly deck — no glow cylinder or halo. */
export default function AssemblyGantry({ progress }) {
  const p = progress / 100;
  const active = easeOutCubic(clamp01((p - 0.08) / 0.14));
  const deckRef = useRef();

  useFrame(() => {
    if (!deckRef.current) return;
    deckRef.current.material.opacity = 0.55 + active * 0.35;
  });

  return (
    <group position={[0, -0.76, 0]}>
      <mesh ref={deckRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.52, 48]} />
        <meshStandardMaterial
          color="#0a0e14"
          metalness={0.82}
          roughness={0.48}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.48, 0.52, 64]} />
        <meshBasicMaterial color="#1e2834" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
