/**
 * Calculate Rectified Linear Unit
 *
 * @param x - input value
 * @returns result
 */
export const relu = (x: number): number => {
  return Math.max(0, x);
};

/**
 * Calculate y value of a given input in a sigmoid curve.
 *
 * @param x - input value
 * @returns result
 */
export const sigmoid = (x: number): number => {
  return 1 / (1 + Math.exp(-x));
};
