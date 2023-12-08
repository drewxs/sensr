export const relu = (x: number): number => {
  return Math.max(0, x);
};

export const sigmoid = (x: number): number => {
  return 1 / (1 + Math.exp(-x));
};
