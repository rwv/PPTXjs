import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./types";
import { createPath, getFillAttr, getStrokeAttrs } from "./helpers";

// =============================================================================
// Shape Renderers
// =============================================================================

export function renderCloud(ctx: MiscSymbolContext): string {
  const { w, h } = ctx;
  const x0 = (w * 3900) / 43200,
    x1 = (w * 4693) / 43200,
    x2 = (w * 6928) / 43200,
    x3 = (w * 16478) / 43200,
    x4 = (w * 28827) / 43200,
    x5 = (w * 34129) / 43200,
    x6 = (w * 41798) / 43200,
    x7 = (w * 38324) / 43200,
    x8 = (w * 29078) / 43200,
    x9 = (w * 22141) / 43200,
    x10 = (w * 14000) / 43200,
    x11 = (w * 4127) / 43200;
  const y0 = (h * 14370) / 43200,
    y1 = (h * 26177) / 43200,
    y2 = (h * 34899) / 43200,
    y3 = (h * 39090) / 43200,
    y4 = (h * 34751) / 43200,
    y5 = (h * 22954) / 43200,
    y6 = (h * 15354) / 43200,
    y7 = (h * 5426) / 43200,
    y8 = (h * 3952) / 43200,
    y9 = (h * 4720) / 43200,
    y10 = (h * 5192) / 43200,
    y11 = (h * 15789) / 43200;
  const rX1 = (w * 6753) / 43200,
    rY1 = (h * 9190) / 43200,
    rX2 = (w * 5333) / 43200,
    rY2 = (h * 7267) / 43200,
    rX3 = (w * 4365) / 43200,
    rY3 = (h * 5945) / 43200,
    rX4 = (w * 4857) / 43200,
    rY4 = (h * 6595) / 43200,
    rY5 = (h * 7273) / 43200,
    rX6 = (w * 6775) / 43200,
    rY6 = (h * 9220) / 43200,
    rX7 = (w * 5785) / 43200,
    rY7 = (h * 7867) / 43200,
    rX8 = (w * 6752) / 43200,
    rY8 = (h * 9215) / 43200,
    rX9 = (w * 7720) / 43200,
    rY9 = (h * 10543) / 43200,
    rX10 = (w * 4360) / 43200,
    rY10 = (h * 5918) / 43200,
    rX11 = (w * 4345) / 43200,
    rY11 = (h * 5945) / 43200,
    rX12 = (w * 6928) / 43200,
    rY12 = (h * 9407) / 43200;
  const d =
    shapeArc(x11, y11, rX12, rY12, 122, 180, false) +
    shapeArc(x0, y0, rX11, rY11, 122, 182, false).replace("M", "L") +
    shapeArc(x1, y7, rX10, rY10, 142, 232, false).replace("M", "L") +
    shapeArc(x2, y8, rX9, rY9, 172, 257, false).replace("M", "L") +
    shapeArc(x3, y9, rX8, rY8, 190, 280, false).replace("M", "L") +
    shapeArc(x4, y10, rX7, rY7, 213, 317, false).replace("M", "L") +
    shapeArc(x5, y7, rX6, rY6, 253, 357, false).replace("M", "L") +
    shapeArc(x6, y6, rX4, rY5, 284, 380, false).replace("M", "L") +
    shapeArc(x7, y5, rX4, rY4, 322, 416, false).replace("M", "L") +
    shapeArc(x8, y4, rX3, rY3, 357, 451, false).replace("M", "L") +
    shapeArc(x9, y3, rX2, rY2, 29, 118, false).replace("M", "L") +
    shapeArc(x10, y2, rX1, rY1, 64, 151, false).replace("M", "L") +
    shapeArc(x11, y1, rX12, rY12, 84, 121, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

export function renderSmileyFace(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList<string>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj = 4653 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  const cnstVal1 = 50000 * refr;
  const cnstVal2 = 100000 * refr;
  const cnstVal3 = 4653 * refr;
  const wd2 = w / 2,
    hd2 = h / 2;
  const a = adj < -cnstVal3 ? -cnstVal3 : adj > cnstVal3 ? cnstVal3 : adj;
  const x1 = (w * 4969) / 21699,
    x2 = (w * 6215) / 21600,
    x3 = (w * 13135) / 21600,
    x4 = (w * 16640) / 21600;
  const y1 = (h * 7570) / 21600,
    y3 = (h * 16515) / 21600;
  const dy2 = (h * a) / cnstVal2;
  const y2 = y3 - dy2;
  const y4 = y3 + dy2;
  const dy3 = (h * a) / cnstVal1;
  const y5 = y4 + dy3;
  const wR = (w * 1125) / 21600,
    hR = (h * 1125) / 21600;
  const cX1 = x2 - wR * Math.cos(Math.PI);
  const cY1 = y1 - hR * Math.sin(Math.PI);
  const cX2 = x3 - wR * Math.cos(Math.PI);
  const d_val =
    shapeArc(cX1, cY1, wR, hR, 180, 540, false) +
    shapeArc(cX2, cY1, wR, hR, 180, 540, false) +
    " M" +
    x1 +
    "," +
    y2 +
    " Q" +
    wd2 +
    "," +
    y5 +
    " " +
    x4 +
    "," +
    y2 +
    " Q" +
    wd2 +
    "," +
    y5 +
    " " +
    x1 +
    "," +
    y2 +
    " M0," +
    hd2 +
    shapeArc(wd2, hd2, wd2, hd2, 180, 540, false).replace("M", "L") +
    " z";
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
