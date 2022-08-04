import { Position } from 'types';
import { lerp } from 'utils';

const INF = 1000000;

export class Road {
  x: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: [Position, Position][];

  constructor(x: number, width: number, laneCount: number = 4) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    this.top = -INF;
    this.bottom = INF;

    const topLeft = new Position(this.left, this.top);
    const topRight = new Position(this.right, this.top);
    const bottomLeft = new Position(this.left, this.bottom);
    const bottomRight = new Position(this.right, this.bottom);
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /**
   * Returns the x position of a lane given the lane index.
   *
   * @param laneIdx
   * @returns center position
   */
  getLaneCenter(laneIdx: number): number {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIdx, this.laneCount - 1) * laneWidth
    );
  }

  /**
   * Draw road.
   *
   * @param ctx - canvas context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
