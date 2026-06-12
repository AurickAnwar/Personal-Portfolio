import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import AssemblyRobot from './AssemblyRobot';
import AssemblyArms3D from './AssemblyArms3D';
import AssemblyGantry from './AssemblyGantry';
import AssemblyCivilian from './AssemblyCivilian';
import AssemblyGLBAvatar from './AssemblyGLBAvatar';
import AvatarRig from './AvatarRig';
import { getActiveAssemblyTarget } from './assemblyUtils';
import { INTRO_CAMERA } from './intro3dConfig';
import { getCanvasDpr, getDevice3DTier } from '../../utils/device3d';

function IntroCameraRig({ progress }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const p = progress / 100;

  useFrame(() => {
    const wideW = Math.max(0, 1 - p / 0.32);
    const midW = Math.max(0, 1 - wideW);
    const closeW = 0;

    const pos = new THREE.Vector3()
      .addScaledVector(new THREE.Vector3(...INTRO_CAMERA.wide.position), wideW)
      .addScaledVector(new THREE.Vector3(...INTRO_CAMERA.mid.position), midW)
      .addScaledVector(new THREE.Vector3(...INTRO_CAMERA.close.position), closeW);

    lookAt
      .set(...INTRO_CAMERA.wide.lookAt)
      .multiplyScalar(wideW)
      .add(new THREE.Vector3(...INTRO_CAMERA.mid.lookAt).multiplyScalar(midW))
      .add(new THREE.Vector3(...INTRO_CAMERA.close.lookAt).multiplyScalar(closeW));

    camera.position.lerp(pos, 0.08);
    camera.lookAt(lookAt);
  });

  return null;
}

function IntroLights({ progress, lite }) {
  const keyRef = useRef();

  useFrame(() => {
    const t = progress / 100;
    if (keyRef.current) keyRef.current.intensity = 0.62 + t * 0.25;
  });

  return (
    <>
      <ambientLight intensity={lite ? 0.42 : 0.28} color="#e8eef4" />
      <directionalLight
        ref={keyRef}
        position={[2.2, 2.8, 3.8]}
        intensity={lite ? 0.78 : 0.62}
        color="#f0f4f8"
        castShadow={!lite}
      />
      <directionalLight position={[-2.4, 1.2, -2.2]} intensity={0.18} color="#94a3b8" />
    </>
  );
}

function WeldSparks({ progress, retracted, lite }) {
  const pointsRef = useRef();
  const count = lite ? 24 : 56;
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const { point, intensity, mounting } = getActiveAssemblyTarget(progress);
    const active = mounting && !retracted && intensity > 0.1;
    pts.visible = active;

    if (!active) return;

    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const angle = t * 8 + i * 0.9;
      const r = 0.025 + (i % 7) * 0.005;
      positions[i3] = point[0] + Math.cos(angle) * r;
      positions[i3 + 1] = point[1] + Math.sin(angle * 1.3) * r * 0.6;
      positions[i3 + 2] = point[2] + Math.sin(angle) * r;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.material.opacity = intensity * 0.8;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#7bf0ff"
        size={0.028}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function AssemblyFloor({ lite }) {
  return (
    <group position={[0, -0.76, 0]}>
      {!lite && (
        <ContactShadows opacity={0.28} scale={7} blur={2.2} far={1.2} color="#000000" />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!lite}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#05080c" metalness={0.35} roughness={0.72} />
      </mesh>
      <gridHelper args={[5, 20, '#1a2830', '#121820']} position={[0, 0.002, 0]} material-opacity={0.06} />
    </group>
  );
}

function SceneContent({ progress, armsRetracted, lite }) {
  return (
    <>
      <IntroCameraRig progress={progress} />
      <IntroLights progress={progress} lite={lite} />
      <Suspense fallback={null}>
        {!lite && <Environment preset="city" environmentIntensity={0.12} />}
        <AvatarRig progress={progress}>
          <AssemblyGLBAvatar progress={progress} lite={lite} />
          <AssemblyRobot progress={progress} lite={lite} />
          <AssemblyArms3D progress={progress} retracted={armsRetracted} />
          <WeldSparks progress={progress} retracted={armsRetracted} lite={lite} />
        </AvatarRig>
      </Suspense>
      <AssemblyFloor lite={lite} />
      <AssemblyGantry progress={progress} />
      <AssemblyCivilian progress={progress} />
      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.28} luminanceThreshold={0.92} luminanceSmoothing={0.4} mipmapBlur />
          <Vignette eskil={false} offset={0.12} darkness={0.55} />
        </EffectComposer>
      )}
    </>
  );
}

export default function IntroAssemblyScene({ progress, armsRetracted = false, className }) {
  const tier = useMemo(() => getDevice3DTier(), []);
  const lite = tier === 'lite';

  return (
    <Canvas
      className={className}
      dpr={getCanvasDpr(tier)}
      shadows={!lite}
      gl={{
        alpha: true,
        antialias: !lite,
        powerPreference: lite ? 'default' : 'high-performance',
      }}
      camera={{
        position: INTRO_CAMERA.wide.position,
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        if (!lite) {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.9;
        }
      }}
    >
      <SceneContent progress={progress} armsRetracted={armsRetracted} lite={lite} />
    </Canvas>
  );
}
