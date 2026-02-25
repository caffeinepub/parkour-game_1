import * as THREE from 'three';

export const NEON_ORANGE  = '#ff6a00';
export const NEON_GREEN   = '#39ff14';
export const NEON_PINK    = '#ff2d78';
export const NEON_BLUE    = '#00d4ff';
export const PLATFORM_COLOR = '#1a1a2e';
export const OBSTACLE_COLOR  = '#ff6a00';

export function createPlatformMaterial(color = PLATFORM_COLOR) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.6,
    emissive: new THREE.Color(NEON_BLUE),
    emissiveIntensity: 0.08,
  });
}

export function createEdgeMaterial(color = NEON_BLUE) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.9,
  });
}

export function createObstacleMaterial() {
  return new THREE.MeshStandardMaterial({
    color: NEON_ORANGE,
    emissive: new THREE.Color(NEON_ORANGE),
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8,
  });
}

export function createStartMaterial() {
  return new THREE.MeshStandardMaterial({
    color: NEON_GREEN,
    emissive: new THREE.Color(NEON_GREEN),
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.5,
  });
}

export function createFinishMaterial() {
  return new THREE.MeshStandardMaterial({
    color: NEON_PINK,
    emissive: new THREE.Color(NEON_PINK),
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.5,
  });
}
