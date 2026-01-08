import tinycolor from "tinycolor2";
import { getMiddleStops } from "./get-middle-stops";
import { svgAngle } from "./svg-angle";

/**
 * Generates SVG linear gradient definition
 *
 * @param w - Width of the gradient
 * @param h - Height of the gradient
 * @param angl - Angle of the gradient in degrees
 * @param color_arry - Array of color hex strings
 * @param shpId - Shape ID for unique gradient reference
 * @returns SVG linearGradient element string
 */
export function getSvgGradient(
  w: number,
  h: number,
  angl: number,
  color_arry: string[],
  shpId: string
): string {
  const stopsArray = getMiddleStops(color_arry.length - 2);

  const svgHeight = h;
  const svgWidth = w;
  let svg = "";

  const xy_ary = svgAngle(angl, svgHeight, svgWidth);
  const x1 = xy_ary[0];
  const y1 = xy_ary[1];
  const x2 = xy_ary[2];
  const y2 = xy_ary[3];

  const sal = stopsArray.length;
  const sr = sal < 20 ? 100 : 1000;

  const svgAngleAttr =
    ' gradientUnits="userSpaceOnUse" x1="' +
    x1 +
    '%" y1="' +
    y1 +
    '%" x2="' +
    x2 +
    '%" y2="' +
    y2 +
    '%"';
  const gradientStart = '<linearGradient id="linGrd_' + shpId + '"' + svgAngleAttr + ">\n";
  svg += gradientStart;

  for (let i = 0; i < sal; i++) {
    const tinClr = tinycolor("#" + color_arry[i]);
    const alpha = tinClr.getAlpha();

    svg +=
      '<stop offset="' +
      Math.round((parseFloat(stopsArray[i]) / 100) * sr) / sr +
      '" style="stop-color:' +
      tinClr.toHexString() +
      "; stop-opacity:" +
      alpha +
      ';"';
    svg += "/>\n";
  }

  svg += "</linearGradient>\n";

  return svg;
}
