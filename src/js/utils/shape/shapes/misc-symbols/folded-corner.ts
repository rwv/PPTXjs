/**
 * Folded corner shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

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
