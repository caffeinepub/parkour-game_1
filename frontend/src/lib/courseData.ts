export interface PlatformDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  isMoving?: boolean;
  moveAxis?: 'x' | 'z';
  moveRange?: number;
  moveSpeed?: number;
}

export interface ObstacleDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  moveAxis: 'x' | 'z' | 'y';
  moveRange: number;
  moveSpeed: number;
}

export const PLATFORMS: PlatformDef[] = [
  // Start platform
  { id: 'p0',  position: [0, 0, 0],       size: [6, 0.5, 6] },
  // First section - easy
  { id: 'p1',  position: [0, 0, -9],      size: [4, 0.5, 4] },
  { id: 'p2',  position: [4, 0.5, -15],   size: [3, 0.5, 3] },
  { id: 'p3',  position: [-3, 1, -21],    size: [3, 0.5, 5] },
  // Second section - rising
  { id: 'p4',  position: [3, 2, -28],     size: [3, 0.5, 3] },
  { id: 'p5',  position: [0, 3, -34],     size: [2.5, 0.5, 2.5] },
  { id: 'p6',  position: [-4, 4, -40],    size: [2, 0.5, 4] },
  // Third section - narrow ledges
  { id: 'p7',  position: [2, 4.5, -47],   size: [1.5, 0.5, 6] },
  { id: 'p8',  position: [-2, 5, -54],    size: [1.5, 0.5, 3] },
  { id: 'p9',  position: [4, 5.5, -60],   size: [2, 0.5, 2] },
  // Fourth section - moving platforms
  { id: 'p10', position: [0, 6, -67],     size: [3, 0.5, 3], isMoving: true, moveAxis: 'x', moveRange: 4, moveSpeed: 1.2 },
  { id: 'p11', position: [-3, 6.5, -74],  size: [2.5, 0.5, 2.5], isMoving: true, moveAxis: 'x', moveRange: 3, moveSpeed: 1.5 },
  { id: 'p12', position: [3, 7, -81],     size: [2, 0.5, 2], isMoving: true, moveAxis: 'z', moveRange: 2, moveSpeed: 1.8 },
  // Fifth section - high altitude
  { id: 'p13', position: [0, 8, -88],     size: [3, 0.5, 3] },
  { id: 'p14', position: [-4, 9, -95],    size: [2.5, 0.5, 2.5] },
  { id: 'p15', position: [4, 10, -102],   size: [2, 0.5, 2] },
  // Finish platform
  { id: 'p16', position: [0, 10, -110],   size: [6, 0.5, 6] },
];

export const OBSTACLES: ObstacleDef[] = [
  { id: 'o1', position: [0, 1.5, -21],   size: [0.5, 2, 0.5], moveAxis: 'x', moveRange: 2.5, moveSpeed: 1.5 },
  { id: 'o2', position: [3, 3.5, -34],   size: [0.5, 2, 0.5], moveAxis: 'z', moveRange: 2,   moveSpeed: 2 },
  { id: 'o3', position: [-2, 5.5, -47],  size: [0.5, 2, 0.5], moveAxis: 'x', moveRange: 1.2, moveSpeed: 2.5 },
  { id: 'o4', position: [0, 6.5, -60],   size: [0.5, 2, 0.5], moveAxis: 'x', moveRange: 3,   moveSpeed: 1.8 },
  { id: 'o5', position: [0, 7.5, -74],   size: [0.5, 2, 0.5], moveAxis: 'z', moveRange: 2,   moveSpeed: 2.2 },
];

export const START_POSITION: [number, number, number] = [0, 1.5, 0];
export const FINISH_POSITION: [number, number, number] = [0, 10.5, -110];
export const FALL_THRESHOLD = -8;
