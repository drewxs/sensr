export const random = (min: number = 0, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min: number = 0, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const xavier = (n: number): number => {
  return random(-(1 / Math.sqrt(n)), 1 / Math.sqrt(n));
};
