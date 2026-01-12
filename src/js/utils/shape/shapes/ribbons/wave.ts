import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { RibbonContext } from "./types";
import { createPath } from "./helpers";

const getShapeAdjustments = (node: XmlNode): XmlNode[] => {
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  return Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
};

/**
 * Render wave or doubleWave shape
 */
export function renderWave(ctx: RibbonContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let adj1 = shapType === "doubleWave" ? 6250 * slideFactor : 12500 * slideFactor;
  let adj2 = 0;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  let d_val;
  const cnstVal2 = -10000 * slideFactor;
  const cnstVal3 = 50000 * slideFactor;
  const cnstVal4 = 100000 * slideFactor;
  const l = 0;
  const b = h;
  const r = w;
  if (shapType === "doubleWave") {
    const cnstVal1 = 12500 * slideFactor;
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
    const a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
    const y1 = (h * a1) / cnstVal4;
    const dy2 = (y1 * 10) / 3;
    const y2 = y1 - dy2;
    const y3 = y1 + dy2;
    const y4 = b - y1;
    const y5 = y4 - dy2;
    const y6 = y4 + dy2;
    const of2 = (w * a2) / cnstVal3;
    const dx2 = of2 > 0 ? 0 : of2;
    const x2 = l - dx2;
    const dx8 = of2 > 0 ? of2 : 0;
    const x8 = r - dx8;
    const dx3 = (dx2 + x8) / 6;
    const x3 = x2 + dx3;
    const dx4 = (dx2 + x8) / 3;
    const x4 = x2 + dx4;
    const x5 = (x2 + x8) / 2;
    const x6 = x5 + dx3;
    const x7 = (x6 + x8) / 2;
    const x9 = l + dx8;
    const x15 = r + dx2;
    const x10 = x9 + dx3;
    const x11 = x9 + dx4;
    const x12 = (x9 + x15) / 2;
    const x13 = x12 + dx3;
    const x14 = (x13 + x15) / 2;

    d_val =
      "M" +
      x2 +
      "," +
      y1 +
      " C" +
      x3 +
      "," +
      y2 +
      " " +
      x4 +
      "," +
      y3 +
      " " +
      x5 +
      "," +
      y1 +
      " C" +
      x6 +
      "," +
      y2 +
      " " +
      x7 +
      "," +
      y3 +
      " " +
      x8 +
      "," +
      y1 +
      " L" +
      x15 +
      "," +
      y4 +
      " C" +
      x14 +
      "," +
      y6 +
      " " +
      x13 +
      "," +
      y5 +
      " " +
      x12 +
      "," +
      y4 +
      " C" +
      x11 +
      "," +
      y6 +
      " " +
      x10 +
      "," +
      y5 +
      " " +
      x9 +
      "," +
      y4 +
      " z";
  } else if (shapType === "wave") {
    const cnstVal5 = 20000 * slideFactor;
    const a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
    const a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
    const y1 = (h * a1) / cnstVal4;
    const dy2 = (y1 * 10) / 3;
    const y2 = y1 - dy2;
    const y3 = y1 + dy2;
    const y4 = b - y1;
    const y5 = y4 - dy2;
    const y6 = y4 + dy2;
    const of2 = (w * a2) / cnstVal3;
    const dx2 = of2 > 0 ? 0 : of2;
    const x2 = l - dx2;
    const dx5 = of2 > 0 ? of2 : 0;
    const x5 = r - dx5;
    const dx3 = (dx2 + x5) / 3;
    const x3 = x2 + dx3;
    const x4 = (x3 + x5) / 2;
    const x6 = l + dx5;
    const x10 = r + dx2;
    const x7 = x6 + dx3;
    const x8 = (x7 + x10) / 2;

    d_val =
      "M" +
      x2 +
      "," +
      y1 +
      " C" +
      x3 +
      "," +
      y2 +
      " " +
      x4 +
      "," +
      y3 +
      " " +
      x5 +
      "," +
      y1 +
      " L" +
      x10 +
      "," +
      y4 +
      " C" +
      x8 +
      "," +
      y6 +
      " " +
      x7 +
      "," +
      y5 +
      " " +
      x6 +
      "," +
      y4 +
      " z";
  }

  return createPath(d_val, ctx);
}
