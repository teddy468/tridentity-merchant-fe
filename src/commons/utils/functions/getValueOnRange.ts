export const getNumberOnRange = (x: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, x));
};
