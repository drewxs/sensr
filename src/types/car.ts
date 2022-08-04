import { Controls, Position, Sensor } from 'types';

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
  sensor: Sensor;
  controls: Controls;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.15;
    this.maxSpeed = 4;
    this.friction = 0.075;
    this.angle = 0;
    this.rotationSpeed = 0.02;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  /**
   * Update positions and sensors.
   *
   * @param roadBorders - borders used for collision detection
   */
  update(roadBorders: [Position, Position][]): void {
    this.move();
    this.sensor.update(roadBorders);
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
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();

    this.sensor.draw(ctx);
  }
}
