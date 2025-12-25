/**
 * Bevel shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

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
