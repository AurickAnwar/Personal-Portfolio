import * as THREE from 'three';
import { ASSEMBLY_SEQUENCE, LEG_WELD_STAGES } from './assemblyPartGeometries';

export const CYAN = '#7bf0ff';

export function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

export function mountProgress(progress, start, end) {
  return easeOutBack(clamp01((progress - start) / Math.max(end - start, 0.001)));
}

export function makeCarbonTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a0e12';
  ctx.fillRect(0, 0, size, size);

  for (let i = -size; i < size * 2; i += 6) {
    ctx.strokeStyle = i % 12 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, size);
    ctx.lineTo(i + size, 0);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.5, 2.5);
  tex.anisotropy = 8;
  return tex;
}

export function createHelmetGeometry() {
  const profile = [
    new THREE.Vector2(0.0, -0.02),
    new THREE.Vector2(0.1, 0.0),
    new THREE.Vector2(0.125, 0.06),
    new THREE.Vector2(0.13, 0.12),
    new THREE.Vector2(0.115, 0.19),
    new THREE.Vector2(0.07, 0.24),
    new THREE.Vector2(0.0, 0.26),
  ];
  return new THREE.LatheGeometry(profile, 48);
}

export function createTaperedLimb(topR, bottomR, height, radialSegments = 20) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, height, radialSegments, 1, false);
  geo.translate(0, -height / 2, 0);
  return geo;
}

export function createRobotMaterials() {
  const carbonMap = makeCarbonTexture();

  const gunmetal = new THREE.MeshPhysicalMaterial({
    color: '#1c2430',
    metalness: 0.92,
    roughness: 0.22,
    clearcoat: 0.55,
    clearcoatRoughness: 0.15,
    envMapIntensity: 0.85,
  });

  const silver = new THREE.MeshPhysicalMaterial({
    color: '#8f9eb0',
    metalness: 0.98,
    roughness: 0.18,
    clearcoat: 0.35,
    envMapIntensity: 1.1,
  });

  const carbon = new THREE.MeshPhysicalMaterial({
    color: '#11161d',
    metalness: 0.75,
    roughness: 0.35,
    map: carbonMap,
    clearcoat: 0.2,
    envMapIntensity: 0.6,
  });

  const accent = new THREE.MeshStandardMaterial({
    color: CYAN,
    emissive: CYAN,
    emissiveIntensity: 0.55,
    metalness: 0.35,
    roughness: 0.35,
  });

  const accentSoft = accent.clone();
  accentSoft.emissiveIntensity = 0.22;

  const visor = new THREE.MeshPhysicalMaterial({
    color: '#05080c',
    metalness: 0.4,
    roughness: 0.05,
    clearcoat: 1,
    transparent: true,
    opacity: 0.92,
  });

  return { gunmetal, silver, carbon, accent, accentSoft, visor };
}

const _sampleBox = new THREE.Box3();

export function sampleSuitPaletteFromScene(root) {
  let bestMat = null;
  let bestScore = -1;

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const mat = Array.isArray(child.material) ? child.material[0] : child.material;
    const label = `${child.name} ${mat.name}`.toLowerCase();
    if (/skin|face|hair|eye|lash|brow|repulsor|light|arc|glow|visor|mask/.test(label)) return;

    _sampleBox.setFromObject(child);
    const area = (_sampleBox.max.y - _sampleBox.min.y) * (_sampleBox.max.x - _sampleBox.min.x);
    if (area < 0.0001) return;

    const color = mat.color ?? new THREE.Color('#1a2028');
    const lum = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
    if (lum > 0.42) return;

    const metalness = mat.metalness ?? 0.5;
    const score = area * (0.45 + metalness);
    if (score > bestScore) {
      bestScore = score;
      bestMat = mat;
    }
  });

  return bestMat;
}

export function createIntroSuitMaterials(sourceMat) {
  const base = createRobotMaterials();
  const suit = base.gunmetal.clone();

  if (sourceMat?.color) suit.color.copy(sourceMat.color);
  if (sourceMat?.metalness != null) suit.metalness = sourceMat.metalness;
  if (sourceMat?.roughness != null) suit.roughness = sourceMat.roughness;
  if (sourceMat?.clearcoat != null) suit.clearcoat = sourceMat.clearcoat;
  if (sourceMat?.clearcoatRoughness != null) suit.clearcoatRoughness = sourceMat.clearcoatRoughness;
  if (sourceMat?.envMapIntensity != null) suit.envMapIntensity = sourceMat.envMapIntensity;

  const suitCore = suit.clone();
  suitCore.color.multiplyScalar(0.82);
  suitCore.roughness = Math.min(1, suit.roughness + 0.08);

  const suitPlate = base.carbon.clone();
  suitPlate.color.copy(suit.color).multiplyScalar(0.72);
  suitPlate.metalness = Math.max(0.55, suit.metalness * 0.85);
  suitPlate.roughness = Math.min(1, suit.roughness + 0.12);

  const suitSole = suitPlate.clone();
  suitSole.roughness = Math.min(1, suitPlate.roughness + 0.18);

  const suitSeam = suit.clone();
  suitSeam.color.multiplyScalar(1.12);
  suitSeam.emissive = suit.color.clone().multiplyScalar(0.35);
  suitSeam.emissiveIntensity = 0.06;

  const suitJoint = base.silver.clone();
  suitJoint.color.copy(suit.color).lerp(new THREE.Color('#8f9eb0'), 0.45);
  suitJoint.metalness = Math.min(1, suit.metalness + 0.06);

  return { suit, suitCore, suitPlate, suitSole, suitSeam, suitJoint };
}

/** Which part is actively mounting + weld point in avatar-rig space. */
export function getActiveAssemblyTarget(progress) {
  const p = progress / 100;
  const stages = [...ASSEMBLY_SEQUENCE, ...LEG_WELD_STAGES.map((s) => ({ ...s, weld: s.point }))];

  for (let i = stages.length - 1; i >= 0; i -= 1) {
    const s = stages[i];
    const anchor = s.weld ?? s.point;
    if (!anchor) continue;
    const m = mountProgress(p, s.start, s.end);
    if (m > 0.04 && m < 0.96) {
      return { point: anchor, intensity: 1 - Math.abs(m - 0.5) * 1.6, mounting: true };
    }
  }

  return { point: [0, 0.1, 0.12], intensity: progress >= 100 ? 0 : 0.25, mounting: progress < 100 };
}
