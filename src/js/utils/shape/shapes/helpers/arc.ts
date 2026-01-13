/**
 * Generates an SVG path for an arc shape
 *
 * @param cX - Center X coordinate
 * @param cY - Center Y coordinate
 * @param rX - Radius in X direction (horizontal)
 * @param rY - Radius in Y direction (vertical)
 * @param stAng - Start angle in degrees
 * @param endAng - End angle in degrees
 * @param isClose - Whether to close the path with 'z' command
 * @returns SVG path string
 */
type ShapeArcOptions = {
  cX: number | string;
  cY: number | string;
  rX: number | string;
  rY: number | string;
  stAng: number | string;
  endAng: number | string;
  isClose: boolean;
};

export function shapeArc({ cX, cY, rX, rY, stAng, endAng, isClose }: ShapeArcOptions): string {
  // Convert to numbers
  const centerX = typeof cX === "number" ? cX : parseFloat(cX);
  const centerY = typeof cY === "number" ? cY : parseFloat(cY);
  const radiusX = typeof rX === "number" ? rX : parseFloat(rX);
  const radiusY = typeof rY === "number" ? rY : parseFloat(rY);
  const startAngle = typeof stAng === "number" ? stAng : parseFloat(stAng);
  const endAngle = typeof endAng === "number" ? endAng : parseFloat(endAng);

  if (
    !Number.isFinite(centerX) ||
    !Number.isFinite(centerY) ||
    !Number.isFinite(radiusX) ||
    !Number.isFinite(radiusY) ||
    !Number.isFinite(startAngle) ||
    !Number.isFinite(endAngle) ||
    radiusX <= 0 ||
    radiusY <= 0
  ) {
    return "";
  }

  let dData = "";
  let angle = startAngle;
  let isFirstPoint = true;

  if (endAngle >= startAngle) {
    // Forward direction (clockwise)
    while (angle <= endAngle) {
      const radians = angle * (Math.PI / 180); // convert degree to radians
      const x = centerX + Math.cos(radians) * radiusX;
      const y = centerY + Math.sin(radians) * radiusY;

      if (isFirstPoint) {
        dData = `M${x} ${y}`;
        isFirstPoint = false;
      } else {
        dData += ` L${x} ${y}`;
      }
      angle++;
    }
  } else {
    // Reverse direction (counter-clockwise)
    while (angle > endAngle) {
      const radians = angle * (Math.PI / 180); // convert degree to radians
      const x = centerX + Math.cos(radians) * radiusX;
      const y = centerY + Math.sin(radians) * radiusY;

      if (isFirstPoint) {
        dData = `M${x} ${y}`;
        isFirstPoint = false;
      } else {
        dData += ` L${x} ${y}`;
      }
      angle--;
    }
  }

  // Close path if requested
  if (isClose) {
    dData += " z";
  }

  return dData;
}
