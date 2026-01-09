/**
 * Math shape rendering functions.
 *
 * Handles mathematical symbol shapes:
 * - mathDivide, mathEqual, mathMinus
 * - mathMultiply, mathNotEqual, mathPlus
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering math shapes
 */
export interface MathShapeContext {
  node: any;
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
 * List of math shape types handled by this module
 */
export const MATH_SHAPE_TYPES = [
  "mathDivide",
  "mathEqual",
  "mathMinus",
  "mathMultiply",
  "mathNotEqual",
  "mathPlus",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: MathShapeContext): string {
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
function getStrokeAttrs(ctx: MathShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: MathShapeContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Math Shape Renderers
// =============================================================================

/**
 * Render math shapes (mathDivide, mathEqual, mathMinus, mathMultiply, mathNotEqual, mathPlus)
 */
function renderMathShape(ctx: MathShapeContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1, adj1;
  let sAdj2, adj2;
  let sAdj3, adj3;
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
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;
  let dVal = "";
  const hc = w / 2;
  const vc = h / 2;
  const hd2 = h / 2;

  if (shapType === "mathNotEqual") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
      adj2 = (110 * Math.PI) / 180;
      adj3 = 11760 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
      adj2 = ((adj2 / 60000) * Math.PI) / 180;
      adj3 = adj3 * slideFactor;
    }
    const angVal1 = (70 * Math.PI) / 180,
      angVal2 = (110 * Math.PI) / 180;
    const cnstVal4 = 73490 * slideFactor;
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
    const crAng = adj2 < angVal1 ? angVal1 : adj2 > angVal2 ? angVal2 : adj2;
    const a2a1 = a1 * 2;
    const maxAdj3 = cnstVal2 - a2a1;
    const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
    const dy1 = (h * a1) / cnstVal2;
    const dy2 = (h * a3) / cnstVal3;
    const dx1 = (w * cnstVal4) / cnstVal3;
    const x1 = hc - dx1;
    const x8 = hc + dx1;
    const y2 = vc - dy2;
    const y3 = vc + dy2;
    const y1 = y2 - dy1;
    const y4 = y3 + dy1;
    const cadj2 = crAng - Math.PI / 2;
    const xadj2 = hd2 * Math.tan(cadj2);
    const len = Math.sqrt(xadj2 * xadj2 + hd2 * hd2);
    const bhw = (len * dy1) / hd2;
    const bhw2 = bhw / 2;
    const x7 = hc + xadj2 - bhw2;
    const dx67 = (xadj2 * y1) / hd2;
    const x6 = x7 - dx67;
    const dx57 = (xadj2 * y2) / hd2;
    const x5 = x7 - dx57;
    const dx47 = (xadj2 * y3) / hd2;
    const x4 = x7 - dx47;
    const dx37 = (xadj2 * y4) / hd2;
    const x3 = x7 - dx37;
    const dx27 = xadj2 * 2;
    const x2 = x7 - dx27;
    const rx7 = x7 + bhw;
    const rx6 = x6 + bhw;
    const rx5 = x5 + bhw;
    const rx4 = x4 + bhw;
    const rx3 = x3 + bhw;
    const _rx2 = x2 + bhw;
    const dx7 = (dy1 * hd2) / len;
    const rxt = x7 + dx7;
    const lxt = rx7 - dx7;
    const rx = cadj2 > 0 ? rxt : rx7;
    const lx = cadj2 > 0 ? x7 : lxt;
    const dy3 = (dy1 * xadj2) / len;
    const dy4 = -dy3;
    const ry = cadj2 > 0 ? dy3 : 0;
    const ly = cadj2 > 0 ? 0 : dy4;
    const dlx = w - rx;
    const drx = w - lx;
    const dly = h - ry;
    const dry = h - ly;
    const _xC1 = (rx + lx) / 2;
    const _xC2 = (drx + dlx) / 2;
    const _yC1 = (ry + ly) / 2;
    const _yC2 = (y1 + y2) / 2;
    const _yC3 = (y3 + y4) / 2;
    const _yC4 = (dry + dly) / 2;

    dVal =
      "M" +
      x1 +
      "," +
      y1 +
      " L" +
      x6 +
      "," +
      y1 +
      " L" +
      lx +
      "," +
      ly +
      " L" +
      rx +
      "," +
      ry +
      " L" +
      rx6 +
      "," +
      y1 +
      " L" +
      x8 +
      "," +
      y1 +
      " L" +
      x8 +
      "," +
      y2 +
      " L" +
      rx5 +
      "," +
      y2 +
      " L" +
      rx4 +
      "," +
      y3 +
      " L" +
      x8 +
      "," +
      y3 +
      " L" +
      x8 +
      "," +
      y4 +
      " L" +
      rx3 +
      "," +
      y4 +
      " L" +
      drx +
      "," +
      dry +
      " L" +
      dlx +
      "," +
      dly +
      " L" +
      x3 +
      "," +
      y4 +
      " L" +
      x1 +
      "," +
      y4 +
      " L" +
      x1 +
      "," +
      y3 +
      " L" +
      x4 +
      "," +
      y3 +
      " L" +
      x5 +
      "," +
      y2 +
      " L" +
      x1 +
      "," +
      y2 +
      " z";
  } else if (shapType === "mathDivide") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
      adj2 = 5880 * slideFactor;
      adj3 = 11760 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
      adj2 = adj2 * slideFactor;
      adj3 = adj3 * slideFactor;
    }
    const cnstVal4 = 1000 * slideFactor;
    const cnstVal5 = 36745 * slideFactor;
    const cnstVal6 = 73490 * slideFactor;
    const a1 = adj1 < cnstVal4 ? cnstVal4 : adj1 > cnstVal5 ? cnstVal5 : adj1;
    const ma1 = -a1;
    const ma3h = (cnstVal6 + ma1) / 4;
    const ma3w = (cnstVal5 * w) / h;
    const maxAdj3 = ma3h < ma3w ? ma3h : ma3w;
    const a3 = adj3 < cnstVal4 ? cnstVal4 : adj3 > maxAdj3 ? maxAdj3 : adj3;
    const m4a3 = -4 * a3;
    const maxAdj2 = cnstVal6 + m4a3 - a1;
    const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
    const dy1 = (h * a1) / cnstVal3;
    const yg = (h * a2) / cnstVal2;
    const rad = (h * a3) / cnstVal2;
    const dx1 = (w * cnstVal6) / cnstVal3;
    const y3 = vc - dy1;
    const y4 = vc + dy1;
    const a = yg + rad;
    const y2 = y3 - a;
    const y1 = y2 - rad;
    const y5 = h - y1;
    const x1 = hc - dx1;
    const x3 = hc + dx1;
    const _x2 = hc - rad;
    const cd4 = 90,
      c3d4 = 270;
    const cX1 = hc - Math.cos((c3d4 * Math.PI) / 180) * rad;
    const cY1 = y1 - Math.sin((c3d4 * Math.PI) / 180) * rad;
    const cX2 = hc - Math.cos(Math.PI / 2) * rad;
    const cY2 = y5 - Math.sin(Math.PI / 2) * rad;
    dVal =
      "M" +
      hc +
      "," +
      y1 +
      shapeArc(cX1, cY1, rad, rad, c3d4, c3d4 + 360, false).replace("M", "L") +
      " z" +
      " M" +
      hc +
      "," +
      y5 +
      shapeArc(cX2, cY2, rad, rad, cd4, cd4 + 360, false).replace("M", "L") +
      " z" +
      " M" +
      x1 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y4 +
      " L" +
      x1 +
      "," +
      y4 +
      " z";
  } else if (shapType === "mathEqual") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
      adj2 = 11760 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
      adj2 = adj2 * slideFactor;
    }
    const cnstVal5 = 36745 * slideFactor;
    const cnstVal6 = 73490 * slideFactor;
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
    const a2a1 = a1 * 2;
    const mAdj2 = cnstVal2 - a2a1;
    const a2 = adj2 < 0 ? 0 : adj2 > mAdj2 ? mAdj2 : adj2;
    const dy1 = (h * a1) / cnstVal2;
    const dy2 = (h * a2) / cnstVal3;
    const dx1 = (w * cnstVal6) / cnstVal3;
    const y2 = vc - dy2;
    const y3 = vc + dy2;
    const y1 = y2 - dy1;
    const y4 = y3 + dy1;
    const x1 = hc - dx1;
    const x2 = hc + dx1;
    const _yC1 = (y1 + y2) / 2;
    const _yC2 = (y3 + y4) / 2;
    dVal =
      "M" +
      x1 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y2 +
      " L" +
      x1 +
      "," +
      y2 +
      " z" +
      "M" +
      x1 +
      "," +
      y3 +
      " L" +
      x2 +
      "," +
      y3 +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      x1 +
      "," +
      y4 +
      " z";
  } else if (shapType === "mathMinus") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
    }
    const cnstVal6 = 73490 * slideFactor;
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
    const dy1 = (h * a1) / cnstVal3;
    const dx1 = (w * cnstVal6) / cnstVal3;
    const y1 = vc - dy1;
    const y2 = vc + dy1;
    const x1 = hc - dx1;
    const x2 = hc + dx1;

    dVal =
      "M" +
      x1 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y2 +
      " L" +
      x1 +
      "," +
      y2 +
      " z";
  } else if (shapType === "mathMultiply") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
    }
    const cnstVal6 = 51965 * slideFactor;
    const ss = Math.min(w, h);
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
    const th = (ss * a1) / cnstVal2;
    const a = Math.atan(h / w);
    const sa = 1 * Math.sin(a);
    const ca = 1 * Math.cos(a);
    const ta = 1 * Math.tan(a);
    const dl = Math.sqrt(w * w + h * h);
    const rw = (dl * cnstVal6) / cnstVal2;
    const lM = dl - rw;
    const xM = (ca * lM) / 2;
    const yM = (sa * lM) / 2;
    const dxAM = (sa * th) / 2;
    const dyAM = (ca * th) / 2;
    const xA = xM - dxAM;
    const yA = yM + dyAM;
    const xB = xM + dxAM;
    const yB = yM - dyAM;
    const xBC = hc - xB;
    const yBC = xBC * ta;
    const yC = yBC + yB;
    const xD = w - xB;
    const xE = w - xA;
    const yFE = vc - yA;
    const xFE = yFE / ta;
    const xF = xE - xFE;
    const xL = xA + xFE;
    const yG = h - yA;
    const yH = h - yB;
    const yI = h - yC;
    const _xC2 = w - xM;
    const _yC3 = h - yM;

    dVal =
      "M" +
      xA +
      "," +
      yA +
      " L" +
      xB +
      "," +
      yB +
      " L" +
      hc +
      "," +
      yC +
      " L" +
      xD +
      "," +
      yB +
      " L" +
      xE +
      "," +
      yA +
      " L" +
      xF +
      "," +
      vc +
      " L" +
      xE +
      "," +
      yG +
      " L" +
      xD +
      "," +
      yH +
      " L" +
      hc +
      "," +
      yI +
      " L" +
      xB +
      "," +
      yH +
      " L" +
      xA +
      "," +
      yG +
      " L" +
      xL +
      "," +
      vc +
      " z";
  } else if (shapType === "mathPlus") {
    if (shapAdjst_ary === undefined) {
      adj1 = 23520 * slideFactor;
    } else {
      adj1 = adj1 * slideFactor;
    }
    const cnstVal6 = 73490 * slideFactor;
    const ss = Math.min(w, h);
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
    const dx1 = (w * cnstVal6) / cnstVal3;
    const dy1 = (h * cnstVal6) / cnstVal3;
    const dx2 = (ss * a1) / cnstVal3;
    const x1 = hc - dx1;
    const x2 = hc - dx2;
    const x3 = hc + dx2;
    const x4 = hc + dx1;
    const y1 = vc - dy1;
    const y2 = vc - dx2;
    const y3 = vc + dx2;
    const y4 = vc + dy1;

    dVal =
      "M" +
      x1 +
      "," +
      y2 +
      " L" +
      x2 +
      "," +
      y2 +
      " L" +
      x2 +
      "," +
      y1 +
      " L" +
      x3 +
      "," +
      y1 +
      " L" +
      x3 +
      "," +
      y2 +
      " L" +
      x4 +
      "," +
      y2 +
      " L" +
      x4 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y3 +
      " L" +
      x1 +
      "," +
      y3 +
      " z";
  }

  return createPath(dVal, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const MATH_SHAPE_RENDERERS: Record<string, (ctx: MathShapeContext, shapType: string) => string> = {
  mathDivide: renderMathShape,
  mathEqual: renderMathShape,
  mathMinus: renderMathShape,
  mathMultiply: renderMathShape,
  mathNotEqual: renderMathShape,
  mathPlus: renderMathShape,
};

/**
 * Check if a shape type is a math shape handled by this module
 */
export function isMathShape(shapType: string): boolean {
  return shapType in MATH_SHAPE_RENDERERS;
}

/**
 * Render a math shape
 * @returns SVG string for the shape, or empty string if not a math shape
 */
export function renderMathShapeType(shapType: string, ctx: MathShapeContext): string {
  const renderer = MATH_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
