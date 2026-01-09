import { getTextByPathList } from "../../../object";
import type { RibbonContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render ellipseRibbon or ellipseRibbon2 shape
 */
export function renderEllipseRibbon(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 12500 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  let d_val;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal3 = 75000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const cnstVal5 = 200000 * slideFactor;
  const hc = w / 2,
    t = 0,
    l = 0,
    b = h,
    r = w,
    wd8 = w / 8;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal4 ? cnstVal4 : adj1;
  const a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
  const q10 = cnstVal4 - a1;
  const q11 = q10 / 2;
  const q12 = a1 - q11;
  const minAdj3 = 0 > q12 ? 0 : q12;
  const a3 = adj3 < minAdj3 ? minAdj3 : adj3 > a1 ? a1 : adj3;
  const dx2 = (w * a2) / cnstVal5;
  const x2 = hc - dx2;
  const x3 = x2 + wd8;
  const x4 = r - x3;
  const x5 = r - x2;
  const x6 = r - wd8;
  const dy1 = (h * a3) / cnstVal4;
  const f1 = (4 * dy1) / w;
  let q1 = (x3 * x3) / w;
  const q2 = x3 - q1;
  const cx1 = x3 / 2;
  const cx2 = r - cx1;
  q1 = (h * a1) / cnstVal4;
  const dy3 = q1 - dy1;
  const q3 = (x2 * x2) / w;
  const q4 = x2 - q3;
  const q5 = f1 * q4;
  const rh = b - q1;
  const q8 = (dy1 * 14) / 16;
  const cx4 = x2 / 2;
  const q9 = f1 * cx4;
  const cx5 = r - cx4;
  if (shapType === "ellipseRibbon") {
    const y1 = f1 * q2;
    const cy1 = f1 * cx1;
    const y3 = q5 + dy3;
    const q6 = dy1 + dy3 - y3;
    const q7 = q6 + dy1;
    const cy3 = q7 + dy3;
    const y2 = (q8 + rh) / 2;
    const y5 = q5 + rh;
    const y6 = y3 + rh;
    const cy4 = q9 + rh;
    const cy6 = cy3 + rh;
    const y7 = y1 + dy3;
    const _cy7 = q1 + q1 - y7;
    const _y8 = b - dy1;
    //
    d_val =
      "M" +
      l +
      "," +
      t +
      " Q" +
      cx1 +
      "," +
      cy1 +
      " " +
      x3 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y3 +
      " Q" +
      hc +
      "," +
      cy3 +
      " " +
      x5 +
      "," +
      y3 +
      " L" +
      x4 +
      "," +
      y1 +
      " Q" +
      cx2 +
      "," +
      cy1 +
      " " +
      r +
      "," +
      t +
      " L" +
      x6 +
      "," +
      y2 +
      " L" +
      r +
      "," +
      rh +
      " Q" +
      cx5 +
      "," +
      cy4 +
      " " +
      x5 +
      "," +
      y5 +
      " L" +
      x5 +
      "," +
      y6 +
      " Q" +
      hc +
      "," +
      cy6 +
      " " +
      x2 +
      "," +
      y6 +
      " L" +
      x2 +
      "," +
      y5 +
      " Q" +
      cx4 +
      "," +
      cy4 +
      " " +
      l +
      "," +
      rh +
      " L" +
      wd8 +
      "," +
      y2 +
      " z" +
      "M" +
      x2 +
      "," +
      y5 +
      " L" +
      x2 +
      "," +
      y3 +
      "M" +
      x5 +
      "," +
      y3 +
      " L" +
      x5 +
      "," +
      y5 +
      "M" +
      x3 +
      "," +
      y1 +
      " L" +
      x3 +
      "," +
      y7 +
      "M" +
      x4 +
      "," +
      y7 +
      " L" +
      x4 +
      "," +
      y1;
  } else if (shapType === "ellipseRibbon2") {
    const u1 = f1 * q2;
    const y1 = b - u1;
    const cu1 = f1 * cx1;
    const cy1 = b - cu1;
    const u3 = q5 + dy3;
    const y3 = b - u3;
    const q6 = dy1 + dy3 - u3;
    const q7 = q6 + dy1;
    const cu3 = q7 + dy3;
    const cy3 = b - cu3;
    const u2 = (q8 + rh) / 2;
    const y2 = b - u2;
    const u5 = q5 + rh;
    const y5 = b - u5;
    const u6 = u3 + rh;
    const y6 = b - u6;
    const cu4 = q9 + rh;
    const cy4 = b - cu4;
    const cu6 = cu3 + rh;
    const cy6 = b - cu6;
    const u7 = u1 + dy3;
    const y7 = b - u7;
    const cu7 = q1 + q1 - u7;
    const _cy7 = b - cu7;
    //
    d_val =
      "M" +
      l +
      "," +
      b +
      " L" +
      wd8 +
      "," +
      y2 +
      " L" +
      l +
      "," +
      q1 +
      " Q" +
      cx4 +
      "," +
      cy4 +
      " " +
      x2 +
      "," +
      y5 +
      " L" +
      x2 +
      "," +
      y6 +
      " Q" +
      hc +
      "," +
      cy6 +
      " " +
      x5 +
      "," +
      y6 +
      " L" +
      x5 +
      "," +
      y5 +
      " Q" +
      cx5 +
      "," +
      cy4 +
      " " +
      r +
      "," +
      q1 +
      " L" +
      x6 +
      "," +
      y2 +
      " L" +
      r +
      "," +
      b +
      " Q" +
      cx2 +
      "," +
      cy1 +
      " " +
      x4 +
      "," +
      y1 +
      " L" +
      x5 +
      "," +
      y3 +
      " Q" +
      hc +
      "," +
      cy3 +
      " " +
      x2 +
      "," +
      y3 +
      " L" +
      x3 +
      "," +
      y1 +
      " Q" +
      cx1 +
      "," +
      cy1 +
      " " +
      l +
      "," +
      b +
      " z" +
      "M" +
      x2 +
      "," +
      y3 +
      " L" +
      x2 +
      "," +
      y5 +
      "M" +
      x5 +
      "," +
      y5 +
      " L" +
      x5 +
      "," +
      y3 +
      "M" +
      x3 +
      "," +
      y7 +
      " L" +
      x3 +
      "," +
      y1 +
      "M" +
      x4 +
      "," +
      y1 +
      " L" +
      x4 +
      "," +
      y7;
  }

  return createPath(d_val, ctx);
}
