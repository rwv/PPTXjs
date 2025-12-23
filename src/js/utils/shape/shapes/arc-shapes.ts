/**
 * Arc and circular shape rendering functions.
 *
 * Handles arc/circular shapes:
 * - pie, pieWedge, arc, chord
 * - frame, donut, noSmoking
 * - halfFrame, blockArc
 */

import { shapeArc } from "./helpers/arc";
import { shapePie } from "./helpers/pie";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering arc shapes
 */
export interface ArcShapeContext {
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
 * List of arc shape types handled by this module
 */
export const ARC_SHAPE_TYPES = [
  "pie",
  "pieWedge",
  "arc",
  "chord",
  "frame",
  "donut",
  "noSmoking",
  "halfFrame",
  "blockArc",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: ArcShapeContext): string {
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
function getStrokeAttrs(ctx: ArcShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: ArcShapeContext, transform?: string): string {
  const transformAttr = transform ? ` transform='${transform}'` : "";
  return `<path   d='${d}'${transformAttr}  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Arc Shape Renderers
// =============================================================================

/**
 * Render pie, pieWedge, or arc shape
 */
function renderPieArcShape(ctx: ArcShapeContext, shapType: string): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1, adj2, H, shapAdjst1, shapAdjst2, isClose;
  if (shapType == "pie") {
    adj1 = 0;
    adj2 = 270;
    H = h;
    isClose = true;
  } else if (shapType == "pieWedge") {
    adj1 = 180;
    adj2 = 270;
    H = 2 * h;
    isClose = true;
  } else if (shapType == "arc") {
    adj1 = 270;
    adj2 = 0;
    H = h;
    isClose = false;
  }
  if (shapAdjst !== undefined) {
    shapAdjst1 = getTextByPathList(shapAdjst, ["attrs", "fmla"]);
    shapAdjst2 = shapAdjst1;
    if (shapAdjst1 === undefined) {
      shapAdjst1 = shapAdjst[0]["attrs"]["fmla"];
      shapAdjst2 = shapAdjst[1]["attrs"]["fmla"];
    }
    if (shapAdjst1 !== undefined) {
      adj1 = parseInt(shapAdjst1.substr(4)) / 60000;
    }
    if (shapAdjst2 !== undefined) {
      adj2 = parseInt(shapAdjst2.substr(4)) / 60000;
    }
  }
  const pieVals = shapePie(H, w, adj1, adj2, isClose);
  return createPath(pieVals[0], ctx, pieVals[1]);
}

/**
 * Render chord shape
 */
function renderChord(ctx: ArcShapeContext): string {
  const { node, w, h } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    sAdj1_val = 45;
  let sAdj2,
    sAdj2_val = 270;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) / 60000;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) / 60000;
      }
    }
  }
  const hR = h / 2;
  const wR = w / 2;
  const d_val = shapeArc(wR, hR, wR, hR, sAdj1_val, sAdj2_val, true);
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render frame shape
 */
function renderFrame(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 12500 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a1, x1, x4, y4;
  if (adj1 < 0) a1 = 0;
  else if (adj1 > cnstVal1) a1 = cnstVal1;
  else a1 = adj1;
  x1 = (Math.min(w, h) * a1) / cnstVal2;
  x4 = w - x1;
  y4 = h - x1;
  const d =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " z" +
    "M" +
    x1 +
    "," +
    x1 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x4 +
    "," +
    y4 +
    " L" +
    x4 +
    "," +
    x1 +
    " z";
  return createPath(d, ctx);
}

/**
 * Render donut shape
 */
function renderDonut(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a, dr, iwd2, ihd2;
  if (adj < 0) a = 0;
  else if (adj > cnstVal1) a = cnstVal1;
  else a = adj;
  dr = (Math.min(w, h) * a) / cnstVal2;
  iwd2 = w / 2 - dr;
  ihd2 = h / 2 - dr;
  const d =
    "M" +
    0 +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 270, 360, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
    " z" +
    "M" +
    dr +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 180, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 90, 0, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 0, -90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 270, 180, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

/**
 * Render noSmoking shape
 */
function renderNoSmoking(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 18750 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a, dr, iwd2, ihd2, ang, ct, st, m, n, drd2, dang, dang2, swAng, stAng1, stAng2;
  if (adj < 0) a = 0;
  else if (adj > cnstVal1) a = cnstVal1;
  else a = adj;
  dr = (Math.min(w, h) * a) / cnstVal2;
  iwd2 = w / 2 - dr;
  ihd2 = h / 2 - dr;
  ang = Math.atan(h / w);
  ct = ihd2 * Math.cos(ang);
  st = iwd2 * Math.sin(ang);
  m = Math.sqrt(ct * ct + st * st);
  n = (iwd2 * ihd2) / m;
  drd2 = dr / 2;
  dang = Math.atan(drd2 / n);
  dang2 = dang * 2;
  swAng = -Math.PI + dang2;
  stAng1 = ang - dang;
  stAng2 = stAng1 - Math.PI;
  let ct1, st1, m1, n1, dx1, dy1, x1, y1, x2, y2;
  ct1 = ihd2 * Math.cos(stAng1);
  st1 = iwd2 * Math.sin(stAng1);
  m1 = Math.sqrt(ct1 * ct1 + st1 * st1);
  n1 = (iwd2 * ihd2) / m1;
  dx1 = n1 * Math.cos(stAng1);
  dy1 = n1 * Math.sin(stAng1);
  x1 = w / 2 + dx1;
  y1 = h / 2 + dy1;
  x2 = w / 2 - dx1;
  y2 = h / 2 - dy1;
  const stAng1deg = (stAng1 * 180) / Math.PI;
  const stAng2deg = (stAng2 * 180) / Math.PI;
  const swAng2deg = (swAng * 180) / Math.PI;
  const d =
    "M" +
    0 +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 270, 360, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
    " z" +
    "M" +
    x1 +
    "," +
    y1 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, stAng1deg, stAng1deg + swAng2deg, false).replace("M", "L") +
    " z" +
    "M" +
    x2 +
    "," +
    y2 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, stAng2deg, stAng2deg + swAng2deg, false).replace("M", "L") +
    " z";

  return createPath(d, ctx);
}

/**
 * Render halfFrame shape
 */
function renderHalfFrame(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    sAdj1_val = 3.5;
  let sAdj2,
    sAdj2_val = 3.5;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  const minWH = Math.min(w, h);
  const maxAdj2 = (cnsVal * w) / minWH;
  let a1, a2;
  if (sAdj2_val < 0) a2 = 0;
  else if (sAdj2_val > maxAdj2) a2 = maxAdj2;
  else a2 = sAdj2_val;
  const x1 = (minWH * a2) / cnsVal;
  const g1 = (h * x1) / w;
  const g2 = h - g1;
  const maxAdj1 = (cnsVal * g2) / minWH;
  if (sAdj1_val < 0) a1 = 0;
  else if (sAdj1_val > maxAdj1) a1 = maxAdj1;
  else a1 = sAdj1_val;
  const y1 = (minWH * a1) / cnsVal;
  const dx2 = (y1 * w) / h;
  const x2 = w - dx2;
  const dy2 = (x1 * h) / w;
  const y2 = h - dy2;
  const d =
    "M0,0" +
    " L" +
    w +
    "," +
    0 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    x1 +
    "," +
    y1 +
    " L" +
    x1 +
    "," +
    y2 +
    " L0," +
    h +
    " z";

  return createPath(d, ctx);
}

/**
 * Render blockArc shape
 */
function renderBlockArc(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 180;
  let sAdj2,
    adj2 = 0;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name == "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) / 60000;
      } else if (sAdj_name == "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) / 60000;
      } else if (sAdj_name == "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  let stAng, istAng, a3, sw11, sw12, swAng, iswAng;
  const cd1 = 360;
  if (adj1 < 0) stAng = 0;
  else if (adj1 > cd1) stAng = cd1;
  else stAng = adj1;

  if (adj2 < 0) istAng = 0;
  else if (adj2 > cd1) istAng = cd1;
  else istAng = adj2;

  if (adj3 < 0) a3 = 0;
  else if (adj3 > cnstVal1) a3 = cnstVal1;
  else a3 = adj3;

  sw11 = istAng - stAng;
  sw12 = sw11 + cd1;
  swAng = sw11 > 0 ? sw11 : sw12;
  iswAng = -swAng;

  const endAng = stAng + swAng;
  const iendAng = istAng + iswAng;

  let wt1, ht1, dx1, dy1, x1, y1, stRd, istRd, wd2, hd2, hc, vc;
  stRd = (stAng * Math.PI) / 180;
  istRd = (istAng * Math.PI) / 180;
  wd2 = w / 2;
  hd2 = h / 2;
  hc = w / 2;
  vc = h / 2;
  if (stAng > 90 && stAng < 270) {
    wt1 = wd2 * Math.sin(Math.PI / 2 - stRd);
    ht1 = hd2 * Math.cos(Math.PI / 2 - stRd);

    dx1 = wd2 * Math.cos(Math.atan(ht1 / wt1));
    dy1 = hd2 * Math.sin(Math.atan(ht1 / wt1));

    x1 = hc - dx1;
    y1 = vc - dy1;
  } else {
    wt1 = wd2 * Math.sin(stRd);
    ht1 = hd2 * Math.cos(stRd);

    dx1 = wd2 * Math.cos(Math.atan(wt1 / ht1));
    dy1 = hd2 * Math.sin(Math.atan(wt1 / ht1));

    x1 = hc + dx1;
    y1 = vc + dy1;
  }
  let dr, iwd2, ihd2, wt2, ht2, dx2, dy2, x2, y2;
  dr = (Math.min(w, h) * a3) / cnstVal2;
  iwd2 = wd2 - dr;
  ihd2 = hd2 - dr;
  if ((endAng <= 450 && endAng > 270) || (endAng >= 630 && endAng < 720)) {
    wt2 = iwd2 * Math.sin(istRd);
    ht2 = ihd2 * Math.cos(istRd);
    dx2 = iwd2 * Math.cos(Math.atan(wt2 / ht2));
    dy2 = ihd2 * Math.sin(Math.atan(wt2 / ht2));
    x2 = hc + dx2;
    y2 = vc + dy2;
  } else {
    wt2 = iwd2 * Math.sin(Math.PI / 2 - istRd);
    ht2 = ihd2 * Math.cos(Math.PI / 2 - istRd);

    dx2 = iwd2 * Math.cos(Math.atan(ht2 / wt2));
    dy2 = ihd2 * Math.sin(Math.atan(ht2 / wt2));
    x2 = hc - dx2;
    y2 = vc - dy2;
  }
  const d =
    "M" +
    x1 +
    "," +
    y1 +
    shapeArc(wd2, hd2, wd2, hd2, stAng, endAng, false).replace("M", "L") +
    " L" +
    x2 +
    "," +
    y2 +
    shapeArc(wd2, hd2, iwd2, ihd2, istAng, iendAng, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const ARC_SHAPE_RENDERERS: Record<string, (ctx: ArcShapeContext, shapType: string) => string> = {
  pie: renderPieArcShape,
  pieWedge: renderPieArcShape,
  arc: renderPieArcShape,
  chord: (ctx) => renderChord(ctx),
  frame: (ctx) => renderFrame(ctx),
  donut: (ctx) => renderDonut(ctx),
  noSmoking: (ctx) => renderNoSmoking(ctx),
  halfFrame: (ctx) => renderHalfFrame(ctx),
  blockArc: (ctx) => renderBlockArc(ctx),
};

/**
 * Check if a shape type is an arc shape handled by this module
 */
export function isArcShape(shapType: string): boolean {
  return shapType in ARC_SHAPE_RENDERERS;
}

/**
 * Render an arc shape
 * @returns SVG string for the shape, or empty string if not an arc shape
 */
export function renderArcShape(shapType: string, ctx: ArcShapeContext): string {
  const renderer = ARC_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
