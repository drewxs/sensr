import { Position } from 'types';
import { getIntersection } from 'utils';

export const linesIntersect = (a: Position[], b: Position[]): boolean => {
  for (let i: number = 0; i < a.length; i++) {
    for (let j: number = 0; j < b.length; j++) {
      const intersection = getIntersection(
        a[i],
        a[(i + 1) % a.length],
        b[j],
        b[(j + 1) % b.length]
      );
      if (intersection) return true;
    }
  }

  return false;
};
