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
 * @param warpContext - Container object with theme and color information
 * @returns Array with CSS gradient string, size, and position
 */
type SolidFillOptions = Parameters<typeof getSolidFill>[0];
type SolidFillNode = SolidFillOptions["fillNode"];
type SolidFillWarpObj = SolidFillOptions["warpContext"];
type PatternFillNode = {
  "a:bgClr"?: unknown;
  "a:fgClr"?: unknown;
  attrs?: { prst?: string };
  [key: string]: unknown;
};

type GetPatternFillOptions = {
  patternFillNode: PatternFillNode;
  warpContext: SolidFillWarpObj;
};

export function getPatternFill({ patternFillNode, warpContext }: GetPatternFillOptions) {
  const patternPreset = patternFillNode["attrs"]?.prst ?? "";
  const backgroundColorNode = patternFillNode["a:bgClr"] as SolidFillNode;
  const foregroundColorNode = patternFillNode["a:fgClr"] as SolidFillNode;
  const foregroundColor =
    getSolidFill({
      fillNode: foregroundColorNode,
      colorMap: undefined,
      placeholderColor: undefined,
      warpContext,
    }) || "";
  const backgroundColor =
    getSolidFill({
      fillNode: backgroundColorNode,
      colorMap: undefined,
      placeholderColor: undefined,
      warpContext,
    }) || "";
  const linearGradient = getLinerGrandient({
    patternPreset,
    backgroundColor,
    foregroundColor,
  });
  return linearGradient;
}
