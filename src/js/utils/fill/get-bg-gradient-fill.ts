/**
 * Get background gradient fill style
 *
 * @param bgPr - Background properties node
 * @param phClr - Placeholder color
 * @param slideMasterContent - Slide master content
 * @param warpObj - The warp object containing theme and other resources
 * @returns CSS background gradient string
 */
import { getTextByPathList } from "../object";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";

type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
type ColorMap = Parameters<typeof getSolidFill>[1];

export function getBgGradientFill(
  bgPr: Record<string, unknown> | undefined,
  phClr: string | undefined,
  slideMasterContent: Record<string, unknown>,
  warpObj: SolidFillWarpObj
): string {
  let bgcolor = "";
  if (bgPr !== undefined) {
    const grdFill = getTextByPathList<Record<string, unknown>>(bgPr, ["a:gradFill"]);
    const gsLst =
      getTextByPathList<Array<Record<string, unknown>>>(grdFill, ["a:gsLst", "a:gs"]) || [];
    const color_ary: string[] = [];
    const pos_ary: string[] = [];
    const clrMap = getTextByPathList<ColorMap>(slideMasterContent, [
      "p:sldMaster",
      "p:clrMap",
      "attrs",
    ]);

    for (let i = 0; i < gsLst.length; i++) {
      const lo_color = getSolidFill(gsLst[i] as SolidFillNode, clrMap, phClr, warpObj);
      const pos = getTextByPathList<string>(gsLst[i], ["attrs", "pos"]);
      if (pos !== undefined) {
        pos_ary[i] = Number(pos) / 1000 + "%";
      } else {
        pos_ary[i] = "";
      }
      color_ary[i] = "#" + lo_color;
    }

    // get rotation
    const lin = getTextByPathList<Record<string, unknown>>(grdFill, ["a:lin"]);
    let rot = 90;
    if (lin !== undefined) {
      const ang = getTextByPathList<string | number>(lin, ["attrs", "ang"]);
      if (ang !== undefined) {
        rot = angleToDegrees(ang) + 90;
      }
    }

    bgcolor = "background: linear-gradient(" + rot + "deg,";
    for (let i = 0; i < gsLst.length; i++) {
      if (i === gsLst.length - 1) {
        bgcolor += color_ary[i] + " " + pos_ary[i] + ");";
      } else {
        bgcolor += color_ary[i] + " " + pos_ary[i] + ", ";
      }
    }
  } else {
    if (phClr !== undefined) {
      bgcolor = "background: #" + phClr + ";";
    }
  }
  return bgcolor;
}
