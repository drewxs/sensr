import { Controls, ControlType, NeuralNetwork, Position, Sensor } from 'types';
import { linesIntersect } from 'utils';

const ACCELERATION: number = 0.1;
const MAX_SPEED: number = 3;
const FRICTION: number = 0.05;
const ROTATION_SPEED: number = 0.015;

const USER_COLOR: string = '#080808';
const NPC_COLOR: string = '#580000';

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
  network: NeuralNetwork | null;
  useNetwork: boolean;
  img: HTMLImageElement;
  mask: HTMLCanvasElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: ControlType,
    maxSpeed: number = MAX_SPEED,
    color: string = USER_COLOR
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

    this.useNetwork = controlType === ControlType.AI;

    if (controlType !== ControlType.NPC) {
      this.sensor = new Sensor(this);
      this.network = new NeuralNetwork([this.sensor.rayCount, 10, 4]);
    } else {
      this.sensor = null;
      this.network = null;
      color = NPC_COLOR;
    }

    this.controls = new Controls(controlType);

    this.img = new Image();
    this.img.src = 'car.png';

    this.mask = document.createElement('canvas');
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext('2d')!;
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();
      maskCtx.globalCompositeOperation = 'destination-atop';
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
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
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets: number[] = this.sensor.readings.map((s) =>
        s === null ? 0 : 1 - s.offset
      );
      const outputs: number[] = NeuralNetwork.feedForward(
        offsets,
        this.network!
      );

      if (this.useNetwork) {
        this.controls.left = Boolean(outputs[0]);
        this.controls.right = Boolean(outputs[1]);
        this.controls.forward = Boolean(outputs[2]);
        this.controls.reverse = Boolean(outputs[3]);
      }
    }
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
  draw(ctx: CanvasRenderingContext2D, drawSensor: boolean = false): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.drawImage(
      this.mask,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();

    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }
}
