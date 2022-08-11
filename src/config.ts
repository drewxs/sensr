// Main
export const LANE_COUNT: number = 4;
export const LANE_WIDTH: number = 60;
export const ROAD_WIDTH: number = LANE_COUNT * LANE_WIDTH;
export const CAR_WIDTH: number = 30;
export const CAR_HEIGHT: number = 50;
export const CAR_Y_OFFSET: number = 100;
export const CAR_SPEED: number = 4;
export const NUM_CARS: number = 250;
export const NUM_NPCS: number = NUM_CARS / 4;
export const ANIMATION_DURATION: number = 50;
export const MESSAGE_DURATION: number = 500;
export const MUTATION_AMOUNT: number = 0.1;

// Car
export const ACCELERATION: number = 0.1;
export const MAX_SPEED: number = 3;
export const FRICTION: number = 0.05;
export const ROTATION_SPEED: number = 0.015;

// Sensor
export const RAY_COUNT: number = 4;
export const RAY_LENGTH: number = 150;
export const INF: number = 1000000;

// Colors
export const BLACK: string = '#080808';
export const WHITE: string = '#f1f1f1';
export const USER_COLOR: string = '#080808';
export const NPC_COLOR: string = '#580000';
export const ROAD_BORDER_COLOR: string = '#9c9c9c';
