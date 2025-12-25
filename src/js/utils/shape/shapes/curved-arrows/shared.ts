/**
 * Shared types and utilities for curved arrow shapes
 *
 * This module provides common interfaces and helper functions for:
 * - Directional curved arrows (curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow)
 * - Swoosh arrow (swooshArrow)
 * - Circular arrows (circularArrow, leftCircularArrow)
 */

import type { PptxNode } from "../../../../types";

/**
 * Context for rendering curved arrow shapes
 */
export interface CurvedArrowContext {
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
export function getFillAttr(ctx: CurvedArrowContext): string {
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
export function getStrokeAttrs(ctx: CurvedArrowContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
export function createPath(d: string, ctx: CurvedArrowContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
