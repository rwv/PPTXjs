/**
 * Smiley face shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

export function renderSmileyFace(ctx: MiscSymbolContext): string {
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
  let adj = 4653 * refr;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * refr;
  }
  const cnstVal1 = 50000 * refr;
  const cnstVal2 = 100000 * refr;
  const cnstVal3 = 4653 * refr;
  const _ss = Math.min(w, h);
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
