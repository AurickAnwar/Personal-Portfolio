import * as THREE from 'three';

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

/** Which part is actively mounting + weld point in robot-local space. */
export function getActiveAssemblyTarget(progress) {
  const p = progress / 100;
  const stages = [
    { start: 0, end: 0.16, point: [0, -0.52, 0.1] },
    { start: 0.1, end: 0.3, point: [0, 0.02, 0.13] },
    { start: 0.24, end: 0.42, point: [0, 0.5, 0.09] },
    { start: 0.36, end: 0.54, point: [-0.32, 0.12, 0.06] },
    { start: 0.48, end: 0.64, point: [0.32, 0.12, 0.06] },
    { start: 0.58, end: 0.76, point: [-0.13, -0.38, 0.07] },
    { start: 0.68, end: 0.86, point: [0.13, -0.38, 0.07] },
    { start: 0.82, end: 0.98, point: [0, 0.08, 0.15] },
  ];

  for (let i = stages.length - 1; i >= 0; i -= 1) {
    const s = stages[i];
    const m = mountProgress(p, s.start, s.end);
    if (m > 0.04 && m < 0.96) {
      return { point: s.point, intensity: 1 - Math.abs(m - 0.5) * 1.6, mounting: true };
    }
  }

  return { point: [0, 0.1, 0.12], intensity: progress >= 100 ? 0 : 0.25, mounting: progress < 100 };
}
