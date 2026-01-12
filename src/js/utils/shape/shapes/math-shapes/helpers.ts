import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { MathShapeContext } from "./types";

export interface MathShapeAdjustments {
  hasAdjustments: boolean;
  adj1?: number;
  adj2?: number;
  adj3?: number;
}

export function getMathShapeAdjustments(node: XmlNode): MathShapeAdjustments {
  const shapAdjst_ary = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  let adj1: number | undefined;
  let adj2: number | undefined;
  let adj3: number | undefined;

  if (shapAdjst_ary !== undefined) {
    if (Array.isArray(shapAdjst_ary)) {
      for (let i = 0; i < shapAdjst_ary.length; i++) {
        const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
        if (sAdj_name === "adj1") {
          const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
          if (sAdj1 !== undefined) {
            adj1 = parseInt(sAdj1.substr(4));
          }
        } else if (sAdj_name === "adj2") {
          const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
          if (sAdj2 !== undefined) {
            adj2 = parseInt(sAdj2.substr(4));
          }
        } else if (sAdj_name === "adj3") {
          const sAdj3 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
          if (sAdj3 !== undefined) {
            adj3 = parseInt(sAdj3.substr(4));
          }
        }
      }
    } else {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary, ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4));
      }
    }
  }

  return {
    hasAdjustments: shapAdjst_ary !== undefined,
    adj1,
    adj2,
    adj3,
  };
}

/**
 * Generate fill attribute string for SVG path
 */
export function getFillAttr(ctx: MathShapeContext): string {
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
export function getStrokeAttrs(ctx: MathShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
export function createPath(d: string, ctx: MathShapeContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
