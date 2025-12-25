/**
 * Shared utilities for callout shape rendering.
 */

import type { PptxNode } from "../../../../types";

/**
 * Context for rendering callout shapes
 */
export interface CalloutContext {
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
 * Generate fill attribute string for SVG path
 */
export function getFillAttr(ctx: CalloutContext): string {
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
export function getStrokeAttrs(ctx: CalloutContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
export function createPath(d: string, ctx: CalloutContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
