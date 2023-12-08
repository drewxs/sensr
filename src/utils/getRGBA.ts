export const getRGBA = (value: number): string => {
  const alpha: number = Math.abs(value);
  const R: number = value > 0 ? 0 : 75;
  const G: number = value < 0 ? 0 : 100;
  const B: number = value < 0 ? 0 : 100;
  return `rgba(${R},${G},${B},${alpha})`;
};
