import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getActiveAssemblyTarget } from './assemblyUtils';

const ARM_METAL = new THREE.MeshStandardMaterial({
  color: '#2a3340',
  metalness: 0.88,
  roughness: 0.32,
});

const ARM_ACCENT = new THREE.MeshStandardMaterial({
  color: '#7bf0ff',
  emissive: '#7bf0ff',
  emissiveIntensity: 0.65,
  metalness: 0.2,
  roughness: 0.4,
});

function RoboticArm({ basePosition, baseRotation, progress, retracted, phaseOffset }) {
  const rootRef = useRef();
  const seg1Ref = useRef();
  const seg2Ref = useRef();
  const tipRef = useRef();
  const weldLightRef = useRef();
  const visRef = useRef(0);

  useFrame((state) => {
    const root = rootRef.current;
    const seg1 = seg1Ref.current;
    const seg2 = seg2Ref.current;
    const tip = tipRef.current;
    const weldLight = weldLightRef.current;
    if (!root || !seg1 || !seg2 || !tip || !weldLight) return;

    const { point, intensity, mounting } = getActiveAssemblyTarget(progress);
    const target = new THREE.Vector3(point[0], point[1], point[2]);
    const t = state.clock.elapsedTime + phaseOffset;

    const targetVis = retracted ? 0 : Math.min(1, progress / 14);
    visRef.current = THREE.MathUtils.lerp(visRef.current, targetVis, retracted ? 0.12 : 0.08);
    const visibility = visRef.current;

    root.visible = visibility > 0.04;
    root.position.y = THREE.MathUtils.lerp(basePosition[1] - 0.55, basePosition[1], visibility);

    if (mounting && !retracted) {
      const sway = Math.sin(t * 2.4) * 0.12;
      seg1.rotation.z = baseRotation[2] + sway;
      seg2.rotation.z = -0.55 + Math.sin(t * 3.1) * 0.1;
      tip.rotation.z = Math.sin(t * 4.2) * 0.08;
    } else {
      seg1.rotation.z = THREE.MathUtils.lerp(seg1.rotation.z, baseRotation[2] * 0.4, 0.06);
      seg2.rotation.z = THREE.MathUtils.lerp(seg2.rotation.z, -0.35, 0.06);
    }

    tip.lookAt(target);
    weldLight.intensity = mounting && !retracted ? intensity * 2.5 : 0;
    weldLight.visible = weldLight.intensity > 0.05;
  });

  return (
    <group ref={rootRef} position={basePosition} rotation={baseRotation}>
      <mesh material={ARM_METAL} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
      </mesh>

      <group ref={seg1Ref} position={[0, 0.08, 0]}>
        <mesh position={[0, 0.22, 0]} material={ARM_METAL}>
          <boxGeometry args={[0.09, 0.44, 0.09]} />
        </mesh>
        <mesh position={[0, 0.44, 0]} material={ARM_ACCENT}>
          <sphereGeometry args={[0.045, 12, 12]} />
        </mesh>

        <group ref={seg2Ref} position={[0, 0.44, 0]}>
          <mesh position={[0, 0.2, 0.05]} rotation={[0.35, 0, 0]} material={ARM_METAL}>
            <boxGeometry args={[0.07, 0.38, 0.07]} />
          </mesh>

          <group ref={tipRef} position={[0, 0.4, 0.12]}>
            <RoundedBox args={[0.08, 0.06, 0.14]} radius={0.012} smoothness={3} material={ARM_METAL} />
            <mesh position={[0, 0, 0.1]} material={ARM_ACCENT} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.025, 0.08, 12]} />
            </mesh>
            <pointLight ref={weldLightRef} color="#7bf0ff" distance={0.6} intensity={0} />
          </group>
        </group>
      </group>
    </group>
  );
}

export default function AssemblyArms3D({ progress, retracted }) {
  return (
    <group>
      <RoboticArm
        basePosition={[-0.72, 0.35, 0.45]}
        baseRotation={[0, 0.45, 0.55]}
        progress={progress}
        retracted={retracted}
        phaseOffset={0}
      />
      <RoboticArm
        basePosition={[0.78, 0.55, 0.35]}
        baseRotation={[0, -0.35, -0.45]}
        progress={progress}
        retracted={retracted}
        phaseOffset={1.4}
      />
      <RoboticArm
        basePosition={[0.55, -0.15, 0.55]}
        baseRotation={[0, -0.55, -0.25]}
        progress={progress}
        retracted={retracted}
        phaseOffset={2.8}
      />
    </group>
  );
}
