/**
 * Plate and cylinder shape rendering functions.
 *
 * Handles plate shapes (arrow-like pentagons):
 * - homePlate, chevron
 *
 * Handles cylinder shapes (3D containers):
 * - can, flowChartMagneticDisk, flowChartMagneticDrum
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";
import type { XmlNode } from "../../../types/pptx-xml";

/**
 * Context for rendering plate and cylinder shapes
 */
export interface PlateCylinderContext {
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
 * List of plate and cylinder shape types handled by this module
 */
export const PLATE_CYLINDER_TYPES = [
  "homePlate",
  "chevron",
  "can",
  "flowChartMagneticDisk",
  "flowChartMagneticDrum",
] as const;

/**
 * Generate fill attribute string for SVG
 */
function getFillAttr(ctx: PlateCylinderContext): string {
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
function getStrokeAttrs(ctx: PlateCylinderContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

// =============================================================================
// Plate Shape Renderers (Arrow-like pentagons)
// =============================================================================

/**
 * Render homePlate shape (pentagon arrow pointing right)
 */
function renderHomePlate(ctx: PlateCylinderContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const vc = h / 2;
  const minWH = Math.min(w, h);
  const maxAdj = (cnstVal1 * w) / minWH;
  const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  const dx1 = (minWH * a) / cnstVal1;
  const x1 = w - dx1;

  const d_val =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " z";

  return `<path  d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render chevron shape (hexagon arrow pointing right)
 */
function renderChevron(ctx: PlateCylinderContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const vc = h / 2;
  const minWH = Math.min(w, h);
  const maxAdj = (cnstVal1 * w) / minWH;
  const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  const x1 = (minWH * a) / cnstVal1;
  const x2 = w - x1;

  const d_val =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " L" +
    x1 +
    "," +
    vc +
    " z";

  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Cylinder Shape Renderers
// =============================================================================

/**
 * Render can/cylinder shapes (can, flowChartMagneticDisk, flowChartMagneticDrum)
 */
function renderCylinder(ctx: PlateCylinderContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 200000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const ss = Math.min(w, h);
  if (shapType === "flowChartMagneticDisk" || shapType === "flowChartMagneticDrum") {
    adj = 50000 * slideFactor;
  }

  const maxAdj = (cnstVal1 * h) / ss;
  const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
  const y1 = (ss * a) / cnstVal2;
  const y3 = h - y1;
  const cd2 = 180,
    wd2 = w / 2;

  const tranglRott =
    shapType === "flowChartMagneticDrum" ? `transform='rotate(90 ${w / 2},${h / 2})'` : "";

  const dVal =
    shapeArc(wd2, y1, wd2, y1, 0, cd2, false) +
    shapeArc(wd2, y1, wd2, y1, cd2, cd2 + cd2, false).replace("M", "L") +
    " L" +
    w +
    "," +
    y3 +
    shapeArc(wd2, y3, wd2, y1, 0, cd2, false).replace("M", "L") +
    " L" +
    0 +
    "," +
    y1;

  return `<path ${tranglRott} d='${dVal}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Shape Registry
// =============================================================================

type PlateCylinderRendererOptions = {
  ctx: PlateCylinderContext;
  shapeType: string;
};

const withCtx = (renderer: (ctx: PlateCylinderContext) => string) => {
  return ({ ctx }: PlateCylinderRendererOptions) => renderer(ctx);
};

const withCtxAndShape = (renderer: (ctx: PlateCylinderContext, shapeType: string) => string) => {
  return ({ ctx, shapeType }: PlateCylinderRendererOptions) => renderer(ctx, shapeType);
};

/**
 * Registry mapping shape types to their render functions
 */
const PLATE_CYLINDER_RENDERERS: Record<string, (options: PlateCylinderRendererOptions) => string> =
  {
    homePlate: withCtx(renderHomePlate),
    chevron: withCtx(renderChevron),
    can: withCtxAndShape(renderCylinder),
    flowChartMagneticDisk: withCtxAndShape(renderCylinder),
    flowChartMagneticDrum: withCtxAndShape(renderCylinder),
  };

/**
 * Check if a shape type is a plate or cylinder shape handled by this module
 */
type IsPlateCylinderShapeOptions = {
  shapeType: string | undefined;
};

export function isPlateCylinderShape({ shapeType }: IsPlateCylinderShapeOptions): boolean {
  return shapeType !== undefined && shapeType in PLATE_CYLINDER_RENDERERS;
}

/**
 * Render a plate or cylinder shape
 * @returns SVG string for the shape, or empty string if not a plate/cylinder shape
 */
type RenderPlateCylinderShapeOptions = {
  shapeType: string;
  ctx: PlateCylinderContext;
};

export function renderPlateCylinderShape({
  shapeType,
  ctx,
}: RenderPlateCylinderShapeOptions): string {
  const renderer = PLATE_CYLINDER_RENDERERS[shapeType];
  return renderer ? renderer({ ctx, shapeType }) : "";
}
