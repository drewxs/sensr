/**
 * Calculate y value of a given input in a sigmoid curve.
 *
 * @param x - input value
 * @returns y value
 */
export const sigmoid = (x: number): number => {
  return 1 / (1 + Math.exp(-x));
};
