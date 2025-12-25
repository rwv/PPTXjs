/**
 * Ribbon shape renderer (ribbon and ribbon2).
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { RibbonContext } from "./shared";
import { createPath } from "./shared";

/**
 * Render ribbon or ribbon2 shape
 */
export function renderRibbon(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 16667 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  let d_val;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 33333 * slideFactor;
  const cnstVal3 = 75000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const cnstVal5 = 200000 * slideFactor;
  const cnstVal6 = 400000 * slideFactor;
  const hc = w / 2;
  const t = 0;
  const l = 0;
  const b = h;
  const r = w;
  const wd8 = w / 8;
  const wd32 = w / 32;
  let y1, y2, y4, y3, y6;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
  const x10 = r - wd8;
  const dx2 = (w * a2) / cnstVal5;
  const x2 = hc - dx2;
  const x9 = hc + dx2;
  const x3 = x2 + wd32;
  const x8 = x9 - wd32;
  const x5 = x2 + wd8;
  const x6 = x9 - wd8;
  const x4 = x5 - wd32;
  const x7 = x6 + wd32;
  const hR = (h * a1) / cnstVal6;
  if (shapType === "ribbon2") {
    const dy1 = (h * a1) / cnstVal5;
    y1 = b - dy1;
    const dy2 = (h * a1) / cnstVal4;
    y2 = b - dy2;
    y4 = t + dy2;
    y3 = (y4 + b) / 2;
    y6 = b - hR;
    const y7 = y1 - hR;

    d_val =
      "M" +
      l +
      "," +
      b +
      " L" +
      wd8 +
      "," +
      y3 +
      " L" +
      l +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      hR +
      shapeArc(x3, hR, wd32, hR, 180, 270, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      t +
      shapeArc(x8, hR, wd32, hR, 270, 360, false).replace("M", "L") +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      r +
      "," +
      y4 +
      " L" +
      x10 +
      "," +
      y3 +
      " L" +
      r +
      "," +
      b +
      " L" +
      x7 +
      "," +
      b +
      shapeArc(x7, y6, wd32, hR, 90, 270, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      y1 +
      shapeArc(x8, y7, wd32, hR, 90, -90, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      y2 +
      shapeArc(x3, y7, wd32, hR, 270, 90, false).replace("M", "L") +
      " L" +
      x4 +
      "," +
      y1 +
      shapeArc(x4, y6, wd32, hR, 270, 450, false).replace("M", "L") +
      " z" +
      " M" +
      x5 +
      "," +
      y2 +
      " L" +
      x5 +
      "," +
      y6 +
      "M" +
      x6 +
      "," +
      y6 +
      " L" +
      x6 +
      "," +
      y2 +
      "M" +
      x2 +
      "," +
      y7 +
      " L" +
      x2 +
      "," +
      y4 +
      "M" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y7;
  } else if (shapType === "ribbon") {
    y1 = (h * a1) / cnstVal5;
    y2 = (h * a1) / cnstVal4;
    y4 = b - y2;
    y3 = y4 / 2;
    const y5 = b - hR;
    y6 = y2 - hR;
    d_val =
      "M" +
      l +
      "," +
      t +
      " L" +
      x4 +
      "," +
      t +
      shapeArc(x4, hR, wd32, hR, 270, 450, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      y1 +
      shapeArc(x3, y6, wd32, hR, 270, 90, false).replace("M", "L") +
      " L" +
      x8 +
      "," +
      y2 +
      shapeArc(x8, y6, wd32, hR, 90, -90, false).replace("M", "L") +
      " L" +
      x7 +
      "," +
      y1 +
      shapeArc(x7, hR, wd32, hR, 90, 270, false).replace("M", "L") +
      " L" +
      r +
      "," +
      t +
      " L" +
      x10 +
      "," +
      y3 +
      " L" +
      r +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y4 +
      " L" +
      x9 +
      "," +
      y5 +
      shapeArc(x8, y5, wd32, hR, 0, 90, false).replace("M", "L") +
      " L" +
      x3 +
      "," +
      b +
      shapeArc(x3, y5, wd32, hR, 90, 180, false).replace("M", "L") +
      " L" +
      x2 +
      "," +
      y4 +
      " L" +
      l +
      "," +
      y4 +
      " L" +
      wd8 +
      "," +
      y3 +
      " z" +
      " M" +
      x5 +
      "," +
      hR +
      " L" +
      x5 +
      "," +
      y2 +
      "M" +
      x6 +
      "," +
      y2 +
      " L" +
      x6 +
      "," +
      hR +
      "M" +
      x2 +
      "," +
      y4 +
      " L" +
      x2 +
      "," +
      y6 +
      "M" +
      x9 +
      "," +
      y6 +
      " L" +
      x9 +
      "," +
      y4;
  }

  return createPath(d_val, ctx);
}
