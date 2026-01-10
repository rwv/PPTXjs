/**
 * Calculates SVG gradient angle coordinates
 * Converts a degree angle to SVG gradient x1, y1, x2, y2 percentages
 *
 * @param angleDegrees - Angle in degrees (0-360)
 * @param svgHeightInput - SVG height
 * @param svgWidthInput - SVG width
 * @returns Array of [x1, y1, x2, y2] as percentages
 */
export function svgAngle(
  angleDegrees: number | string,
  svgHeightInput: number | string,
  svgWidthInput: number | string
): [number, number, number, number] {
  const width = parseFloat(String(svgWidthInput));
  const height = parseFloat(String(svgHeightInput));
  const angle = parseFloat(String(angleDegrees));

  let edgeY = 2;
  let edgeX = 2;
  const widthCenter = width / 2;
  const heightCenter = height / 2;
  let tempX1 = 2;
  let tempY1 = 2;
  let tempX2 = 2;
  let tempY2 = 2;

  const normalizedAngle = ((angle % 360) + 360) % 360;
  const angleRadians = ((360 - normalizedAngle) * Math.PI) / 180;
  const slope = Math.tan(angleRadians);
  const yIntercept = heightCenter - slope * widthCenter;

  // Handle special angles
  if (normalizedAngle === 0) {
    tempX1 = width;
    tempY1 = heightCenter;
    tempX2 = 0;
    tempY2 = heightCenter;
  } else if (normalizedAngle < 90) {
    edgeX = width;
    edgeY = 0;
  } else if (normalizedAngle === 90) {
    tempX1 = widthCenter;
    tempY1 = 0;
    tempX2 = widthCenter;
    tempY2 = height;
  } else if (normalizedAngle < 180) {
    edgeX = 0;
    edgeY = 0;
  } else if (normalizedAngle === 180) {
    tempX1 = 0;
    tempY1 = heightCenter;
    tempX2 = width;
    tempY2 = heightCenter;
  } else if (normalizedAngle < 270) {
    edgeX = 0;
    edgeY = height;
  } else if (normalizedAngle === 270) {
    tempX1 = widthCenter;
    tempY1 = height;
    tempX2 = widthCenter;
    tempY2 = 0;
  } else {
    edgeX = width;
    edgeY = height;
  }

  // Calculate gradient line coordinates
  const lineOffset = edgeY + edgeX / slope;
  tempX1 = tempX1 === 2 ? (slope * (lineOffset - yIntercept)) / (Math.pow(slope, 2) + 1) : tempX1;
  tempY1 = tempY1 === 2 ? slope * tempX1 + yIntercept : tempY1;
  tempX2 = tempX2 === 2 ? width - tempX1 : tempX2;
  tempY2 = tempY2 === 2 ? height - tempY1 : tempY2;

  const x1Percent = Math.round((tempX2 / width) * 100 * 100) / 100;
  const y1Percent = Math.round((tempY2 / height) * 100 * 100) / 100;
  const x2Percent = Math.round((tempX1 / width) * 100 * 100) / 100;
  const y2Percent = Math.round((tempY1 / height) * 100 * 100) / 100;

  return [x1Percent, y1Percent, x2Percent, y2Percent];
}
