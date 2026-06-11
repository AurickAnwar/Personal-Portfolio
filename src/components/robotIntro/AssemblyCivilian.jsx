import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { clamp01, easeOutCubic } from './assemblyUtils';

const HOODIE = new THREE.MeshStandardMaterial({
  color: '#1a1f28',
  roughness: 0.88,
  metalness: 0.05,
});

const PANTS = new THREE.MeshStandardMaterial({
  color: '#3d4654',
  roughness: 0.92,
  metalness: 0.04,
});

const SKIN = new THREE.MeshStandardMaterial({
  color: '#c4a98a',
  roughness: 0.75,
  metalness: 0.02,
});

export default function AssemblyCivilian({ progress }) {
  const rootRef = useRef();
  const tabletRef = useRef();
  const p = progress / 100;

  const walk = easeOutCubic(clamp01(p / 0.11));
  const onPlate = easeOutCubic(clamp01((p - 0.1) / 0.08));
  const fadeOut = 1 - easeOutCubic(clamp01((p - 0.22) / 0.18));

  useFrame((state) => {
    const root = rootRef.current;
    const tablet = tabletRef.current;
    if (!root) return;

    root.position.z = THREE.MathUtils.lerp(0.95, 0, walk);
    root.position.y = THREE.MathUtils.lerp(-0.68, -0.52, onPlate);
    root.visible = fadeOut > 0.04;

    root.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material.transparent = fadeOut < 0.99;
      child.material.opacity = fadeOut;
    });

    if (tablet) {
      tablet.rotation.x = -0.35 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      tablet.rotation.y = 0.25 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    }
  });

  const tabletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7bf0ff',
        emissive: '#7bf0ff',
        emissiveIntensity: 0.35 + onPlate * 0.4,
        metalness: 0.4,
        roughness: 0.35,
      }),
    [onPlate]
  );

  return (
    <group ref={rootRef} position={[0, -0.68, 0.95]}>
      <mesh position={[0, 0.78, 0]} material={SKIN} castShadow>
        <sphereGeometry args={[0.09, 20, 20]} />
      </mesh>
      <RoundedBox args={[0.28, 0.38, 0.16]} radius={0.04} smoothness={3} material={HOODIE} castShadow />
      <mesh position={[0, 0.52, 0]} material={HOODIE}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh position={[-0.07, 0.08, 0]} material={PANTS} castShadow>
        <boxGeometry args={[0.1, 0.42, 0.12]} />
      </mesh>
      <mesh position={[0.07, 0.08, 0]} material={PANTS} castShadow>
        <boxGeometry args={[0.1, 0.42, 0.12]} />
      </mesh>
      <group ref={tabletRef} position={[0.18, 0.42, 0.12]}>
        <mesh material={tabletMat}>
          <boxGeometry args={[0.12, 0.16, 0.012]} />
        </mesh>
      </group>
    </group>
  );
}
