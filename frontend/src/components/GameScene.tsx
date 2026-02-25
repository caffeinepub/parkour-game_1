import { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, usePlane } from '@react-three/cannon';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Player from './Player';
import Platform from './Platform';
import Obstacle from './Obstacle';
import Zone from './Zone';
import ParticleEffect from './ParticleEffect';
import HUD from './HUD';
import NameEntryDialog from './NameEntryDialog';
import { useTimer } from '../lib/useTimer';
import { useLeaderboard } from '../lib/useLeaderboard';
import { PLATFORMS, OBSTACLES } from '../lib/courseData';
import { Screen } from '../App';

function Ground() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, -55],
    mass: 0,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#020408" roughness={1} />
    </mesh>
  );
}

interface ParticleState {
  id: number;
  position: THREE.Vector3;
  active: boolean;
}

interface GameSceneProps {
  onNavigate: (s: Screen) => void;
}

export default function GameScene({ onNavigate }: GameSceneProps) {
  const timer = useTimer();
  const { addEntry, getRank } = useLeaderboard();
  const [resetSignal, setResetSignal] = useState(0);
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [finishTime, setFinishTime] = useState(0);
  const [finishRank, setFinishRank] = useState(0);
  const particleIdRef = useRef(0);
  const hasFinishedRef = useRef(false);

  const spawnParticle = useCallback((pos: THREE.Vector3) => {
    const id = ++particleIdRef.current;
    setParticles(prev => [...prev.slice(-5), { id, position: pos.clone(), active: true }]);
  }, []);

  const handleEnterStart = useCallback(() => {
    timer.start();
  }, [timer]);

  const handleEnterFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    timer.stop();
    const t = timer.elapsed;
    setFinishTime(t);
    const rank = getRank(t);
    setFinishRank(rank);
    setTimeout(() => setShowNameEntry(true), 800);
  }, [timer, getRank]);

  const handleRestart = useCallback(() => {
    timer.reset();
    setResetSignal(s => s + 1);
    setShowNameEntry(false);
    hasFinishedRef.current = false;
  }, [timer]);

  const handleNameSubmit = useCallback((name: string) => {
    addEntry(name, finishTime);
    setShowNameEntry(false);
  }, [addEntry, finishTime]);

  const handleNameCancel = useCallback(() => {
    setShowNameEntry(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 500, position: [0, 3, 8] }}
        shadows
        gl={{ antialias: true }}
        style={{ background: '#020408' }}
      >
        <color attach="background" args={['#020408']} />
        <fog attach="fog" args={['#020408', 40, 150]} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          color="#ffffff"
        />
        <pointLight position={[0, 5, 0]}    intensity={1.5} color="#00d4ff" distance={30} />
        <pointLight position={[0, 8, -55]}  intensity={2}   color="#ff6a00" distance={40} />
        <pointLight position={[0, 12, -110]} intensity={2}  color="#ff2d78" distance={30} />

        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={0.5} />

        <Physics gravity={[0, -20, 0]} broadphase="SAP" allowSleep>
          <Ground />

          {/* Platforms */}
          {PLATFORMS.map(p => (
            <Platform key={p.id} def={p} />
          ))}

          {/* Obstacles */}
          {OBSTACLES.map(o => (
            <Obstacle key={o.id} def={o} />
          ))}

          {/* Player */}
          <Player
            onEnterStart={handleEnterStart}
            onEnterFinish={handleEnterFinish}
            onJump={spawnParticle}
            onLand={spawnParticle}
            resetSignal={resetSignal}
          />
        </Physics>

        {/* Zones (visual only, detection in Player) */}
        <Zone position={[0, 0.5, 0]}    size={[6, 1, 6]}  color="#39ff14" label="START" />
        <Zone position={[0, 10.5, -110]} size={[6, 1, 6]} color="#ff2d78" label="FINISH" />

        {/* Particle effects */}
        {particles.map(p => (
          <ParticleEffect
            key={p.id}
            position={p.position}
            active={p.active}
            onComplete={() => setParticles(prev => prev.filter(x => x.id !== p.id))}
          />
        ))}
      </Canvas>

      {/* HUD overlay */}
      <HUD
        timeFormatted={timer.formatted}
        finished={timer.finished}
        running={timer.running}
        onRestart={handleRestart}
        onNavigate={onNavigate}
      />

      {/* Name entry dialog */}
      {showNameEntry && (
        <NameEntryDialog
          time={finishTime}
          rank={finishRank}
          onSubmit={handleNameSubmit}
          onCancel={handleNameCancel}
        />
      )}
    </div>
  );
}
