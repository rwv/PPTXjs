/**
 * Math divide shape renderer.
 *
 * Handles: mathDivide
 */

import { getTextByPathList } from "../../../object";
import { shapeArc } from "../helpers/arc";
import type { MathShapeContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render mathDivide shape
 */
export function renderMathDivide(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1, adj1;
  let sAdj2, adj2;
  let sAdj3, adj3;
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
        } else if (sAdj_name === "adj3") {
          sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj3 = parseInt(sAdj3.substr(4));
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
    adj2 = 5880 * slideFactor;
    adj3 = 11760 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
    adj2 = adj2 * slideFactor;
    adj3 = adj3 * slideFactor;
  }

  const cnstVal4 = 1000 * slideFactor;
  const cnstVal5 = 36745 * slideFactor;
  const cnstVal6 = 73490 * slideFactor;
  const a1 = adj1 < cnstVal4 ? cnstVal4 : adj1 > cnstVal5 ? cnstVal5 : adj1;
  const ma1 = -a1;
  const ma3h = (cnstVal6 + ma1) / 4;
  const ma3w = (cnstVal5 * w) / h;
  const maxAdj3 = ma3h < ma3w ? ma3h : ma3w;
  const a3 = adj3 < cnstVal4 ? cnstVal4 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const m4a3 = -4 * a3;
  const maxAdj2 = cnstVal6 + m4a3 - a1;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const dy1 = (h * a1) / cnstVal3;
  const yg = (h * a2) / cnstVal2;
  const rad = (h * a3) / cnstVal2;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const y3 = vc - dy1;
  const y4 = vc + dy1;
  const a = yg + rad;
  const y2 = y3 - a;
  const y1 = y2 - rad;
  const y5 = h - y1;
  const x1 = hc - dx1;
  const x3 = hc + dx1;
  const _x2 = hc - rad;
  const cd4 = 90,
    c3d4 = 270;
  const cX1 = hc - Math.cos((c3d4 * Math.PI) / 180) * rad;
  const cY1 = y1 - Math.sin((c3d4 * Math.PI) / 180) * rad;
  const cX2 = hc - Math.cos(Math.PI / 2) * rad;
  const cY2 = y5 - Math.sin(Math.PI / 2) * rad;

  const dVal =
    "M" +
    hc +
    "," +
    y1 +
    shapeArc(cX1, cY1, rad, rad, c3d4, c3d4 + 360, false).replace("M", "L") +
    " z" +
    " M" +
    hc +
    "," +
    y5 +
    shapeArc(cX2, cY2, rad, rad, cd4, cd4 + 360, false).replace("M", "L") +
    " z" +
    " M" +
    x1 +
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
    x1 +
    "," +
    y4 +
    " z";

  return createPath(dVal, ctx);
}
