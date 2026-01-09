import { getTextByPathList } from "../../../object";
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
export function parseSingleAdj(node: any, defaultVal: number, slideFactor: number): number {
  const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  if (shapAdjst !== undefined) {
    const name = shapAdjst["attrs"]["name"];
    if (name === "adj") {
      return parseInt(shapAdjst["attrs"]["fmla"].substr(4)) * slideFactor;
    }
  }
  return defaultVal * slideFactor;
}

/**
 * Parse multiple adjustment values from shape node
 */
export function parseMultiAdj(
  node: any,
  defaults: { adj: number; hf?: number; vf?: number },
  slideFactor: number
): { adj: number; hf: number; vf: number } {
  let adj = defaults.adj * slideFactor;
  let hf = (defaults.hf ?? 100000) * slideFactor;
  let vf = (defaults.vf ?? 100000) * slideFactor;

  const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  if (shapAdjst !== undefined) {
    Object.keys(shapAdjst).forEach(function (key) {
      const name = shapAdjst[key]["attrs"]["name"];
      if (name === "adj") {
        adj = parseInt(shapAdjst[key]["attrs"]["fmla"].substr(4)) * slideFactor;
      } else if (name === "hf") {
        hf = parseInt(shapAdjst[key]["attrs"]["fmla"].substr(4)) * slideFactor;
      } else if (name === "vf") {
        vf = parseInt(shapAdjst[key]["attrs"]["fmla"].substr(4)) * slideFactor;
      }
    });
  }
  return { adj, hf, vf };
}

/**
 * Clamp value between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}
