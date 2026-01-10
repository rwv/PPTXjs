/**
 * Get background gradient fill style
 *
 * @param backgroundProps - Background properties node
 * @param placeholderColor - Placeholder color
 * @param slideMasterContent - Slide master content
 * @param warpContext - The warp object containing theme and other resources
 * @returns CSS background gradient string
 */
import { getTextByPathList } from "../object";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";

type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
type ColorMap = Parameters<typeof getSolidFill>[1];

export function getBgGradientFill(
  backgroundProps: Record<string, unknown> | undefined,
  placeholderColor: string | undefined,
  slideMasterContent: Record<string, unknown>,
  warpContext: SolidFillWarpObj
): string {
  let backgroundCss = "";
  if (backgroundProps !== undefined) {
    const gradientFillNode = getTextByPathList<Record<string, unknown>>(backgroundProps, [
      "a:gradFill",
    ]);
    const gradientStops =
      getTextByPathList<Array<Record<string, unknown>>>(gradientFillNode, ["a:gsLst", "a:gs"]) ||
      [];
    const colorStops: string[] = [];
    const positionStops: string[] = [];
    const colorMap = getTextByPathList<ColorMap>(slideMasterContent, [
      "p:sldMaster",
      "p:clrMap",
      "attrs",
    ]);

    for (let i = 0; i < gradientStops.length; i++) {
      const solidFillColor = getSolidFill(
        gradientStops[i] as SolidFillNode,
        colorMap,
        placeholderColor,
        warpContext
      );
      const pos = getTextByPathList<string>(gradientStops[i], ["attrs", "pos"]);
      if (pos !== undefined) {
        positionStops[i] = Number(pos) / 1000 + "%";
      } else {
        positionStops[i] = "";
      }
      colorStops[i] = "#" + solidFillColor;
    }

    // get rotation
    const linearGradientNode = getTextByPathList<Record<string, unknown>>(gradientFillNode, [
      "a:lin",
    ]);
    let rotationDegrees = 90;
    if (linearGradientNode !== undefined) {
      const angle = getTextByPathList<string | number>(linearGradientNode, ["attrs", "ang"]);
      if (angle !== undefined) {
        rotationDegrees = angleToDegrees(angle) + 90;
      }
    }

    backgroundCss = "background: linear-gradient(" + rotationDegrees + "deg,";
    for (let i = 0; i < gradientStops.length; i++) {
      if (i === gradientStops.length - 1) {
        backgroundCss += colorStops[i] + " " + positionStops[i] + ");";
      } else {
        backgroundCss += colorStops[i] + " " + positionStops[i] + ", ";
      }
    }
  } else {
    if (placeholderColor !== undefined) {
      backgroundCss = "background: #" + placeholderColor + ";";
    }
  }
  return backgroundCss;
}
