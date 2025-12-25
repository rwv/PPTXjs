/**
 * Teardrop shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderTeardrop(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 100000 * slideFactor;
  const cnsVal1 = adj1;
  const cnsVal2 = 200000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a1;
  if (adj1 < 0) a1 = 0;
  else if (adj1 > cnsVal2) a1 = cnsVal2;
  else a1 = adj1;
  const r2 = Math.sqrt(2);
  const tw = r2 * (w / 2);
  const th = r2 * (h / 2);
  const sw = (tw * a1) / cnsVal1;
  const sh = (th * a1) / cnsVal1;
  const rd45 = (45 * Math.PI) / 180;
  const dx1 = sw * Math.cos(rd45);
  const dy1 = sh * Math.cos(rd45);
  const x1 = w / 2 + dx1;
  const y1 = h / 2 - dy1;
  const x2 = (w / 2 + x1) / 2;
  const y2 = (h / 2 + y1) / 2;
  const d_val =
    shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false) +
    "Q " +
    x2 +
    ",0 " +
    x1 +
    "," +
    y1 +
    "Q " +
    w +
    "," +
    y2 +
    " " +
    w +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}
