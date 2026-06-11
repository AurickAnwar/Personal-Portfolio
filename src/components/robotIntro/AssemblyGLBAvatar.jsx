import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { MODEL_URLS } from '../home/hero3d/hero3dConfig';
import { computeIntroWaistAlignOffset, fitIntroModelToFrame, measureIntroTorsoWidth } from '../home/hero3d/fitModel';
import {
  clamp01,
  createIntroSuitMaterials,
  easeOutCubic,
  sampleSuitPaletteFromScene,
} from './assemblyUtils';
import AssemblySuitLegs from './AssemblySuitLegs';
import IntroSuitHands from './IntroSuitHands';
import { INTRO_FIT, INTRO_WAIST_MEASURE_MAX_X, INTRO_WAIST_Y } from './intro3dConfig';

useGLTF.preload(MODEL_URLS.idle);

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

function IntroModel({ url, fit, rootRef, children }) {
  const animRef = useRef();
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => {
    const cloned = scene.clone(true);
    fitIntroModelToFrame(cloned, fit);
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
      {children}
    </group>
  );
}

export default function AssemblyGLBAvatar({ progress }) {
  const waistRef = useRef();
  const idleRef = useRef();
  const idleOffsetRef = useRef(null);
  const [torsoSpan, setTorsoSpan] = useState(null);
  const p = progress / 100;

  const { scene: idleSource } = useGLTF(MODEL_URLS.idle);
  const suitMaterials = useMemo(() => {
    const sample = sampleSuitPaletteFromScene(idleSource);
    return createIntroSuitMaterials(sample);
  }, [idleSource]);

  const idleIn = easeOutCubic(clamp01((p - 0.34) / 0.2));

  useFrame(() => {
    const waist = waistRef.current;
    const idle = idleRef.current;
    if (!waist || !idle) return;

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
      idle.position.set(
        idleOffsetRef.current.x + (nx ?? 0),
        idleOffsetRef.current.y + (ny ?? 0),
        nz ?? 0
      );
    }

    if (!torsoSpan && idleIn > 0.35) {
      const span = measureIntroTorsoWidth(idle, waist, INTRO_WAIST_MEASURE_MAX_X);
      if (span?.width > 0.12) setTorsoSpan(span);
    }

    idle.visible = idleIn > 0.02;
    setSubtreeOpacity(idle, idleIn);
  });

  return (
    <group ref={waistRef} position={[0, INTRO_WAIST_Y, 0]}>
      <AssemblySuitLegs progress={progress} hipY={0} materials={suitMaterials} torsoSpan={torsoSpan} />
      <IntroModel url={MODEL_URLS.idle} fit={INTRO_FIT} rootRef={idleRef}>
        <IntroSuitHands opacity={idleIn} materials={suitMaterials} />
      </IntroModel>
    </group>
  );
}
