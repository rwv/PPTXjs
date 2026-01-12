import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { StarShapeContext } from "./types";

/**
 * Generate fill attribute string for SVG path
 */
export function getFillAttr(ctx: StarShapeContext): string {
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
export function getStrokeAttrs(ctx: StarShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
export function createPath(d: string, ctx: StarShapeContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Parse single adjustment value from shape node
 */
export function parseSingleAdj(node: XmlNode, defaultVal: number, slideFactor: number): number {
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const name = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "name"] });
    if (name === "adj") {
      const fmla = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (fmla !== undefined) {
        return parseInt(fmla.substr(4)) * slideFactor;
      }
    }
  }
  return defaultVal * slideFactor;
}

/**
 * Parse multiple adjustment values from shape node
 */
export function parseMultiAdj(
  node: XmlNode,
  defaults: { adj: number; hf?: number; vf?: number },
  slideFactor: number
): { adj: number; hf: number; vf: number } {
  let adj = defaults.adj * slideFactor;
  let hf = (defaults.hf ?? 100000) * slideFactor;
  let vf = (defaults.vf ?? 100000) * slideFactor;

  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const name = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "name"] });
    const fmla = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
    if (fmla === undefined) {
      continue;
    }
    if (name === "adj") {
      adj = parseInt(fmla.substr(4)) * slideFactor;
    } else if (name === "hf") {
      hf = parseInt(fmla.substr(4)) * slideFactor;
    } else if (name === "vf") {
      vf = parseInt(fmla.substr(4)) * slideFactor;
    }
  }
  return { adj, hf, vf };
}

/**
 * Clamp value between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}
