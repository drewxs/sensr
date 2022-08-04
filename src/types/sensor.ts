import { Car, Contact, Position } from 'types';
import { getIntersection, lerp } from 'utils';

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: [Position, Position][];
  readings: Contact[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 4;
    this.rayLength = 100;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  /**
   * Update rays and readings.
   *
   * @param roadBorders - border matrix
   */
  update(roadBorders: [Position, Position][]): void {
    this.castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      const reading = this.getReading(this.rays[i], roadBorders)!;
      this.readings.push(reading);
    }
  }

  /**
   * Get reading position of contact with border if any.
   *
   * @param ray - ray start and end position
   * @param roadBoarders - border matrix
   * @returns position of contact if it exists
   */
  getReading(ray: Position[], roadBoarders: Position[][]): Contact | null {
    const contacts: Contact[] = [];

    for (let i = 0; i < roadBoarders.length; i++) {
      const contact: Contact = getIntersection(
        ray[0],
        ray[1],
        roadBoarders[i][0],
        roadBoarders[i][1]
      )!;
      if (contact) {
        contacts.push(contact);
      }
    }

    if (contacts.length === 0) {
      return null;
    } else {
      const offsets = contacts.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return contacts.find((e) => e.offset === minOffset) ?? null;
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
      ctx.strokeStyle = 'cyan';
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
