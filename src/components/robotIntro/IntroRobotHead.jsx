import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { createRobotMaterials, easeOutCubic, mountProgress } from './assemblyUtils';
import { PART_ANCHORS } from './assemblyPartGeometries';

/** Lite intro — block CAD helmet mounted on the procedural suit torso. */
export default function IntroRobotHead({ progress }) {
  const rootRef = useRef();
  const mount = mountProgress(progress / 100, 0.46, 0.6);
  const [x, y, z] = PART_ANCHORS.mask;
  const materials = useMemo(() => createRobotMaterials(), []);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;

    const t = easeOutCubic(mount);
    root.visible = t > 0.02;
    root.scale.setScalar(0.35 + t * 0.65);

    root.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material.transparent = t < 0.995;
      child.material.opacity = t;
    });
  });

  return (
    <group ref={rootRef} position={[x, y, z]}>
      <RoundedBox
        args={[0.2, 0.22, 0.18]}
        radius={0.028}
        smoothness={4}
        material={materials.gunmetal}
        castShadow
      />
      <RoundedBox
        args={[0.17, 0.1, 0.14]}
        radius={0.02}
        smoothness={3}
        material={materials.carbon}
        position={[0, -0.04, 0.02]}
      />
      <RoundedBox
        args={[0.14, 0.05, 0.03]}
        radius={0.008}
        smoothness={2}
        material={materials.silver}
        position={[0, 0.03, 0.098]}
      />
      <mesh position={[0, 0.03, 0.112]} material={materials.accent}>
        <boxGeometry args={[0.1, 0.028, 0.012]} />
      </mesh>
      <mesh position={[0, -0.02, 0.1]} material={materials.accentSoft}>
        <ringGeometry args={[0.024, 0.034, 20]} />
      </mesh>
      <RoundedBox
        args={[0.06, 0.04, 0.04]}
        radius={0.006}
        smoothness={2}
        material={materials.silver}
        position={[-0.11, 0.06, 0.04]}
      />
      <RoundedBox
        args={[0.06, 0.04, 0.04]}
        radius={0.006}
        smoothness={2}
        material={materials.silver}
        position={[0.11, 0.06, 0.04]}
      />
    </group>
  );
}
