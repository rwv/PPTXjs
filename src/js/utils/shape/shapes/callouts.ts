/**
 * Callout shape rendering functions.
 *
 * Handles callout shapes:
 * - wedgeEllipseCallout, wedgeRectCallout, wedgeRoundRectCallout
 * - borderCallout1/2/3, callout1/2/3
 * - accentBorderCallout1/2/3, accentCallout1/2/3
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering callout shapes
 */
export interface CalloutContext {
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
 * List of callout shape types handled by this module
 */
export const CALLOUT_SHAPE_TYPES = [
  "wedgeEllipseCallout",
  "wedgeRectCallout",
  "wedgeRoundRectCallout",
  "accentBorderCallout1",
  "accentBorderCallout2",
  "accentBorderCallout3",
  "borderCallout1",
  "borderCallout2",
  "borderCallout3",
  "accentCallout1",
  "accentCallout2",
  "accentCallout3",
  "callout1",
  "callout2",
  "callout3",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: CalloutContext): string {
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
function getStrokeAttrs(ctx: CalloutContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: CalloutContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Callout Shape Renderers
// =============================================================================

/**
 * Render wedgeEllipseCallout shape
 */
function renderWedgeEllipseCallout(ctx: CalloutContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const angVal1 = (11 * Math.PI) / 180;
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const sdx = dxPos * h;
  const sdy = dyPos * w;
  const pang = Math.atan(sdy / sdx);
  const stAng = pang + angVal1;
  const enAng = pang - angVal1;
  console.log("dxPos: ", dxPos, "dyPos: ", dyPos);
  const dx1 = hc * Math.cos(stAng);
  const dy1 = vc * Math.sin(stAng);
  const dx2 = hc * Math.cos(enAng);
  const dy2 = vc * Math.sin(enAng);
  let x1;
  let y1;
  let x2;
  let y2;
  if (dxPos >= 0) {
    x1 = hc + dx1;
    y1 = vc + dy1;
    x2 = hc + dx2;
    y2 = vc + dy2;
  } else {
    x1 = hc - dx1;
    y1 = vc - dy1;
    x2 = hc - dx2;
    y2 = vc - dy2;
  }
  const d_val =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    xPos +
    "," +
    yPos +
    " L" +
    x2 +
    "," +
    y2 +
    shapeArc(hc, vc, hc, vc, 0, 360, true);

  return createPath(d_val, ctx);
}

/**
 * Render wedgeRectCallout shape
 */
function renderWedgeRectCallout(ctx: CalloutContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const dq = (dxPos * h) / w;
  const ady = Math.abs(dyPos);
  const adq = Math.abs(dq);
  const dz = ady - adq;
  const xg1 = dxPos > 0 ? 7 : 2;
  const xg2 = dxPos > 0 ? 10 : 5;
  const x1 = (w * xg1) / 12;
  const x2 = (w * xg2) / 12;
  const yg1 = dyPos > 0 ? 7 : 2;
  const yg2 = dyPos > 0 ? 10 : 5;
  const y1 = (h * yg1) / 12;
  const y2 = (h * yg2) / 12;
  const t1 = dxPos > 0 ? 0 : xPos;
  const xl = dz > 0 ? 0 : t1;
  const t2 = dyPos > 0 ? x1 : xPos;
  const xt = dz > 0 ? t2 : x1;
  const t3 = dxPos > 0 ? xPos : w;
  const xr = dz > 0 ? w : t3;
  const t4 = dyPos > 0 ? xPos : x1;
  const xb = dz > 0 ? t4 : x1;
  const t5 = dxPos > 0 ? y1 : yPos;
  const yl = dz > 0 ? y1 : t5;
  const t6 = dyPos > 0 ? 0 : yPos;
  const yt = dz > 0 ? t6 : 0;
  const t7 = dxPos > 0 ? yPos : y1;
  const yr = dz > 0 ? y1 : t7;
  const t8 = dyPos > 0 ? yPos : h;
  const yb = dz > 0 ? t8 : h;

  const d_val =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    xt +
    "," +
    yt +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    xr +
    "," +
    yr +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    w +
    "," +
    h +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    xb +
    "," +
    yb +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " L" +
    0 +
    "," +
    y2 +
    " L" +
    xl +
    "," +
    yl +
    " L" +
    0 +
    "," +
    y1 +
    " z";

  return createPath(d_val, ctx);
}

/**
 * Render wedgeRoundRectCallout shape
 */
function renderWedgeRoundRectCallout(ctx: CalloutContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  let sAdj3,
    adj3 = 16667 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const ss = Math.min(w, h);
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const dq = (dxPos * h) / w;
  const ady = Math.abs(dyPos);
  const adq = Math.abs(dq);
  const dz = ady - adq;
  const xg1 = dxPos > 0 ? 7 : 2;
  const xg2 = dxPos > 0 ? 10 : 5;
  const x1 = (w * xg1) / 12;
  const x2 = (w * xg2) / 12;
  const yg1 = dyPos > 0 ? 7 : 2;
  const yg2 = dyPos > 0 ? 10 : 5;
  const y1 = (h * yg1) / 12;
  const y2 = (h * yg2) / 12;
  const t1 = dxPos > 0 ? 0 : xPos;
  const xl = dz > 0 ? 0 : t1;
  const t2 = dyPos > 0 ? x1 : xPos;
  const xt = dz > 0 ? t2 : x1;
  const t3 = dxPos > 0 ? xPos : w;
  const xr = dz > 0 ? w : t3;
  const t4 = dyPos > 0 ? xPos : x1;
  const xb = dz > 0 ? t4 : x1;
  const t5 = dxPos > 0 ? y1 : yPos;
  const yl = dz > 0 ? y1 : t5;
  const t6 = dyPos > 0 ? 0 : yPos;
  const yt = dz > 0 ? t6 : 0;
  const t7 = dxPos > 0 ? yPos : y1;
  const yr = dz > 0 ? y1 : t7;
  const t8 = dyPos > 0 ? yPos : h;
  const yb = dz > 0 ? t8 : h;
  const u1 = (ss * adj3) / cnstVal1;
  const u2 = w - u1;
  const v2 = h - u1;
  const d_val =
    "M" +
    0 +
    "," +
    u1 +
    shapeArc(u1, u1, u1, u1, 180, 270, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    xt +
    "," +
    yt +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    u2 +
    "," +
    0 +
    shapeArc(u2, u1, u1, u1, 270, 360, false).replace("M", "L") +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    xr +
    "," +
    yr +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    w +
    "," +
    v2 +
    shapeArc(u2, v2, u1, u1, 0, 90, false).replace("M", "L") +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    xb +
    "," +
    yb +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    u1 +
    "," +
    h +
    shapeArc(u1, v2, u1, u1, 90, 180, false).replace("M", "L") +
    " L" +
    0 +
    "," +
    y2 +
    " L" +
    xl +
    "," +
    yl +
    " L" +
    0 +
    "," +
    y1 +
    " z";

  return createPath(d_val, ctx);
}

/**
 * Render border/accent callout shapes (1, 2, 3 variants)
 */
function renderBorderAccentCallout(ctx: CalloutContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = 18750 * refr;
  let sAdj2,
    adj2 = -8333 * refr;
  let sAdj3,
    adj3 = 18750 * refr;
  let sAdj4,
    adj4 = -16667 * refr;
  let sAdj5,
    adj5 = 100000 * refr;
  let sAdj6,
    adj6 = -16667 * refr;
  let sAdj7,
    adj7 = 112963 * refr;
  let sAdj8,
    adj8 = -8333 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      } else if (sAdj_name === "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * refr;
      } else if (sAdj_name === "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * refr;
      } else if (sAdj_name === "adj6") {
        sAdj6 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj6 = parseInt(sAdj6.substr(4)) * refr;
      } else if (sAdj_name === "adj7") {
        sAdj7 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj7 = parseInt(sAdj7.substr(4)) * refr;
      } else if (sAdj_name === "adj8") {
        sAdj8 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj8 = parseInt(sAdj8.substr(4)) * refr;
      }
    }
  }
  let d_val;
  const cnstVal1 = 100000 * refr;

  switch (shapType) {
    case "borderCallout1":
    case "callout1": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2;
      break;
    }
    case "borderCallout2":
    case "callout2": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2;

      break;
    }
    case "borderCallout3":
    case "callout3": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 100000 * refr;
        adj6 = -16667 * refr;

        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      const y4 = (h * adj7) / cnstVal1;
      const x4 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x4 +
        "," +
        y4 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2;
      break;
    }
    case "accentBorderCallout1":
    case "accentCallout1": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;
      break;
    }
    case "accentBorderCallout2":
    case "accentCallout2": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;

      break;
    }
    case "accentBorderCallout3":
    case "accentCallout3": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 100000 * refr;
        adj6 = -16667 * refr;
        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      const y4 = (h * adj7) / cnstVal1;
      const x4 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x4 +
        "," +
        y4 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;
      break;
    }
    default:
      d_val = "";
  }

  return createPath(d_val, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const CALLOUT_RENDERERS: Record<string, (ctx: CalloutContext, shapType: string) => string> = {
  wedgeEllipseCallout: (ctx) => renderWedgeEllipseCallout(ctx),
  wedgeRectCallout: (ctx) => renderWedgeRectCallout(ctx),
  wedgeRoundRectCallout: (ctx) => renderWedgeRoundRectCallout(ctx),
  accentBorderCallout1: renderBorderAccentCallout,
  accentBorderCallout2: renderBorderAccentCallout,
  accentBorderCallout3: renderBorderAccentCallout,
  borderCallout1: renderBorderAccentCallout,
  borderCallout2: renderBorderAccentCallout,
  borderCallout3: renderBorderAccentCallout,
  accentCallout1: renderBorderAccentCallout,
  accentCallout2: renderBorderAccentCallout,
  accentCallout3: renderBorderAccentCallout,
  callout1: renderBorderAccentCallout,
  callout2: renderBorderAccentCallout,
  callout3: renderBorderAccentCallout,
};

/**
 * Check if a shape type is a callout shape handled by this module
 */
export function isCalloutShape(shapType: string): boolean {
  return shapType in CALLOUT_RENDERERS;
}

/**
 * Render a callout shape
 * @returns SVG string for the shape, or empty string if not a callout shape
 */
export function renderCalloutShape(shapType: string, ctx: CalloutContext): string {
  const renderer = CALLOUT_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
