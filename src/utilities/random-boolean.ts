export function randomBoolean(truthlyRatio: number = 0.5): boolean {
  return Math.random() < truthlyRatio;
}
