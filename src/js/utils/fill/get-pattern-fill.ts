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
 * @param node - Pattern fill node from PPTX (a:pattFill)
 * @param warpObj - Container object with theme and color information
 * @returns Array with CSS gradient string, size, and position
 */
export function getPatternFill(node: any, warpObj: any) {
  var fgColor = "",
    bgColor = "",
    prst = "";
  var bgClr = node["a:bgClr"];
  var fgClr = node["a:fgClr"];
  prst = node["attrs"]["prst"];
  // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
  fgColor = getSolidFill(fgClr, undefined, undefined, warpObj);
  // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
  bgColor = getSolidFill(bgClr, undefined, undefined, warpObj);
  var linear_gradient = getLinerGrandient(prst, bgColor, fgColor);
  return linear_gradient;
}
