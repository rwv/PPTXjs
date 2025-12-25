/**
 * Plaque shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderPlaque(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 16667 * slideFactor;
  const cnsVal1 = 50000 * slideFactor;
  const cnsVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a1;
  if (adj1 < 0) a1 = 0;
  else if (adj1 > cnsVal1) a1 = cnsVal1;
  else a1 = adj1;
  const x1 = (a1 * Math.min(w, h)) / cnsVal2;
  const x2 = w - x1;
  const y2 = h - x1;
  const d_val =
    "M0," +
    x1 +
    shapeArc(0, 0, x1, x1, 90, 0, false).replace("M", "L") +
    " L" +
    x2 +
    ",0" +
    shapeArc(w, 0, x1, x1, 180, 90, false).replace("M", "L") +
    " L" +
    w +
    "," +
    y2 +
    shapeArc(w, h, x1, x1, 270, 180, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    h +
    shapeArc(0, h, x1, x1, 0, -90, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}
