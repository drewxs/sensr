/**
 * Linear interpolation.
 *
 * @param x - first value
 * @param y - second value
 * @param p - amount to interpolate by
 */
export const lerp = (x: number, y: number, z: number): number => {
  return x + (y - x) * z;
};
