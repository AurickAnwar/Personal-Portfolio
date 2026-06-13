import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getEvolutionPhase } from './assemblyUtils';
import { EVOLUTION, INTRO_TORSO_SEAT_Y } from './intro3dConfig';

const CYAN = '#5ce1ff';
const WHITE = '#ffffff';
const PLATFORM_Y = INTRO_TORSO_SEAT_Y - 0.1;

function makeHexTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(0, 0, size, size);

  const r = 14;
  const h = r * Math.sqrt(3);
  for (let row = -1; row < size / h + 1; row += 1) {
    for (let col = -1; col < size / (r * 1.5) + 1; col += 1) {
      const x = col * r * 1.5 + (row % 2 ? r * 0.75 : 0);
      const y = row * h * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(92, 225, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 2.2);
  return tex;
}

/** Scene-level backdrop — gradient wall, stage floor, ambient particles. */
export function IntroEvolutionBackdrop({ progress }) {
  const bokehRef = useRef();
  const pillarRefs = useRef([]);
  const bokehCount = 18;
  const bokehPos = useMemo(() => new Float32Array(bokehCount * 3), [bokehCount]);
  const starPos = useMemo(() => {
    const arr = new Float32Array(64 * 3);
    for (let i = 0; i < 64; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 4.5;
      arr[i3 + 1] = 0.15 + Math.random() * 1.6;
      arr[i3 + 2] = -1.2 - Math.random() * 2.8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const { platform, peak, reveal } = getEvolutionPhase(progress);
    const t = state.clock.elapsedTime;
    const mood = 0.35 + platform * 0.35 + peak * 0.3 + reveal * 0.2;

    if (bokehRef.current) {
      bokehRef.current.material.opacity = mood * 0.5;
      for (let i = 0; i < bokehCount; i += 1) {
        const i3 = i * 3;
        bokehPos[i3] = -1.6 + (i / (bokehCount - 1)) * 3.2;
        bokehPos[i3 + 1] = 0.22 + Math.sin(t * 0.35 + i * 0.7) * 0.06;
        bokehPos[i3 + 2] = -1.4 - (i % 5) * 0.22;
      }
      bokehRef.current.geometry.attributes.position.needsUpdate = true;
    }

    pillarRefs.current.forEach((pillar, i) => {
      if (!pillar) return;
      pillar.material.opacity = mood * (0.08 + (i % 2) * 0.04);
    });
  });

  return (
    <group position={[0, 0.02, 0]}>
      <mesh position={[0, 0.45, -2.4]}>
        <planeGeometry args={[9, 5.5]} />
        <meshBasicMaterial color="#0f2844" />
      </mesh>
      <mesh position={[0, 0.95, -2.35]}>
        <planeGeometry args={[7.5, 2.8]} />
        <meshBasicMaterial color="#1a4568" transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.05, -2.3]}>
        <planeGeometry args={[8, 1.2]} />
        <meshBasicMaterial color="#163552" transparent opacity={0.28} depthWrite={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
        <circleGeometry args={[2.35, 64]} />
        <meshStandardMaterial color="#0c1828" metalness={0.55} roughness={0.58} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.175, 0]}>
        <ringGeometry args={[0.72, 2.35, 64]} />
        <meshBasicMaterial color="#1a4568" transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {[-1.15, -0.38, 0.38, 1.15].map((x, i) => (
        <mesh
          key={x}
          ref={(el) => {
            pillarRefs.current[i] = el;
          }}
          position={[x, 0.55, -1.55]}
        >
          <planeGeometry args={[0.08, 2.4]} />
          <meshBasicMaterial
            color="#6ecfff"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <points ref={bokehRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={bokehCount} array={bokehPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={CYAN}
          size={0.14}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={64} array={starPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={WHITE}
          size={0.016}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function EvolutionPlatform({ progress }) {
  const rootRef = useRef();
  const ringRefs = useRef([]);
  const glowRef = useRef();
  const hexMap = useMemo(() => makeHexTexture(), []);

  useFrame((state) => {
    const root = rootRef.current;
    if (!root) return;

    const { platform, peak } = getEvolutionPhase(progress);
    const t = state.clock.elapsedTime;
    const pulse = 0.88 + Math.sin(t * 2.2) * 0.1 * peak;

    root.visible = platform > 0.02;
    root.scale.setScalar(0.88 + platform * 0.12);
    root.position.y = PLATFORM_Y - (1 - platform) * 0.1;

    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.material.opacity = platform * (0.45 + peak * 0.5) * (i === 0 ? pulse : 0.9);
      ring.rotation.z = t * (0.4 + i * 0.12);
    });

    if (glowRef.current) {
      glowRef.current.intensity = platform * (0.35 + peak * 0.55);
    }
  });

  const struts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return { angle, x: Math.cos(angle) * 0.66, z: Math.sin(angle) * 0.66 };
      }),
    []
  );

  const rimSegments = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        return { angle, x: Math.cos(angle) * 0.58, z: Math.sin(angle) * 0.58 };
      }),
    []
  );

  return (
    <group ref={rootRef} visible={false}>
      <pointLight ref={glowRef} position={[0, 0.08, 0]} color={CYAN} intensity={0} distance={1.6} />

      <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.14, 48]} />
        <meshStandardMaterial color="#101820" metalness={0.8} roughness={0.42} />
      </mesh>

      {struts.map(({ angle, x, z }) => (
        <group key={angle} position={[x, -0.02, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="#080d14" metalness={0.85} roughness={0.35} />
          </mesh>
          <mesh position={[0.04, -0.01, 0]}>
            <boxGeometry args={[0.018, 0.06, 0.04]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.58, 0.62, 0.07, 48]} />
        <meshStandardMaterial color="#1a2838" metalness={0.88} roughness={0.28} />
      </mesh>

      {rimSegments.map(({ angle, x, z }, i) => (
        <mesh
          key={angle}
          position={[x, 0.038, z]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[0.07, 0.028, 0.05]} />
          <meshStandardMaterial
            color="#243448"
            emissive={CYAN}
            emissiveIntensity={i % 2 === 0 ? 0.22 : 0.08}
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.048, 0]} receiveShadow>
        <circleGeometry args={[0.5, 48]} />
        <meshStandardMaterial
          color="#243040"
          metalness={0.92}
          roughness={0.22}
          map={hexMap}
          emissive="#1a3048"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.049, 0]}>
        <ringGeometry args={[0.14, 0.48, 48]} />
        <meshStandardMaterial color="#2a3848" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#162030" metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.053, 0]}>
        <ringGeometry args={[0.045, 0.062, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.054, 0]}>
        <circleGeometry args={[0.038, 24]} />
        <meshBasicMaterial color="#8fe8ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>

      {[0.012, 0.034].map((y, i) => (
        <mesh
          key={y}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, y, 0]}
        >
          <torusGeometry args={[0.54 - i * 0.05, 0.007, 12, 64]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function EnergyCocoon({ progress }) {
  const groupRef = useRef();
  const outerRef = useRef();
  const coreRef = useRef();
  const shellRef = useRef();
  const swirlRef = useRef();
  const burstRef = useRef();
  const count = 120;
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const burstCount = 64;
  const burstPos = useMemo(() => new Float32Array(burstCount * 3), [burstCount]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const { cocoon, peak, burst } = getEvolutionPhase(progress);
    const t = state.clock.elapsedTime;
    const radius = EVOLUTION.radius;
    const visible = cocoon > 0.04;
    const burstScale = 1 + burst * 1.6;
    const wobble = 1 + Math.sin(t * 3.5) * 0.025 * peak;

    group.visible = visible || burst > 0.02;
    group.position.y = EVOLUTION.centerY;

    const scale = radius * (0.35 + cocoon * 0.65) * wobble * burstScale;
    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale * 1.22);
      outerRef.current.material.opacity = cocoon * 0.28 * (1 - burst);
      outerRef.current.rotation.y = t * 0.45;
      outerRef.current.rotation.x = t * 0.18;
    }
    if (shellRef.current) {
      shellRef.current.scale.setScalar(scale * 1.05);
      shellRef.current.material.opacity = cocoon * 0.55 * (1 - burst * 0.95);
      shellRef.current.rotation.y = -t * 0.65;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(scale * 0.72);
      coreRef.current.material.opacity = cocoon * 0.92 * (1 - burst);
    }

    if (swirlRef.current) {
      swirlRef.current.visible = peak > 0.08 && burst < 0.85;
      swirlRef.current.material.opacity = peak * 0.75;
      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const phi = (i / count) * Math.PI * 2 + t * (1.8 + (i % 7) * 0.08);
        const theta = ((i * 0.37) % 1) * Math.PI + Math.sin(t + i) * 0.15;
        const r = scale * (0.55 + (i % 9) * 0.04);
        positions[i3] = Math.cos(phi) * Math.sin(theta) * r;
        positions[i3 + 1] = Math.cos(theta) * r * 0.85;
        positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
      }
      swirlRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (burstRef.current) {
      burstRef.current.visible = burst > 0.04 && burst < 0.98;
      burstRef.current.material.opacity = burst * (1 - burst) * 1.4;
      for (let i = 0; i < burstCount; i += 1) {
        const i3 = i * 3;
        const angle = (i / burstCount) * Math.PI * 2;
        const dist = burst * (0.35 + (i % 5) * 0.07);
        burstPos[i3] = Math.cos(angle) * dist;
        burstPos[i3 + 1] = (i % 7) * 0.012 * burst;
        burstPos[i3 + 2] = Math.sin(angle) * dist;
      }
      burstRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#8fdcff"
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={shellRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={WHITE}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#fffef5"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={swirlRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={WHITE}
          size={0.022}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <points ref={burstRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={burstCount} array={burstPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={CYAN}
          size={0.035}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function WaistCap({ progress }) {
  const capRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const { reveal } = getEvolutionPhase(progress);
    const cap = capRef.current;
    const ring = ringRef.current;
    if (!cap || !ring) return;

    const t = state.clock.elapsedTime;
    const show = reveal > 0.35;
    cap.visible = show;
    ring.visible = show;
    cap.material.opacity = 0.5 + reveal * 0.45;
    ring.material.opacity = 0.25 + Math.sin(t * 2) * 0.08 + reveal * 0.35;
    ring.rotation.z = t * 0.4;
  });

  return (
    <group position={[0, INTRO_TORSO_SEAT_Y - 0.02, 0.01]}>
      <mesh ref={capRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[0.18, 48]} />
        <meshStandardMaterial color="#101820" metalness={0.9} roughness={0.22} transparent opacity={0} />
      </mesh>
      <mesh ref={ringRef} visible={false}>
        <torusGeometry args={[0.16, 0.004, 12, 48]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function IntroEvolutionStage({ progress }) {
  return (
    <group>
      <EvolutionPlatform progress={progress} />
      <EnergyCocoon progress={progress} />
      <WaistCap progress={progress} />
    </group>
  );
}
