export function someObject(
  a: number,
  b: number,
): { id: number; a: number; b: number } {
  return {
    id: Date.now(),
    a,
    b,
  }
}
