import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import AssemblyRobot from './AssemblyRobot';
import AssemblyArms3D from './AssemblyArms3D';
import { getActiveAssemblyTarget } from './assemblyUtils';

const INTRO_CAMERA = {
  position: [0, 0.06, 3.25],
  fov: 36,
  lookAt: [0, 0.04, 0],
};

function IntroLights({ progress }) {
  const keyRef = useRef();
  const rimRef = useRef();

  useFrame(() => {
    const t = progress / 100;
    if (keyRef.current) keyRef.current.intensity = 0.55 + t * 0.35;
    if (rimRef.current) rimRef.current.intensity = 0.85 + t * 0.65;
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#0c1218" />
      <directionalLight ref={keyRef} position={[1.8, 2.2, 3.5]} intensity={0.55} color="#c8e8ff" />
      <directionalLight ref={rimRef} position={[-2.8, 0.8, -1.8]} intensity={0.85} color="#7bf0ff" />
      <spotLight
        position={[0, 1.8, 1.2]}
        angle={0.35}
        penumbra={0.8}
        intensity={0.25 + progress * 0.004}
        color="#7bf0ff"
        distance={6}
      />
    </>
  );
}

function WeldSparks({ progress, retracted }) {
  const pointsRef = useRef();
  const count = 48;
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
      const r = 0.02 + (i % 7) * 0.004;
      positions[i3] = point[0] + Math.cos(angle) * r;
      positions[i3 + 1] = point[1] + Math.sin(angle * 1.3) * r * 0.6;
      positions[i3 + 2] = point[2] + Math.sin(angle) * r;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.material.opacity = intensity * 0.75;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#7bf0ff"
        size={0.025}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function AssemblyFloor() {
  return (
    <group position={[0, -0.76, 0]}>
      <ContactShadows
        opacity={0.45}
        scale={8}
        blur={2.4}
        far={1.4}
        color="#000000"
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.1, 64]} />
        <meshStandardMaterial
          color="#060a0e"
          metalness={0.85}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <gridHelper args={[3.5, 24, '#7bf0ff', '#1a2830']} position={[0, 0.001, 0]} material-opacity={0.12} />
    </group>
  );
}

function SceneContent({ progress, armsRetracted }) {
  return (
    <>
      <IntroLights progress={progress} />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>
      <AssemblyFloor />
      <AssemblyRobot progress={progress} />
      <AssemblyArms3D progress={progress} retracted={armsRetracted} />
      <WeldSparks progress={progress} retracted={armsRetracted} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.35} mipmapBlur />
        <Vignette eskil={false} offset={0.08} darkness={0.65} />
      </EffectComposer>
    </>
  );
}

export default function IntroAssemblyScene({ progress, armsRetracted = false, className }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      shadows
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{
        position: INTRO_CAMERA.position,
        fov: INTRO_CAMERA.fov,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ camera, gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.88;
        camera.lookAt(...INTRO_CAMERA.lookAt);
      }}
    >
      <SceneContent progress={progress} armsRetracted={armsRetracted} />
    </Canvas>
  );
}
