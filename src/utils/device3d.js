/** Detect phones / low-end devices that need lighter WebGL settings. */
export function getDevice3DTier() {
  if (typeof window === 'undefined') return 'full';

  const ua = navigator.userAgent || '';
  const isMobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const narrow = window.innerWidth <= 820;
  const touchPrimary = navigator.maxTouchPoints > 0 && narrow;
  const lowMemory =
    typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
  const saveData = navigator.connection?.saveData === true;

  if (saveData || lowMemory || (isMobileUa && narrow) || touchPrimary) {
    return 'lite';
  }
  return 'full';
}

export function isLite3DDevice() {
  return getDevice3DTier() === 'lite';
}

export function getCanvasDpr(tier = getDevice3DTier()) {
  return tier === 'lite' ? [1, 1.25] : [1, 1.5];
}

/** Max wait before falling back when GLBs are slow (common on cellular). */
export function getModelLoadTimeoutMs(tier = getDevice3DTier()) {
  return tier === 'lite' ? 22000 : 40000;
}
