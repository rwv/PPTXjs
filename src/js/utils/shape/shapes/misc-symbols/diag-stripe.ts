/**
 * Diagonal stripe shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderDiagStripe(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let sAdj1_val = 50000 * slideFactor;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    sAdj1_val = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  let a1;
  if (sAdj1_val < 0) a1 = 0;
  else if (sAdj1_val > cnsVal) a1 = cnsVal;
  else a1 = sAdj1_val;
  const x2 = (w * a1) / cnsVal;
  const y2 = (h * a1) / cnsVal;
  const d = "M0," + y2 + " L" + x2 + ",0 L" + w + ",0 L0," + h + " z";
  return createPath(d, ctx);
}
