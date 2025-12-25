/**
 * curvedDownArrow shape renderer
 */

import { getTextByPathList } from "../../../object";
import { shapeArc } from "../helpers/arc";
import { createPath, type CurvedArrowContext } from "./shared";

/**
 * Render curvedDownArrow shape
 */
export function renderCurvedDownArrow(ctx: CurvedArrowContext): string {
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
  const c3d4 = 270;
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
  const y1 = b - ah;
  const swAng = Math.atan(dx / ah);
  const swAngDeg = (swAng * 180) / Math.PI;
  const mswAng = -swAngDeg;
  const _iy = b - idy;
  const _ix = (wR + x3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / idy);
  const dang2Deg = (dang2 * 180) / Math.PI;
  const stAng = c3d4 + swAngDeg;
  const stAng2 = c3d4 - dang2Deg;
  const swAng2 = dang2Deg - cd4;
  const swAng3 = cd4 + dang2Deg;

  const d_val =
    "M" +
    x6 +
    "," +
    b +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    x5 +
    "," +
    y1 +
    shapeArc(wR, h, wR, h, stAng, stAng + mswAng, false).replace("M", "L") +
    " L" +
    x3 +
    "," +
    t +
    shapeArc(x3, h, wR, h, c3d4, c3d4 + swAngDeg, false).replace("M", "L") +
    " L" +
    (x5 + th) +
    "," +
    y1 +
    " L" +
    x8 +
    "," +
    y1 +
    " z" +
    "M" +
    x3 +
    "," +
    t +
    shapeArc(x3, h, wR, h, stAng2, stAng2 + swAng2, false).replace("M", "L") +
    shapeArc(wR, h, wR, h, cd2, cd2 + swAng3, false).replace("M", "L");

  return createPath(d_val, ctx);
}
