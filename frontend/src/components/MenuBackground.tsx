import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PLATFORMS } from '../lib/courseData';

function AutoCamera() {
  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta * 0.15;
    const t = timeRef.current;
    state.camera.position.set(
      Math.sin(t) * 12,
      4 + Math.sin(t * 0.5) * 3,
      -30 + Math.cos(t * 0.3) * 20
    );
    state.camera.lookAt(0, 3, -55);
  });
  return null;
}

function PreviewPlatform({ position, size, isMoving }: { position: [number,number,number]; size: [number,number,number]; isMoving?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const color   = isMoving ? '#ff6a00' : '#00d4ff';

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.1 + Math.sin(timeRef.current * 1.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#0d0d1a"
        emissive={new THREE.Color(color)}
        emissiveIntensity={0.1}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

export default function MenuBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 500, position: [10, 5, -20] }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020408']} />
        <fog attach="fog" args={['#020408', 30, 120]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[0, 20, -50]} intensity={2} color="#00d4ff" />
        <pointLight position={[10, 10, -30]} intensity={1.5} color="#ff6a00" />
        <pointLight position={[-10, 15, -80]} intensity={1.5} color="#ff2d78" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <AutoCamera />

        {PLATFORMS.map(p => (
          <PreviewPlatform key={p.id} position={p.position} size={p.size} isMoving={p.isMoving} />
        ))}

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -55]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#020408" roughness={1} />
        </mesh>
      </Canvas>
    </div>
  );
}
