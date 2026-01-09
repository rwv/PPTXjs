import { getTextByPathList } from "../../../object";
import type { MathShapeContext } from "./types";

export interface MathShapeAdjustments {
  hasAdjustments: boolean;
  adj1?: number;
  adj2?: number;
  adj3?: number;
}

export function getMathShapeAdjustments(node: any): MathShapeAdjustments {
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1;
  let adj1;
  let sAdj2;
  let adj2;
  let sAdj3;
  let adj3;

  if (shapAdjst_ary !== undefined) {
    if (shapAdjst_ary.constructor === Array) {
      for (let i = 0; i < shapAdjst_ary.length; i++) {
        const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
        if (sAdj_name === "adj1") {
          sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj1 = parseInt(sAdj1.substr(4));
        } else if (sAdj_name === "adj2") {
          sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj2 = parseInt(sAdj2.substr(4));
        } else if (sAdj_name === "adj3") {
          sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
          adj3 = parseInt(sAdj3.substr(4));
        }
      }
    } else {
      sAdj1 = getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]);
      adj1 = parseInt(sAdj1.substr(4));
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
