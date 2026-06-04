import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  clamp01,
  createHelmetGeometry,
  createRobotMaterials,
  createTaperedLimb,
  easeOutCubic,
  mountProgress,
} from './assemblyUtils';

function AssemblyPart({ groupRef, progress, windowStart, windowEnd, from, to, children }) {
  const mount = mountProgress(progress, windowStart, windowEnd);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = easeOutCubic(mount);
    group.position.set(
      THREE.MathUtils.lerp(from[0], to[0], t),
      THREE.MathUtils.lerp(from[1], to[1], t),
      THREE.MathUtils.lerp(from[2], to[2], t)
    );
    const scale = 0.2 + t * 0.8;
    group.scale.setScalar(scale);
    group.visible = mount > 0.015;

    group.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat.userData?._skipFade) return;
        mat.transparent = mount < 0.99;
        mat.opacity = 0.15 + mount * 0.85;
        mat.depthWrite = mount > 0.82;
      });
    });

    group.userData.weldIntensity =
      mount > 0.06 && mount < 0.94 ? 0.45 + Math.sin(state.clock.elapsedTime * 16) * 0.55 : 0;
  });

  return <group ref={groupRef}>{children}</group>;
}

function WeldPoint({ parentRef, offset = [0, 0, 0] }) {
  const lightRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
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

function LimbSegment({ upper, fore, hand, materials, side = 1 }) {
  return (
    <group rotation={[0.08, 0, side * 0.18]}>
      <mesh position={[0, 0.11, 0]} material={materials.silver} castShadow>
        <primitive object={upper} attach="geometry" />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={materials.accentSoft}>
        <sphereGeometry args={[0.048, 16, 16]} />
      </mesh>
      <mesh position={[side * 0.015, -0.06, 0.02]} material={materials.gunmetal} castShadow>
        <primitive object={fore} attach="geometry" />
      </mesh>
      <mesh position={[side * 0.02, -0.24, 0.05]} material={materials.gunmetal}>
        <RoundedBox args={[0.09, 0.1, 0.07]} radius={0.015} smoothness={4} />
      </mesh>
      <mesh position={[side * 0.02, -0.24, 0.1]} material={materials.accentSoft}>
        <primitive object={hand} attach="geometry" />
      </mesh>
    </group>
  );
}

function LegSegment({ materials }) {
  const thigh = useMemo(() => createTaperedLimb(0.075, 0.06, 0.34), []);
  const shin = useMemo(() => createTaperedLimb(0.055, 0.042, 0.36), []);

  return (
    <>
      <mesh position={[0, 0.14, 0]} material={materials.gunmetal} castShadow>
        <primitive object={thigh} attach="geometry" />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={materials.accentSoft} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.011, 10, 24]} />
      </mesh>
      <mesh position={[0, -0.1, 0.01]} material={materials.silver} castShadow>
        <primitive object={shin} attach="geometry" />
      </mesh>
      <mesh position={[0, -0.34, 0.08]} material={materials.carbon}>
        <RoundedBox args={[0.12, 0.05, 0.2]} radius={0.012} smoothness={3} />
      </mesh>
    </>
  );
}

export default function AssemblyRobot({ progress }) {
  const p = progress / 100;
  const materials = useMemo(() => createRobotMaterials(), []);
  const helmetGeo = useMemo(() => createHelmetGeometry(), []);
  const upperArmGeo = useMemo(() => createTaperedLimb(0.058, 0.048, 0.22), []);
  const foreArmGeo = useMemo(() => createTaperedLimb(0.044, 0.036, 0.2), []);
  const handGeo = useMemo(() => new THREE.BoxGeometry(0.06, 0.025, 0.04), []);

  const rootRef = useRef();
  const pelvisRef = useRef();
  const torsoRef = useRef();
  const headRef = useRef();
  const chestRef = useRef();
  const armLRef = useRef();
  const armRRef = useRef();
  const legLRef = useRef();
  const legRRef = useRef();

  useFrame((state) => {
    const root = rootRef.current;
    if (!root) return;
    const entrance = easeOutCubic(clamp01(p / 0.32));
    const idle = p >= 0.98;
    const breathe = idle ? Math.sin(state.clock.elapsedTime * 1.05) * 0.003 : 0;
    root.position.y = -0.9 * (1 - entrance) + breathe;
    root.rotation.y = idle ? Math.sin(state.clock.elapsedTime * 0.22) * 0.035 : 0;
  });

  const powered = mountProgress(p, 0.9, 1);

  return (
    <group ref={rootRef}>
      <AssemblyPart
        groupRef={pelvisRef}
        progress={p}
        windowStart={0}
        windowEnd={0.16}
        from={[0, -1.4, 0]}
        to={[0, -0.54, 0]}
      >
        <RoundedBox args={[0.3, 0.14, 0.18]} radius={0.028} smoothness={4} material={materials.gunmetal} castShadow />
        <mesh position={[0, 0.02, 0.09]} material={materials.accentSoft}>
          <boxGeometry args={[0.18, 0.035, 0.025]} />
        </mesh>
        <WeldPoint parentRef={pelvisRef} offset={[0, 0.08, 0.11]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={torsoRef}
        progress={p}
        windowStart={0.1}
        windowEnd={0.3}
        from={[0, -0.4, 0.5]}
        to={[0, 0.04, 0]}
      >
        <RoundedBox args={[0.36, 0.46, 0.19]} radius={0.035} smoothness={5} material={materials.gunmetal} castShadow />
        <mesh position={[0, 0.06, 0.098]} material={materials.carbon}>
          <RoundedBox args={[0.24, 0.28, 0.03]} radius={0.012} smoothness={3} />
        </mesh>
        <mesh position={[-0.19, 0.1, 0]} material={materials.silver}>
          <RoundedBox args={[0.06, 0.12, 0.14]} radius={0.02} smoothness={3} />
        </mesh>
        <mesh position={[0.19, 0.1, 0]} material={materials.silver}>
          <RoundedBox args={[0.06, 0.12, 0.14]} radius={0.02} smoothness={3} />
        </mesh>
        <mesh position={[0, -0.12, 0.1]} material={materials.accentSoft}>
          <ringGeometry args={[0.04, 0.055, 24]} />
        </mesh>
        <WeldPoint parentRef={torsoRef} offset={[0, -0.1, 0.14]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={headRef}
        progress={p}
        windowStart={0.24}
        windowEnd={0.42}
        from={[0, 1.1, 0.25]}
        to={[0, 0.52, 0]}
      >
        <mesh geometry={helmetGeo} material={materials.silver} castShadow rotation={[Math.PI, 0, 0]} position={[0, -0.12, 0]} />
        <mesh position={[0, 0.02, 0.11]} material={materials.visor}>
          <boxGeometry args={[0.17, 0.055, 0.02]} />
        </mesh>
        <mesh position={[0, 0.02, 0.125]} material={materials.accent}>
          <planeGeometry args={[0.1, 0.012]} />
        </mesh>
        <mesh position={[0, -0.16, 0]} material={materials.accentSoft}>
          <torusGeometry args={[0.055, 0.01, 10, 28]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        <WeldPoint parentRef={headRef} offset={[0, -0.14, 0.1]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={armLRef}
        progress={p}
        windowStart={0.36}
        windowEnd={0.54}
        from={[-1.05, 0.15, 0.35]}
        to={[-0.3, 0.1, 0]}
      >
        <LimbSegment upper={upperArmGeo} fore={foreArmGeo} hand={handGeo} materials={materials} side={-1} />
        <WeldPoint parentRef={armLRef} offset={[-0.02, 0.2, 0.08]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={armRRef}
        progress={p}
        windowStart={0.48}
        windowEnd={0.64}
        from={[1.05, 0.15, 0.35]}
        to={[0.3, 0.1, 0]}
      >
        <LimbSegment upper={upperArmGeo} fore={foreArmGeo} hand={handGeo} materials={materials} side={1} />
        <WeldPoint parentRef={armRRef} offset={[0.02, 0.2, 0.08]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={legLRef}
        progress={p}
        windowStart={0.58}
        windowEnd={0.76}
        from={[-0.24, -1.3, 0.2]}
        to={[-0.11, -0.54, 0]}
      >
        <LegSegment materials={materials} />
        <WeldPoint parentRef={legLRef} offset={[0, 0.28, 0.08]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={legRRef}
        progress={p}
        windowStart={0.68}
        windowEnd={0.86}
        from={[0.24, -1.3, 0.2]}
        to={[0.11, -0.54, 0]}
      >
        <LegSegment materials={materials} />
        <WeldPoint parentRef={legRRef} offset={[0, 0.28, 0.08]} />
      </AssemblyPart>

      <AssemblyPart
        groupRef={chestRef}
        progress={p}
        windowStart={0.82}
        windowEnd={0.98}
        from={[0, 0.18, 0.4]}
        to={[0, 0.08, 0.125]}
      >
        <RoundedBox
          args={[0.22, 0.18, 0.025]}
          radius={0.01}
          smoothness={3}
          material={materials.carbon}
          castShadow
        />
        <mesh position={[0, 0, 0.015]} material={materials.accent}>
          <planeGeometry args={[0.06, 0.12]} />
        </mesh>
        <WeldPoint parentRef={chestRef} offset={[0, 0, 0.04]} />
      </AssemblyPart>

      {powered > 0.05 && (
        <pointLight position={[0, 0.18, 0.35]} intensity={powered * 0.9} color="#7bf0ff" distance={1.8} />
      )}
    </group>
  );
}
