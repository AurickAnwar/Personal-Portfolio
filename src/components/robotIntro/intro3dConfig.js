/** Intro assembly scene tuning — separate from home hero framing. */

export const INTRO_DURATION_MS = 9200;

/** Pause on finished assembly before transitioning to portfolio. */
export const INTRO_HOLD_MS = 900;

export const INTRO_CAMERA = {
  wide: { position: [0, 0, 6.4], lookAt: [0, -0.18, 0] },
  mid: { position: [0.04, -0.02, 5.1], lookAt: [0, -0.14, 0] },
  close: { position: [0.04, -0.04, 5.35], lookAt: [0, -0.16, 0] },
};

/** Waist anchor in avatar-rig space — pelvis center line. */
export const INTRO_WAIST_Y = -0.52;

/** Where the GLB stomach cut meets the procedural pelvis (waist-local Y). */
export const INTRO_TORSO_SEAT_Y = 0.21;

export const INTRO_FIT = {
  headY: 0.92,
  baseY: INTRO_WAIST_Y,
  offsetX: 0,
  viewScale: 0.72,
  widthWeight: 0.48,
  depthWeight: 0.85,
  coreTorsoMaxX: 0.22,
  torsoSeatY: INTRO_TORSO_SEAT_Y,
  alignNudge: [0, 0, 0],
  torsoMaxX: 0.18,
};

/** Stomach-cut slice width for pelvis matching. */
export const INTRO_WAIST_MEASURE_MAX_X = 0.13;

/** Procedural pelvis width at scale 1 — matched to GLB stomach slice. */
export const INTRO_PELVIS_REF_WIDTH = 0.27;

export const INTRO_PELVIS_REF_DEPTH = 0.15;

/** Fine-tune pelvis vs measured stomach: 1 = exact, >1 slightly wider. */
export const INTRO_PELVIS_WIDTH_BIAS = 1.12;

/** Extra width on upper bridge only (meets GLB stomach cut). */
export const INTRO_PELVIS_TOP_SCALE = 1.1;

export const INTRO_PELVIS_MAX_SCALE = 1.28;

export const INTRO_MODEL = {
  position: [0, 0.04, 0],
  rotation: [0, -0.12, 0],
  scale: 0.94,
};

export const INTRO_ROOT_Y = 0.06;
