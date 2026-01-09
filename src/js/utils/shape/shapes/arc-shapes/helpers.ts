import type { ArcShapeContext } from "./types";

/**
 * Generate fill attribute string for SVG path
 */
export function getFillAttr(ctx: ArcShapeContext): string {
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
export function getStrokeAttrs(ctx: ArcShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
export function createPath(d: string, ctx: ArcShapeContext, transform?: string): string {
  const transformAttr = transform ? ` transform='${transform}'` : "";
  return `<path   d='${d}'${transformAttr}  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
