/**
 * Converts angle in EMU (English Metric Units) to degrees
 *
 * @param angle - Angle in EMU units (1 degree = 60000 EMU)
 * @returns Angle in degrees, or 0 if input is null/empty
 */
type AngleToDegreesOptions = {
  angle: number | string | null;
};

export function angleToDegrees({ angle }: AngleToDegreesOptions): number {
  if (angle === "" || angle == null) {
    return 0;
  }
  const angleNum = typeof angle === "number" ? angle : parseFloat(angle);
  if (!Number.isFinite(angleNum)) {
    return 0;
  }
  return Math.round(angleNum / 60000);
}
