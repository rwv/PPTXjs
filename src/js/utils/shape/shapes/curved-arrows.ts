/**
 * Curved arrow shape rendering functions.
 *
 * Handles curved and circular arrow shapes:
 * - curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow
 * - swooshArrow
 * - circularArrow, leftCircularArrow
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering curved arrow shapes
 */
export interface CurvedArrowContext {
  node: any;
  w: number;
  h: number;
  shpId: string;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
  slideFactor: number;
}

/**
 * List of curved arrow shape types handled by this module
 */
export const CURVED_ARROW_TYPES = [
  "curvedDownArrow",
  "curvedLeftArrow",
  "curvedRightArrow",
  "curvedUpArrow",
  "swooshArrow",
  "circularArrow",
  "leftCircularArrow",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: CurvedArrowContext): string {
  const { imgFillFlg, grndFillFlg, shpId, fillColor } = ctx;
  if (imgFillFlg) {
    return `url(#imgPtrn_${shpId})`;
  }
  if (grndFillFlg) {
    return `url(#linGrd_${shpId})`;
  }
  return fillColor;
}

/**
 * Generate stroke attributes string for SVG path
 */
function getStrokeAttrs(ctx: CurvedArrowContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: CurvedArrowContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Curved Arrow Shape Renderers
// =============================================================================

/**
 * Render curvedDownArrow shape
 */
function renderCurvedDownArrow(ctx: CurvedArrowContext): string {
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
  const wd2 = w / 2;
  const r = w;
  const b = h;
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
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
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

/**
 * Render curvedLeftArrow shape
 */
function renderCurvedLeftArrow(ctx: CurvedArrowContext): string {
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
  const hd2 = h / 2;
  const r = w;
  const b = h;
  const l = 0;
  const t = 0;
  const c3d4 = 270;
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
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - swAng;
  const swAngDg = (swAng * 180) / Math.PI;
  const swAng2Dg = (swAng2 * 180) / Math.PI;

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

/**
 * Render curvedRightArrow shape
 */
function renderCurvedRightArrow(ctx: CurvedArrowContext): string {
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
  const hd2 = h / 2;
  const r = w;
  const b = h;
  const l = 0;
  const c3d4 = 270;
  const cd2 = 180;
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
  const x1 = r - ah;
  const swAng = Math.atan(dy / ah);
  const stAng = Math.PI - swAng;
  const mswAng = -swAng;
  const _ix = r - iDx;
  const _iy = (hR + y3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - Math.PI / 2;
  const stAngDg = (stAng * 180) / Math.PI;
  const mswAngDg = (mswAng * 180) / Math.PI;
  const swAngDg = (swAng * 180) / Math.PI;
  const swAng2dg = (swAng2 * 180) / Math.PI;

  const d_val =
    "M" +
    l +
    "," +
    hR +
    shapeArc(w, hR, w, hR, cd2, cd2 + mswAngDg, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    y5 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    r +
    "," +
    y6 +
    " L" +
    x1 +
    "," +
    y8 +
    " L" +
    x1 +
    "," +
    y7 +
    shapeArc(w, y3, w, hR, stAngDg, stAngDg + swAngDg, false).replace("M", "L") +
    " L" +
    l +
    "," +
    hR +
    shapeArc(w, hR, w, hR, cd2, cd2 + cd4, false).replace("M", "L") +
    " L" +
    r +
    "," +
    th +
    shapeArc(w, y3, w, hR, c3d4, c3d4 + swAng2dg, false).replace("M", "L");
  ("");
  return createPath(d_val, ctx);
}

/**
 * Render curvedUpArrow shape
 */
function renderCurvedUpArrow(ctx: CurvedArrowContext): string {
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
  const wd2 = w / 2;
  const r = w;
  const b = h;
  const t = 0;
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
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
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
  const _iy = t + idy;
  const _ix = (wR + x3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / idy);
  const swAng2 = dang2 - swAng;
  const stAng3 = Math.PI / 2 - swAng;
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

/**
 * Render swooshArrow shape
 */
function renderSwooshArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = 25000 * refr;
  let sAdj2,
    adj2 = 16667 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 1 * refr;
  const cnstVal2 = 70000 * refr;
  const cnstVal3 = 75000 * refr;
  const cnstVal4 = 100000 * refr;
  const ss = Math.min(w, h);
  const ssd8 = ss / 8;
  const hd6 = h / 6;

  const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal3 ? cnstVal3 : adj1;
  const maxAdj2 = (cnstVal2 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const ad1 = (h * a1) / cnstVal4;
  const ad2 = (ss * a2) / cnstVal4;
  const xB = w - ad2;
  const yB = ssd8;
  const alfa = Math.PI / 2 / 14;
  const dx0 = ssd8 * Math.tan(alfa);
  const xC = xB - dx0;
  const dx1 = ad1 * Math.tan(alfa);
  const yF = yB + ad1;
  const xF = xB + dx1;
  const xE = xF + dx0;
  const yE = yF + ssd8;
  const dy2 = yE - 0;
  const dy22 = dy2 / 2;
  const dy3 = h / 20;
  const yD = dy22 - dy3;
  const dy4 = hd6;
  const yP1 = hd6 + dy4;
  const xP1 = w / 6;
  const dy5 = hd6 / 2;
  const yP2 = yF + dy5;
  const xP2 = w / 4;

  const dVal =
    "M" +
    0 +
    "," +
    h +
    " Q" +
    xP1 +
    "," +
    yP1 +
    " " +
    xB +
    "," +
    yB +
    " L" +
    xC +
    "," +
    0 +
    " L" +
    w +
    "," +
    yD +
    " L" +
    xE +
    "," +
    yE +
    " L" +
    xF +
    "," +
    yF +
    " Q" +
    xP2 +
    "," +
    yP2 +
    " " +
    0 +
    "," +
    h +
    " z";

  return createPath(dVal, ctx);
}

/**
 * Render circularArrow shape
 */
function renderCircularArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 12500 * slideFactor;
  let sAdj2,
    adj2 = ((1142319 / 60000) * Math.PI) / 180;
  let sAdj3,
    adj3 = ((20457681 / 60000) * Math.PI) / 180;
  let sAdj4,
    adj4 = ((10800000 / 60000) * Math.PI) / 180;
  let sAdj5,
    adj5 = 12500 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = ((parseInt(sAdj2.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = ((parseInt(sAdj3.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = ((parseInt(sAdj4.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2;
  const hc = w / 2;
  const wd2 = w / 2;
  const hd2 = h / 2;
  const ss = Math.min(w, h);
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const rdAngVal1 = ((1 / 60000) * Math.PI) / 180;
  const rdAngVal2 = ((21599999 / 60000) * Math.PI) / 180;
  const rdAngVal3 = 2 * Math.PI;
  const cd2 = 180;

  const a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
  const maxAdj1 = a5 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
  const stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
  const th = (ss * a1) / cnstVal2;
  const thh = (ss * a5) / cnstVal2;
  const th2 = th / 2;
  const rw1 = wd2 + th2 - thh;
  const rh1 = hd2 + th2 - thh;
  const rw2 = rw1 - th;
  const rh2 = rh1 - th;
  const rw3 = rw2 + th2;
  const rh3 = rh2 + th2;
  const wtH = rw3 * Math.sin(enAng);
  const htH = rh3 * Math.cos(enAng);

  const dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
  const dyH = rh3 * Math.sin(Math.atan2(wtH, htH));

  const xH = hc + dxH;
  const yH = vc + dyH;
  const rI = rw2 < rh2 ? rw2 : rh2;
  const u1 = dxH * dxH;
  const u2 = dyH * dyH;
  const u3 = rI * rI;
  const u4 = u1 - u3;
  const u5 = u2 - u3;
  const u6 = (u4 * u5) / u1;
  const u7 = u6 / u2;
  const u8 = 1 - u7;
  const u9 = Math.sqrt(u8);
  const u10 = u4 / dxH;
  const u11 = u10 / dyH;
  const u12 = (1 + u9) / u11;

  const u13 = Math.atan2(u12, 1);

  const u14 = u13 + rdAngVal3;
  const u15 = u13 > 0 ? u13 : u14;
  const u16 = u15 - enAng;
  const u17 = u16 + rdAngVal3;
  const u18 = u16 > 0 ? u16 : u17;
  const u19 = u18 - cd2;
  const u20 = u18 - rdAngVal3;
  const u21 = u19 > 0 ? u20 : u18;
  const maxAng = Math.abs(u21);
  const aAng = adj2 < 0 ? 0 : adj2 > maxAng ? maxAng : adj2;
  const ptAng = enAng + aAng;
  const wtA = rw3 * Math.sin(ptAng);
  const htA = rh3 * Math.cos(ptAng);
  const dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
  const dyA = rh3 * Math.sin(Math.atan2(wtA, htA));

  const xA = hc + dxA;
  const yA = vc + dyA;
  const wtE = rw1 * Math.sin(stAng);
  const htE = rh1 * Math.cos(stAng);

  const dxE = rw1 * Math.cos(Math.atan2(wtE, htE));
  const dyE = rh1 * Math.sin(Math.atan2(wtE, htE));

  const _xE = hc + dxE;
  const _yE = vc + dyE;
  const dxG = thh * Math.cos(ptAng);
  const dyG = thh * Math.sin(ptAng);
  const xG = xH + dxG;
  const yG = yH + dyG;
  const dxB = thh * Math.cos(ptAng);
  const dyB = thh * Math.sin(ptAng);
  const xB = xH - dxB;
  const yB = yH - dyB;
  const sx1 = xB - hc;
  const sy1 = yB - vc;
  const sx2 = xG - hc;
  const sy2 = yG - vc;
  const rO = rw1 < rh1 ? rw1 : rh1;
  const x1O = (sx1 * rO) / rw1;
  const y1O = (sy1 * rO) / rh1;
  const x2O = (sx2 * rO) / rw1;
  const y2O = (sy2 * rO) / rh1;
  const dxO = x2O - x1O;
  const dyO = y2O - y1O;
  const dO = Math.sqrt(dxO * dxO + dyO * dyO);
  const q1 = x1O * y2O;
  const q2 = x2O * y1O;
  const DO = q1 - q2;
  const q3 = rO * rO;
  const q4 = dO * dO;
  const q5 = q3 * q4;
  const q6 = DO * DO;
  const q7 = q5 - q6;
  const q8 = q7 > 0 ? q7 : 0;
  const sdelO = Math.sqrt(q8);
  const ndyO = dyO * -1;
  const sdyO = ndyO > 0 ? -1 : 1;
  const q9 = sdyO * dxO;
  const q10 = q9 * sdelO;
  const q11 = DO * dyO;
  const dxF1 = (q11 + q10) / q4;
  const q12 = q11 - q10;
  const dxF2 = q12 / q4;
  const adyO = Math.abs(dyO);
  const q13 = adyO * sdelO;
  const q14 = (DO * dxO) / -1;
  const dyF1 = (q14 + q13) / q4;
  const q15 = q14 - q13;
  const dyF2 = q15 / q4;
  const q16 = x2O - dxF1;
  const q17 = x2O - dxF2;
  const q18 = y2O - dyF1;
  const q19 = y2O - dyF2;
  const q20 = Math.sqrt(q16 * q16 + q18 * q18);
  const q21 = Math.sqrt(q17 * q17 + q19 * q19);
  const q22 = q21 - q20;
  const dxF = q22 > 0 ? dxF1 : dxF2;
  const dyF = q22 > 0 ? dyF1 : dyF2;
  const sdxF = (dxF * rw1) / rO;
  const sdyF = (dyF * rh1) / rO;
  const xF = hc + sdxF;
  const yF = vc + sdyF;
  const x1I = (sx1 * rI) / rw2;
  const y1I = (sy1 * rI) / rh2;
  const x2I = (sx2 * rI) / rw2;
  const y2I = (sy2 * rI) / rh2;
  const dxI = x2I - x1I;
  const dyI = y2I - y1I;
  const dI = Math.sqrt(dxI * dxI + dyI * dyI);
  const v1 = x1I * y2I;
  const v2 = x2I * y1I;
  const DI = v1 - v2;
  const v3 = rI * rI;
  const v4 = dI * dI;
  const v5 = v3 * v4;
  const v6 = DI * DI;
  const v7 = v5 - v6;
  const v8 = v7 > 0 ? v7 : 0;
  const sdelI = Math.sqrt(v8);
  const v9 = sdyO * dxI;
  const v10 = v9 * sdelI;
  const v11 = DI * dyI;
  const dxC1 = (v11 + v10) / v4;
  const v12 = v11 - v10;
  const dxC2 = v12 / v4;
  const adyI = Math.abs(dyI);
  const v13 = adyI * sdelI;
  const v14 = (DI * dxI) / -1;
  const dyC1 = (v14 + v13) / v4;
  const v15 = v14 - v13;
  const dyC2 = v15 / v4;
  const v16 = x1I - dxC1;
  const v17 = x1I - dxC2;
  const v18 = y1I - dyC1;
  const v19 = y1I - dyC2;
  const v20 = Math.sqrt(v16 * v16 + v18 * v18);
  const v21 = Math.sqrt(v17 * v17 + v19 * v19);
  const v22 = v21 - v20;
  const dxC = v22 > 0 ? dxC1 : dxC2;
  const dyC = v22 > 0 ? dyC1 : dyC2;
  const sdxC = (dxC * rw2) / rI;
  const sdyC = (dyC * rh2) / rI;
  const xC = hc + sdxC;
  const yC = vc + sdyC;

  const ist0 = Math.atan2(sdyC, sdxC);

  const ist1 = ist0 + rdAngVal3;
  const istAng = ist0 > 0 ? ist0 : ist1;
  const isw1 = stAng - istAng;
  const isw2 = isw1 - rdAngVal3;
  const iswAng = isw1 > 0 ? isw2 : isw1;
  const p1 = xF - xC;
  const p2 = yF - yC;
  const p3 = Math.sqrt(p1 * p1 + p2 * p2);
  const p4 = p3 / 2;
  const p5 = p4 - thh;
  const xGp = p5 > 0 ? xF : xG;
  const yGp = p5 > 0 ? yF : yG;
  const xBp = p5 > 0 ? xC : xB;
  const yBp = p5 > 0 ? yC : yB;

  const en0 = Math.atan2(sdyF, sdxF);

  const en1 = en0 + rdAngVal3;
  const en2 = en0 > 0 ? en0 : en1;
  const sw0 = en2 - stAng;
  const sw1 = sw0 + rdAngVal3;
  const swAng = sw0 > 0 ? sw0 : sw1;

  const strtAng = (stAng * 180) / Math.PI;
  const endAng = strtAng + (swAng * 180) / Math.PI;
  const stiAng = (istAng * 180) / Math.PI;
  const swiAng = (iswAng * 180) / Math.PI;
  const ediAng = stiAng + swiAng;

  const d_val =
    shapeArc(w / 2, h / 2, rw1, rh1, strtAng, endAng, false) +
    " L" +
    xGp +
    "," +
    yGp +
    " L" +
    xA +
    "," +
    yA +
    " L" +
    xBp +
    "," +
    yBp +
    " L" +
    xC +
    "," +
    yC +
    shapeArc(w / 2, h / 2, rw2, rh2, stiAng, ediAng, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}

/**
 * Render leftCircularArrow shape
 */
function renderLeftCircularArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 12500 * slideFactor;
  let sAdj2,
    adj2 = ((-1142319 / 60000) * Math.PI) / 180;
  let sAdj3,
    adj3 = ((1142319 / 60000) * Math.PI) / 180;
  let sAdj4,
    adj4 = ((10800000 / 60000) * Math.PI) / 180;
  let sAdj5,
    adj5 = 12500 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = ((parseInt(sAdj2.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = ((parseInt(sAdj3.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = ((parseInt(sAdj4.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name === "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2;
  const hc = w / 2;
  const wd2 = w / 2;
  const hd2 = h / 2;
  const ss = Math.min(w, h);
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const rdAngVal1 = ((1 / 60000) * Math.PI) / 180;
  const rdAngVal2 = ((21599999 / 60000) * Math.PI) / 180;
  const rdAngVal3 = 2 * Math.PI;
  const cd2 = 180;
  const a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
  const maxAdj1 = a5 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
  const stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
  const th = (ss * a1) / cnstVal2;
  const thh = (ss * a5) / cnstVal2;
  const th2 = th / 2;
  const rw1 = wd2 + th2 - thh;
  const rh1 = hd2 + th2 - thh;
  const rw2 = rw1 - th;
  const rh2 = rh1 - th;
  const rw3 = rw2 + th2;
  const rh3 = rh2 + th2;
  const wtH = rw3 * Math.sin(enAng);
  const htH = rh3 * Math.cos(enAng);
  const dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
  const dyH = rh3 * Math.sin(Math.atan2(wtH, htH));
  const xH = hc + dxH;
  const yH = vc + dyH;
  const rI = rw2 < rh2 ? rw2 : rh2;
  const u1 = dxH * dxH;
  const u2 = dyH * dyH;
  const u3 = rI * rI;
  const u4 = u1 - u3;
  const u5 = u2 - u3;
  const u6 = (u4 * u5) / u1;
  const u7 = u6 / u2;
  const u8 = 1 - u7;
  const u9 = Math.sqrt(u8);
  const u10 = u4 / dxH;
  const u11 = u10 / dyH;
  const u12 = (1 + u9) / u11;
  const u13 = Math.atan2(u12, 1);
  const u14 = u13 + rdAngVal3;
  const u15 = u13 > 0 ? u13 : u14;
  const u16 = u15 - enAng;
  const u17 = u16 + rdAngVal3;
  const u18 = u16 > 0 ? u16 : u17;
  const u19 = u18 - cd2;
  const u20 = u18 - rdAngVal3;
  const u21 = u19 > 0 ? u20 : u18;
  const u22 = Math.abs(u21);
  const minAng = u22 * -1;
  const u23 = Math.abs(adj2);
  const a2 = u23 * -1;
  const aAng = a2 < minAng ? minAng : a2 > 0 ? 0 : a2;
  const ptAng = enAng + aAng;
  const wtA = rw3 * Math.sin(ptAng);
  const htA = rh3 * Math.cos(ptAng);
  const dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
  const dyA = rh3 * Math.sin(Math.atan2(wtA, htA));
  const xA = hc + dxA;
  const yA = vc + dyA;
  const wtE = rw1 * Math.sin(stAng);
  const htE = rh1 * Math.cos(stAng);
  const dxE = rw1 * Math.cos(Math.atan2(wtE, htE));
  const dyE = rh1 * Math.sin(Math.atan2(wtE, htE));
  const xE = hc + dxE;
  const yE = vc + dyE;
  const wtD = rw2 * Math.sin(stAng);
  const htD = rh2 * Math.cos(stAng);
  const dxD = rw2 * Math.cos(Math.atan2(wtD, htD));
  const dyD = rh2 * Math.sin(Math.atan2(wtD, htD));
  const xD = hc + dxD;
  const yD = vc + dyD;
  const dxG = thh * Math.cos(ptAng);
  const dyG = thh * Math.sin(ptAng);
  const xG = xH + dxG;
  const yG = yH + dyG;
  const dxB = thh * Math.cos(ptAng);
  const dyB = thh * Math.sin(ptAng);
  const xB = xH - dxB;
  const yB = yH - dyB;
  const sx1 = xB - hc;
  const sy1 = yB - vc;
  const sx2 = xG - hc;
  const sy2 = yG - vc;
  const rO = rw1 < rh1 ? rw1 : rh1;
  const x1O = (sx1 * rO) / rw1;
  const y1O = (sy1 * rO) / rh1;
  const x2O = (sx2 * rO) / rw1;
  const y2O = (sy2 * rO) / rh1;
  const dxO = x2O - x1O;
  const dyO = y2O - y1O;
  const dO = Math.sqrt(dxO * dxO + dyO * dyO);
  const q1 = x1O * y2O;
  const q2 = x2O * y1O;
  const DO = q1 - q2;
  const q3 = rO * rO;
  const q4 = dO * dO;
  const q5 = q3 * q4;
  const q6 = DO * DO;
  const q7 = q5 - q6;
  const q8 = q7 > 0 ? q7 : 0;
  const sdelO = Math.sqrt(q8);
  const ndyO = dyO * -1;
  const sdyO = ndyO > 0 ? -1 : 1;
  const q9 = sdyO * dxO;
  const q10 = q9 * sdelO;
  const q11 = DO * dyO;
  const dxF1 = (q11 + q10) / q4;
  const q12 = q11 - q10;
  const dxF2 = q12 / q4;
  const adyO = Math.abs(dyO);
  const q13 = adyO * sdelO;
  const q14 = (DO * dxO) / -1;
  const dyF1 = (q14 + q13) / q4;
  const q15 = q14 - q13;
  const dyF2 = q15 / q4;
  const q16 = x2O - dxF1;
  const q17 = x2O - dxF2;
  const q18 = y2O - dyF1;
  const q19 = y2O - dyF2;
  const q20 = Math.sqrt(q16 * q16 + q18 * q18);
  const q21 = Math.sqrt(q17 * q17 + q19 * q19);
  const q22 = q21 - q20;
  const dxF = q22 > 0 ? dxF1 : dxF2;
  const dyF = q22 > 0 ? dyF1 : dyF2;
  const sdxF = (dxF * rw1) / rO;
  const sdyF = (dyF * rh1) / rO;
  const xF = hc + sdxF;
  const yF = vc + sdyF;
  const x1I = (sx1 * rI) / rw2;
  const y1I = (sy1 * rI) / rh2;
  const x2I = (sx2 * rI) / rw2;
  const y2I = (sy2 * rI) / rh2;
  const dxI = x2I - x1I;
  const dyI = y2I - y1I;
  const dI = Math.sqrt(dxI * dxI + dyI * dyI);
  const v1 = x1I * y2I;
  const v2 = x2I * y1I;
  const DI = v1 - v2;
  const v3 = rI * rI;
  const v4 = dI * dI;
  const v5 = v3 * v4;
  const v6 = DI * DI;
  const v7 = v5 - v6;
  const v8 = v7 > 0 ? v7 : 0;
  const sdelI = Math.sqrt(v8);
  const v9 = sdyO * dxI;
  const v10 = v9 * sdelI;
  const v11 = DI * dyI;
  const dxC1 = (v11 + v10) / v4;
  const v12 = v11 - v10;
  const dxC2 = v12 / v4;
  const adyI = Math.abs(dyI);
  const v13 = adyI * sdelI;
  const v14 = (DI * dxI) / -1;
  const dyC1 = (v14 + v13) / v4;
  const v15 = v14 - v13;
  const dyC2 = v15 / v4;
  const v16 = x1I - dxC1;
  const v17 = x1I - dxC2;
  const v18 = y1I - dyC1;
  const v19 = y1I - dyC2;
  const v20 = Math.sqrt(v16 * v16 + v18 * v18);
  const v21 = Math.sqrt(v17 * v17 + v19 * v19);
  const v22 = v21 - v20;
  const dxC = v22 > 0 ? dxC1 : dxC2;
  const dyC = v22 > 0 ? dyC1 : dyC2;
  const sdxC = (dxC * rw2) / rI;
  const sdyC = (dyC * rh2) / rI;
  const xC = hc + sdxC;
  const yC = vc + sdyC;
  const ist0 = Math.atan2(sdyC, sdxC);
  const ist1 = ist0 + rdAngVal3;
  const istAng0 = ist0 > 0 ? ist0 : ist1;
  const isw1 = stAng - istAng0;
  const isw2 = isw1 + rdAngVal3;
  const iswAng0 = isw1 > 0 ? isw1 : isw2;
  const istAng = istAng0 + iswAng0;
  const iswAng = -iswAng0;
  const p1 = xF - xC;
  const p2 = yF - yC;
  const p3 = Math.sqrt(p1 * p1 + p2 * p2);
  const p4 = p3 / 2;
  const p5 = p4 - thh;
  const xGp = p5 > 0 ? xF : xG;
  const yGp = p5 > 0 ? yF : yG;
  const xBp = p5 > 0 ? xC : xB;
  const yBp = p5 > 0 ? yC : yB;
  const en0 = Math.atan2(sdyF, sdxF);
  const en1 = en0 + rdAngVal3;
  const en2 = en0 > 0 ? en0 : en1;
  const sw0 = en2 - stAng;
  const sw1 = sw0 - rdAngVal3;
  const swAng = sw0 > 0 ? sw1 : sw0;
  const stAng0 = stAng + swAng;

  const strtAng = (stAng0 * 180) / Math.PI;
  const endAng = (stAng * 180) / Math.PI;
  const stiAng = (istAng * 180) / Math.PI;
  const swiAng = (iswAng * 180) / Math.PI;
  const ediAng = stiAng + swiAng;

  const d_val =
    "M" +
    xE +
    "," +
    yE +
    " L" +
    xD +
    "," +
    yD +
    shapeArc(w / 2, h / 2, rw2, rh2, stiAng, ediAng, false).replace("M", "L") +
    " L" +
    xBp +
    "," +
    yBp +
    " L" +
    xA +
    "," +
    yA +
    " L" +
    xGp +
    "," +
    yGp +
    " L" +
    xF +
    "," +
    yF +
    shapeArc(w / 2, h / 2, rw1, rh1, strtAng, endAng, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const CURVED_ARROW_RENDERERS: Record<string, (ctx: CurvedArrowContext) => string> = {
  curvedDownArrow: renderCurvedDownArrow,
  curvedLeftArrow: renderCurvedLeftArrow,
  curvedRightArrow: renderCurvedRightArrow,
  curvedUpArrow: renderCurvedUpArrow,
  swooshArrow: renderSwooshArrow,
  circularArrow: renderCircularArrow,
  leftCircularArrow: renderLeftCircularArrow,
};

/**
 * Check if a shape type is a curved arrow shape handled by this module
 */
export function isCurvedArrowShape(shapType: string): boolean {
  return shapType in CURVED_ARROW_RENDERERS;
}

/**
 * Render a curved arrow shape
 * @returns SVG string for the shape, or empty string if not a curved arrow shape
 */
export function renderCurvedArrowShape(shapType: string, ctx: CurvedArrowContext): string {
  const renderer = CURVED_ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
