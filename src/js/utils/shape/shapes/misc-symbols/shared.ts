/**
 * Shared utilities for misc symbol shape rendering.
 */

import type { PptxNode } from "../../../../types";

/**
 * Context for rendering misc symbol shapes
 */
export interface MiscSymbolContext {
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
  setTxtRotate?: (angle: number) => void;
}

/**
 * Generate fill attribute string for SVG
 */
export function getFillAttr(ctx: MiscSymbolContext): string {
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
export function getStrokeAttrs(ctx: MiscSymbolContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element
 */
export function createPath(d: string, ctx: MiscSymbolContext, transform?: string): string {
  const transformAttr = transform ? ` transform='${transform}'` : "";
  return `<path   d='${d}'${transformAttr}  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
