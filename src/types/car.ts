import { Controls, Position, Sensor } from 'types';
import { linesIntersect } from 'utils';

const ACCELERATION: number = 0.1;
const MAX_SPEED: number = 4;
const FRICTION: number = 0.05;
const ROTATION_SPEED: number = 0.015;

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  rotationSpeed: number;
  sensor: Sensor | null;
  controls: Controls;
  shape: Position[];
  damaged: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: string,
    maxSpeed: number = MAX_SPEED
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = ACCELERATION;
    this.maxSpeed = maxSpeed;
    this.friction = FRICTION;
    this.angle = 0;
    this.rotationSpeed = ROTATION_SPEED;
    this.shape = this.createShape();
    this.damaged = false;

    const isUser = controlType === 'USER';
    this.sensor = isUser ? new Sensor(this) : null;

    this.controls = new Controls(controlType);
  }

  /**
   * Update positions and sensors.
   *
   * @param roadBorders - road boundaries
   */
  update(roadBorders: Position[][], traffic: Car[] = []): void {
    if (!this.damaged) {
      this.move();
      this.shape = this.createShape();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }
    this.sensor?.update(roadBorders, traffic);
  }

  /**
   * Checks for collision with road borders.
   *
   * @param roadBorders - road boundaries
   * @returns whether the car is damaged or not
   */
  assessDamage(roadBorders: Position[][], traffic: Car[]): boolean {
    for (let i: number = 0; i < roadBorders.length; i++) {
      if (linesIntersect(this.shape, roadBorders[i])) {
        return true;
      }
    }
    for (let i: number = 0; i < traffic.length; i++) {
      if (linesIntersect(this.shape, traffic[i].shape)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Create vertexes for car shape.
   *
   * @returns position matrix of vertices
   */
  createShape(): Position[] {
    const points: Position[] = [];
    const radius: number = Math.hypot(this.width, this.height) / 2;
    const alpha: number = Math.atan2(this.width, this.height);

    points.push(
      new Position(
        this.x - Math.sin(this.angle - alpha) * radius,
        this.y - Math.cos(this.angle - alpha) * radius
      )
    );
    points.push(
      new Position(
        this.x - Math.sin(this.angle + alpha) * radius,
        this.y - Math.cos(this.angle + alpha) * radius
      )
    );
    points.push(
      new Position(
        this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
        this.y - Math.cos(Math.PI + this.angle - alpha) * radius
      )
    );
    points.push(
      new Position(
        this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
        this.y - Math.cos(Math.PI + this.angle + alpha) * radius
      )
    );

    return points;
  }

  /**
   * Update car position.
   */
  move(): void {
    // Update speed by acceleration
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // Prevent speed exceeding limits
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    // Apply friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    // Stop car if speed is below friction
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // Only allow turning if car is moving
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      // Handle turning
      if (this.controls.left) {
        this.angle += this.rotationSpeed * flip;
      }
      if (this.controls.right) {
        this.angle -= this.rotationSpeed * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  /**
   * Draw car.
   *
   * @param ctx - canvas context
   */
  draw(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.fillStyle = this.damaged ? '#2c2c2c' : color;

    ctx.beginPath();
    ctx.moveTo(this.shape[0].x, this.shape[0].y);
    for (let i: number = 0; i < this.shape.length; i++) {
      ctx.lineTo(this.shape[i].x, this.shape[i].y);
    }
    ctx.fill();

    this.sensor?.draw(ctx);
  }
}
