/**
 * curvedUpArrow shape renderer
 */

import { getTextByPathList } from "../../../object";
import { shapeArc } from "../helpers/arc";
import { createPath, type CurvedArrowContext } from "./shared";

/**
 * Render curvedUpArrow shape
 */
export function renderCurvedUpArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const _vc = h / 2;
  const _hc = w / 2;
  const wd2 = w / 2;
  const r = w;
  const b = h;
  const _l = 0;
  const t = 0;
  const _c3d4 = 270;
  const cd2 = 180;
  const cd4 = 90;
  const ss = Math.min(w, h);

  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const wR = wd2 - q1;
  const q7 = wR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const idy = (q11 * h) / q7;
  const maxAdj3 = (cnstVal2 * idy) / ss;
  const _a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * adj3) / cnstVal2;
  const x3 = wR + th;
  const q2 = h * h;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dx = (q5 * wR) / h;
  const x5 = wR + dx;
  const x7 = x3 + dx;
  const q6 = aw - th;
  const dh = q6 / 2;
  const x4 = x5 - dh;
  const x8 = x7 + dh;
  const aw2 = aw / 2;
  const x6 = r - aw2;
  const y1 = t + ah;
  const swAng = Math.atan(dx / ah);
  const _mswAng = -swAng;
  const _iy = t + idy;
  const _ix = (wR + x3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / idy);
  const swAng2 = dang2 - swAng;
  const _mswAng2 = -swAng2;
  const stAng3 = Math.PI / 2 - swAng;
  const _swAng3 = swAng + dang2;
  const stAng2 = Math.PI / 2 - dang2;

  const stAng2dg = (stAng2 * 180) / Math.PI;
  const swAng2dg = (swAng2 * 180) / Math.PI;
  const stAng3dg = (stAng3 * 180) / Math.PI;
  const swAngDg = (swAng * 180) / Math.PI;

  const d_val =
    shapeArc(wR, 0, wR, h, stAng2dg, stAng2dg + swAng2dg, false) +
    " L" +
    x5 +
    "," +
    y1 +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    x6 +
    "," +
    t +
    " L" +
    x8 +
    "," +
    y1 +
    " L" +
    x7 +
    "," +
    y1 +
    shapeArc(x3, 0, wR, h, stAng3dg, stAng3dg + swAngDg, false).replace("M", "L") +
    " L" +
    wR +
    "," +
    b +
    shapeArc(wR, 0, wR, h, cd4, cd2, false).replace("M", "L") +
    " L" +
    th +
    "," +
    t +
    shapeArc(x3, 0, wR, h, cd2, cd4, false).replace("M", "L") +
    "";
  return createPath(d_val, ctx);
}
