/** Intro assembly scene tuning — separate from home hero framing. */

export const INTRO_DURATION_MS = 9200;

/** Pause on finished assembly before transitioning to portfolio. */
export const INTRO_HOLD_MS = 900;

/** PoGO-style: elevated top-right, looking down at the platform surface. */
export const INTRO_CAMERA = {
  wide: { position: [0.42, 0.7, 3.85], lookAt: [0, 0.02, 0] },
  mid: { position: [0.66, 1.02, 2.62], lookAt: [0, 0.1, 0] },
  close: { position: [0.7, 1.06, 2.42], lookAt: [0, 0.12, 0] },
};

export const INTRO_FOV = 36;

/** Bust anchor in avatar-rig space — waist cut line. */
export const INTRO_WAIST_Y = -0.06;

/** Where the GLB stomach cut sits (waist-local Y). */
export const INTRO_TORSO_SEAT_Y = 0.21;

export const INTRO_FIT = {
  headY: 0.92,
  baseY: INTRO_WAIST_Y,
  offsetX: 0,
  viewScale: 0.8,
  widthWeight: 0.48,
  depthWeight: 0.85,
  coreTorsoMaxX: 0.22,
  torsoSeatY: INTRO_TORSO_SEAT_Y,
  alignNudge: [0, 0, 0],
  torsoMaxX: 0.18,
};

/** Pokémon GO–style evolution timing (progress 0–1). */
export const EVOLUTION = {
  platformStart: 0.2,
  platformEnd: 0.34,
  cocoonStart: 0.32,
  cocoonPeak: 0.54,
  cocoonBurst: 0.7,
  revealEnd: 0.84,
  centerY: 0.38,
  radius: 0.46,
};

export const INTRO_MODEL = {
  position: [0, 0.02, 0],
  rotation: [0, -0.1, 0],
  scale: 0.98,
};

export const INTRO_ROOT_Y = 0.02;
