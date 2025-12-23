/**
 * Polygon shape rendering functions.
 *
 * Handles polygon shapes:
 * - rtTriangle, triangle, diamond, trapezoid, parallelogram
 * - pentagon, hexagon, heptagon, octagon, decagon, dodecagon
 * - flowChartExtract, flowChartMerge, flowChartDecision, flowChartSort
 * - flowChartManualOperation, flowChartManualInput, flowChartInputOutput
 * - flowChartPreparation
 */

import { getTextByPathList } from "../../object";

/**
 * Context for rendering polygon shapes
 */
export interface PolygonShapeContext {
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
 * List of polygon shape types handled by this module
 */
export const POLYGON_SHAPE_TYPES = [
  "rtTriangle",
  "triangle",
  "flowChartExtract",
  "flowChartMerge",
  "diamond",
  "flowChartDecision",
  "flowChartSort",
  "trapezoid",
  "flowChartManualOperation",
  "flowChartManualInput",
  "parallelogram",
  "flowChartInputOutput",
  "pentagon",
  "hexagon",
  "flowChartPreparation",
  "heptagon",
  "octagon",
  "decagon",
  "dodecagon",
] as const;

/**
 * Generate fill attribute string for SVG
 */
function getFillAttr(ctx: PolygonShapeContext): string {
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
 * Generate stroke attributes string for SVG
 */
function getStrokeAttrs(ctx: PolygonShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

// =============================================================================
// Polygon Shape Renderers
// =============================================================================

/**
 * Render rtTriangle shape
 */
function renderRtTriangle(ctx: PolygonShapeContext): string {
  const { w, h } = ctx;
  return ` <polygon points='0 0,0 ${h},${w} ${h}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render triangle, flowChartExtract, flowChartMerge shapes
 */
function renderTriangle(ctx: PolygonShapeContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let shapAdjst_val = 0.5;
  if (shapAdjst !== undefined) {
    shapAdjst_val = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let tranglRott = "";
  if (shapType === "flowChartMerge") {
    tranglRott = `transform='rotate(180 ${w / 2},${h / 2})'`;
  }
  return ` <polygon ${tranglRott} points='${w * shapAdjst_val} 0,0 ${h},${w} ${h}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render diamond, flowChartDecision, flowChartSort shapes
 */
function renderDiamond(ctx: PolygonShapeContext, shapType: string): string {
  const { w, h } = ctx;

  let result = ` <polygon points='${w / 2} 0,0 ${h / 2},${w / 2} ${h},${w} ${h / 2}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
  if (shapType === "flowChartSort") {
    result += ` <polyline points='0 ${h / 2},${w} ${h / 2}' fill='none' ${getStrokeAttrs(ctx)} />`;
  }
  return result;
}

/**
 * Render trapezoid, flowChartManualOperation, flowChartManualInput shapes
 */
function renderTrapezoid(ctx: PolygonShapeContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adjst_val = 0.2;
  const max_adj_const = 0.7407;
  if (shapAdjst !== undefined) {
    const adjst = parseInt(shapAdjst.substr(4)) * slideFactor;
    adjst_val = (adjst * 0.5) / max_adj_const;
  }
  let cnstVal = 0;
  let tranglRott = "";
  if (shapType === "flowChartManualOperation") {
    tranglRott = `transform='rotate(180 ${w / 2},${h / 2})'`;
  }
  if (shapType === "flowChartManualInput") {
    adjst_val = 0;
    cnstVal = h / 5;
  }
  return ` <polygon ${tranglRott} points='${w * adjst_val} ${cnstVal},0 ${h},${w} ${h},${(1 - adjst_val) * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render parallelogram, flowChartInputOutput shapes
 */
function renderParallelogram(ctx: PolygonShapeContext): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adjst_val = 0.25;
  let max_adj_const;
  if (w > h) {
    max_adj_const = w / h;
  } else {
    max_adj_const = h / w;
  }
  if (shapAdjst !== undefined) {
    const adjst = parseInt(shapAdjst.substr(4)) / 100000;
    adjst_val = adjst / max_adj_const;
  }
  return ` <polygon points='${adjst_val * w} 0,0 ${h},${(1 - adjst_val) * w} ${h},${w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render pentagon shape
 */
function renderPentagon(ctx: PolygonShapeContext): string {
  const { w, h } = ctx;
  return ` <polygon points='${0.5 * w} 0,0 ${0.375 * h},${0.15 * w} ${h},${0.85 * w} ${h},${w} ${0.375 * h}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render hexagon, flowChartPreparation shapes
 */
function renderHexagon(ctx: PolygonShapeContext): string {
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
  const vf = 115470 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const angVal1 = (60 * Math.PI) / 180;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let maxAdj,
    a,
    shd2,
    x1,
    x2,
    dy1,
    y1,
    y2,
    vc = h / 2,
    hd2 = h / 2;
  const ss = Math.min(w, h);
  maxAdj = (cnstVal1 * w) / ss;
  a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  shd2 = (hd2 * vf) / cnstVal2;
  x1 = (ss * a) / cnstVal2;
  x2 = w - x1;
  dy1 = shd2 * Math.sin(angVal1);
  y1 = vc - dy1;
  y2 = vc + dy1;

  const d =
    "M" +
    0 +
    "," +
    vc +
    " L" +
    x1 +
    "," +
    y1 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    y2 +
    " z";

  return `<path   d='${d}'  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render heptagon shape
 */
function renderHeptagon(ctx: PolygonShapeContext): string {
  const { w, h } = ctx;
  return ` <polygon points='${0.5 * w} 0,${w / 8} ${h / 4},0 ${(5 / 8) * h},${w / 4} ${h},${(3 / 4) * w} ${h},${w} ${(5 / 8) * h},${(7 / 8) * w} ${h / 4}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render octagon shape
 */
function renderOctagon(ctx: PolygonShapeContext): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 0.25;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) / 100000;
  }
  const adj2 = 1 - adj1;
  return ` <polygon points='${adj1 * w} 0,0 ${adj1 * h},0 ${adj2 * h},${adj1 * w} ${h},${adj2 * w} ${h},${w} ${adj2 * h},${w} ${adj1 * h},${adj2 * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render decagon shape
 */
function renderDecagon(ctx: PolygonShapeContext): string {
  const { w, h } = ctx;
  return ` <polygon points='${(3 / 8) * w} 0,${w / 8} ${h / 8},0 ${h / 2},${w / 8} ${(7 / 8) * h},${(3 / 8) * w} ${h},${(5 / 8) * w} ${h},${(7 / 8) * w} ${(7 / 8) * h},${w} ${h / 2},${(7 / 8) * w} ${h / 8},${(5 / 8) * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render dodecagon shape
 */
function renderDodecagon(ctx: PolygonShapeContext): string {
  const { w, h } = ctx;
  return ` <polygon points='${(3 / 8) * w} 0,${w / 8} ${h / 8},0 ${(3 / 8) * h},0 ${(5 / 8) * h},${w / 8} ${(7 / 8) * h},${(3 / 8) * w} ${h},${(5 / 8) * w} ${h},${(7 / 8) * w} ${(7 / 8) * h},${w} ${(5 / 8) * h},${w} ${(3 / 8) * h},${(7 / 8) * w} ${h / 8},${(5 / 8) * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const POLYGON_SHAPE_RENDERERS: Record<
  string,
  (ctx: PolygonShapeContext, shapType: string) => string
> = {
  rtTriangle: (ctx) => renderRtTriangle(ctx),
  triangle: renderTriangle,
  flowChartExtract: renderTriangle,
  flowChartMerge: renderTriangle,
  diamond: renderDiamond,
  flowChartDecision: renderDiamond,
  flowChartSort: renderDiamond,
  trapezoid: renderTrapezoid,
  flowChartManualOperation: renderTrapezoid,
  flowChartManualInput: renderTrapezoid,
  parallelogram: (ctx) => renderParallelogram(ctx),
  flowChartInputOutput: (ctx) => renderParallelogram(ctx),
  pentagon: (ctx) => renderPentagon(ctx),
  hexagon: (ctx) => renderHexagon(ctx),
  flowChartPreparation: (ctx) => renderHexagon(ctx),
  heptagon: (ctx) => renderHeptagon(ctx),
  octagon: (ctx) => renderOctagon(ctx),
  decagon: (ctx) => renderDecagon(ctx),
  dodecagon: (ctx) => renderDodecagon(ctx),
};

/**
 * Check if a shape type is a polygon shape handled by this module
 */
export function isPolygonShape(shapType: string): boolean {
  return shapType in POLYGON_SHAPE_RENDERERS;
}

/**
 * Render a polygon shape
 * @returns SVG string for the shape, or empty string if not a polygon shape
 */
export function renderPolygonShape(shapType: string, ctx: PolygonShapeContext): string {
  const renderer = POLYGON_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
