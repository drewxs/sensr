import { Contact, Position } from 'types';
import { lerp } from 'utils';

export const getIntersection = (
  a: Position,
  b: Position,
  c: Position,
  d: Position
): Contact | null => {
  const tTop: number = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop: number = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom: number = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom !== 0) {
    const t: number = tTop / bottom;
    const u: number = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Contact(lerp(a.x, b.x, t), lerp(a.y, b.y, t), t);
    }
  }

  return null;
};
