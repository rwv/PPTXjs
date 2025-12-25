/**
 * Directional curved arrow shape rendering functions.
 *
 * Handles directional curved arrow shapes:
 * - curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow
 */

import type { PptxNode } from "../../../types";
import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering directional curved arrow shapes
 */
export interface DirectionalCurvedArrowContext {
  node: PptxNode;
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
 * List of directional curved arrow shape types handled by this module
 */
export const DIRECTIONAL_CURVED_ARROW_TYPES = [
  "curvedDownArrow",
  "curvedLeftArrow",
  "curvedRightArrow",
  "curvedUpArrow",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: DirectionalCurvedArrowContext): string {
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
function getStrokeAttrs(ctx: DirectionalCurvedArrowContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: DirectionalCurvedArrowContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Directional Curved Arrow Shape Renderers
// =============================================================================

/**
 * Render curvedDownArrow shape
 */
function renderCurvedDownArrow(ctx: DirectionalCurvedArrowContext): string {
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

/**
 * Render curvedLeftArrow shape
 */
function renderCurvedLeftArrow(ctx: DirectionalCurvedArrowContext): string {
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

/**
 * Render curvedRightArrow shape
 */
function renderCurvedRightArrow(ctx: DirectionalCurvedArrowContext): string {
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
  const _t = 0;
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
  const stAng = Math.PI + 0 - swAng;
  const mswAng = -swAng;
  const _ix = r - iDx;
  const _iy = (hR + y3) / 2;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - Math.PI / 2;
  const _swAng3 = Math.PI / 2 + dang2;
  const _stAng3 = Math.PI - dang2;

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

  return createPath(d_val, ctx);
}

/**
 * Render curvedUpArrow shape
 */
function renderCurvedUpArrow(ctx: DirectionalCurvedArrowContext): string {
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

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const DIRECTIONAL_CURVED_ARROW_RENDERERS: Record<
  string,
  (ctx: DirectionalCurvedArrowContext) => string
> = {
  curvedDownArrow: renderCurvedDownArrow,
  curvedLeftArrow: renderCurvedLeftArrow,
  curvedRightArrow: renderCurvedRightArrow,
  curvedUpArrow: renderCurvedUpArrow,
};

/**
 * Check if a shape type is a directional curved arrow shape handled by this module
 */
export function isDirectionalCurvedArrowShape(shapType: string): boolean {
  return shapType in DIRECTIONAL_CURVED_ARROW_RENDERERS;
}

/**
 * Render a directional curved arrow shape
 * @returns SVG string for the shape, or empty string if not a directional curved arrow shape
 */
export function renderDirectionalCurvedArrowShape(
  shapType: string,
  ctx: DirectionalCurvedArrowContext
): string {
  const renderer = DIRECTIONAL_CURVED_ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
