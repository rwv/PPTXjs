/**
 * Ribbon and wave shape rendering functions.
 *
 * Handles ribbon and wave shapes:
 * - leftRightRibbon, ribbon, ribbon2
 * - wave, doubleWave
 * - ellipseRibbon, ellipseRibbon2
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering ribbon shapes
 */
export interface RibbonContext {
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
 * List of ribbon shape types handled by this module
 */
export const RIBBON_SHAPE_TYPES = [
  "leftRightRibbon",
  "ribbon",
  "ribbon2",
  "wave",
  "doubleWave",
  "ellipseRibbon",
  "ellipseRibbon2",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: RibbonContext): string {
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
function getStrokeAttrs(ctx: RibbonContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: RibbonContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Ribbon Shape Renderers
// =============================================================================

/**
 * Render leftRightRibbon shape
 */
function renderLeftRightRibbon(ctx: RibbonContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = 50000 * refr;
  let sAdj2,
    adj2 = 50000 * refr;
  let sAdj3,
    adj3 = 16667 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      }
    }
  }
  let d_val;
  const cnstVal1 = 33333 * refr;
  const cnstVal2 = 100000 * refr;
  const cnstVal3 = 200000 * refr;
  const cnstVal4 = 400000 * refr;
  const ss = Math.min(w, h);
  let a3,
    maxAdj1,
    a1,
    w1,
    maxAdj2,
    a2,
    x1,
    x4,
    dy1,
    dy2,
    ly1,
    ry4,
    ly2,
    ry3,
    ly4,
    ry1,
    ly3,
    ry2,
    hR,
    x2,
    x3,
    y1,
    y2,
    wd32 = w / 32,
    vc = h / 2,
    hc = w / 2;

  a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
  maxAdj1 = cnstVal2 - a3;
  a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  w1 = hc - wd32;
  maxAdj2 = (cnstVal2 * w1) / ss;
  a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  x1 = (ss * a2) / cnstVal2;
  x4 = w - x1;
  dy1 = (h * a1) / cnstVal3;
  dy2 = (h * a3) / -cnstVal3;
  ly1 = vc + dy2 - dy1;
  ry4 = vc + dy1 - dy2;
  ly2 = ly1 + dy1;
  ry3 = h - ly2;
  ly4 = ly2 * 2;
  ry1 = h - ly4;
  ly3 = ly4 - ly1;
  ry2 = h - ly3;
  hR = (a3 * ss) / cnstVal4;
  x2 = hc - wd32;
  x3 = hc + wd32;
  y1 = ly1 + hR;
  y2 = ry2 - hR;

  d_val =
    "M" +
    0 +
    "," +
    ly2 +
    "L" +
    x1 +
    "," +
    0 +
    "L" +
    x1 +
    "," +
    ly1 +
    "L" +
    hc +
    "," +
    ly1 +
    shapeArc(hc, y1, wd32, hR, 270, 450, false).replace("M", "L") +
    shapeArc(hc, y2, wd32, hR, 270, 90, false).replace("M", "L") +
    "L" +
    x4 +
    "," +
    ry2 +
    "L" +
    x4 +
    "," +
    ry1 +
    "L" +
    w +
    "," +
    ry3 +
    "L" +
    x4 +
    "," +
    h +
    "L" +
    x4 +
    "," +
    ry4 +
    "L" +
    hc +
    "," +
    ry4 +
    shapeArc(hc, ry4 - hR, wd32, hR, 90, 180, false).replace("M", "L") +
    "L" +
    x2 +
    "," +
    ly3 +
    "L" +
    x1 +
    "," +
    ly3 +
    "L" +
    x1 +
    "," +
    ly4 +
    " z" +
    "M" +
    x3 +
    "," +
    y1 +
    "L" +
    x3 +
    "," +
    ry2 +
    "M" +
    x2 +
    "," +
    y2 +
    "L" +
    x2 +
    "," +
    ly3;

  return createPath(d_val, ctx);
}

/**
 * Render ribbon or ribbon2 shape
 */
function renderRibbon(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 16667 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  let d_val;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 33333 * slideFactor;
  const cnstVal3 = 75000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const cnstVal5 = 200000 * slideFactor;
  const cnstVal6 = 400000 * slideFactor;
  const hc = w / 2,
    t = 0,
    l = 0,
    b = h,
    r = w,
    wd8 = w / 8,
    wd32 = w / 32;
  let a1, a2, x10, dx2, x2, x9, x3, x8, x5, x6, x4, x7, y1, y2, y4, y3, hR, y6;
  a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
  x10 = r - wd8;
  dx2 = (w * a2) / cnstVal5;
  x2 = hc - dx2;
  x9 = hc + dx2;
  x3 = x2 + wd32;
  x8 = x9 - wd32;
  x5 = x2 + wd8;
  x6 = x9 - wd8;
  x4 = x5 - wd32;
  x7 = x6 + wd32;
  hR = (h * a1) / cnstVal6;
  if (shapType === "ribbon2") {
    let dy1, dy2, y7;
    dy1 = (h * a1) / cnstVal5;
    y1 = b - dy1;
    dy2 = (h * a1) / cnstVal4;
    y2 = b - dy2;
    y4 = t + dy2;
    y3 = (y4 + b) / 2;
    y6 = b - hR;
    y7 = y1 - hR;

    d_val =
      "M" +
      l +
      "," +
      b +
      " L" +
      wd8 +
      "," +
      y3 +
      " L" +
      l +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      hR +
      shapeArc(x3, hR, wd32, hR, 180, 270, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      t +
      shapeArc(x8, hR, wd32, hR, 270, 360, false).replace("M", "L") +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      r +
      "," +
      y4 +
      " L" +
      x10 +
      "," +
      y3 +
      " L" +
      r +
      "," +
      b +
      " L" +
      x7 +
      "," +
      b +
      shapeArc(x7, y6, wd32, hR, 90, 270, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      y1 +
      shapeArc(x8, y7, wd32, hR, 90, -90, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      y2 +
      shapeArc(x3, y7, wd32, hR, 270, 90, false).replace("M", "L") +
      " L" +
      x4 +
      "," +
      y1 +
      shapeArc(x4, y6, wd32, hR, 270, 450, false).replace("M", "L") +
      " z" +
      " M" +
      x5 +
      "," +
      y2 +
      " L" +
      x5 +
      "," +
      y6 +
      "M" +
      x6 +
      "," +
      y6 +
      " L" +
      x6 +
      "," +
      y2 +
      "M" +
      x2 +
      "," +
      y7 +
      " L" +
      x2 +
      "," +
      y4 +
      "M" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y7;
  } else if (shapType === "ribbon") {
    let y5;
    y1 = (h * a1) / cnstVal5;
    y2 = (h * a1) / cnstVal4;
    y4 = b - y2;
    y3 = y4 / 2;
    y5 = b - hR;
    y6 = y2 - hR;
    d_val =
      "M" +
      l +
      "," +
      t +
      " L" +
      x4 +
      "," +
      t +
      shapeArc(x4, hR, wd32, hR, 270, 450, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      y1 +
      shapeArc(x3, y6, wd32, hR, 270, 90, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      y2 +
      shapeArc(x8, y6, wd32, hR, 90, -90, false).replace("M", "L") +
      " L" +
      x7 +
      "," +
      y1 +
      shapeArc(x7, hR, wd32, hR, 90, 270, false).replace("M", "L") +
      " L" +
      r +
      "," +
      t +
      " L" +
      x10 +
      "," +
      y3 +
      " L" +
      r +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y5 +
      shapeArc(x8, y5, wd32, hR, 0, 90, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      b +
      shapeArc(x3, y5, wd32, hR, 90, 180, false).replace("M", "L") +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      l +
      "," +
      y4 +
      " L" +
      wd8 +
      "," +
      y3 +
      " z" +
      " M" +
      x5 +
      "," +
      hR +
      " L" +
      x5 +
      "," +
      y2 +
      "M" +
      x6 +
      "," +
      y2 +
      " L" +
      x6 +
      "," +
      hR +
      "M" +
      x2 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y6 +
      "M" +
      x9 +
      "," +
      y6 +
      " L" +
      x9 +
      "," +
      y4;
  }

  return createPath(d_val, ctx);
}

/**
 * Render wave or doubleWave shape
 */
function renderWave(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = shapType === "doubleWave" ? 6250 * slideFactor : 12500 * slideFactor;
  let sAdj2,
    adj2 = 0;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  let d_val;
  const cnstVal2 = -10000 * slideFactor;
  const cnstVal3 = 50000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const hc = w / 2,
    t = 0,
    l = 0,
    b = h,
    r = w,
    wd8 = w / 8,
    wd32 = w / 32;
  if (shapType === "doubleWave") {
    const cnstVal1 = 12500 * slideFactor;
    let a1,
      a2,
      y1,
      dy2,
      y2,
      y3,
      y4,
      y5,
      y6,
      of2,
      dx2,
      x2,
      dx8,
      x8,
      dx3,
      x3,
      dx4,
      x4,
      x5,
      x6,
      x7,
      x9,
      x15,
      x10,
      x11,
      x12,
      x13,
      x14;
    a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
    a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
    y1 = (h * a1) / cnstVal4;
    dy2 = (y1 * 10) / 3;
    y2 = y1 - dy2;
    y3 = y1 + dy2;
    y4 = b - y1;
    y5 = y4 - dy2;
    y6 = y4 + dy2;
    of2 = (w * a2) / cnstVal3;
    dx2 = of2 > 0 ? 0 : of2;
    x2 = l - dx2;
    dx8 = of2 > 0 ? of2 : 0;
    x8 = r - dx8;
    dx3 = (dx2 + x8) / 6;
    x3 = x2 + dx3;
    dx4 = (dx2 + x8) / 3;
    x4 = x2 + dx4;
    x5 = (x2 + x8) / 2;
    x6 = x5 + dx3;
    x7 = (x6 + x8) / 2;
    x9 = l + dx8;
    x15 = r + dx2;
    x10 = x9 + dx3;
    x11 = x9 + dx4;
    x12 = (x9 + x15) / 2;
    x13 = x12 + dx3;
    x14 = (x13 + x15) / 2;

    d_val =
      "M" +
      x2 +
      "," +
      y1 +
      " C" +
      x3 +
      "," +
      y2 +
      " " +
      x4 +
      "," +
      y3 +
      " " +
      x5 +
      "," +
      y1 +
      " C" +
      x6 +
      "," +
      y2 +
      " " +
      x7 +
      "," +
      y3 +
      " " +
      x8 +
      "," +
      y1 +
      " L" +
      x15 +
      "," +
      y4 +
      " C" +
      x14 +
      "," +
      y6 +
      " " +
      x13 +
      "," +
      y5 +
      " " +
      x12 +
      "," +
      y4 +
      " C" +
      x11 +
      "," +
      y6 +
      " " +
      x10 +
      "," +
      y5 +
      " " +
      x9 +
      "," +
      y4 +
      " z";
  } else if (shapType === "wave") {
    const cnstVal5 = 20000 * slideFactor;
    let a1, a2, y1, dy2, y2, y3, y4, y5, y6, of2, dx2, x2, dx5, x5, dx3, x3, x4, x6, x10, x7, x8;
    a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
    a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
    y1 = (h * a1) / cnstVal4;
    dy2 = (y1 * 10) / 3;
    y2 = y1 - dy2;
    y3 = y1 + dy2;
    y4 = b - y1;
    y5 = y4 - dy2;
    y6 = y4 + dy2;
    of2 = (w * a2) / cnstVal3;
    dx2 = of2 > 0 ? 0 : of2;
    x2 = l - dx2;
    dx5 = of2 > 0 ? of2 : 0;
    x5 = r - dx5;
    dx3 = (dx2 + x5) / 3;
    x3 = x2 + dx3;
    x4 = (x3 + x5) / 2;
    x6 = l + dx5;
    x10 = r + dx2;
    x7 = x6 + dx3;
    x8 = (x7 + x10) / 2;

    d_val =
      "M" +
      x2 +
      "," +
      y1 +
      " C" +
      x3 +
      "," +
      y2 +
      " " +
      x4 +
      "," +
      y3 +
      " " +
      x5 +
      "," +
      y1 +
      " L" +
      x10 +
      "," +
      y4 +
      " C" +
      x8 +
      "," +
      y6 +
      " " +
      x7 +
      "," +
      y5 +
      " " +
      x6 +
      "," +
      y4 +
      " z";
  }

  return createPath(d_val, ctx);
}

/**
 * Render ellipseRibbon or ellipseRibbon2 shape
 */
function renderEllipseRibbon(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 12500 * slideFactor;
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
  let d_val;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal3 = 75000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const cnstVal5 = 200000 * slideFactor;
  const hc = w / 2,
    t = 0,
    l = 0,
    b = h,
    r = w,
    wd8 = w / 8;
  let a1,
    a2,
    q10,
    q11,
    q12,
    minAdj3,
    a3,
    dx2,
    x2,
    x3,
    x4,
    x5,
    x6,
    dy1,
    f1,
    q1,
    q2,
    cx1,
    cx2,
    dy3,
    q3,
    q4,
    q5,
    rh,
    q8,
    cx4,
    q9,
    cx5;
  a1 = adj1 < 0 ? 0 : adj1 > cnstVal4 ? cnstVal4 : adj1;
  a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
  q10 = cnstVal4 - a1;
  q11 = q10 / 2;
  q12 = a1 - q11;
  minAdj3 = 0 > q12 ? 0 : q12;
  a3 = adj3 < minAdj3 ? minAdj3 : adj3 > a1 ? a1 : adj3;
  dx2 = (w * a2) / cnstVal5;
  x2 = hc - dx2;
  x3 = x2 + wd8;
  x4 = r - x3;
  x5 = r - x2;
  x6 = r - wd8;
  dy1 = (h * a3) / cnstVal4;
  f1 = (4 * dy1) / w;
  q1 = (x3 * x3) / w;
  q2 = x3 - q1;
  cx1 = x3 / 2;
  cx2 = r - cx1;
  q1 = (h * a1) / cnstVal4;
  dy3 = q1 - dy1;
  q3 = (x2 * x2) / w;
  q4 = x2 - q3;
  q5 = f1 * q4;
  rh = b - q1;
  q8 = (dy1 * 14) / 16;
  cx4 = x2 / 2;
  q9 = f1 * cx4;
  cx5 = r - cx4;
  if (shapType === "ellipseRibbon") {
    let y1, cy1, y3, q6, q7, cy3, y2, y5, y6, cy4, cy6, y7, cy7, y8;
    y1 = f1 * q2;
    cy1 = f1 * cx1;
    y3 = q5 + dy3;
    q6 = dy1 + dy3 - y3;
    q7 = q6 + dy1;
    cy3 = q7 + dy3;
    y2 = (q8 + rh) / 2;
    y5 = q5 + rh;
    y6 = y3 + rh;
    cy4 = q9 + rh;
    cy6 = cy3 + rh;
    y7 = y1 + dy3;
    cy7 = q1 + q1 - y7;
    y8 = b - dy1;
    //
    d_val =
      "M" +
      l +
      "," +
      t +
      " Q" +
      cx1 +
      "," +
      cy1 +
      " " +
      x3 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y3 +
      " Q" +
      hc +
      "," +
      cy3 +
      " " +
      x5 +
      "," +
      y3 +
      " L" +
      x4 +
      "," +
      y1 +
      " Q" +
      cx2 +
      "," +
      cy1 +
      " " +
      r +
      "," +
      t +
      " L" +
      x6 +
      "," +
      y2 +
      " L" +
      r +
      "," +
      rh +
      " Q" +
      cx5 +
      "," +
      cy4 +
      " " +
      x5 +
      "," +
      y5 +
      " L" +
      x5 +
      "," +
      y6 +
      " Q" +
      hc +
      "," +
      cy6 +
      " " +
      x2 +
      "," +
      y6 +
      " L" +
      x2 +
      "," +
      y5 +
      " Q" +
      cx4 +
      "," +
      cy4 +
      " " +
      l +
      "," +
      rh +
      " L" +
      wd8 +
      "," +
      y2 +
      " z" +
      "M" +
      x2 +
      "," +
      y5 +
      " L" +
      x2 +
      "," +
      y3 +
      "M" +
      x5 +
      "," +
      y3 +
      " L" +
      x5 +
      "," +
      y5 +
      "M" +
      x3 +
      "," +
      y1 +
      " L" +
      x3 +
      "," +
      y7 +
      "M" +
      x4 +
      "," +
      y7 +
      " L" +
      x4 +
      "," +
      y1;
  } else if (shapType === "ellipseRibbon2") {
    let u1,
      y1,
      cu1,
      cy1,
      u3,
      y3,
      q6,
      q7,
      cu3,
      cy3,
      u2,
      y2,
      u5,
      y5,
      u6,
      y6,
      cu4,
      cy4,
      cu6,
      cy6,
      u7,
      y7,
      cu7,
      cy7;
    u1 = f1 * q2;
    y1 = b - u1;
    cu1 = f1 * cx1;
    cy1 = b - cu1;
    u3 = q5 + dy3;
    y3 = b - u3;
    q6 = dy1 + dy3 - u3;
    q7 = q6 + dy1;
    cu3 = q7 + dy3;
    cy3 = b - cu3;
    u2 = (q8 + rh) / 2;
    y2 = b - u2;
    u5 = q5 + rh;
    y5 = b - u5;
    u6 = u3 + rh;
    y6 = b - u6;
    cu4 = q9 + rh;
    cy4 = b - cu4;
    cu6 = cu3 + rh;
    cy6 = b - cu6;
    u7 = u1 + dy3;
    y7 = b - u7;
    cu7 = q1 + q1 - u7;
    cy7 = b - cu7;
    //
    d_val =
      "M" +
      l +
      "," +
      b +
      " L" +
      wd8 +
      "," +
      y2 +
      " L" +
      l +
      "," +
      q1 +
      " Q" +
      cx4 +
      "," +
      cy4 +
      " " +
      x2 +
      "," +
      y5 +
      " L" +
      x2 +
      "," +
      y6 +
      " Q" +
      hc +
      "," +
      cy6 +
      " " +
      x5 +
      "," +
      y6 +
      " L" +
      x5 +
      "," +
      y5 +
      " Q" +
      cx5 +
      "," +
      cy4 +
      " " +
      r +
      "," +
      q1 +
      " L" +
      x6 +
      "," +
      y2 +
      " L" +
      r +
      "," +
      b +
      " Q" +
      cx2 +
      "," +
      cy1 +
      " " +
      x4 +
      "," +
      y1 +
      " L" +
      x5 +
      "," +
      y3 +
      " Q" +
      hc +
      "," +
      cy3 +
      " " +
      x2 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y1 +
      " Q" +
      cx1 +
      "," +
      cy1 +
      " " +
      l +
      "," +
      b +
      " z" +
      "M" +
      x2 +
      "," +
      y3 +
      " L" +
      x2 +
      "," +
      y5 +
      "M" +
      x5 +
      "," +
      y5 +
      " L" +
      x5 +
      "," +
      y3 +
      "M" +
      x3 +
      "," +
      y7 +
      " L" +
      x3 +
      "," +
      y1 +
      "M" +
      x4 +
      "," +
      y1 +
      " L" +
      x4 +
      "," +
      y7;
  }

  return createPath(d_val, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const RIBBON_RENDERERS: Record<string, (ctx: RibbonContext, shapType: string) => string> = {
  leftRightRibbon: (ctx) => renderLeftRightRibbon(ctx),
  ribbon: renderRibbon,
  ribbon2: renderRibbon,
  wave: renderWave,
  doubleWave: renderWave,
  ellipseRibbon: renderEllipseRibbon,
  ellipseRibbon2: renderEllipseRibbon,
};

/**
 * Check if a shape type is a ribbon shape handled by this module
 */
export function isRibbonShape(shapType: string): boolean {
  return shapType in RIBBON_RENDERERS;
}

/**
 * Render a ribbon shape
 * @returns SVG string for the shape, or empty string if not a ribbon shape
 */
export function renderRibbonShape(shapType: string, ctx: RibbonContext): string {
  const renderer = RIBBON_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
