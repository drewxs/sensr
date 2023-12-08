import { INF, ROAD_BORDER_COLOR } from 'config';
import { Position } from 'types';
import { lerp } from 'utils';
export class Road {
  x: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: Position[][];

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

  getLaneCenter(laneIdx: number): number {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIdx, this.laneCount - 1) * laneWidth
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 3;
    ctx.strokeStyle = ROAD_BORDER_COLOR;

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    for (let i: number = 0; i < this.borders.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.borders[i][0].x, this.borders[i][0].y);
      ctx.lineTo(this.borders[i][1].x, this.borders[i][1].y);
      ctx.stroke();
    }
  }
}
