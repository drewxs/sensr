/**
 * Linear interpolation.
 *
 * @param x - first value
 * @param y - second value
 * @param p - amount to interpolate by
 * @returns interpolated value
 */
export const lerp = (x: number, y: number, z: number) => {
  return x + (y - x) * z;
};
