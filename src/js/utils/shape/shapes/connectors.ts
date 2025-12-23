/**
 * Connector shape rendering functions.
 *
 * Handles connector shapes (lines with optional arrow markers):
 * - bentConnector2, bentConnector3
 * - line, straightConnector1
 * - bentConnector4, bentConnector5
 * - curvedConnector2, curvedConnector3, curvedConnector4, curvedConnector5
 */

import { getTextByPathList } from "../../object";

/**
 * Context for rendering connector shapes
 */
export interface ConnectorContext {
  node: any;
  w: number;
  h: number;
  shpId: string;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
}

/**
 * Extract arrow marker attributes from node
 */
function getMarkerNodeAttrs(node: any): { headEndNodeAttrs: any; tailEndNodeAttrs: any } {
  return {
    headEndNodeAttrs: getTextByPathList(node, ["p:spPr", "a:ln", "a:headEnd", "attrs"]),
    tailEndNodeAttrs: getTextByPathList(node, ["p:spPr", "a:ln", "a:tailEnd", "attrs"]),
  };
}

/**
 * List of connector shape types handled by this module
 */
export const CONNECTOR_TYPES = [
  "bentConnector2",
  "bentConnector3",
  "line",
  "straightConnector1",
  "bentConnector4",
  "bentConnector5",
  "curvedConnector2",
  "curvedConnector3",
  "curvedConnector4",
  "curvedConnector5",
] as const;

/**
 * Generate stroke attributes string for SVG
 */
function getStrokeAttrs(ctx: ConnectorContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Generate marker attributes for arrow endpoints
 */
function getMarkerAttrs(ctx: ConnectorContext): string {
  const { node, shpId } = ctx;
  const { headEndNodeAttrs, tailEndNodeAttrs } = getMarkerNodeAttrs(node);
  let attrs = "";

  if (
    headEndNodeAttrs !== undefined &&
    (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")
  ) {
    attrs += `marker-start='url(#markerTriangle_${shpId})' `;
  }
  if (
    tailEndNodeAttrs !== undefined &&
    (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow")
  ) {
    attrs += `marker-end='url(#markerTriangle_${shpId})' `;
  }

  return attrs;
}

// =============================================================================
// Connector Shape Renderers
// =============================================================================

/**
 * Render bentConnector2 shape (L-shaped connector)
 */
function renderBentConnector2(ctx: ConnectorContext): string {
  const { w, h } = ctx;

  const d = "M " + w + " 0 L " + w + " " + h + " L 0 " + h;

  return `<path d='${d}' ${getStrokeAttrs(ctx)} fill='none' ${getMarkerAttrs(ctx)}/>`;
}

/**
 * Render bentConnector3 shape (Z-shaped connector with adjustable midpoint)
 */
function renderBentConnector3(ctx: ConnectorContext): string {
  const { node, w, h } = ctx;

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
    shapAdjst_val = parseInt(shapAdjst.substr(4)) / 100000;

    return ` <polyline points='0 0,${shapAdjst_val * w} 0,${shapAdjst_val * w} ${h},${w} ${h}' fill='transparent' ${getStrokeAttrs(ctx)} ${getMarkerAttrs(ctx)}/>`;
  }

  return "";
}

/**
 * Render line and simple connector shapes
 */
function renderLine(ctx: ConnectorContext): string {
  const { w, h } = ctx;

  return `<line x1='0' y1='0' x2='${w}' y2='${h}' ${getStrokeAttrs(ctx)} ${getMarkerAttrs(ctx)}/>`;
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const CONNECTOR_RENDERERS: Record<string, (ctx: ConnectorContext) => string> = {
  bentConnector2: renderBentConnector2,
  bentConnector3: renderBentConnector3,
  line: renderLine,
  straightConnector1: renderLine,
  bentConnector4: renderLine,
  bentConnector5: renderLine,
  curvedConnector2: renderLine,
  curvedConnector3: renderLine,
  curvedConnector4: renderLine,
  curvedConnector5: renderLine,
};

/**
 * Check if a shape type is a connector shape handled by this module
 */
export function isConnectorShape(shapType: string): boolean {
  return shapType in CONNECTOR_RENDERERS;
}

/**
 * Render a connector shape
 * @returns SVG string for the shape, or empty string if not a connector shape
 */
export function renderConnectorShape(shapType: string, ctx: ConnectorContext): string {
  const renderer = CONNECTOR_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
