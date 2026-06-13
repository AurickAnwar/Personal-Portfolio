import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URLS } from '../home/hero3d/hero3dConfig';
import {
  applyIntroWaistClip,
  computeIntroWaistAlignOffset,
  fitIntroModelToFrame,
} from '../home/hero3d/fitModel';
import { getDevice3DTier } from '../../utils/device3d';
import { clamp01, easeOutCubic, getEvolutionPhase } from './assemblyUtils';
import IntroEvolutionStage from './IntroEvolutionStage';
import { INTRO_FIT, INTRO_WAIST_Y } from './intro3dConfig';

if (typeof window !== 'undefined' && getDevice3DTier() === 'full') {
  useGLTF.preload(MODEL_URLS.idle);
}

const SILHOUETTE = new THREE.Color('#fff8e8');
const WHITE = new THREE.Color('#ffffff');

function setSubtreeOpacity(root, opacity) {
  if (!root) return;
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      mat.transparent = opacity < 0.995;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.65;
    });
  });
}

function applyEvolutionMaterial(root, silhouetteStrength, reveal) {
  if (!root) return;
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (!mat.userData._evoBase) {
        mat.userData._evoBase = {
          color: mat.color?.clone?.() ?? new THREE.Color('#888'),
          emissive: mat.emissive?.clone?.() ?? new THREE.Color('#000'),
          emissiveIntensity: mat.emissiveIntensity ?? 1,
          metalness: mat.metalness ?? 0.5,
          roughness: mat.roughness ?? 0.5,
        };
      }

      const base = mat.userData._evoBase;
      const sil = clamp01(silhouetteStrength);

      if (sil <= 0.001 && reveal >= 0.995) {
        if (mat.color) mat.color.copy(base.color);
        if (mat.emissive) mat.emissive.copy(base.emissive);
        mat.emissiveIntensity = base.emissiveIntensity;
        mat.metalness = base.metalness;
        mat.roughness = base.roughness;
        return;
      }

      const colorMix = sil * (1 - reveal * 0.95);
      if (mat.color) mat.color.copy(base.color).lerp(SILHOUETTE, colorMix).lerp(WHITE, colorMix * 0.35);
      if (mat.emissive) {
        mat.emissive.copy(base.emissive).lerp(WHITE, sil * 0.85);
        mat.emissiveIntensity = base.emissiveIntensity + sil * 2.8;
      }
      mat.metalness = THREE.MathUtils.lerp(base.metalness, 0.15, sil * 0.8);
      mat.roughness = THREE.MathUtils.lerp(base.roughness, 0.55, sil * 0.5);
    });
  });
}

function IntroModel({ url, fit, rootRef }) {
  const animRef = useRef();
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => {
    const cloned = scene.clone(true);
    fitIntroModelToFrame(cloned, fit);
    applyIntroWaistClip(cloned, fit.torsoSeatY);
    return cloned;
  }, [scene, fit]);
  const { actions, mixer } = useAnimations(animations, animRef);

  useEffect(() => {
    if (!actions) return undefined;
    const names = Object.keys(actions);
    if (!names.length) return undefined;
    const action = actions[names[0]];
    action.reset().fadeIn(0.35).play();
    return () => action.fadeOut(0.25);
  }, [actions]);

  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={rootRef}>
      <group ref={animRef}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

function AssemblyGLBAvatarFull({ progress }) {
  const waistRef = useRef();
  const idleRef = useRef();
  const idleOffsetRef = useRef(null);

  useFrame((state) => {
    const waist = waistRef.current;
    const idle = idleRef.current;
    if (!waist || !idle) return;

    const { cocoonIn, peak, burst, reveal } = getEvolutionPhase(progress);

    if (!idleOffsetRef.current) {
      idle.position.set(0, 0, 0);
      idleOffsetRef.current = computeIntroWaistAlignOffset(
        idle,
        waist,
        INTRO_FIT.torsoMaxX,
        INTRO_FIT.torsoSeatY
      );
    }

    if (idleOffsetRef.current) {
      const [nx, ny, nz] = INTRO_FIT.alignNudge;
      const floatY = Math.sin(state.clock.elapsedTime * 1.1) * 0.012 * reveal;
      idle.position.set(
        idleOffsetRef.current.x + (nx ?? 0),
        idleOffsetRef.current.y + (ny ?? 0) + floatY,
        nz ?? 0
      );
    }

    const insideCocoon = cocoonIn > 0.08 && burst < 0.92;
    const silhouette = insideCocoon ? peak * (1 - burst * 0.4) : 0;
    const opacity = insideCocoon
      ? 0.08 + peak * 0.28 + reveal * 0.64
      : easeOutCubic(reveal);

    idle.visible = cocoonIn > 0.05 || reveal > 0.02;
    idle.scale.setScalar(0.96 + reveal * 0.04);
    idle.rotation.y = Math.sin(state.clock.elapsedTime * 0.28) * 0.01 * reveal;

    setSubtreeOpacity(idle, opacity);
    applyEvolutionMaterial(idle, silhouette, reveal);
  });

  return (
    <group ref={waistRef} position={[0, INTRO_WAIST_Y, 0]}>
      <IntroEvolutionStage progress={progress} />
      <IntroModel url={MODEL_URLS.idle} fit={INTRO_FIT} rootRef={idleRef} />
    </group>
  );
}

export default function AssemblyGLBAvatar({ progress, lite = false }) {
  if (lite) return null;
  return <AssemblyGLBAvatarFull progress={progress} />;
}
