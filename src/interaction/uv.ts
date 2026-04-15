import * as THREE from "three";

export function getStrokeSteps(
  startUV: THREE.Vector2,
  endUV: THREE.Vector2,
  radius: number,
  textureSize = 1024
): number {
  const dx = endUV.x - startUV.x;
  const dy = endUV.y - startUV.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const uvStep = Math.max(0.001, radius / textureSize / 2);
  return Math.max(1, Math.ceil(distance / uvStep));
}

export function lerpUV(
  startUV: THREE.Vector2,
  endUV: THREE.Vector2,
  t: number
): THREE.Vector2 {
  return new THREE.Vector2(
    startUV.x + (endUV.x - startUV.x) * t,
    startUV.y + (endUV.y - startUV.y) * t
  );
}