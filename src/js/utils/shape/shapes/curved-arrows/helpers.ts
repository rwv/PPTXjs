import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { CurvedArrowContext } from "./types";

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

export function getShapeAdjustments(node: XmlNode): XmlNode[] {
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  return Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
}
