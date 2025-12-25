/**
 * Math equal shape renderer.
 *
 * Handles: mathEqual
 */

import { getTextByPathList } from "../../../object";
import type { MathShapeContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render mathEqual shape
 */
export function renderMathEqual(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1, adj1;
  let sAdj2, adj2;
  if (shapAdjst_ary !== undefined) {
    if (shapAdjst_ary.constructor === Array) {
      for (let i = 0; i < shapAdjst_ary.length; i++) {
        const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
        if (sAdj_name === "adj1") {
          sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj1 = parseInt(sAdj1.substr(4));
        } else if (sAdj_name === "adj2") {
          sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj2 = parseInt(sAdj2.substr(4));
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
    adj2 = 11760 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
    adj2 = adj2 * slideFactor;
  }

  const cnstVal5 = 36745 * slideFactor;
  const cnstVal6 = 73490 * slideFactor;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
  const a2a1 = a1 * 2;
  const mAdj2 = cnstVal2 - a2a1;
  const a2 = adj2 < 0 ? 0 : adj2 > mAdj2 ? mAdj2 : adj2;
  const dy1 = (h * a1) / cnstVal2;
  const dy2 = (h * a2) / cnstVal3;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y1 = y2 - dy1;
  const y4 = y3 + dy1;
  const x1 = hc - dx1;
  const x2 = hc + dx1;
  const _yC1 = (y1 + y2) / 2;
  const _yC2 = (y3 + y4) / 2;

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
    " z" +
    "M" +
    x1 +
    "," +
    y3 +
    " L" +
    x2 +
    "," +
    y3 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    x1 +
    "," +
    y4 +
    " z";

  return createPath(dVal, ctx);
}
