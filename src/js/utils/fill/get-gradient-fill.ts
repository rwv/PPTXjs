import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";

/**
 * Extracts gradient fill information from PPTX node
 *
 * Parses gradient stop colors and rotation angle to create CSS linear gradient.
 * Handles multiple color stops (a:gs) and linear gradient direction (a:lin).
 *
 * @param node - Gradient fill node from PPTX (a:gradFill)
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

export function getGradientFill(node: GradientFillNode, warpObj: SolidFillWarpObj) {
  const gsLst = getTextByPathList<Array<Record<string, unknown>>>(node, ["a:gsLst", "a:gs"]) || [];
  const color_ary: Array<string | undefined> = [];
  for (let i = 0; i < gsLst.length; i++) {
    const lo_color = getSolidFill(gsLst[i] as SolidFillNode, undefined, undefined, warpObj);
    color_ary[i] = lo_color;
  }
  const lin = getTextByPathList<Record<string, unknown>>(node, ["a:lin"]);
  let rot = 0;
  if (lin !== undefined) {
    const ang = getTextByPathList<string | number>(lin, ["attrs", "ang"]);
    if (ang !== undefined) {
      rot = angleToDegrees(ang) + 90;
    }
  }
  return {
    color: color_ary,
    rot: rot,
  };
}
