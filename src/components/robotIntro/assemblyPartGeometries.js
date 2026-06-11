import * as THREE from 'three';

export const PART_ANCHORS = {
  pelvis: [0, -0.54, 0],
  torso: [0, 0.04, 0],
  shoulderL: [-0.28, 0.18, 0],
  shoulderR: [0.28, 0.18, 0],
  armL: [-0.28, 0.06, 0],
  armR: [0.28, 0.06, 0],
  mask: [0, 0.48, 0.04],
  chestReactor: [0, 0.1, 0.12],
};

/** Block CAD plates — fade once the idle bust locks on; legs stay procedural. */
export const ASSEMBLY_SEQUENCE = [
  { id: 'pelvis', start: 0.12, end: 0.22, anchor: 'pelvis', from: [0, -1.2, 0.15], weld: [0, 0.04, 0.1] },
  { id: 'torso', start: 0.18, end: 0.32, anchor: 'torso', from: [0, -0.35, 0.55], weld: [0, -0.08, 0.14] },
  { id: 'shoulderL', start: 0.28, end: 0.4, anchor: 'shoulderL', from: [-0.85, 0.55, 0.3], weld: [-0.24, 0.16, 0.08] },
  { id: 'shoulderR', start: 0.3, end: 0.42, anchor: 'shoulderR', from: [0.85, 0.55, 0.3], weld: [0.24, 0.16, 0.08] },
  { id: 'armL', start: 0.36, end: 0.48, anchor: 'armL', from: [-1.0, 0.1, 0.4], weld: [-0.26, 0.02, 0.08] },
  { id: 'armR', start: 0.38, end: 0.5, anchor: 'armR', from: [1.0, 0.1, 0.4], weld: [0.26, 0.02, 0.08] },
];

export const LEG_WELD_STAGES = [
  { start: 0.38, end: 0.48, point: [0, -0.36, 0.08] },
  { start: 0.44, end: 0.54, point: [-0.1, -0.7, 0.07] },
  { start: 0.48, end: 0.62, point: [-0.1, -0.78, 0.07] },
  { start: 0.52, end: 0.66, point: [-0.1, -0.9, 0.09] },
  { start: 0.54, end: 0.64, point: [0.1, -0.7, 0.07] },
  { start: 0.58, end: 0.7, point: [0.1, -0.78, 0.07] },
  { start: 0.62, end: 0.74, point: [0.1, -0.9, 0.09] },
];

export function createTaperedLimbGeo(topR, bottomR, height) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, height, 16, 1, false);
  geo.translate(0, -height / 2, 0);
  return geo;
}
