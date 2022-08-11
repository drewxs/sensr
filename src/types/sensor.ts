import { RAY_COUNT, RAY_LENGTH } from 'config';
import { Car, Contact, Position } from 'types';
import { getIntersection, lerp } from 'utils';

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: Position[][];
  readings: Contact[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = RAY_COUNT;
    this.rayLength = RAY_LENGTH;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  /**
   * Update rays and readings.
   *
   * @param roadBorders - road boundaries
   */
  update(roadBorders: Position[][], traffic: Car[]): void {
    this.castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      const reading = this.getReading(this.rays[i], roadBorders, traffic)!;
      this.readings.push(reading);
    }
  }

  /**
   * Get reading position of contact with border if any.
   *
   * @param ray - ray start and end position
   * @param roadBoarders - road boundaries
   * @returns position of contact if it exists
   */
  getReading(
    ray: Position[],
    roadBoarders: Position[][],
    traffic: Car[]
  ): Contact | null {
    const intersections: Contact[] = [];

    for (let i = 0; i < roadBoarders.length; i++) {
      const intersection: Contact = getIntersection(
        ray[0],
        ray[1],
        roadBoarders[i][0],
        roadBoarders[i][1]
      )!;
      if (intersection) {
        intersections.push(intersection);
      }
    }

    for (let i: number = 0; i < traffic.length; i++) {
      const shape = traffic[i].shape;
      for (let j: number = 0; j < shape.length; j++) {
        const intersection = getIntersection(
          ray[0],
          ray[1],
          shape[j],
          shape[(j + 1) % shape.length]
        );
        if (intersection) {
          intersections.push(intersection);
        }
      }
    }

    if (intersections.length === 0) {
      return null;
    } else {
      const offsets = intersections.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return intersections.find((e) => e.offset === minOffset) ?? null;
    }
  }

  /**
   * Generate ray data.
   */
  castRays(): void {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle: number =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = new Position(this.car.x, this.car.y);
      const end = new Position(
        this.car.x - Math.sin(rayAngle) * this.rayLength,
        this.car.y - Math.cos(rayAngle) * this.rayLength
      );

      this.rays.push([start, end]);
    }
  }

  /**
   * Draw sensor lines.
   *
   * @param ctx - canvas context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.readings[i] ?? this.rays[i][1];

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#47a2a6';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
