import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import AssemblyRobot from './AssemblyRobot';
import AssemblyArms3D from './AssemblyArms3D';
import AssemblyCivilian from './AssemblyCivilian';
import AssemblyGLBAvatar from './AssemblyGLBAvatar';
import IntroRobotHead from './IntroRobotHead';
import AvatarRig from './AvatarRig';
import { getActiveAssemblyTarget, getEvolutionPhase } from './assemblyUtils';
import { INTRO_CAMERA, INTRO_FOV } from './intro3dConfig';
import { IntroEvolutionBackdrop } from './IntroEvolutionStage';
import { getCanvasDpr, getDevice3DTier } from '../../utils/device3d';

function IntroCameraRig({ progress }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const p = progress / 100;

  useFrame(() => {
    const wideW = Math.max(0, 1 - p / 0.2);
    const midW = 1 - wideW;

    const pos = new THREE.Vector3()
      .addScaledVector(new THREE.Vector3(...INTRO_CAMERA.wide.position), wideW)
      .addScaledVector(new THREE.Vector3(...INTRO_CAMERA.mid.position), midW);

    lookAt
      .set(...INTRO_CAMERA.wide.lookAt)
      .multiplyScalar(wideW)
      .add(new THREE.Vector3(...INTRO_CAMERA.mid.lookAt).multiplyScalar(midW));

    camera.position.lerp(pos, 0.1);
    camera.lookAt(lookAt);
  });

  return null;
}

function IntroLights({ progress, lite }) {
  const keyRef = useRef();
  const fillRef = useRef();
  const rimRef = useRef();

  useFrame(() => {
    const { platform, peak, reveal } = getEvolutionPhase(progress);
    const mood = platform * 0.5 + peak * 0.8 + reveal * 0.3;

    if (keyRef.current) keyRef.current.intensity = 0.35 + mood * 0.55;
    if (fillRef.current) fillRef.current.intensity = 0.12 + peak * 0.35;
    if (rimRef.current) rimRef.current.intensity = 0.08 + peak * 0.42;
  });

  return (
    <>
      <ambientLight intensity={lite ? 0.32 : 0.18} color="#c8dff5" />
      <directionalLight
        ref={keyRef}
        position={[2.4, 4.5, 3.2]}
        intensity={lite ? 0.65 : 0.52}
        color="#eef6ff"
        castShadow={!lite}
      />
      <directionalLight ref={fillRef} position={[-1.8, 2.2, 3.5]} intensity={0.18} color="#6eb8ff" />
      <pointLight ref={rimRef} position={[0.8, 0.35, 1.2]} intensity={0.12} color="#5ce1ff" distance={5} />
    </>
  );
}

function IntroBloom({ progress }) {
  const bloomRef = useRef();

  useFrame(() => {
    const bloom = bloomRef.current;
    if (!bloom) return;
    const { peak, burst } = getEvolutionPhase(progress);
    bloom.intensity = 0.32 + peak * 1.35 + burst * 0.45;
    bloom.luminanceThreshold = 0.82 - peak * 0.18;
  });

  return (
    <Bloom
      ref={bloomRef}
      intensity={0.32}
      luminanceThreshold={0.82}
      luminanceSmoothing={0.35}
      mipmapBlur
    />
  );
}

function WeldSparks({ progress, retracted, lite }) {
  const pointsRef = useRef();
  const count = lite ? 24 : 56;
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const { cocoonIn } = getEvolutionPhase(progress);
    if (cocoonIn > 0.15) {
      pts.visible = false;
      return;
    }

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

function SceneContent({ progress, armsRetracted, lite }) {
  const { platform } = getEvolutionPhase(progress);

  return (
    <>
      <color attach="background" args={['#0b1a2e']} />
      <fog attach="fog" args={['#0b1a2e', 7, 16]} />
      <IntroEvolutionBackdrop progress={progress} />
      <IntroCameraRig progress={progress} />
      <IntroLights progress={progress} lite={lite} />
      <Suspense fallback={null}>
        {!lite && platform < 0.5 && (
          <Environment preset="city" environmentIntensity={0.08} />
        )}
        <AvatarRig progress={progress}>
          <AssemblyGLBAvatar progress={progress} lite={lite} />
          <AssemblyRobot progress={progress} lite={lite} />
          {lite && <IntroRobotHead progress={progress} />}
          <AssemblyArms3D progress={progress} retracted={armsRetracted} />
          <WeldSparks progress={progress} retracted={armsRetracted} lite={lite} />
        </AvatarRig>
      </Suspense>
      <AssemblyCivilian progress={progress} />
      {!lite && (
        <EffectComposer multisampling={0}>
          <IntroBloom progress={progress} />
          <Vignette eskil={false} offset={0.08} darkness={0.48} />
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
        fov: INTRO_FOV,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x0b1a2e, 1);
        gl.localClippingEnabled = true;
        if (!lite) {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }
      }}
    >
      <SceneContent progress={progress} armsRetracted={armsRetracted} lite={lite} />
    </Canvas>
  );
}
