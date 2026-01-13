import tinycolor from "tinycolor2";
import { getMiddleStops } from "./get-middle-stops";
import { svgAngle } from "./svg-angle";

/**
 * Generates SVG linear gradient definition
 *
 * @param width - Width of the gradient
 * @param height - Height of the gradient
 * @param angleDegrees - Angle of the gradient in degrees
 * @param colorStops - Array of color hex strings
 * @param shapeId - Shape ID for unique gradient reference
 * @returns SVG linearGradient element string
 */
type GetSvgGradientOptions = {
  width: number;
  height: number;
  angleDegrees: number;
  colorStops: string[];
  shapeId: string;
};

export function getSvgGradient({
  width,
  height,
  angleDegrees,
  colorStops,
  shapeId,
}: GetSvgGradientOptions): string {
  if (colorStops.length < 2) {
    return "";
  }

  const middleStops = getMiddleStops({ middleStopCount: colorStops.length - 2 });

  const svgHeight = height;
  const svgWidth = width;
  let svgMarkup = "";

  const angleCoords = svgAngle({
    angleDegrees,
    svgHeightInput: svgHeight,
    svgWidthInput: svgWidth,
  });
  const x1 = angleCoords[0];
  const y1 = angleCoords[1];
  const x2 = angleCoords[2];
  const y2 = angleCoords[3];

  const stopCount = middleStops.length;
  const stopResolution = stopCount < 20 ? 100 : 1000;

  const gradientUnitsAttr =
    ' gradientUnits="userSpaceOnUse" x1="' +
    x1 +
    '%" y1="' +
    y1 +
    '%" x2="' +
    x2 +
    '%" y2="' +
    y2 +
    '%"';
  const gradientOpenTag = '<linearGradient id="linGrd_' + shapeId + '"' + gradientUnitsAttr + ">\n";
  svgMarkup += gradientOpenTag;

  for (let i = 0; i < stopCount; i++) {
    const stopColor = tinycolor("#" + colorStops[i]);
    const stopOpacity = stopColor.getAlpha();

    svgMarkup +=
      '<stop offset="' +
      Math.round((parseFloat(middleStops[i]) / 100) * stopResolution) / stopResolution +
      '" style="stop-color:' +
      stopColor.toHexString() +
      "; stop-opacity:" +
      stopOpacity +
      ';"';
    svgMarkup += "/>\n";
  }

  svgMarkup += "</linearGradient>\n";

  return svgMarkup;
}
