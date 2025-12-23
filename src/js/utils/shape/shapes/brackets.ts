/**
 * Bracket and brace shape rendering functions.
 *
 * Handles bracket/brace shapes:
 * - bracePair, leftBrace, rightBrace
 * - bracketPair, leftBracket, rightBracket
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering bracket shapes
 */
export interface BracketShapeContext {
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
 * List of bracket shape types handled by this module
 */
export const BRACKET_SHAPE_TYPES = [
  "bracePair",
  "leftBrace",
  "rightBrace",
  "bracketPair",
  "leftBracket",
  "rightBracket",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: BracketShapeContext): string {
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
function getStrokeAttrs(ctx: BracketShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: BracketShapeContext): string {
  return `<path   d='${d}'  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Bracket Shape Renderers
// =============================================================================

/**
 * Render bracePair shape
 */
function renderBracePair(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 8333 * slideFactor;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 50000 * slideFactor;
  const cnstVal3 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let vc = h / 2,
    cd = 360,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a,
    x1,
    x2,
    x3,
    x4,
    y2,
    y3,
    y4;
  if (adj < 0) a = 0;
  else if (adj > cnstVal1) a = cnstVal1;
  else a = adj;
  const minWH = Math.min(w, h);
  x1 = (minWH * a) / cnstVal3;
  x2 = (minWH * a) / cnstVal2;
  x3 = w - x2;
  x4 = w - x1;
  y2 = vc - x1;
  y3 = vc + x1;
  y4 = h - x1;

  const d =
    "M" +
    x2 +
    "," +
    h +
    shapeArc(x2, y4, x1, x1, cd4, cd2, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    y3 +
    shapeArc(0, y3, x1, x1, 0, -cd4, false).replace("M", "L") +
    shapeArc(0, y2, x1, x1, cd4, 0, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    x1 +
    shapeArc(x2, x1, x1, x1, cd2, c3d4, false).replace("M", "L") +
    " M" +
    x3 +
    "," +
    0 +
    shapeArc(x3, x1, x1, x1, c3d4, cd, false).replace("M", "L") +
    " L" +
    x4 +
    "," +
    y2 +
    shapeArc(w, y2, x1, x1, cd2, cd4, false).replace("M", "L") +
    shapeArc(w, y3, x1, x1, c3d4, cd2, false).replace("M", "L") +
    " L" +
    x4 +
    "," +
    y4 +
    shapeArc(x3, y4, x1, x1, 0, cd4, false).replace("M", "L");

  return createPath(d, ctx);
}

/**
 * Render leftBrace shape
 */
function renderLeftBrace(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 8333 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
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
      }
    }
  }
  let vc = h / 2,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a1,
    a2,
    q1,
    q2,
    q3,
    y1,
    y2,
    y3,
    y4;
  if (adj2 < 0) a2 = 0;
  else if (adj2 > cnstVal2) a2 = cnstVal2;
  else a2 = adj2;
  const minWH = Math.min(w, h);
  q1 = cnstVal2 - a2;
  if (q1 < a2) q2 = q1;
  else q2 = a2;
  q3 = q2 / 2;
  const maxAdj1 = (q3 * h) / minWH;
  if (adj1 < 0) a1 = 0;
  else if (adj1 > maxAdj1) a1 = maxAdj1;
  else a1 = adj1;
  y1 = (minWH * a1) / cnstVal2;
  y3 = (h * a2) / cnstVal2;
  y2 = y3 - y1;
  y4 = y3 + y1;

  const d =
    "M" +
    w +
    "," +
    h +
    shapeArc(w, h - y1, w / 2, y1, cd4, cd2, false).replace("M", "L") +
    " L" +
    w / 2 +
    "," +
    y4 +
    shapeArc(0, y4, w / 2, y1, 0, -cd4, false).replace("M", "L") +
    shapeArc(0, y2, w / 2, y1, cd4, 0, false).replace("M", "L") +
    " L" +
    w / 2 +
    "," +
    y1 +
    shapeArc(w, y1, w / 2, y1, cd2, c3d4, false).replace("M", "L");

  return createPath(d, ctx);
}

/**
 * Render rightBrace shape
 */
function renderRightBrace(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 8333 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
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
      }
    }
  }
  let vc = h / 2,
    cd = 360,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a1,
    a2,
    q1,
    q2,
    q3,
    y1,
    y2,
    y3,
    y4;
  if (adj2 < 0) a2 = 0;
  else if (adj2 > cnstVal2) a2 = cnstVal2;
  else a2 = adj2;
  const minWH = Math.min(w, h);
  q1 = cnstVal2 - a2;
  if (q1 < a2) q2 = q1;
  else q2 = a2;
  q3 = q2 / 2;
  const maxAdj1 = (q3 * h) / minWH;
  if (adj1 < 0) a1 = 0;
  else if (adj1 > maxAdj1) a1 = maxAdj1;
  else a1 = adj1;
  y1 = (minWH * a1) / cnstVal2;
  y3 = (h * a2) / cnstVal2;
  y2 = y3 - y1;
  y4 = h - y1;

  const d =
    "M" +
    0 +
    "," +
    0 +
    shapeArc(0, y1, w / 2, y1, c3d4, cd, false).replace("M", "L") +
    " L" +
    w / 2 +
    "," +
    y2 +
    shapeArc(w, y2, w / 2, y1, cd2, cd4, false).replace("M", "L") +
    shapeArc(w, y3 + y1, w / 2, y1, c3d4, cd2, false).replace("M", "L") +
    " L" +
    w / 2 +
    "," +
    y4 +
    shapeArc(0, y4, w / 2, y1, 0, cd4, false).replace("M", "L");

  return createPath(d, ctx);
}

/**
 * Render bracketPair shape
 */
function renderBracketPair(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 16667 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let r = w,
    b = h,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a,
    x1,
    x2,
    y2;
  if (adj < 0) a = 0;
  else if (adj > cnstVal1) a = cnstVal1;
  else a = adj;
  x1 = (Math.min(w, h) * a) / cnstVal2;
  x2 = r - x1;
  y2 = b - x1;

  const d =
    shapeArc(x1, x1, x1, x1, c3d4, cd2, false) +
    shapeArc(x1, y2, x1, x1, cd2, cd4, false).replace("M", "L") +
    shapeArc(x2, x1, x1, x1, c3d4, c3d4 + cd4, false) +
    shapeArc(x2, y2, x1, x1, 0, cd4, false).replace("M", "L");

  return createPath(d, ctx);
}

/**
 * Render leftBracket shape
 */
function renderLeftBracket(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 8333 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const maxAdj = (cnstVal1 * h) / Math.min(w, h);
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let r = w,
    b = h,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a,
    y1,
    y2;
  if (adj < 0) a = 0;
  else if (adj > maxAdj) a = maxAdj;
  else a = adj;
  y1 = (Math.min(w, h) * a) / cnstVal2;
  if (y1 > w) y1 = w;
  y2 = b - y1;

  const d =
    "M" +
    r +
    "," +
    b +
    shapeArc(y1, y2, y1, y1, cd4, cd2, false).replace("M", "L") +
    " L" +
    0 +
    "," +
    y1 +
    shapeArc(y1, y1, y1, y1, cd2, c3d4, false).replace("M", "L") +
    " L" +
    r +
    "," +
    0;

  return createPath(d, ctx);
}

/**
 * Render rightBracket shape
 */
function renderRightBracket(ctx: BracketShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 8333 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const maxAdj = (cnstVal1 * h) / Math.min(w, h);
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let cd = 360,
    cd2 = 180,
    cd4 = 90,
    c3d4 = 270,
    a,
    y1,
    y2,
    y3;
  if (adj < 0) a = 0;
  else if (adj > maxAdj) a = maxAdj;
  else a = adj;
  y1 = (Math.min(w, h) * a) / cnstVal2;
  y2 = h - y1;
  y3 = w - y1;

  const d =
    "M" +
    0 +
    "," +
    h +
    shapeArc(y3, y2, y1, y1, cd4, 0, false).replace("M", "L") +
    " L" +
    w +
    "," +
    h / 2 +
    shapeArc(y3, y1, y1, y1, cd, c3d4, false).replace("M", "L") +
    " L" +
    0 +
    "," +
    0;

  return createPath(d, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const BRACKET_SHAPE_RENDERERS: Record<string, (ctx: BracketShapeContext) => string> = {
  bracePair: renderBracePair,
  leftBrace: renderLeftBrace,
  rightBrace: renderRightBrace,
  bracketPair: renderBracketPair,
  leftBracket: renderLeftBracket,
  rightBracket: renderRightBracket,
};

/**
 * Check if a shape type is a bracket shape handled by this module
 */
export function isBracketShape(shapType: string): boolean {
  return shapType in BRACKET_SHAPE_RENDERERS;
}

/**
 * Render a bracket shape
 * @returns SVG string for the shape, or empty string if not a bracket shape
 */
export function renderBracketShape(shapType: string, ctx: BracketShapeContext): string {
  const renderer = BRACKET_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
