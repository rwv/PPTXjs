/**
 * Converts angle in EMU (English Metric Units) to degrees
 *
 * @param angle - Angle in EMU units (1 degree = 60000 EMU)
 * @returns Angle in degrees, or 0 if input is null/empty
 */
export function angleToDegrees(angle: number | string | null): number {
  if (angle === "" || angle === null) {
    return 0;
  }
  const angleNum = typeof angle === "number" ? angle : parseFloat(angle);
  return Math.round(angleNum / 60000);
}
