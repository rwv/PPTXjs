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

export function getBgGradientFill(
  bgPr: any,
  phClr: any,
  slideMasterContent: any,
  warpObj: any
): string {
  let bgcolor = "";
  if (bgPr !== undefined) {
    const grdFill = bgPr["a:gradFill"];
    const gsLst = grdFill["a:gsLst"]["a:gs"];
    const color_ary: string[] = [];
    const pos_ary: string[] = [];

    for (let i = 0; i < gsLst.length; i++) {
      let _lo_tint;
      let lo_color = "";
      lo_color = getSolidFill(
        gsLst[i],
        slideMasterContent["p:sldMaster"]["p:clrMap"]["attrs"],
        phClr,
        warpObj
      );
      const pos = getTextByPathList(gsLst[i], ["attrs", "pos"]);
      if (pos !== undefined) {
        pos_ary[i] = pos / 1000 + "%";
      } else {
        pos_ary[i] = "";
      }
      color_ary[i] = "#" + lo_color;
    }

    // get rotation
    const lin = grdFill["a:lin"];
    let rot = 90;
    if (lin !== undefined) {
      rot = angleToDegrees(lin["attrs"]["ang"]);
      rot = rot + 90;
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
