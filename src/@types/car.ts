import { Controls } from './controls';

export class Car {
  controls: Controls;
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
  flip: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.controls = new Controls();

    this.x = x;
    this.y = x;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.15;
    this.maxSpeed = 4;
    this.friction = 0.075;
    this.angle = 0;
    this.rotationSpeed = 0.02;
    this.flip = 1;
  }

  update() {
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
  }
}
