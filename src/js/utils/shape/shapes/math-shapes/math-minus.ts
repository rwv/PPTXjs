/**
 * Math minus shape renderer.
 *
 * Handles: mathMinus
 */

import { getTextByPathList } from "../../../object";
import type { MathShapeContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render mathMinus shape
 */
export function renderMathMinus(ctx: MathShapeContext): string {
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

  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;
  const hc = w / 2,
    vc = h / 2;

  if (shapAdjst_ary === undefined) {
    adj1 = 23520 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
  }

  const cnstVal6 = 73490 * slideFactor;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const dy1 = (h * a1) / cnstVal3;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc + dy1;
  const x1 = hc - dx1;
  const x2 = hc + dx1;

  const dVal =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    y2 +
    " z";

  return createPath(dVal, ctx);
}
