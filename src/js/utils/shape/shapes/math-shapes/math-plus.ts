/**
 * Math plus shape renderer.
 *
 * Handles: mathPlus
 */

import { getTextByPathList } from "../../../object";
import type { MathShapeContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render mathPlus shape
 */
export function renderMathPlus(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1, adj1;
  if (shapAdjst_ary !== undefined) {
    if (shapAdjst_ary.constructor === Array) {
      for (let i = 0; i < shapAdjst_ary.length; i++) {
        const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
        if (sAdj_name === "adj1") {
          sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj1 = parseInt(sAdj1.substr(4));
        }
      }
    } else {
      sAdj1 = getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]);
      adj1 = parseInt(sAdj1.substr(4));
    }
  }

  const cnstVal3 = 200000 * slideFactor;
  const hc = w / 2,
    vc = h / 2;

  if (shapAdjst_ary === undefined) {
    adj1 = 23520 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
  }

  const cnstVal6 = 73490 * slideFactor;
  const ss = Math.min(w, h);
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const dy1 = (h * cnstVal6) / cnstVal3;
  const dx2 = (ss * a1) / cnstVal3;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const y1 = vc - dy1;
  const y2 = vc - dx2;
  const y3 = vc + dx2;
  const y4 = vc + dy1;

  const dVal =
    "M" +
    x1 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    x3 +
    "," +
    y1 +
    " L" +
    x3 +
    "," +
    y2 +
    " L" +
    x4 +
    "," +
    y2 +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    x3 +
    "," +
    y3 +
    " L" +
    x3 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y3 +
    " L" +
    x1 +
    "," +
    y3 +
    " z";

  return createPath(dVal, ctx);
}
