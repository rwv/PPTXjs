import { getSolidFill } from "../color/get-solid-fill";
import { getLinerGrandient } from "./get-liner-grandient";

/**
 * Extracts pattern fill information from PPTX node
 *
 * Parses foreground color, background color, and pattern preset type.
 * Converts PPTX pattern fills to CSS gradient patterns using getLinerGrandient.
 *
 * Pattern types include: grids, diagonals, checks, bricks, waves, dots, etc.
 * See OOXML spec or getLinerGrandient for full list of pattern presets.
 *
 * @param patternFillNode - Pattern fill node from PPTX (a:pattFill)
 * @param warpObj - Container object with theme and color information
 * @returns Array with CSS gradient string, size, and position
 */
type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
type PatternFillNode = {
  "a:bgClr"?: unknown;
  "a:fgClr"?: unknown;
  attrs?: { prst?: string };
  [key: string]: unknown;
};

export function getPatternFill(patternFillNode: PatternFillNode, warpObj: SolidFillWarpObj) {
  const patternPreset = patternFillNode["attrs"]?.prst ?? "";
  const backgroundColorNode = patternFillNode["a:bgClr"] as SolidFillNode;
  const foregroundColorNode = patternFillNode["a:fgClr"] as SolidFillNode;
  const foregroundColor = getSolidFill(foregroundColorNode, undefined, undefined, warpObj) || "";
  const backgroundColor = getSolidFill(backgroundColorNode, undefined, undefined, warpObj) || "";
  const linearGradient = getLinerGrandient(patternPreset, backgroundColor, foregroundColor);
  return linearGradient;
}
