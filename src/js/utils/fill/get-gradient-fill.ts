import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";

/**
 * Extracts gradient fill information from PPTX node
 *
 * Parses gradient stop colors and rotation angle to create CSS linear gradient.
 * Handles multiple color stops (a:gs) and linear gradient direction (a:lin).
 *
 * @param gradientFillNode - Gradient fill node from PPTX (a:gradFill)
 * @param warpObj - Container object with theme and color information
 * @returns Object with color array and rotation angle for CSS gradient
 */
type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
type GradientFillNode = {
  "a:gsLst"?: { "a:gs"?: Array<Record<string, unknown>> };
  "a:lin"?: { attrs?: { ang?: string | number } };
  [key: string]: unknown;
};

export function getGradientFill(gradientFillNode: GradientFillNode, warpObj: SolidFillWarpObj) {
  const gradientStops =
    getTextByPathList<Array<Record<string, unknown>>>(gradientFillNode, ["a:gsLst", "a:gs"]) || [];
  const colorStops: Array<string | undefined> = [];
  for (let i = 0; i < gradientStops.length; i++) {
    const solidFillColor = getSolidFill(
      gradientStops[i] as SolidFillNode,
      undefined,
      undefined,
      warpObj
    );
    colorStops[i] = solidFillColor;
  }
  const linearGradientNode = getTextByPathList<Record<string, unknown>>(gradientFillNode, [
    "a:lin",
  ]);
  let rotationDegrees = 0;
  if (linearGradientNode !== undefined) {
    const angle = getTextByPathList<string | number>(linearGradientNode, ["attrs", "ang"]);
    if (angle !== undefined) {
      rotationDegrees = angleToDegrees(angle) + 90;
    }
  }
  return {
    color: colorStops,
    rot: rotationDegrees,
  };
}
