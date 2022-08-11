/**
 * Returns a random number with a range.
 *
 * @param min - minimum value
 * @param max - maximum value
 * @returns random number
 */
export const random = (min: number = 0, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer with a range.
 *
 * @param min - minimum value
 * @param max - maximum value
 * @returns random integer
 */
export const randomInt = (min: number = 0, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Xavier weight initialization, return a random number with a uniform probability distribution.
 *
 * @param n - number of inputs
 * @returns random number
 */
export const xavier = (n: number): number => {
  return random(-(1 / Math.sqrt(n)), 1 / Math.sqrt(n));
};
