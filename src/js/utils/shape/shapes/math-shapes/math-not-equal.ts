/**
 * Math not-equal shape renderer.
 *
 * Handles: mathNotEqual
 */

import { getTextByPathList } from "../../../object";
import type { MathShapeContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render mathNotEqual shape
 */
export function renderMathNotEqual(ctx: MathShapeContext): string {
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

  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;
  const hc = w / 2,
    vc = h / 2,
    hd2 = h / 2;

  if (shapAdjst_ary === undefined) {
    adj1 = 23520 * slideFactor;
    adj2 = (110 * Math.PI) / 180;
    adj3 = 11760 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
    adj2 = ((adj2 / 60000) * Math.PI) / 180;
    adj3 = adj3 * slideFactor;
  }

  const angVal1 = (70 * Math.PI) / 180;
  const angVal2 = (110 * Math.PI) / 180;
  const cnstVal4 = 73490 * slideFactor;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
  const crAng = adj2 < angVal1 ? angVal1 : adj2 > angVal2 ? angVal2 : adj2;
  const a2a1 = a1 * 2;
  const maxAdj3 = cnstVal2 - a2a1;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const dy1 = (h * a1) / cnstVal2;
  const dy2 = (h * a3) / cnstVal3;
  const dx1 = (w * cnstVal4) / cnstVal3;
  const x1 = hc - dx1;
  const x8 = hc + dx1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y1 = y2 - dy1;
  const y4 = y3 + dy1;
  const cadj2 = crAng - Math.PI / 2;
  const xadj2 = hd2 * Math.tan(cadj2);
  const len = Math.sqrt(xadj2 * xadj2 + hd2 * hd2);
  const bhw = (len * dy1) / hd2;
  const bhw2 = bhw / 2;
  const x7 = hc + xadj2 - bhw2;
  const dx67 = (xadj2 * y1) / hd2;
  const x6 = x7 - dx67;
  const dx57 = (xadj2 * y2) / hd2;
  const x5 = x7 - dx57;
  const dx47 = (xadj2 * y3) / hd2;
  const x4 = x7 - dx47;
  const dx37 = (xadj2 * y4) / hd2;
  const x3 = x7 - dx37;
  const dx27 = xadj2 * 2;
  const x2 = x7 - dx27;
  const rx7 = x7 + bhw;
  const rx6 = x6 + bhw;
  const rx5 = x5 + bhw;
  const rx4 = x4 + bhw;
  const rx3 = x3 + bhw;
  const _rx2 = x2 + bhw;
  const dx7 = (dy1 * hd2) / len;
  const rxt = x7 + dx7;
  const lxt = rx7 - dx7;
  const rx = cadj2 > 0 ? rxt : rx7;
  const lx = cadj2 > 0 ? x7 : lxt;
  const dy3 = (dy1 * xadj2) / len;
  const dy4 = -dy3;
  const ry = cadj2 > 0 ? dy3 : 0;
  const ly = cadj2 > 0 ? 0 : dy4;
  const dlx = w - rx;
  const drx = w - lx;
  const dly = h - ry;
  const dry = h - ly;
  const _xC1 = (rx + lx) / 2;
  const _xC2 = (drx + dlx) / 2;
  const _yC1 = (ry + ly) / 2;
  const _yC2 = (y1 + y2) / 2;
  const _yC3 = (y3 + y4) / 2;
  const _yC4 = (dry + dly) / 2;

  const dVal =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    x6 +
    "," +
    y1 +
    " L" +
    lx +
    "," +
    ly +
    " L" +
    rx +
    "," +
    ry +
    " L" +
    rx6 +
    "," +
    y1 +
    " L" +
    x8 +
    "," +
    y1 +
    " L" +
    x8 +
    "," +
    y2 +
    " L" +
    rx5 +
    "," +
    y2 +
    " L" +
    rx4 +
    "," +
    y3 +
    " L" +
    x8 +
    "," +
    y3 +
    " L" +
    x8 +
    "," +
    y4 +
    " L" +
    rx3 +
    "," +
    y4 +
    " L" +
    drx +
    "," +
    dry +
    " L" +
    dlx +
    "," +
    dly +
    " L" +
    x3 +
    "," +
    y4 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x1 +
    "," +
    y3 +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    x5 +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    y2 +
    " z";

  return createPath(dVal, ctx);
}
