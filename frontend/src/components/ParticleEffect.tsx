import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  color: THREE.Color;
}

interface ParticleEffectProps {
  position: THREE.Vector3;
  active: boolean;
  onComplete?: () => void;
}

const COLORS = ['#ff6a00', '#39ff14', '#ff2d78', '#00d4ff'];

export default function ParticleEffect({ position, active, onComplete }: ParticleEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particles  = useRef<Particle[]>([]);
  const initialized = useRef(false);

  const COUNT = 20;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (!active && !initialized.current) return;

    if (active && !initialized.current) {
      initialized.current = true;
      particles.current = Array.from({ length: COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
        return {
          position: position.clone(),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            2 + Math.random() * 4,
            Math.sin(angle) * speed
          ),
          life: 0,
          maxLife: 0.4 + Math.random() * 0.3,
          color,
        };
      });
    }

    if (!initialized.current) return;

    let allDead = true;
    particles.current.forEach((p, i) => {
      p.life += delta;
      p.velocity.y -= 9.8 * delta;
      p.position.addScaledVector(p.velocity, delta);
      const t = p.life / p.maxLife;
      if (t < 1) allDead = false;
      const alpha = Math.max(0, 1 - t);
      positions[i * 3]     = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      colors[i * 3]     = p.color.r * alpha;
      colors[i * 3 + 1] = p.color.g * alpha;
      colors[i * 3 + 2] = p.color.b * alpha;
    });

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    if (allDead && initialized.current) {
      initialized.current = false;
      onComplete?.();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent depthWrite={false} />
    </points>
  );
}
