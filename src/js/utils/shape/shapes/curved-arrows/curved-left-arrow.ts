/**
 * curvedLeftArrow shape renderer
 */

import { getTextByPathList } from "../../../object";
import { shapeArc } from "../helpers/arc";
import { createPath, type CurvedArrowContext } from "./shared";

/**
 * Render curvedLeftArrow shape
 */
export function renderCurvedLeftArrow(ctx: CurvedArrowContext): string {
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
  const hd2 = h / 2;
  const r = w;
  const b = h;
  const l = 0;
  const t = 0;
  const c3d4 = 270;
  const _cd2 = 180;
  const cd4 = 90;
  const ss = Math.min(w, h);

  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const hR = hd2 - q1;
  const q7 = hR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const iDx = (q11 * w) / q7;
  const maxAdj3 = (cnstVal2 * iDx) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
  const y3 = hR + th;
  const q2 = w * w;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dy = (q5 * hR) / w;
  const y5 = hR + dy;
  const y7 = y3 + dy;
  const q6 = aw - th;
  const dh = q6 / 2;
  const y4 = y5 - dh;
  const y8 = y7 + dh;
  const aw2 = aw / 2;
  const y6 = b - aw2;
  const x1 = l + ah;
  const swAng = Math.atan(dy / ah);
  const _mswAng = -swAng;
  const _ix = l + iDx;
  const _iy = (hR + y3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - swAng;
  const swAng3 = swAng + dang2;
  const stAng3 = -dang2;
  const swAngDg = (swAng * 180) / Math.PI;
  const swAng2Dg = (swAng2 * 180) / Math.PI;
  const _swAng3Dg = (swAng3 * 180) / Math.PI;
  const _stAng3dg = (stAng3 * 180) / Math.PI;

  const d_val =
    "M" +
    r +
    "," +
    y3 +
    shapeArc(l, hR, w, hR, 0, -cd4, false).replace("M", "L") +
    " L" +
    l +
    "," +
    t +
    shapeArc(l, y3, w, hR, c3d4, c3d4 + cd4, false).replace("M", "L") +
    " L" +
    r +
    "," +
    y3 +
    shapeArc(l, y3, w, hR, 0, swAngDg, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    y7 +
    " L" +
    x1 +
    "," +
    y8 +
    " L" +
    l +
    "," +
    y6 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x1 +
    "," +
    y5 +
    shapeArc(l, hR, w, hR, swAngDg, swAngDg + swAng2Dg, false).replace("M", "L") +
    shapeArc(l, hR, w, hR, 0, -cd4, false).replace("M", "L") +
    shapeArc(l, y3, w, hR, c3d4, c3d4 + cd4, false).replace("M", "L");

  return createPath(d_val, ctx);
}
