/**
 * Flowchart shape rendering functions.
 *
 * Handles independent flowchart shapes:
 * - flowChartCollate, flowChartDocument, flowChartMultidocument
 * - flowChartTerminator, flowChartPunchedTape, flowChartOnlineStorage
 * - flowChartDisplay, flowChartDelay, flowChartMagneticTape
 *
 * Note: Some flowchart shapes share rendering with basic shapes (rect, ellipse, etc.)
 * and remain in gen-shape.ts switch statement.
 */

import { shapeArc } from "./helpers/arc";
import type { XmlNode } from "../../../types/pptx-xml";

/**
 * Context for rendering flowchart shapes
 */
export interface FlowchartShapeContext {
  node: XmlNode;
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
 * List of independent flowchart shape types handled by this module
 */
export const FLOWCHART_SHAPE_TYPES = [
  "flowChartCollate",
  "flowChartDocument",
  "flowChartMultidocument",
  "flowChartTerminator",
  "flowChartPunchedTape",
  "flowChartOnlineStorage",
  "flowChartDisplay",
  "flowChartDelay",
  "flowChartMagneticTape",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: FlowchartShapeContext): string {
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
function getStrokeAttrs(ctx: FlowchartShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: FlowchartShapeContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Flowchart Shape Renderers
// =============================================================================

/**
 * Render flowChartCollate shape - X-shaped hourglass
 */
function renderFlowChartCollate(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const d = "M 0,0" + " L" + w + "," + 0 + " L" + 0 + "," + h + " L" + w + "," + h + " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartDocument shape - document with curved bottom
 */
function renderFlowChartDocument(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const x1 = (w * 10800) / 21600;
  const y1 = (h * 17322) / 21600;
  const y2 = (h * 20172) / 21600;
  const y3 = (h * 23922) / 21600;
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
    y1 +
    " C" +
    x1 +
    "," +
    y1 +
    " " +
    x1 +
    "," +
    y3 +
    " " +
    0 +
    "," +
    y2 +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartMultidocument shape - stacked documents
 */
function renderFlowChartMultidocument(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const y1 = (h * 18022) / 21600;
  const y2 = (h * 3675) / 21600;
  const y3 = (h * 23542) / 21600;
  const y4 = (h * 1815) / 21600;
  const y5 = (h * 16252) / 21600;
  const y6 = (h * 16352) / 21600;
  const y7 = (h * 14392) / 21600;
  const y8 = (h * 20782) / 21600;
  const y9 = (h * 14467) / 21600;
  const x1 = (w * 1532) / 21600;
  const x2 = (w * 20000) / 21600;
  const x3 = (w * 9298) / 21600;
  const x4 = (w * 19298) / 21600;
  const x5 = (w * 18595) / 21600;
  const x6 = (w * 2972) / 21600;
  const x7 = (w * 20800) / 21600;
  const d =
    "M" +
    0 +
    "," +
    y2 +
    " L" +
    x5 +
    "," +
    y2 +
    " L" +
    x5 +
    "," +
    y1 +
    " C" +
    x3 +
    "," +
    y1 +
    " " +
    x3 +
    "," +
    y3 +
    " " +
    0 +
    "," +
    y8 +
    " z" +
    "M" +
    x1 +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y5 +
    " C" +
    x4 +
    "," +
    y5 +
    " " +
    x5 +
    "," +
    y6 +
    " " +
    x5 +
    "," +
    y6 +
    "M" +
    x6 +
    "," +
    y4 +
    " L" +
    x6 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    y7 +
    " C" +
    x7 +
    "," +
    y7 +
    " " +
    x2 +
    "," +
    y9 +
    " " +
    x2 +
    "," +
    y9;
  return createPath(d, ctx);
}

/**
 * Render flowChartTerminator shape - rounded rectangle (start/end)
 */
function renderFlowChartTerminator(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const cd2 = 180,
    cd4 = 90,
    c3d4 = 270;
  const x1 = (w * 3475) / 21600;
  const x2 = (w * 18125) / 21600;
  const y1 = (h * 10800) / 21600;
  const d =
    "M" +
    x1 +
    "," +
    0 +
    " L" +
    x2 +
    "," +
    0 +
    shapeArc(x2, h / 2, x1, y1, c3d4, c3d4 + cd2, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    h +
    shapeArc(x1, h / 2, x1, y1, cd4, cd4 + cd2, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartPunchedTape shape - wavy tape
 */
function renderFlowChartPunchedTape(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const cd2 = 180;
  const x1 = (w * 5) / 20;
  const y1 = (h * 2) / 20;
  const y2 = (h * 18) / 20;
  const d =
    "M" +
    0 +
    "," +
    y1 +
    shapeArc(x1, y1, x1, y1, cd2, 0, false).replace("M", "L") +
    shapeArc(w * (3 / 4), y1, x1, y1, cd2, 360, false).replace("M", "L") +
    " L" +
    w +
    "," +
    y2 +
    shapeArc(w * (3 / 4), y2, x1, y1, 0, -cd2, false).replace("M", "L") +
    shapeArc(x1, y2, x1, y1, 0, cd2, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartOnlineStorage shape - cylinder side view
 */
function renderFlowChartOnlineStorage(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const c3d4 = 270,
    cd4 = 90;
  const x1 = (w * 1) / 6;
  const y1 = (h * 3) / 6;
  const d =
    "M" +
    x1 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    shapeArc(w, h / 2, x1, y1, c3d4, 90, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    h +
    shapeArc(x1, h / 2, x1, y1, cd4, 270, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartDisplay shape - display/monitor shape
 */
function renderFlowChartDisplay(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const c3d4 = 270,
    cd2 = 180;
  const x1 = (w * 1) / 6;
  const x2 = (w * 5) / 6;
  const y1 = (h * 3) / 6;
  const d =
    "M" +
    0 +
    "," +
    y1 +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    x2 +
    "," +
    0 +
    shapeArc(w, h / 2, x1, y1, c3d4, c3d4 + cd2, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    h +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartDelay shape - D-shaped delay
 */
function renderFlowChartDelay(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const wd2 = w / 2,
    hd2 = h / 2;
  const cd2 = 180,
    c3d4 = 270;
  const d =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    wd2 +
    "," +
    0 +
    shapeArc(wd2, hd2, wd2, hd2, c3d4, c3d4 + cd2, false).replace("M", "L") +
    " L" +
    0 +
    "," +
    h +
    " z";
  return createPath(d, ctx);
}

/**
 * Render flowChartMagneticTape shape - reel tape
 */
function renderFlowChartMagneticTape(ctx: FlowchartShapeContext): string {
  const { w, h } = ctx;
  const wd2 = w / 2,
    hd2 = h / 2;
  const cd2 = 180,
    c3d4 = 270,
    cd4 = 90;
  const idy = hd2 * Math.sin(Math.PI / 4);
  const ib = hd2 + idy;
  const ang1 = Math.atan(h / w);
  const ang1Dg = (ang1 * 180) / Math.PI;
  const d =
    "M" +
    wd2 +
    "," +
    h +
    shapeArc(wd2, hd2, wd2, hd2, cd4, cd2, false).replace("M", "L") +
    shapeArc(wd2, hd2, wd2, hd2, cd2, c3d4, false).replace("M", "L") +
    shapeArc(wd2, hd2, wd2, hd2, c3d4, 360, false).replace("M", "L") +
    shapeArc(wd2, hd2, wd2, hd2, 0, ang1Dg, false).replace("M", "L") +
    " L" +
    w +
    "," +
    ib +
    " L" +
    w +
    "," +
    h +
    " z";
  return createPath(d, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const FLOWCHART_RENDERERS: Record<string, (ctx: FlowchartShapeContext) => string> = {
  flowChartCollate: renderFlowChartCollate,
  flowChartDocument: renderFlowChartDocument,
  flowChartMultidocument: renderFlowChartMultidocument,
  flowChartTerminator: renderFlowChartTerminator,
  flowChartPunchedTape: renderFlowChartPunchedTape,
  flowChartOnlineStorage: renderFlowChartOnlineStorage,
  flowChartDisplay: renderFlowChartDisplay,
  flowChartDelay: renderFlowChartDelay,
  flowChartMagneticTape: renderFlowChartMagneticTape,
};

/**
 * Check if a shape type is an independent flowchart shape handled by this module
 */
export function isFlowchartShape(shapType: string): boolean {
  return shapType in FLOWCHART_RENDERERS;
}

/**
 * Render a flowchart shape
 * @returns SVG string for the shape, or empty string if not a flowchart shape
 */
export function renderFlowchartShape(shapType: string, ctx: FlowchartShapeContext): string {
  const renderer = FLOWCHART_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
