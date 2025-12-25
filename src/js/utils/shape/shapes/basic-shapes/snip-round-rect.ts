/**
 * Snip round rectangle shape renderer.
 *
 * Handles: snipRoundRect
 */

import { getTextByPathList } from "../../../object";
import type { BasicShapeParams } from "./shared";
import { getFillAttr } from "./shared";

export function renderSnipRoundRect(params: BasicShapeParams): string {
  const { node, w, h, border } = params;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    sAdj1_val = 0.33334;
  let sAdj2,
    sAdj2_val = 0.33334;

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

  return (
    "<path   d='" +
    d_val +
    "'  fill='" +
    getFillAttr(params) +
    "' stroke='" +
    border.color +
    "' stroke-width='" +
    border.width +
    "' stroke-dasharray='" +
    border.strokeDasharray +
    "' />"
  );
}
