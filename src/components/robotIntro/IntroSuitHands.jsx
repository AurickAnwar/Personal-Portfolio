import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { createRobotMaterials } from './assemblyUtils';

function setOpacity(group, opacity) {
  if (!group) return;
  group.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      mat.transparent = opacity < 0.995;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.55;
    });
  });
}

function SuitHand({ side, materials }) {
  const x = side * 0.335;
  const palmRot = side * 0.12;

  return (
    <group position={[x, -0.04, 0.055]} rotation={[0.12, side * 0.08, palmRot]}>
      <RoundedBox args={[0.072, 0.05, 0.075]} radius={0.012} smoothness={3} material={materials.suitPlate} castShadow position={[0, 0.02, 0]} />
      <RoundedBox args={[0.082, 0.095, 0.05]} radius={0.014} smoothness={4} material={materials.suit} castShadow position={[0, -0.04, 0.015]} />
      <RoundedBox args={[0.074, 0.058, 0.032]} radius={0.008} smoothness={2} material={materials.suitCore} castShadow position={[0, -0.085, 0.038]} />
    </group>
  );
}

export default function IntroSuitHands({ opacity = 1, materials: materialsProp }) {
  const rootRef = useRef();
  const visRef = useRef(0);

  const materials = useMemo(() => {
    if (materialsProp) return materialsProp;
    const base = createRobotMaterials();
    return {
      suit: base.gunmetal.clone(),
      suitCore: base.gunmetal.clone(),
      suitPlate: base.carbon.clone(),
    };
  }, [materialsProp]);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;
    visRef.current = THREE.MathUtils.lerp(visRef.current, opacity, 0.12);
    const vis = visRef.current;
    root.visible = vis > 0.03;
    setOpacity(root, vis);
  });

  return (
    <group ref={rootRef} userData={{ _skipWaistAlign: true }}>
      <SuitHand side={-1} materials={materials} />
      <SuitHand side={1} materials={materials} />
    </group>
  );
}
