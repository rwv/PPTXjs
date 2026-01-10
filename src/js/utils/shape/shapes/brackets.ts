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
  node: unknown;
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

  const shapAdjst = getTextByPathList<string>(node, [
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
  const vc = h / 2;
  const cd = 360;
  const cd2 = 180;
  const cd4 = 90;
  const c3d4 = 270;
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const minWH = Math.min(w, h);
  const x1 = (minWH * a) / cnstVal3;
  const x2 = (minWH * a) / cnstVal2;
  const x3 = w - x2;
  const x4 = w - x1;
  const y2 = vc - x1;
  const y3 = vc + x1;
  const y4 = h - x1;

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

  const shapAdjst_ary = getTextByPathList<unknown[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  let sAdj1: string | undefined;
  let adj1 = 8333 * slideFactor;
  let sAdj2: string | undefined;
  let adj2 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
        if (sAdj1 !== undefined) {
          adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
        }
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
        if (sAdj2 !== undefined) {
          adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
        }
      }
    }
  }
  const cd2 = 180;
  const cd4 = 90;
  const c3d4 = 270;
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal2 ? cnstVal2 : adj2;
  const minWH = Math.min(w, h);
  const q1 = cnstVal2 - a2;
  const q2 = q1 < a2 ? q1 : a2;
  const q3 = q2 / 2;
  const maxAdj1 = (q3 * h) / minWH;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const y1 = (minWH * a1) / cnstVal2;
  const y3 = (h * a2) / cnstVal2;
  const y2 = y3 - y1;
  const y4 = y3 + y1;

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

  const shapAdjst_ary = getTextByPathList<unknown[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  let sAdj1: string | undefined;
  let adj1 = 8333 * slideFactor;
  let sAdj2: string | undefined;
  let adj2 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
        if (sAdj1 !== undefined) {
          adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
        }
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
        if (sAdj2 !== undefined) {
          adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
        }
      }
    }
  }
  const cd = 360;
  const cd2 = 180;
  const cd4 = 90;
  const c3d4 = 270;
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal2 ? cnstVal2 : adj2;
  const minWH = Math.min(w, h);
  const q1 = cnstVal2 - a2;
  const q2 = q1 < a2 ? q1 : a2;
  const q3 = q2 / 2;
  const maxAdj1 = (q3 * h) / minWH;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const y1 = (minWH * a1) / cnstVal2;
  const y3 = (h * a2) / cnstVal2;
  const y2 = y3 - y1;
  const y4 = h - y1;

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

  const shapAdjst = getTextByPathList<string>(node, [
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
  const r = w;
  const b = h;
  const cd2 = 180;
  const cd4 = 90;
  const c3d4 = 270;
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const x1 = (Math.min(w, h) * a) / cnstVal2;
  const x2 = r - x1;
  const y2 = b - x1;

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

  const shapAdjst = getTextByPathList<string>(node, [
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
  const r = w;
  const b = h;
  const cd2 = 180;
  const cd4 = 90;
  const c3d4 = 270;
  const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  const rawY1 = (Math.min(w, h) * a) / cnstVal2;
  const y1 = rawY1 > w ? w : rawY1;
  const y2 = b - y1;

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

  const shapAdjst = getTextByPathList<string>(node, [
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
  const cd = 360;
  const cd4 = 90;
  const c3d4 = 270;
  const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  const y1 = (Math.min(w, h) * a) / cnstVal2;
  const y2 = h - y1;
  const y3 = w - y1;

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
