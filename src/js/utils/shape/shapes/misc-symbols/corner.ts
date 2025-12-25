/**
 * Corner shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderCorner(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1_val = 50000 * slideFactor;
  let sAdj2_val = 50000 * slideFactor;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  const minWH = Math.min(w, h);
  const maxAdj1 = (cnsVal * h) / minWH;
  const maxAdj2 = (cnsVal * w) / minWH;
  let a1, a2;
  if (sAdj1_val < 0) a1 = 0;
  else if (sAdj1_val > maxAdj1) a1 = maxAdj1;
  else a1 = sAdj1_val;
  if (sAdj2_val < 0) a2 = 0;
  else if (sAdj2_val > maxAdj2) a2 = maxAdj2;
  else a2 = sAdj2_val;
  const x1 = (minWH * a2) / cnsVal;
  const dy1 = (minWH * a1) / cnsVal;
  const y1 = h - dy1;
  const d =
    "M0,0 L" +
    x1 +
    ",0 L" +
    x1 +
    "," +
    y1 +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    w +
    "," +
    h +
    " L0," +
    h +
    " z";
  return createPath(d, ctx);
}
