import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import type { ObstacleDef } from '../lib/courseData';

interface ObstacleProps {
  def: ObstacleDef;
}

export default function Obstacle({ def }: ObstacleProps) {
  const { position, size, moveAxis, moveRange, moveSpeed } = def;
  const timeRef = useRef(Math.random() * Math.PI * 2);

  const [ref, api] = useBox<THREE.Mesh>(() => ({
    type: 'Static',
    args: size,
    position,
    mass: 0,
  }));

  useFrame((_, delta) => {
    timeRef.current += delta * moveSpeed;
    const offset = Math.sin(timeRef.current) * moveRange;
    const newPos: [number, number, number] = [...position] as [number, number, number];
    if (moveAxis === 'x') newPos[0] = position[0] + offset;
    if (moveAxis === 'z') newPos[2] = position[2] + offset;
    if (moveAxis === 'y') newPos[1] = position[1] + offset;
    api.position.set(...newPos);
    if (ref.current) ref.current.position.set(...newPos);
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#ff6a00"
        emissive={new THREE.Color('#ff6a00')}
        emissiveIntensity={0.9}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}
