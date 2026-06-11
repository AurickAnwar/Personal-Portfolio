import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { clamp01, easeOutCubic } from './assemblyUtils';
import { INTRO_MODEL, INTRO_ROOT_Y } from './intro3dConfig';

/** Shared transform so GLB torso, procedural parts, and legs align. */
export default function AvatarRig({ progress, children }) {
  const ref = useRef();
  const p = progress / 100;

  useFrame((state) => {
    const rig = ref.current;
    if (!rig) return;
    const entrance = easeOutCubic(clamp01(p / 0.28));
    const breathe = Math.sin(state.clock.elapsedTime * 1.05) * 0.002;
    rig.position.y = INTRO_ROOT_Y + INTRO_MODEL.position[1] + (1 - entrance) * -0.15 + breathe;
    rig.rotation.y = INTRO_MODEL.rotation[1];
    rig.scale.setScalar(INTRO_MODEL.scale);
  });

  return <group ref={ref}>{children}</group>;
}
