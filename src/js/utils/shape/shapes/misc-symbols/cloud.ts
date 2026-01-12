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
    shapeArc({ cX: x11, cY: y11, rX: rX12, rY: rY12, stAng: 122, endAng: 180, isClose: false }) +
    shapeArc({
      cX: x0,
      cY: y0,
      rX: rX11,
      rY: rY11,
      stAng: 122,
      endAng: 182,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: x1,
      cY: y7,
      rX: rX10,
      rY: rY10,
      stAng: 142,
      endAng: 232,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({ cX: x2, cY: y8, rX: rX9, rY: rY9, stAng: 172, endAng: 257, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x3, cY: y9, rX: rX8, rY: rY8, stAng: 190, endAng: 280, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({
      cX: x4,
      cY: y10,
      rX: rX7,
      rY: rY7,
      stAng: 213,
      endAng: 317,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({ cX: x5, cY: y7, rX: rX6, rY: rY6, stAng: 253, endAng: 357, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x6, cY: y6, rX: rX4, rY: rY5, stAng: 284, endAng: 380, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x7, cY: y5, rX: rX4, rY: rY4, stAng: 322, endAng: 416, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x8, cY: y4, rX: rX3, rY: rY3, stAng: 357, endAng: 451, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x9, cY: y3, rX: rX2, rY: rY2, stAng: 29, endAng: 118, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({ cX: x10, cY: y2, rX: rX1, rY: rY1, stAng: 64, endAng: 151, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({
      cX: x11,
      cY: y1,
      rX: rX12,
      rY: rY12,
      stAng: 84,
      endAng: 121,
      isClose: false,
    }).replace("M", "L") +
    " z";
  return createPath({ d, ctx });
}

export function renderSmileyFace(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
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
    shapeArc({ cX: cX1, cY: cY1, rX: wR, rY: hR, stAng: 180, endAng: 540, isClose: false }) +
    shapeArc({ cX: cX2, cY: cY1, rX: wR, rY: hR, stAng: 180, endAng: 540, isClose: false }) +
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
    shapeArc({
      cX: wd2,
      cY: hd2,
      rX: wd2,
      rY: hd2,
      stAng: 180,
      endAng: 540,
      isClose: false,
    }).replace("M", "L") +
    " z";
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
