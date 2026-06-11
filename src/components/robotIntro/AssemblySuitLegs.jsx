import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  createRobotMaterials,
  createTaperedLimb,
  easeOutCubic,
  mountProgress,
} from './assemblyUtils';
import {
  INTRO_PELVIS_MAX_SCALE,
  INTRO_PELVIS_REF_DEPTH,
  INTRO_PELVIS_REF_WIDTH,
  INTRO_PELVIS_TOP_SCALE,
  INTRO_PELVIS_WIDTH_BIAS,
  INTRO_WAIST_Y,
} from './intro3dConfig';

const FOOT_SOLE_Y = -0.34;

function setSectionOpacity(group, opacity) {
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

function SuitPelvis({ progress, materials, hipY, waistScaleX, waistScaleZ, waistTopScaleX }) {
  const rootRef = useRef();
  const topRef = useRef();
  const hipRef = useRef();
  const mount = mountProgress(progress, 0.38, 0.5);

  useFrame(() => {
    if (!rootRef.current) return;
    const t = easeOutCubic(mount);
    rootRef.current.visible = t > 0.02;
    rootRef.current.scale.y = 0.2 + t * 0.8;
    if (topRef.current) {
      topRef.current.scale.set(waistScaleX * waistTopScaleX, 1, waistScaleZ);
    }
    if (hipRef.current) {
      hipRef.current.scale.set(waistScaleX, 1, waistScaleZ);
    }
    setSectionOpacity(rootRef.current, 0.25 + t * 0.75);
  });

  return (
    <group ref={rootRef} position={[0, hipY, 0.01]}>
      <group ref={topRef}>
        <RoundedBox args={[0.34, 0.14, 0.16]} radius={0.022} smoothness={4} material={materials.suit} castShadow position={[0, 0.17, 0.015]} />
        <RoundedBox args={[0.32, 0.11, 0.14]} radius={0.018} smoothness={3} material={materials.suitCore} castShadow position={[0, 0.24, 0.01]} />
      </group>
      <group ref={hipRef}>
        <RoundedBox args={[0.16, 0.14, 0.035]} radius={0.012} smoothness={3} material={materials.suitPlate} castShadow position={[0, 0.1, 0.095]} />
        <mesh position={[0, 0.1, 0.115]} material={materials.suitSeam}>
          <ringGeometry args={[0.038, 0.05, 24]} />
        </mesh>
        <RoundedBox args={[0.28, 0.11, 0.15]} radius={0.02} smoothness={4} material={materials.suit} castShadow position={[0, 0.04, 0.005]} />
        <RoundedBox args={[0.27, 0.04, 0.14]} radius={0.01} smoothness={2} material={materials.suitPlate} position={[0, 0.09, 0.04]} />
        <RoundedBox args={[0.23, 0.1, 0.03]} radius={0.012} smoothness={3} material={materials.suitCore} castShadow position={[0, 0.05, -0.075]} />
        <RoundedBox args={[0.105, 0.09, 0.12]} radius={0.016} smoothness={3} material={materials.suitPlate} castShadow position={[-0.118, -0.01, 0.015]} />
        <RoundedBox args={[0.105, 0.09, 0.12]} radius={0.016} smoothness={3} material={materials.suitPlate} castShadow position={[0.118, -0.01, 0.015]} />
        <RoundedBox args={[0.045, 0.11, 0.075]} radius={0.008} smoothness={2} material={materials.suitSeam} position={[-0.132, 0.04, 0.04]} />
        <RoundedBox args={[0.045, 0.11, 0.075]} radius={0.008} smoothness={2} material={materials.suitSeam} position={[0.132, 0.04, 0.04]} />
      </group>
    </group>
  );
}

function SuitLeg({ side, progress, materials, hipY, legSpreadX, legScaleX }) {
  const rootRef = useRef();
  const thighRef = useRef();
  const shinRef = useRef();
  const footRef = useRef();
  const x = side * legSpreadX;
  const legRootY = hipY - 0.08;

  const legStart = side < 0 ? 0.44 : 0.54;
  const thighEnd = side < 0 ? 0.54 : 0.64;
  const shinEnd = side < 0 ? 0.62 : 0.7;
  const footEnd = side < 0 ? 0.68 : 0.74;

  const thighMount = mountProgress(progress, legStart, thighEnd);
  const shinMount = mountProgress(progress, legStart + 0.04, shinEnd);
  const footMount = mountProgress(progress, legStart + 0.08, footEnd);
  const legVisible = thighMount > 0.02 || shinMount > 0.02 || footMount > 0.02;

  const upperGeo = useMemo(() => createTaperedLimb(0.062, 0.052, 0.2, 18), []);
  const lowerGeo = useMemo(() => createTaperedLimb(0.05, 0.042, 0.22, 18), []);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;
    root.visible = legVisible;
    root.scale.x = legScaleX;

    const applySection = (ref, mount) => {
      if (!ref.current) return;
      const t = easeOutCubic(mount);
      ref.current.visible = mount > 0.015;
      ref.current.scale.y = 0.15 + t * 0.85;
      setSectionOpacity(ref.current, 0.2 + t * 0.8);
    };

    applySection(thighRef, thighMount);
    applySection(shinRef, shinMount);
    applySection(footRef, footMount);
  });

  return (
    <group ref={rootRef} position={[x, legRootY, 0.01]}>
      <group ref={thighRef}>
        <RoundedBox args={[0.12, 0.05, 0.13]} radius={0.012} smoothness={3} material={materials.suit} castShadow position={[0, 0.02, 0.01]} />
        <mesh position={[0, -0.1, 0.015]} material={materials.suitCore} castShadow>
          <primitive object={upperGeo} attach="geometry" />
        </mesh>
        <RoundedBox args={[0.11, 0.2, 0.11]} radius={0.016} smoothness={4} material={materials.suitPlate} castShadow position={[side * 0.008, -0.1, 0.045]} />
      </group>
      <group ref={shinRef} position={[0, -0.18, 0]}>
        <mesh position={[0, -0.1, 0.02]} material={materials.suitCore} castShadow>
          <primitive object={lowerGeo} attach="geometry" />
        </mesh>
        <RoundedBox args={[0.09, 0.18, 0.095]} radius={0.012} smoothness={3} material={materials.suitPlate} castShadow position={[0, -0.1, 0.04]} />
        <RoundedBox args={[0.1, 0.065, 0.1]} radius={0.01} smoothness={2} material={materials.suit} position={[0, -0.02, 0.055]} />
      </group>
      <group ref={footRef} position={[0, -0.26, 0.015]}>
        <mesh position={[0, 0.02, 0.01]} material={materials.suitJoint} castShadow>
          <sphereGeometry args={[0.042, 14, 14]} />
        </mesh>
        <RoundedBox args={[0.11, 0.08, 0.15]} radius={0.012} smoothness={3} material={materials.suit} castShadow position={[0, -0.05, 0.035]} />
        <RoundedBox args={[0.1, 0.05, 0.09]} radius={0.008} smoothness={2} material={materials.suitPlate} castShadow position={[0, -0.055, 0.105]} rotation={[0.32, 0, 0]} />
        <RoundedBox args={[0.13, 0.028, 0.24]} radius={0.006} smoothness={2} material={materials.suitSole} position={[0, -0.082, 0.05]} />
      </group>
    </group>
  );
}

export default function AssemblySuitLegs({
  progress,
  hipY = INTRO_WAIST_Y,
  materials: materialsProp,
  torsoSpan = null,
}) {
  const p = progress / 100;
  const waistScaleX = THREE.MathUtils.clamp(
    ((torsoSpan?.width ?? INTRO_PELVIS_REF_WIDTH) * INTRO_PELVIS_WIDTH_BIAS) / INTRO_PELVIS_REF_WIDTH,
    1.0,
    INTRO_PELVIS_MAX_SCALE
  );
  const waistScaleZ = THREE.MathUtils.clamp(
    torsoSpan?.depth ? torsoSpan.depth / INTRO_PELVIS_REF_DEPTH : waistScaleX * 0.92,
    0.88,
    INTRO_PELVIS_MAX_SCALE
  );
  const legSpreadX = 0.092 * waistScaleX;
  const legScaleX = THREE.MathUtils.clamp(waistScaleX * 0.9, 0.86, 1.08);

  const materials = useMemo(() => {
    if (materialsProp) return materialsProp;
    const base = createRobotMaterials();
    const suit = base.gunmetal.clone();
    suit.color = new THREE.Color('#141920');
    const suitCore = base.gunmetal.clone();
    suitCore.color = new THREE.Color('#0f1318');
    const suitPlate = base.carbon.clone();
    const suitSole = base.carbon.clone();
    const suitSeam = base.gunmetal.clone();
    const suitJoint = base.silver.clone();
    return { suit, suitCore, suitPlate, suitSole, suitSeam, suitJoint };
  }, [materialsProp]);

  return (
    <group>
      <SuitPelvis
        progress={p}
        materials={materials}
        hipY={hipY}
        waistScaleX={waistScaleX}
        waistScaleZ={waistScaleZ}
        waistTopScaleX={INTRO_PELVIS_TOP_SCALE}
      />
      <SuitLeg side={-1} progress={p} materials={materials} hipY={hipY} legSpreadX={legSpreadX} legScaleX={legScaleX} />
      <SuitLeg side={1} progress={p} materials={materials} hipY={hipY} legSpreadX={legSpreadX} legScaleX={legScaleX} />
      <mesh visible={false} position={[0, FOOT_SOLE_Y, 0]}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
      </mesh>
    </group>
  );
}
