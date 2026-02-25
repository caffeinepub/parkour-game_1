import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import type { PlatformDef } from '../lib/courseData';

interface PlatformProps {
  def: PlatformDef;
}

export default function Platform({ def }: PlatformProps) {
  const { position, size, isMoving, moveAxis, moveRange, moveSpeed } = def;
  const timeRef = useRef(Math.random() * Math.PI * 2);

  const [ref, api] = useBox<THREE.Mesh>(() => ({
    type: 'Static',
    args: size,
    position,
    mass: 0,
  }));

  useFrame((_, delta) => {
    if (!isMoving || !moveAxis || !moveRange || !moveSpeed) return;
    timeRef.current += delta * moveSpeed;
    const offset = Math.sin(timeRef.current) * moveRange;
    const newPos: [number, number, number] = [...position] as [number, number, number];
    if (moveAxis === 'x') newPos[0] = position[0] + offset;
    if (moveAxis === 'z') newPos[2] = position[2] + offset;
    api.position.set(...newPos);
    if (ref.current) {
      ref.current.position.set(...newPos);
    }
  });

  return (
    <group>
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#0d0d1a"
          roughness={0.3}
          metalness={0.7}
          emissive={new THREE.Color('#001a3a')}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Neon edge glow strips */}
      <NeonEdge
        position={position}
        size={size}
        isMoving={isMoving}
        moveAxis={moveAxis}
        moveRange={moveRange}
        moveSpeed={moveSpeed}
      />
    </group>
  );
}

interface NeonEdgeProps {
  position: [number, number, number];
  size: [number, number, number];
  isMoving?: boolean;
  moveAxis?: 'x' | 'z';
  moveRange?: number;
  moveSpeed?: number;
}

function NeonEdge({ position, size, isMoving, moveAxis, moveRange, moveSpeed }: NeonEdgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef  = useRef(Math.random() * Math.PI * 2);
  const [, h] = size;
  const edgeColor = isMoving ? '#ff6a00' : '#00d4ff';

  useFrame((_, delta) => {
    if (!isMoving || !moveAxis || !moveRange || !moveSpeed || !groupRef.current) return;
    timeRef.current += delta * moveSpeed;
    const offset = Math.sin(timeRef.current) * moveRange;
    const newPos: [number, number, number] = [...position] as [number, number, number];
    if (moveAxis === 'x') newPos[0] = position[0] + offset;
    if (moveAxis === 'z') newPos[2] = position[2] + offset;
    groupRef.current.position.set(...newPos);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Top edge strip */}
      <mesh position={[0, h / 2 + 0.02, 0]}>
        <boxGeometry args={[size[0], 0.04, size[2]]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={new THREE.Color(edgeColor)}
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
