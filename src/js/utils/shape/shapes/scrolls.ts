/**
 * Scroll shape rendering functions.
 *
 * Handles scroll shapes:
 * - verticalScroll, horizontalScroll
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";
import type { XmlNode } from "../../../types/pptx-xml";

/**
 * Context for rendering scroll shapes
 */
export interface ScrollShapeContext {
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
 * List of scroll shape types handled by this module
 */
export const SCROLL_SHAPE_TYPES = ["verticalScroll", "horizontalScroll"] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: ScrollShapeContext): string {
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
function getStrokeAttrs(ctx: ScrollShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
type CreatePathOptions = {
  d: string;
  ctx: ScrollShapeContext;
};

function createPath({ d, ctx }: CreatePathOptions): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Scroll Shape Renderers
// =============================================================================

/**
 * Render verticalScroll or horizontalScroll shape
 */
type RenderScrollShapeOptions = {
  ctx: ScrollShapeContext;
  shapeType: string;
};

function renderScrollShape({ ctx, shapeType }: RenderScrollShapeOptions): string {
  const { node, w, h, slideFactor } = ctx;
  const shapType = shapeType;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  const refr = slideFactor;
  let adj = 12500 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  let d_val = "";
  const cnstVal1 = 25000 * refr;
  const cnstVal2 = 100000 * refr;
  const ss = Math.min(w, h);
  const t = 0,
    l = 0,
    b = h,
    r = w;
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const ch = (ss * a) / cnstVal2;
  const ch2 = ch / 2;
  const ch4 = ch / 4;

  if (shapType === "verticalScroll") {
    const x3 = ch + ch2;
    const x4 = ch + ch;
    const x6 = r - ch;
    const x7 = r - ch2;
    const x5 = x6 - ch2;
    const y3 = b - ch;
    const y4 = b - ch2;

    d_val =
      "M" +
      ch +
      "," +
      y3 +
      " L" +
      ch +
      "," +
      ch2 +
      shapeArc({
        cX: x3,
        cY: ch2,
        rX: ch2,
        rY: ch2,
        stAng: 180,
        endAng: 270,
        isClose: false,
      }).replace("M", "L") +
      " L" +
      x7 +
      "," +
      t +
      shapeArc({
        cX: x7,
        cY: ch2,
        rX: ch2,
        rY: ch2,
        stAng: 270,
        endAng: 450,
        isClose: false,
      }).replace("M", "L") +
      " L" +
      x6 +
      "," +
      ch +
      " L" +
      x6 +
      "," +
      y4 +
      shapeArc({ cX: x5, cY: y4, rX: ch2, rY: ch2, stAng: 0, endAng: 90, isClose: false }).replace(
        "M",
        "L"
      ) +
      " L" +
      ch2 +
      "," +
      b +
      shapeArc({
        cX: ch2,
        cY: y4,
        rX: ch2,
        rY: ch2,
        stAng: 90,
        endAng: 270,
        isClose: false,
      }).replace("M", "L") +
      " z" +
      " M" +
      x3 +
      "," +
      t +
      shapeArc({
        cX: x3,
        cY: ch2,
        rX: ch2,
        rY: ch2,
        stAng: 270,
        endAng: 450,
        isClose: false,
      }).replace("M", "L") +
      shapeArc({
        cX: x3,
        cY: x3 / 2,
        rX: ch4,
        rY: ch4,
        stAng: 90,
        endAng: 270,
        isClose: false,
      }).replace("M", "L") +
      " L" +
      x4 +
      "," +
      ch2 +
      " M" +
      x6 +
      "," +
      ch +
      " L" +
      x3 +
      "," +
      ch +
      " M" +
      ch +
      "," +
      y4 +
      shapeArc({
        cX: ch2,
        cY: y4,
        rX: ch2,
        rY: ch2,
        stAng: 0,
        endAng: 270,
        isClose: false,
      }).replace("M", "L") +
      shapeArc({
        cX: ch2,
        cY: (y4 + y3) / 2,
        rX: ch4,
        rY: ch4,
        stAng: 270,
        endAng: 450,
        isClose: false,
      }).replace("M", "L") +
      " z" +
      " M" +
      ch +
      "," +
      y4 +
      " L" +
      ch +
      "," +
      y3;
  } else if (shapType === "horizontalScroll") {
    const y3 = ch + ch2;
    const y4 = ch + ch;
    const y6 = b - ch;
    const y7 = b - ch2;
    const y5 = y6 - ch2;
    const x3 = r - ch;
    const x4 = r - ch2;

    d_val =
      "M" +
      l +
      "," +
      y3 +
      shapeArc({
        cX: ch2,
        cY: y3,
        rX: ch2,
        rY: ch2,
        stAng: 180,
        endAng: 270,
        isClose: false,
      }).replace("M", "L") +
      " L" +
      x3 +
      "," +
      ch +
      " L" +
      x3 +
      "," +
      ch2 +
      shapeArc({
        cX: x4,
        cY: ch2,
        rX: ch2,
        rY: ch2,
        stAng: 180,
        endAng: 360,
        isClose: false,
      }).replace("M", "L") +
      " L" +
      r +
      "," +
      y5 +
      shapeArc({ cX: x4, cY: y5, rX: ch2, rY: ch2, stAng: 0, endAng: 90, isClose: false }).replace(
        "M",
        "L"
      ) +
      " L" +
      ch +
      "," +
      y6 +
      " L" +
      ch +
      "," +
      y7 +
      shapeArc({
        cX: ch2,
        cY: y7,
        rX: ch2,
        rY: ch2,
        stAng: 0,
        endAng: 180,
        isClose: false,
      }).replace("M", "L") +
      " z" +
      "M" +
      x4 +
      "," +
      ch +
      shapeArc({
        cX: x4,
        cY: ch2,
        rX: ch2,
        rY: ch2,
        stAng: 90,
        endAng: -180,
        isClose: false,
      }).replace("M", "L") +
      shapeArc({
        cX: (x3 + x4) / 2,
        cY: ch2,
        rX: ch4,
        rY: ch4,
        stAng: 180,
        endAng: 0,
        isClose: false,
      }).replace("M", "L") +
      " z" +
      " M" +
      x4 +
      "," +
      ch +
      " L" +
      x3 +
      "," +
      ch +
      " M" +
      ch2 +
      "," +
      y4 +
      " L" +
      ch2 +
      "," +
      y3 +
      shapeArc({
        cX: y3 / 2,
        cY: y3,
        rX: ch4,
        rY: ch4,
        stAng: 180,
        endAng: 360,
        isClose: false,
      }).replace("M", "L") +
      shapeArc({
        cX: ch2,
        cY: y3,
        rX: ch2,
        rY: ch2,
        stAng: 0,
        endAng: 180,
        isClose: false,
      }).replace("M", "L") +
      " M" +
      ch +
      "," +
      y3 +
      " L" +
      ch +
      "," +
      y6;
  }

  return createPath({ d: d_val, ctx });
}

// =============================================================================
// Shape Registry
// =============================================================================

type ScrollRendererOptions = {
  ctx: ScrollShapeContext;
  shapeType: string;
};

const withCtxAndShape = (
  renderer: (options: { ctx: ScrollShapeContext; shapeType: string }) => string
) => {
  return ({ ctx, shapeType }: ScrollRendererOptions) => renderer({ ctx, shapeType });
};

/**
 * Registry mapping shape types to their render functions
 */
const SCROLL_SHAPE_RENDERERS: Record<string, (options: ScrollRendererOptions) => string> = {
  verticalScroll: withCtxAndShape(renderScrollShape),
  horizontalScroll: withCtxAndShape(renderScrollShape),
};

/**
 * Check if a shape type is a scroll shape handled by this module
 */
type IsScrollShapeOptions = {
  shapeType: string | undefined;
};

export function isScrollShape({ shapeType }: IsScrollShapeOptions): boolean {
  return shapeType !== undefined && shapeType in SCROLL_SHAPE_RENDERERS;
}

/**
 * Render a scroll shape
 * @returns SVG string for the shape, or empty string if not a scroll shape
 */
type RenderScrollShapeTypeOptions = {
  shapeType: string;
  ctx: ScrollShapeContext;
};

export function renderScrollShapeType({ shapeType, ctx }: RenderScrollShapeTypeOptions): string {
  const renderer = SCROLL_SHAPE_RENDERERS[shapeType];
  return renderer ? renderer({ ctx, shapeType }) : "";
}
