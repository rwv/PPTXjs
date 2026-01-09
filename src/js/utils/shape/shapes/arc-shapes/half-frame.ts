import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

export function renderHalfFrame(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    sAdj1_val = 3.5;
  let sAdj2,
    sAdj2_val = 3.5;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  const minWH = Math.min(w, h);
  const maxAdj2 = (cnsVal * w) / minWH;
  let a1, a2;
  if (sAdj2_val < 0) a2 = 0;
  else if (sAdj2_val > maxAdj2) a2 = maxAdj2;
  else a2 = sAdj2_val;
  const x1 = (minWH * a2) / cnsVal;
  const g1 = (h * x1) / w;
  const g2 = h - g1;
  const maxAdj1 = (cnsVal * g2) / minWH;
  if (sAdj1_val < 0) a1 = 0;
  else if (sAdj1_val > maxAdj1) a1 = maxAdj1;
  else a1 = sAdj1_val;
  const y1 = (minWH * a1) / cnsVal;
  const dx2 = (y1 * w) / h;
  const x2 = w - dx2;
  const dy2 = (x1 * h) / w;
  const y2 = h - dy2;
  const d =
    "M0,0" +
    " L" +
    w +
    "," +
    0 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    x1 +
    "," +
    y1 +
    " L" +
    x1 +
    "," +
    y2 +
    " L0," +
    h +
    " z";

  return createPath(d, ctx);
}

/**
 * Render blockArc shape
 */
