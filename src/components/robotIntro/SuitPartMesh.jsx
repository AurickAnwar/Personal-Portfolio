import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { createTaperedLimbGeo } from './assemblyPartGeometries';

export function SuitPartMesh({ partId, materials }) {
  switch (partId) {
    case 'pelvis':
      return (
        <group>
          <RoundedBox args={[0.28, 0.12, 0.16]} radius={0.024} smoothness={3} material={materials.gunmetal} castShadow />
          <mesh position={[0, 0.02, 0.085]} material={materials.accentSoft}>
            <boxGeometry args={[0.16, 0.03, 0.02]} />
          </mesh>
        </group>
      );

    case 'torso':
      return (
        <group>
          <RoundedBox args={[0.34, 0.4, 0.17]} radius={0.032} smoothness={4} material={materials.gunmetal} castShadow />
          <RoundedBox args={[0.22, 0.24, 0.025]} radius={0.01} smoothness={2} position={[0, 0.08, 0.092]} material={materials.carbon} />
          <mesh position={[0, -0.1, 0.09]} material={materials.accentSoft}>
            <ringGeometry args={[0.038, 0.052, 24]} />
          </mesh>
        </group>
      );

    case 'shoulderL':
    case 'shoulderR':
      return (
        <group>
          <RoundedBox args={[0.11, 0.07, 0.13]} radius={0.015} smoothness={3} material={materials.silver} castShadow />
          <mesh position={[0, 0, 0.07]} material={materials.accent} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.034, 0.008, 10, 24]} />
          </mesh>
        </group>
      );

    case 'armL':
      return <ArmPart materials={materials} side={-1} />;

    case 'armR':
      return <ArmPart materials={materials} side={1} />;

    default:
      return null;
  }
}

function ArmPart({ materials, side }) {
  const upper = createTaperedLimbGeo(0.058, 0.048, 0.2);
  const fore = createTaperedLimbGeo(0.044, 0.036, 0.18);

  return (
    <group rotation={[0.08, 0, side * 0.16]}>
      <mesh position={[0, 0.1, 0]} material={materials.silver} castShadow>
        <primitive object={upper} attach="geometry" />
      </mesh>
      <mesh position={[side * 0.012, -0.08, 0.03]} material={materials.gunmetal} castShadow>
        <primitive object={fore} attach="geometry" />
      </mesh>
      <RoundedBox args={[0.08, 0.09, 0.07]} radius={0.012} smoothness={3} material={materials.carbon} position={[side * 0.015, -0.22, 0.05]} />
      <group position={[side * 0.018, -0.28, 0.065]} rotation={[0.12, side * 0.08, side * 0.12]}>
        <RoundedBox args={[0.07, 0.045, 0.07]} radius={0.01} smoothness={2} material={materials.carbon} position={[0, 0.02, 0]} />
        <RoundedBox args={[0.078, 0.085, 0.048]} radius={0.012} smoothness={3} material={materials.gunmetal} castShadow position={[0, -0.035, 0.012]} />
        <RoundedBox args={[0.07, 0.05, 0.03]} radius={0.008} smoothness={2} material={materials.silver} position={[0, -0.075, 0.035]} />
      </group>
    </group>
  );
}
