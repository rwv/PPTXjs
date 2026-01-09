import { getTextByPathList } from "../../../object";
import type { BasicShapeParams } from "./types";

export function renderSnipRoundRect(params: BasicShapeParams): string {
  const { node, w, h, shpId, fillColor, grndFillFlg, imgFillFlg, border } = params;
  let result = "";
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1;
  let sAdj1_val = 0.33334;
  let sAdj2;
  let sAdj2_val = 0.33334;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) / 50000;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) / 50000;
      }
    }
  }
  const d_val =
    "M0," +
    h +
    " L" +
    w +
    "," +
    h +
    " L" +
    w +
    "," +
    (h / 2) * sAdj2_val +
    " L" +
    (w / 2 + (w / 2) * (1 - sAdj2_val)) +
    ",0 L" +
    (w / 2) * sAdj1_val +
    ",0 Q0,0 0," +
    (h / 2) * sAdj1_val +
    " z";

  result +=
    "<path   d='" +
    d_val +
    "'  fill='" +
    (!imgFillFlg
      ? grndFillFlg
        ? "url(#linGrd_" + shpId + ")"
        : fillColor
      : "url(#imgPtrn_" + shpId + ")") +
    "' stroke='" +
    border.color +
    "' stroke-width='" +
    border.width +
    "' stroke-dasharray='" +
    border.strokeDasharray +
    "' />";
  return result;
}
