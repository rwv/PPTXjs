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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    wd2 = w / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    c3d4 = 270,
    cd2 = 180,
    cd4 = 90;
  const ss = Math.min(w, h);
  let maxAdj2,
    a2,
    a1,
    th,
    aw,
    q1,
    wR,
    q7,
    q8,
    q9,
    q10,
    q11,
    idy,
    maxAdj3,
    a3,
    ah,
    x3,
    q2,
    q3,
    q4,
    q5,
    dx,
    x5,
    x7,
    q6,
    dh,
    x4,
    x8,
    aw2,
    x6,
    y1,
    swAng,
    mswAng,
    iy,
    ix,
    q12,
    dang2,
    stAng,
    stAng2,
    swAng2,
    swAng3;

  maxAdj2 = (cnstVal1 * w) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  th = (ss * a1) / cnstVal2;
  aw = (ss * a2) / cnstVal2;
  q1 = (th + aw) / 4;
  wR = wd2 - q1;
  q7 = wR * 2;
  q8 = q7 * q7;
  q9 = th * th;
  q10 = q8 - q9;
  q11 = Math.sqrt(q10);
  idy = (q11 * h) / q7;
  maxAdj3 = (cnstVal2 * idy) / ss;
  a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  ah = (ss * adj3) / cnstVal2;
  x3 = wR + th;
  q2 = h * h;
  q3 = ah * ah;
  q4 = q2 - q3;
  q5 = Math.sqrt(q4);
  dx = (q5 * wR) / h;
  x5 = wR + dx;
  x7 = x3 + dx;
  q6 = aw - th;
  dh = q6 / 2;
  x4 = x5 - dh;
  x8 = x7 + dh;
  aw2 = aw / 2;
  x6 = r - aw2;
  y1 = b - ah;
  swAng = Math.atan(dx / ah);
  const swAngDeg = (swAng * 180) / Math.PI;
  mswAng = -swAngDeg;
  iy = b - idy;
  ix = (wR + x3) / 2;
  q12 = th / 2;
  dang2 = Math.atan(q12 / idy);
  const dang2Deg = (dang2 * 180) / Math.PI;
  stAng = c3d4 + swAngDeg;
  stAng2 = c3d4 - dang2Deg;
  swAng2 = dang2Deg - cd4;
  swAng3 = cd4 + dang2Deg;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    hd2 = h / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    c3d4 = 270,
    cd2 = 180,
    cd4 = 90;
  const ss = Math.min(w, h);
  let maxAdj2,
    a2,
    a1,
    th,
    aw,
    q1,
    hR,
    q7,
    q8,
    q9,
    q10,
    q11,
    iDx,
    maxAdj3,
    a3,
    ah,
    y3,
    q2,
    q3,
    q4,
    q5,
    dy,
    y5,
    y7,
    q6,
    dh,
    y4,
    y8,
    aw2,
    y6,
    x1,
    swAng,
    mswAng,
    ix,
    iy,
    q12,
    dang2,
    swAng2,
    swAng3,
    stAng3;

  maxAdj2 = (cnstVal1 * h) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
  th = (ss * a1) / cnstVal2;
  aw = (ss * a2) / cnstVal2;
  q1 = (th + aw) / 4;
  hR = hd2 - q1;
  q7 = hR * 2;
  q8 = q7 * q7;
  q9 = th * th;
  q10 = q8 - q9;
  q11 = Math.sqrt(q10);
  iDx = (q11 * w) / q7;
  maxAdj3 = (cnstVal2 * iDx) / ss;
  a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  ah = (ss * a3) / cnstVal2;
  y3 = hR + th;
  q2 = w * w;
  q3 = ah * ah;
  q4 = q2 - q3;
  q5 = Math.sqrt(q4);
  dy = (q5 * hR) / w;
  y5 = hR + dy;
  y7 = y3 + dy;
  q6 = aw - th;
  dh = q6 / 2;
  y4 = y5 - dh;
  y8 = y7 + dh;
  aw2 = aw / 2;
  y6 = b - aw2;
  x1 = l + ah;
  swAng = Math.atan(dy / ah);
  mswAng = -swAng;
  ix = l + iDx;
  iy = (hR + y3) / 2;
  q12 = th / 2;
  dang2 = Math.atan(q12 / iDx);
  swAng2 = dang2 - swAng;
  swAng3 = swAng + dang2;
  stAng3 = -dang2;
  let swAngDg, swAng2Dg, swAng3Dg, stAng3dg;
  swAngDg = (swAng * 180) / Math.PI;
  swAng2Dg = (swAng2 * 180) / Math.PI;
  swAng3Dg = (swAng3 * 180) / Math.PI;
  stAng3dg = (stAng3 * 180) / Math.PI;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    hd2 = h / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    c3d4 = 270,
    cd2 = 180,
    cd4 = 90;
  const ss = Math.min(w, h);
  let maxAdj2,
    a2,
    a1,
    th,
    aw,
    q1,
    hR,
    q7,
    q8,
    q9,
    q10,
    q11,
    iDx,
    maxAdj3,
    a3,
    ah,
    y3,
    q2,
    q3,
    q4,
    q5,
    dy,
    y5,
    y7,
    q6,
    dh,
    y4,
    y8,
    aw2,
    y6,
    x1,
    swAng,
    stAng,
    mswAng,
    ix,
    iy,
    q12,
    dang2,
    swAng2,
    swAng3,
    stAng3;

  maxAdj2 = (cnstVal1 * h) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
  th = (ss * a1) / cnstVal2;
  aw = (ss * a2) / cnstVal2;
  q1 = (th + aw) / 4;
  hR = hd2 - q1;
  q7 = hR * 2;
  q8 = q7 * q7;
  q9 = th * th;
  q10 = q8 - q9;
  q11 = Math.sqrt(q10);
  iDx = (q11 * w) / q7;
  maxAdj3 = (cnstVal2 * iDx) / ss;
  a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  ah = (ss * a3) / cnstVal2;
  y3 = hR + th;
  q2 = w * w;
  q3 = ah * ah;
  q4 = q2 - q3;
  q5 = Math.sqrt(q4);
  dy = (q5 * hR) / w;
  y5 = hR + dy;
  y7 = y3 + dy;
  q6 = aw - th;
  dh = q6 / 2;
  y4 = y5 - dh;
  y8 = y7 + dh;
  aw2 = aw / 2;
  y6 = b - aw2;
  x1 = r - ah;
  swAng = Math.atan(dy / ah);
  stAng = Math.PI + 0 - swAng;
  mswAng = -swAng;
  ix = r - iDx;
  iy = (hR + y3) / 2;
  q12 = th / 2;
  dang2 = Math.atan(q12 / iDx);
  swAng2 = dang2 - Math.PI / 2;
  swAng3 = Math.PI / 2 + dang2;
  stAng3 = Math.PI - dang2;

  let stAngDg, mswAngDg, swAngDg, swAng2dg;
  stAngDg = (stAng * 180) / Math.PI;
  mswAngDg = (mswAng * 180) / Math.PI;
  swAngDg = (swAng * 180) / Math.PI;
  swAng2dg = (swAng2 * 180) / Math.PI;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    wd2 = w / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    c3d4 = 270,
    cd2 = 180,
    cd4 = 90;
  const ss = Math.min(w, h);
  let maxAdj2,
    a2,
    a1,
    th,
    aw,
    q1,
    wR,
    q7,
    q8,
    q9,
    q10,
    q11,
    idy,
    maxAdj3,
    a3,
    ah,
    x3,
    q2,
    q3,
    q4,
    q5,
    dx,
    x5,
    x7,
    q6,
    dh,
    x4,
    x8,
    aw2,
    x6,
    y1,
    swAng,
    mswAng,
    iy,
    ix,
    q12,
    dang2,
    swAng2,
    mswAng2,
    stAng3,
    swAng3,
    stAng2;

  maxAdj2 = (cnstVal1 * w) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  th = (ss * a1) / cnstVal2;
  aw = (ss * a2) / cnstVal2;
  q1 = (th + aw) / 4;
  wR = wd2 - q1;
  q7 = wR * 2;
  q8 = q7 * q7;
  q9 = th * th;
  q10 = q8 - q9;
  q11 = Math.sqrt(q10);
  idy = (q11 * h) / q7;
  maxAdj3 = (cnstVal2 * idy) / ss;
  a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  ah = (ss * adj3) / cnstVal2;
  x3 = wR + th;
  q2 = h * h;
  q3 = ah * ah;
  q4 = q2 - q3;
  q5 = Math.sqrt(q4);
  dx = (q5 * wR) / h;
  x5 = wR + dx;
  x7 = x3 + dx;
  q6 = aw - th;
  dh = q6 / 2;
  x4 = x5 - dh;
  x8 = x7 + dh;
  aw2 = aw / 2;
  x6 = r - aw2;
  y1 = t + ah;
  swAng = Math.atan(dx / ah);
  mswAng = -swAng;
  iy = t + idy;
  ix = (wR + x3) / 2;
  q12 = th / 2;
  dang2 = Math.atan(q12 / idy);
  swAng2 = dang2 - swAng;
  mswAng2 = -swAng2;
  stAng3 = Math.PI / 2 - swAng;
  swAng3 = swAng + dang2;
  stAng2 = Math.PI / 2 - dang2;

  let stAng2dg, swAng2dg, swAngDg, stAng3dg;
  stAng2dg = (stAng2 * 180) / Math.PI;
  swAng2dg = (swAng2 * 180) / Math.PI;
  stAng3dg = (stAng3 * 180) / Math.PI;
  swAngDg = (swAng * 180) / Math.PI;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name == "adj2") {
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

  let a1,
    maxAdj2,
    a2,
    ad1,
    ad2,
    xB,
    yB,
    alfa,
    dx0,
    xC,
    dx1,
    yF,
    xF,
    xE,
    yE,
    dy2,
    dy22,
    dy3,
    yD,
    dy4,
    yP1,
    xP1,
    dy5,
    yP2,
    xP2;

  a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal3 ? cnstVal3 : adj1;
  maxAdj2 = (cnstVal2 * w) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  ad1 = (h * a1) / cnstVal4;
  ad2 = (ss * a2) / cnstVal4;
  xB = w - ad2;
  yB = ssd8;
  alfa = Math.PI / 2 / 14;
  dx0 = ssd8 * Math.tan(alfa);
  xC = xB - dx0;
  dx1 = ad1 * Math.tan(alfa);
  yF = yB + ad1;
  xF = xB + dx1;
  xE = xF + dx0;
  yE = yF + ssd8;
  dy2 = yE - 0;
  dy22 = dy2 / 2;
  dy3 = h / 20;
  yD = dy22 - dy3;
  dy4 = hd6;
  yP1 = hd6 + dy4;
  xP1 = w / 6;
  dy5 = hd6 / 2;
  yP2 = yF + dy5;
  xP2 = w / 4;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = ((parseInt(sAdj2.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = ((parseInt(sAdj3.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = ((parseInt(sAdj4.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    wd2 = w / 2,
    hd2 = h / 2;
  const ss = Math.min(w, h);
  let a5,
    maxAdj1,
    a1,
    enAng,
    stAng,
    th,
    thh,
    th2,
    rw1,
    rh1,
    rw2,
    rh2,
    rw3,
    rh3,
    wtH,
    htH,
    dxH,
    dyH,
    xH,
    yH,
    rI,
    u1,
    u2,
    u3,
    u4,
    u5,
    u6,
    u7,
    u8,
    u9,
    u10,
    u11,
    u12,
    u13,
    u14,
    u15,
    u16,
    u17,
    u18,
    u19,
    u20,
    u21,
    maxAng,
    aAng,
    ptAng,
    wtA,
    htA,
    dxA,
    dyA,
    xA,
    yA,
    wtE,
    htE,
    dxE,
    dyE,
    xE,
    yE,
    dxG,
    dyG,
    xG,
    yG,
    dxB,
    dyB,
    xB,
    yB,
    sx1,
    sy1,
    sx2,
    sy2,
    rO,
    x1O,
    y1O,
    x2O,
    y2O,
    dxO,
    dyO,
    dO,
    q1,
    q2,
    DO,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    sdelO,
    ndyO,
    sdyO,
    q9,
    q10,
    q11,
    dxF1,
    q12,
    dxF2,
    adyO,
    q13,
    q14,
    dyF1,
    q15,
    dyF2,
    q16,
    q17,
    q18,
    q19,
    q20,
    q21,
    q22,
    dxF,
    dyF,
    sdxF,
    sdyF,
    xF,
    yF,
    x1I,
    y1I,
    x2I,
    y2I,
    dxI,
    dyI,
    dI,
    v1,
    v2,
    DI,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    sdelI,
    v9,
    v10,
    v11,
    dxC1,
    v12,
    dxC2,
    adyI,
    v13,
    v14,
    dyC1,
    v15,
    dyC2,
    v16,
    v17,
    v18,
    v19,
    v20,
    v21,
    v22,
    dxC,
    dyC,
    sdxC,
    sdyC,
    xC,
    yC,
    ist0,
    ist1,
    istAng,
    isw1,
    isw2,
    iswAng,
    p1,
    p2,
    p3,
    p4,
    p5,
    xGp,
    yGp,
    xBp,
    yBp,
    en0,
    en1,
    en2,
    sw0,
    sw1,
    swAng;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const rdAngVal1 = ((1 / 60000) * Math.PI) / 180;
  const rdAngVal2 = ((21599999 / 60000) * Math.PI) / 180;
  const rdAngVal3 = 2 * Math.PI;
  const cd2 = 180;

  a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
  maxAdj1 = a5 * 2;
  a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
  stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
  th = (ss * a1) / cnstVal2;
  thh = (ss * a5) / cnstVal2;
  th2 = th / 2;
  rw1 = wd2 + th2 - thh;
  rh1 = hd2 + th2 - thh;
  rw2 = rw1 - th;
  rh2 = rh1 - th;
  rw3 = rw2 + th2;
  rh3 = rh2 + th2;
  wtH = rw3 * Math.sin(enAng);
  htH = rh3 * Math.cos(enAng);

  dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
  dyH = rh3 * Math.sin(Math.atan2(wtH, htH));

  xH = hc + dxH;
  yH = vc + dyH;
  rI = rw2 < rh2 ? rw2 : rh2;
  u1 = dxH * dxH;
  u2 = dyH * dyH;
  u3 = rI * rI;
  u4 = u1 - u3;
  u5 = u2 - u3;
  u6 = (u4 * u5) / u1;
  u7 = u6 / u2;
  u8 = 1 - u7;
  u9 = Math.sqrt(u8);
  u10 = u4 / dxH;
  u11 = u10 / dyH;
  u12 = (1 + u9) / u11;

  u13 = Math.atan2(u12, 1);

  u14 = u13 + rdAngVal3;
  u15 = u13 > 0 ? u13 : u14;
  u16 = u15 - enAng;
  u17 = u16 + rdAngVal3;
  u18 = u16 > 0 ? u16 : u17;
  u19 = u18 - cd2;
  u20 = u18 - rdAngVal3;
  u21 = u19 > 0 ? u20 : u18;
  maxAng = Math.abs(u21);
  aAng = adj2 < 0 ? 0 : adj2 > maxAng ? maxAng : adj2;
  ptAng = enAng + aAng;
  wtA = rw3 * Math.sin(ptAng);
  htA = rh3 * Math.cos(ptAng);
  dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
  dyA = rh3 * Math.sin(Math.atan2(wtA, htA));

  xA = hc + dxA;
  yA = vc + dyA;
  wtE = rw1 * Math.sin(stAng);
  htE = rh1 * Math.cos(stAng);

  dxE = rw1 * Math.cos(Math.atan2(wtE, htE));
  dyE = rh1 * Math.sin(Math.atan2(wtE, htE));

  xE = hc + dxE;
  yE = vc + dyE;
  dxG = thh * Math.cos(ptAng);
  dyG = thh * Math.sin(ptAng);
  xG = xH + dxG;
  yG = yH + dyG;
  dxB = thh * Math.cos(ptAng);
  dyB = thh * Math.sin(ptAng);
  xB = xH - dxB;
  yB = yH - dyB;
  sx1 = xB - hc;
  sy1 = yB - vc;
  sx2 = xG - hc;
  sy2 = yG - vc;
  rO = rw1 < rh1 ? rw1 : rh1;
  x1O = (sx1 * rO) / rw1;
  y1O = (sy1 * rO) / rh1;
  x2O = (sx2 * rO) / rw1;
  y2O = (sy2 * rO) / rh1;
  dxO = x2O - x1O;
  dyO = y2O - y1O;
  dO = Math.sqrt(dxO * dxO + dyO * dyO);
  q1 = x1O * y2O;
  q2 = x2O * y1O;
  DO = q1 - q2;
  q3 = rO * rO;
  q4 = dO * dO;
  q5 = q3 * q4;
  q6 = DO * DO;
  q7 = q5 - q6;
  q8 = q7 > 0 ? q7 : 0;
  sdelO = Math.sqrt(q8);
  ndyO = dyO * -1;
  sdyO = ndyO > 0 ? -1 : 1;
  q9 = sdyO * dxO;
  q10 = q9 * sdelO;
  q11 = DO * dyO;
  dxF1 = (q11 + q10) / q4;
  q12 = q11 - q10;
  dxF2 = q12 / q4;
  adyO = Math.abs(dyO);
  q13 = adyO * sdelO;
  q14 = (DO * dxO) / -1;
  dyF1 = (q14 + q13) / q4;
  q15 = q14 - q13;
  dyF2 = q15 / q4;
  q16 = x2O - dxF1;
  q17 = x2O - dxF2;
  q18 = y2O - dyF1;
  q19 = y2O - dyF2;
  q20 = Math.sqrt(q16 * q16 + q18 * q18);
  q21 = Math.sqrt(q17 * q17 + q19 * q19);
  q22 = q21 - q20;
  dxF = q22 > 0 ? dxF1 : dxF2;
  dyF = q22 > 0 ? dyF1 : dyF2;
  sdxF = (dxF * rw1) / rO;
  sdyF = (dyF * rh1) / rO;
  xF = hc + sdxF;
  yF = vc + sdyF;
  x1I = (sx1 * rI) / rw2;
  y1I = (sy1 * rI) / rh2;
  x2I = (sx2 * rI) / rw2;
  y2I = (sy2 * rI) / rh2;
  dxI = x2I - x1I;
  dyI = y2I - y1I;
  dI = Math.sqrt(dxI * dxI + dyI * dyI);
  v1 = x1I * y2I;
  v2 = x2I * y1I;
  DI = v1 - v2;
  v3 = rI * rI;
  v4 = dI * dI;
  v5 = v3 * v4;
  v6 = DI * DI;
  v7 = v5 - v6;
  v8 = v7 > 0 ? v7 : 0;
  sdelI = Math.sqrt(v8);
  v9 = sdyO * dxI;
  v10 = v9 * sdelI;
  v11 = DI * dyI;
  dxC1 = (v11 + v10) / v4;
  v12 = v11 - v10;
  dxC2 = v12 / v4;
  adyI = Math.abs(dyI);
  v13 = adyI * sdelI;
  v14 = (DI * dxI) / -1;
  dyC1 = (v14 + v13) / v4;
  v15 = v14 - v13;
  dyC2 = v15 / v4;
  v16 = x1I - dxC1;
  v17 = x1I - dxC2;
  v18 = y1I - dyC1;
  v19 = y1I - dyC2;
  v20 = Math.sqrt(v16 * v16 + v18 * v18);
  v21 = Math.sqrt(v17 * v17 + v19 * v19);
  v22 = v21 - v20;
  dxC = v22 > 0 ? dxC1 : dxC2;
  dyC = v22 > 0 ? dyC1 : dyC2;
  sdxC = (dxC * rw2) / rI;
  sdyC = (dyC * rh2) / rI;
  xC = hc + sdxC;
  yC = vc + sdyC;

  ist0 = Math.atan2(sdyC, sdxC);

  ist1 = ist0 + rdAngVal3;
  istAng = ist0 > 0 ? ist0 : ist1;
  isw1 = stAng - istAng;
  isw2 = isw1 - rdAngVal3;
  iswAng = isw1 > 0 ? isw2 : isw1;
  p1 = xF - xC;
  p2 = yF - yC;
  p3 = Math.sqrt(p1 * p1 + p2 * p2);
  p4 = p3 / 2;
  p5 = p4 - thh;
  xGp = p5 > 0 ? xF : xG;
  yGp = p5 > 0 ? yF : yG;
  xBp = p5 > 0 ? xC : xB;
  yBp = p5 > 0 ? yC : yB;

  en0 = Math.atan2(sdyF, sdxF);

  en1 = en0 + rdAngVal3;
  en2 = en0 > 0 ? en0 : en1;
  sw0 = en2 - stAng;
  sw1 = sw0 + rdAngVal3;
  swAng = sw0 > 0 ? sw0 : sw1;

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
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = ((parseInt(sAdj2.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = ((parseInt(sAdj3.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = ((parseInt(sAdj4.substr(4)) / 60000) * Math.PI) / 180;
      } else if (sAdj_name == "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2,
    hc = w / 2,
    r = w,
    b = h,
    l = 0,
    t = 0,
    wd2 = w / 2,
    hd2 = h / 2;
  const ss = Math.min(w, h);
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const rdAngVal1 = ((1 / 60000) * Math.PI) / 180;
  const rdAngVal2 = ((21599999 / 60000) * Math.PI) / 180;
  const rdAngVal3 = 2 * Math.PI;
  const cd2 = 180;
  let a5,
    maxAdj1,
    a1,
    enAng,
    stAng,
    th,
    thh,
    th2,
    rw1,
    rh1,
    rw2,
    rh2,
    rw3,
    rh3,
    wtH,
    htH,
    dxH,
    dyH,
    xH,
    yH,
    rI,
    u1,
    u2,
    u3,
    u4,
    u5,
    u6,
    u7,
    u8,
    u9,
    u10,
    u11,
    u12,
    u13,
    u14,
    u15,
    u16,
    u17,
    u18,
    u19,
    u20,
    u21,
    u22,
    minAng,
    u23,
    a2,
    aAng,
    ptAng,
    wtA,
    htA,
    dxA,
    dyA,
    xA,
    yA,
    wtE,
    htE,
    dxE,
    dyE,
    xE,
    yE,
    wtD,
    htD,
    dxD,
    dyD,
    xD,
    yD,
    dxG,
    dyG,
    xG,
    yG,
    dxB,
    dyB,
    xB,
    yB,
    sx1,
    sy1,
    sx2,
    sy2,
    rO,
    x1O,
    y1O,
    x2O,
    y2O,
    dxO,
    dyO,
    dO,
    q1,
    q2,
    DO,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    sdelO,
    ndyO,
    sdyO,
    q9,
    q10,
    q11,
    dxF1,
    q12,
    dxF2,
    adyO,
    q13,
    q14,
    dyF1,
    q15,
    dyF2,
    q16,
    q17,
    q18,
    q19,
    q20,
    q21,
    q22,
    dxF,
    dyF,
    sdxF,
    sdyF,
    xF,
    yF,
    x1I,
    y1I,
    x2I,
    y2I,
    dxI,
    dyI,
    dI,
    v1,
    v2,
    DI,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    sdelI,
    v9,
    v10,
    v11,
    dxC1,
    v12,
    dxC2,
    adyI,
    v13,
    v14,
    dyC1,
    v15,
    dyC2,
    v16,
    v17,
    v18,
    v19,
    v20,
    v21,
    v22,
    dxC,
    dyC,
    sdxC,
    sdyC,
    xC,
    yC,
    ist0,
    ist1,
    istAng0,
    isw1,
    isw2,
    iswAng0,
    istAng,
    iswAng,
    p1,
    p2,
    p3,
    p4,
    p5,
    xGp,
    yGp,
    xBp,
    yBp,
    en0,
    en1,
    en2,
    sw0,
    sw1,
    swAng,
    stAng0;

  a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
  maxAdj1 = a5 * 2;
  a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
  stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
  th = (ss * a1) / cnstVal2;
  thh = (ss * a5) / cnstVal2;
  th2 = th / 2;
  rw1 = wd2 + th2 - thh;
  rh1 = hd2 + th2 - thh;
  rw2 = rw1 - th;
  rh2 = rh1 - th;
  rw3 = rw2 + th2;
  rh3 = rh2 + th2;
  wtH = rw3 * Math.sin(enAng);
  htH = rh3 * Math.cos(enAng);
  dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
  dyH = rh3 * Math.sin(Math.atan2(wtH, htH));
  xH = hc + dxH;
  yH = vc + dyH;
  rI = rw2 < rh2 ? rw2 : rh2;
  u1 = dxH * dxH;
  u2 = dyH * dyH;
  u3 = rI * rI;
  u4 = u1 - u3;
  u5 = u2 - u3;
  u6 = (u4 * u5) / u1;
  u7 = u6 / u2;
  u8 = 1 - u7;
  u9 = Math.sqrt(u8);
  u10 = u4 / dxH;
  u11 = u10 / dyH;
  u12 = (1 + u9) / u11;
  u13 = Math.atan2(u12, 1);
  u14 = u13 + rdAngVal3;
  u15 = u13 > 0 ? u13 : u14;
  u16 = u15 - enAng;
  u17 = u16 + rdAngVal3;
  u18 = u16 > 0 ? u16 : u17;
  u19 = u18 - cd2;
  u20 = u18 - rdAngVal3;
  u21 = u19 > 0 ? u20 : u18;
  u22 = Math.abs(u21);
  minAng = u22 * -1;
  u23 = Math.abs(adj2);
  a2 = u23 * -1;
  aAng = a2 < minAng ? minAng : a2 > 0 ? 0 : a2;
  ptAng = enAng + aAng;
  wtA = rw3 * Math.sin(ptAng);
  htA = rh3 * Math.cos(ptAng);
  dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
  dyA = rh3 * Math.sin(Math.atan2(wtA, htA));
  xA = hc + dxA;
  yA = vc + dyA;
  wtE = rw1 * Math.sin(stAng);
  htE = rh1 * Math.cos(stAng);
  dxE = rw1 * Math.cos(Math.atan2(wtE, htE));
  dyE = rh1 * Math.sin(Math.atan2(wtE, htE));
  xE = hc + dxE;
  yE = vc + dyE;
  wtD = rw2 * Math.sin(stAng);
  htD = rh2 * Math.cos(stAng);
  dxD = rw2 * Math.cos(Math.atan2(wtD, htD));
  dyD = rh2 * Math.sin(Math.atan2(wtD, htD));
  xD = hc + dxD;
  yD = vc + dyD;
  dxG = thh * Math.cos(ptAng);
  dyG = thh * Math.sin(ptAng);
  xG = xH + dxG;
  yG = yH + dyG;
  dxB = thh * Math.cos(ptAng);
  dyB = thh * Math.sin(ptAng);
  xB = xH - dxB;
  yB = yH - dyB;
  sx1 = xB - hc;
  sy1 = yB - vc;
  sx2 = xG - hc;
  sy2 = yG - vc;
  rO = rw1 < rh1 ? rw1 : rh1;
  x1O = (sx1 * rO) / rw1;
  y1O = (sy1 * rO) / rh1;
  x2O = (sx2 * rO) / rw1;
  y2O = (sy2 * rO) / rh1;
  dxO = x2O - x1O;
  dyO = y2O - y1O;
  dO = Math.sqrt(dxO * dxO + dyO * dyO);
  q1 = x1O * y2O;
  q2 = x2O * y1O;
  DO = q1 - q2;
  q3 = rO * rO;
  q4 = dO * dO;
  q5 = q3 * q4;
  q6 = DO * DO;
  q7 = q5 - q6;
  q8 = q7 > 0 ? q7 : 0;
  sdelO = Math.sqrt(q8);
  ndyO = dyO * -1;
  sdyO = ndyO > 0 ? -1 : 1;
  q9 = sdyO * dxO;
  q10 = q9 * sdelO;
  q11 = DO * dyO;
  dxF1 = (q11 + q10) / q4;
  q12 = q11 - q10;
  dxF2 = q12 / q4;
  adyO = Math.abs(dyO);
  q13 = adyO * sdelO;
  q14 = (DO * dxO) / -1;
  dyF1 = (q14 + q13) / q4;
  q15 = q14 - q13;
  dyF2 = q15 / q4;
  q16 = x2O - dxF1;
  q17 = x2O - dxF2;
  q18 = y2O - dyF1;
  q19 = y2O - dyF2;
  q20 = Math.sqrt(q16 * q16 + q18 * q18);
  q21 = Math.sqrt(q17 * q17 + q19 * q19);
  q22 = q21 - q20;
  dxF = q22 > 0 ? dxF1 : dxF2;
  dyF = q22 > 0 ? dyF1 : dyF2;
  sdxF = (dxF * rw1) / rO;
  sdyF = (dyF * rh1) / rO;
  xF = hc + sdxF;
  yF = vc + sdyF;
  x1I = (sx1 * rI) / rw2;
  y1I = (sy1 * rI) / rh2;
  x2I = (sx2 * rI) / rw2;
  y2I = (sy2 * rI) / rh2;
  dxI = x2I - x1I;
  dyI = y2I - y1I;
  dI = Math.sqrt(dxI * dxI + dyI * dyI);
  v1 = x1I * y2I;
  v2 = x2I * y1I;
  DI = v1 - v2;
  v3 = rI * rI;
  v4 = dI * dI;
  v5 = v3 * v4;
  v6 = DI * DI;
  v7 = v5 - v6;
  v8 = v7 > 0 ? v7 : 0;
  sdelI = Math.sqrt(v8);
  v9 = sdyO * dxI;
  v10 = v9 * sdelI;
  v11 = DI * dyI;
  dxC1 = (v11 + v10) / v4;
  v12 = v11 - v10;
  dxC2 = v12 / v4;
  adyI = Math.abs(dyI);
  v13 = adyI * sdelI;
  v14 = (DI * dxI) / -1;
  dyC1 = (v14 + v13) / v4;
  v15 = v14 - v13;
  dyC2 = v15 / v4;
  v16 = x1I - dxC1;
  v17 = x1I - dxC2;
  v18 = y1I - dyC1;
  v19 = y1I - dyC2;
  v20 = Math.sqrt(v16 * v16 + v18 * v18);
  v21 = Math.sqrt(v17 * v17 + v19 * v19);
  v22 = v21 - v20;
  dxC = v22 > 0 ? dxC1 : dxC2;
  dyC = v22 > 0 ? dyC1 : dyC2;
  sdxC = (dxC * rw2) / rI;
  sdyC = (dyC * rh2) / rI;
  xC = hc + sdxC;
  yC = vc + sdyC;
  ist0 = Math.atan2(sdyC, sdxC);
  ist1 = ist0 + rdAngVal3;
  istAng0 = ist0 > 0 ? ist0 : ist1;
  isw1 = stAng - istAng0;
  isw2 = isw1 + rdAngVal3;
  iswAng0 = isw1 > 0 ? isw1 : isw2;
  istAng = istAng0 + iswAng0;
  iswAng = -iswAng0;
  p1 = xF - xC;
  p2 = yF - yC;
  p3 = Math.sqrt(p1 * p1 + p2 * p2);
  p4 = p3 / 2;
  p5 = p4 - thh;
  xGp = p5 > 0 ? xF : xG;
  yGp = p5 > 0 ? yF : yG;
  xBp = p5 > 0 ? xC : xB;
  yBp = p5 > 0 ? yC : yB;
  en0 = Math.atan2(sdyF, sdxF);
  en1 = en0 + rdAngVal3;
  en2 = en0 > 0 ? en0 : en1;
  sw0 = en2 - stAng;
  sw1 = sw0 - rdAngVal3;
  swAng = sw0 > 0 ? sw1 : sw0;
  stAng0 = stAng + swAng;

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
