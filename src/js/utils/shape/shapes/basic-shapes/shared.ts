/**
 * Shared utilities for basic shape rendering.
 */

import type { PptxNode } from "../../../../types";

export interface BasicShapeParams {
  node: PptxNode;
  w: number;
  h: number;
  shpId: string | number;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: any;
}

/**
 * Get fill attribute value
 */
export function getFillAttr(params: BasicShapeParams): string {
  const { imgFillFlg, grndFillFlg, shpId, fillColor } = params;
  if (imgFillFlg) {
    return `url(#imgPtrn_${shpId})`;
  }
  if (grndFillFlg) {
    return `url(#linGrd_${shpId})`;
  }
  return fillColor;
}
