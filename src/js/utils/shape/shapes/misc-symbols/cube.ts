/**
 * Cube shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

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
