import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  clamp01,
  createRobotMaterials,
  easeOutCubic,
  mountProgress,
} from './assemblyUtils';
import { ASSEMBLY_SEQUENCE, PART_ANCHORS } from './assemblyPartGeometries';
import { SuitPartMesh } from './SuitPartMesh';

function AssemblyPart({ groupRef, progress, stage, children }) {
  const mount = mountProgress(progress, stage.start, stage.end);
  const proceduralFade = 1 - easeOutCubic(clamp01((progress - 0.36) / 0.28));
  const anchor = PART_ANCHORS[stage.anchor];
  const from = stage.from;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = easeOutCubic(mount);
    group.position.set(
      THREE.MathUtils.lerp(from[0], anchor[0], t),
      THREE.MathUtils.lerp(from[1], anchor[1], t),
      THREE.MathUtils.lerp(from[2], anchor[2], t)
    );
    group.scale.setScalar(0.18 + t * 0.82);
    group.visible = mount > 0.012;

    group.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat.userData?._skipFade) return;
        mat.transparent = mount < 0.99 || proceduralFade < 0.99;
        mat.opacity = (0.12 + mount * 0.88) * proceduralFade;
        mat.depthWrite = mount > 0.8 && proceduralFade > 0.6;
      });
    });

    group.userData.weldIntensity =
      mount > 0.05 && mount < 0.94 ? 0.45 + Math.sin(state.clock.elapsedTime * 16) * 0.55 : 0;
  });

  return <group ref={groupRef}>{children}</group>;
}

function WeldPoint({ parentRef, offset = [0, 0, 0] }) {
  const lightRef = useRef();
  const coreRef = useRef();

  useFrame(() => {
    const parent = parentRef.current;
    const light = lightRef.current;
    const core = coreRef.current;
    if (!parent || !light || !core) return;

    const intensity = parent.userData.weldIntensity ?? 0;
    const active = intensity > 0.08;
    core.visible = active;
    light.visible = active;
    core.position.set(offset[0], offset[1], offset[2]);
    light.position.set(offset[0], offset[1], offset[2] + 0.02);
    core.material.opacity = intensity * 0.85;
    core.scale.setScalar(0.012 + intensity * 0.018);
    light.intensity = intensity * 2.2;
  });

  return (
    <>
      <mesh ref={coreRef} visible={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#7bf0ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} color="#7bf0ff" distance={0.45} intensity={0} visible={false} />
    </>
  );
}

export default function AssemblyRobot({ progress }) {
  const p = progress / 100;
  const materials = useMemo(() => createRobotMaterials(), []);
  const partRefs = useMemo(() => Object.fromEntries(ASSEMBLY_SEQUENCE.map((s) => [s.id, React.createRef()])), []);

  const powered = mountProgress(p, 0.88, 1);
  const getRef = (id) => partRefs[id];

  return (
    <group scale={0.92}>
      {ASSEMBLY_SEQUENCE.map((stage) => (
        <AssemblyPart key={stage.id} groupRef={getRef(stage.id)} progress={p} stage={stage}>
          <SuitPartMesh partId={stage.id} materials={materials} />
          <WeldPoint parentRef={getRef(stage.id)} offset={stage.weld} />
        </AssemblyPart>
      ))}

      {powered > 0.05 && (
        <pointLight position={[0, 0.18, 0.35]} intensity={powered * 0.35} color="#7bf0ff" distance={1.2} />
      )}
    </group>
  );
}
