import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useKeyboardControls } from '../lib/useKeyboardControls';
import { FALL_THRESHOLD, START_POSITION } from '../lib/courseData';

interface PlayerProps {
  onEnterStart: () => void;
  onEnterFinish: () => void;
  onJump: (pos: THREE.Vector3) => void;
  onLand: (pos: THREE.Vector3) => void;
  resetSignal: number;
}

const SPEED       = 8;
const RUN_SPEED   = 14;
const JUMP_FORCE  = 7;
const MAX_JUMPS   = 2;
const CAMERA_DIST = 7;
const CAMERA_HEIGHT = 3;

export default function Player({ onEnterStart, onEnterFinish, onJump, onLand, resetSignal }: PlayerProps) {
  const { camera } = useThree();
  const keys = useKeyboardControls();

  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    mass: 1,
    position: START_POSITION,
    args: [0.4],
    linearDamping: 0.4,
    angularDamping: 1,
    material: { friction: 0.1, restitution: 0 },
  }));

  const velocity    = useRef(new THREE.Vector3());
  const position    = useRef(new THREE.Vector3(...START_POSITION));
  const jumpCount   = useRef(0);
  const isGrounded  = useRef(false);
  const prevJump    = useRef(false);
  const wasGrounded = useRef(false);
  const yaw         = useRef(0);
  const pitch       = useRef(-0.3);
  const inStart     = useRef(true);
  const inFinish    = useRef(false);

  // Subscribe to physics state
  useEffect(() => {
    const unsubV = api.velocity.subscribe(v => {
      velocity.current.set(v[0], v[1], v[2]);
    });
    const unsubP = api.position.subscribe(p => {
      position.current.set(p[0], p[1], p[2]);
    });
    return () => { unsubV(); unsubP(); };
  }, [api]);

  // Reset player
  useEffect(() => {
    api.position.set(...START_POSITION);
    api.velocity.set(0, 0, 0);
    jumpCount.current = 0;
    isGrounded.current = false;
    inStart.current = true;
    inFinish.current = false;
  }, [resetSignal, api]);

  // Mouse look
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current   -= e.movementX * 0.002;
        pitch.current -= e.movementY * 0.002;
        pitch.current  = Math.max(-Math.PI / 3, Math.min(Math.PI / 6, pitch.current));
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const handleClick = useCallback(() => {
    document.body.requestPointerLock();
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  useFrame((_, delta) => {
    const pos = position.current;
    const vel = velocity.current;

    // Ground detection: player is grounded if vertical velocity is near zero and not falling fast
    const wasG = isGrounded.current;
    isGrounded.current = Math.abs(vel.y) < 0.5 && vel.y > -2;
    if (!wasGrounded.current && isGrounded.current) {
      jumpCount.current = 0;
      onLand(pos.clone());
    }
    wasGrounded.current = isGrounded.current;

    // Movement direction based on camera yaw
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right   = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const moveDir = new THREE.Vector3();

    if (keys.current.forward)  moveDir.add(forward);
    if (keys.current.backward) moveDir.sub(forward);
    if (keys.current.right)    moveDir.add(right);
    if (keys.current.left)     moveDir.sub(right);

    const speed = keys.current.shift ? RUN_SPEED : SPEED;
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(speed);
      api.velocity.set(moveDir.x, vel.y, moveDir.z);
    } else {
      // Dampen horizontal movement
      api.velocity.set(vel.x * Math.pow(0.85, delta * 60), vel.y, vel.z * Math.pow(0.85, delta * 60));
    }

    // Jump
    const jumpPressed = keys.current.jump;
    if (jumpPressed && !prevJump.current && jumpCount.current < MAX_JUMPS) {
      api.velocity.set(vel.x, JUMP_FORCE, vel.z);
      jumpCount.current++;
      onJump(pos.clone());
    }
    prevJump.current = jumpPressed;

    // Fall reset
    if (pos.y < FALL_THRESHOLD) {
      api.position.set(...START_POSITION);
      api.velocity.set(0, 0, 0);
      jumpCount.current = 0;
      inStart.current = true;
    }

    // Zone detection
    const distToStart  = Math.sqrt(pos.x ** 2 + (pos.z) ** 2);
    const distToFinish = Math.sqrt((pos.x - 0) ** 2 + (pos.z + 110) ** 2);

    if (distToStart < 3 && pos.y > -0.5 && pos.y < 3) {
      if (!inStart.current) {
        inStart.current = true;
      }
    } else {
      if (inStart.current) {
        inStart.current = false;
        onEnterStart();
      }
    }

    if (distToFinish < 3.5 && pos.y > 9 && pos.y < 13) {
      if (!inFinish.current) {
        inFinish.current = true;
        onEnterFinish();
      }
    } else {
      inFinish.current = false;
    }

    // Camera follow
    const camOffset = new THREE.Vector3(
      Math.sin(yaw.current) * CAMERA_DIST * Math.cos(pitch.current),
      CAMERA_HEIGHT + Math.sin(pitch.current) * CAMERA_DIST,
      Math.cos(yaw.current) * CAMERA_DIST * Math.cos(pitch.current)
    );
    const targetCamPos = pos.clone().add(camOffset);
    camera.position.lerp(targetCamPos, 0.12);
    camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return (
    <mesh ref={ref} castShadow>
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive={new THREE.Color('#00d4ff')}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}
