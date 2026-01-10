import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./types";
import { getFillAttr, getStrokeAttrs } from "./helpers";

// =============================================================================
// Shape Renderers
// =============================================================================

export function renderHeart(ctx: MiscSymbolContext): string {
  const { w, h } = ctx;
  const dx1 = (w * 49) / 48,
    dx2 = (w * 10) / 48,
    x1 = w / 2 - dx1,
    x2 = w / 2 - dx2,
    x3 = w / 2 + dx2,
    x4 = w / 2 + dx1,
    y1 = -h / 3;
  const d_val =
    "M" +
    w / 2 +
    "," +
    h / 4 +
    "C" +
    x3 +
    "," +
    y1 +
    " " +
    x4 +
    "," +
    h / 4 +
    " " +
    w / 2 +
    "," +
    h +
    "C" +
    x1 +
    "," +
    h / 4 +
    " " +
    x2 +
    "," +
    y1 +
    " " +
    w / 2 +
    "," +
    h / 4 +
    " z";
  return `<path   d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

export function renderLightningBolt(ctx: MiscSymbolContext): string {
  const { w, h } = ctx;
  const x1 = (w * 5022) / 21600,
    x2 = (w * 11050) / 21600,
    x3 = (w * 8472) / 21600,
    x5 = (w * 10012) / 21600,
    x6 = (w * 14767) / 21600,
    x7 = (w * 12222) / 21600,
    x8 = (w * 12860) / 21600,
    x10 = (w * 7602) / 21600,
    x11 = (w * 16577) / 21600,
    y1 = (h * 3890) / 21600,
    y2 = (h * 6080) / 21600,
    y3 = (h * 6797) / 21600,
    y5 = (h * 12877) / 21600,
    y6 = (h * 9705) / 21600,
    y7 = (h * 12007) / 21600,
    y8 = (h * 13987) / 21600,
    y9 = (h * 8382) / 21600,
    y11 = (h * 14915) / 21600;
  const d_val =
    "M" +
    x3 +
    ",0 L" +
    x8 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y3 +
    " L" +
    x11 +
    "," +
    y7 +
    " L" +
    x6 +
    "," +
    y5 +
    " L" +
    w +
    "," +
    h +
    " L" +
    x5 +
    "," +
    y11 +
    " L" +
    x7 +
    "," +
    y8 +
    " L" +
    x1 +
    "," +
    y6 +
    " L" +
    x10 +
    "," +
    y9 +
    " L0," +
    y1 +
    " z";
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

export function renderCube(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj = 25000 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  const cnstVal2 = 100000 * refr;
  const ss = Math.min(w, h);
  const a = adj < 0 ? 0 : adj > cnstVal2 ? cnstVal2 : adj;
  const y1 = (ss * a) / cnstVal2;
  const y4 = h - y1;
  const x4 = w - y1;
  const d_val =
    "M0," +
    y1 +
    " L" +
    y1 +
    ",0 L" +
    w +
    ",0 L" +
    w +
    "," +
    y4 +
    " L" +
    x4 +
    "," +
    h +
    " L0," +
    h +
    " z" +
    "M0," +
    y1 +
    " L" +
    x4 +
    "," +
    y1 +
    " M" +
    x4 +
    "," +
    y1 +
    " L" +
    w +
    ",0" +
    "M" +
    x4 +
    "," +
    y1 +
    " L" +
    x4 +
    "," +
    h;
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

export function renderBevel(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj = 12500 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  const cnstVal1 = 50000 * refr;
  const cnstVal2 = 100000 * refr;
  const ss = Math.min(w, h);
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const x1 = (ss * a) / cnstVal2;
  const x2 = w - x1;
  const y2 = h - x1;
  const d_val =
    "M0,0 L" +
    w +
    ",0 L" +
    w +
    "," +
    h +
    " L0," +
    h +
    " z" +
    " M" +
    x1 +
    "," +
    x1 +
    " L" +
    x2 +
    "," +
    x1 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    y2 +
    " z" +
    " M0,0 L" +
    x1 +
    "," +
    x1 +
    " M0," +
    h +
    " L" +
    x1 +
    "," +
    y2 +
    " M" +
    w +
    ",0 L" +
    x2 +
    "," +
    x1 +
    " M" +
    w +
    "," +
    h +
    " L" +
    x2 +
    "," +
    y2;
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

export function renderFoldedCorner(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj = 16667 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  const cnstVal1 = 50000 * refr;
  const cnstVal2 = 100000 * refr;
  const ss = Math.min(w, h);
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const dy2 = (ss * a) / cnstVal2;
  const dy1 = dy2 / 5;
  const x1 = w - dy2;
  const x2 = x1 + dy1;
  const y2 = h - dy2;
  const y1 = y2 + dy1;
  const d_val =
    "M" +
    x1 +
    "," +
    h +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    x1 +
    "," +
    h +
    " L0," +
    h +
    " L0,0 L" +
    w +
    ",0 L" +
    w +
    "," +
    y2;
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
