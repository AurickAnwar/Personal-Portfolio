import * as THREE from 'three';

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _box = new THREE.Box3();

function objectBounds(root) {
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root);
}

function coreMeshBounds(root, maxAbsX = 0.22) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3();
  let found = false;

  root.traverse((child) => {
    if (!child.isMesh) return;
    _box.setFromObject(child);
    if (_box.max.y < 0.12) return;
    const cx = (_box.min.x + _box.max.x) * 0.5;
    if (Math.abs(cx) > maxAbsX) return;
    box.union(_box);
    found = true;
  });

  return found ? box : objectBounds(root);
}

function boxInSpace(worldBox, spaceMatrix) {
  const inv = spaceMatrix.clone().invert();
  return new THREE.Box3(
    _v1.copy(worldBox.min).applyMatrix4(inv),
    _v2.copy(worldBox.max).applyMatrix4(inv)
  );
}

function shouldSkipWaistAlign(object) {
  let node = object;
  while (node) {
    if (node.userData?._skipWaistAlign) return true;
    node = node.parent;
  }
  return false;
}

function upperBodyBoundsInWaistSpace(modelGroup, waistGroup, torsoMaxX = 0.2) {
  waistGroup.updateMatrixWorld(true);
  modelGroup.updateMatrixWorld(true);

  const all = new THREE.Box3();
  const torso = new THREE.Box3();
  let hasBody = false;
  let hasTorso = false;

  modelGroup.traverse((child) => {
    if (!child.isMesh) return;
    if (shouldSkipWaistAlign(child)) return;

    _box.setFromObject(child);
    const wb = boxInSpace(_box, waistGroup.matrixWorld);
    if (wb.max.y < 0.04) return;

    all.union(wb);
    hasBody = true;

    const cx = (wb.min.x + wb.max.x) * 0.5;
    if (Math.abs(cx) <= torsoMaxX) {
      torso.union(wb);
      hasTorso = true;
    }
  });

  if (!hasBody) return null;
  return { all, torso: hasTorso ? torso : all };
}

export function fitModelToFrame(
  root,
  {
    offsetX = 0.12,
    headY = 1.06,
    baseY = -0.9,
    viewScale = 1,
    widthWeight = 0.45,
    depthWeight = 0.82,
  } = {}
) {
  const box = objectBounds(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  root.position.sub(center);

  const span = headY - baseY;
  const nextBox = objectBounds(root);
  nextBox.getSize(size);
  const fitExtent = Math.max(size.y, size.z * depthWeight, size.x * widthWeight);
  const scale = (span / Math.max(fitExtent, 0.001)) * viewScale;
  root.scale.multiplyScalar(scale);

  const fitted = objectBounds(root);
  root.position.y += headY - fitted.max.y;
  root.position.x += offsetX;

  return { scale, size, center, span };
}

/** Hide mesh below the bust waist cut (waist-local Y). */
export function applyIntroWaistClip(root, cutY = 0.21) {
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -cutY);
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      mat.clippingPlanes = [plane];
      mat.clipShadows = true;
    });
  });
}

export function fitIntroModelToFrame(root, fit) {
  const {
    offsetX = 0,
    headY = 0.92,
    baseY = -0.9,
    viewScale = 1,
    widthWeight = 0.48,
    depthWeight = 0.85,
    coreTorsoMaxX = 0.25,
  } = fit;

  const box = coreMeshBounds(root, coreTorsoMaxX);
  root.position.sub(box.getCenter(new THREE.Vector3()));

  const sized = objectBounds(root);
  const size = sized.getSize(new THREE.Vector3());
  const span = headY - baseY;
  const fitExtent = Math.max(size.y, size.z * depthWeight, size.x * widthWeight);
  const scale = (span / Math.max(fitExtent, 0.001)) * viewScale;
  root.scale.multiplyScalar(scale);

  const fitted = objectBounds(root);
  root.position.y += headY - fitted.max.y;
  root.position.x += offsetX;
}

export function computeIntroWaistAlignOffset(
  modelGroup,
  waistGroup,
  torsoMaxX = 0.2,
  torsoSeatY = 0
) {
  if (!modelGroup || !waistGroup) return null;

  const bounds = upperBodyBoundsInWaistSpace(modelGroup, waistGroup, torsoMaxX);
  if (!bounds) return null;

  return {
    x: -(bounds.torso.min.x + bounds.torso.max.x) * 0.5,
    y: torsoSeatY - bounds.all.min.y,
  };
}

/** Torso span at the stomach cut — used to scale procedural pelvis width. */
export function measureIntroTorsoWidth(
  modelGroup,
  waistGroup,
  torsoMaxX = 0.13,
  cutBand = 0.1
) {
  waistGroup.updateMatrixWorld(true);
  modelGroup.updateMatrixWorld(true);

  const bounds = upperBodyBoundsInWaistSpace(modelGroup, waistGroup, torsoMaxX);
  if (!bounds) return null;

  const cutY = bounds.all.min.y;
  const waist = new THREE.Box3();
  let found = false;

  modelGroup.traverse((child) => {
    if (!child.isMesh) return;
    if (shouldSkipWaistAlign(child)) return;

    _box.setFromObject(child);
    const wb = boxInSpace(_box, waistGroup.matrixWorld);
    if (wb.max.y < cutY - 0.01 || wb.min.y > cutY + cutBand) return;

    const cx = (wb.min.x + wb.max.x) * 0.5;
    if (Math.abs(cx) > torsoMaxX) return;

    waist.union(wb);
    found = true;
  });

  const torsoW = bounds.torso.max.x - bounds.torso.min.x;
  const torsoD = bounds.torso.max.z - bounds.torso.min.z;

  if (!found || waist.isEmpty()) {
    return { width: torsoW * 0.58, depth: torsoD * 0.84 };
  }

  const sliceW = waist.max.x - waist.min.x;
  const sliceD = waist.max.z - waist.min.z;

  // Favor lower-torso taper so the stomach bridge fills the suit cut.
  return {
    width: sliceW * 0.38 + torsoW * 0.62,
    depth: sliceD * 0.5 + torsoD * 0.5,
  };
}

export function alignIntroModelToWaist(
  modelGroup,
  waistGroup,
  nudge = [0, 0, 0],
  torsoMaxX = 0.2,
  torsoSeatY = 0
) {
  const offset = computeIntroWaistAlignOffset(modelGroup, waistGroup, torsoMaxX, torsoSeatY);
  if (!offset) return false;

  modelGroup.position.x += offset.x + (nudge[0] ?? 0);
  modelGroup.position.y += offset.y + (nudge[1] ?? 0);
  modelGroup.position.z += nudge[2] ?? 0;
  return true;
}
