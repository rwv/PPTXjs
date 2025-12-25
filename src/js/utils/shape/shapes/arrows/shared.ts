/**
 * Shared utilities for arrow shape rendering.
 */

import type { PptxNode } from "../../../../types";

/**
 * Context for rendering arrow shapes
 */
export interface ArrowShapeContext {
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
 * Generate fill attribute string for SVG
 */
export function getFillAttr(ctx: ArrowShapeContext): string {
  const { imgFillFlg, grndFillFlg, shpId, fillColor } = ctx;
  if (imgFillFlg) return `url(#imgPtrn_${shpId})`;
  if (grndFillFlg) return `url(#linGrd_${shpId})`;
  return fillColor;
}

/**
 * Generate stroke attributes string for SVG
 */
export function getStrokeAttrs(ctx: ArrowShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG polygon element
 */
export function createPolygon(points: string, ctx: ArrowShapeContext): string {
  return `<polygon points='${points}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Create SVG path element
 */
export function createPath(d: string, ctx: ArrowShapeContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
