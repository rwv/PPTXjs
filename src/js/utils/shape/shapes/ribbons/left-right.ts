import { shapeArc } from "../helpers/arc";
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
 * Render leftRightRibbon shape
 */
export function renderLeftRightRibbon(ctx: RibbonContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  const refr = slideFactor;
  let adj1 = 50000 * refr;
  let adj2 = 50000 * refr;
  let adj3 = 16667 * refr;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj3") {
      const sAdj3 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 33333 * refr;
  const cnstVal2 = 100000 * refr;
  const cnstVal3 = 200000 * refr;
  const cnstVal4 = 400000 * refr;
  const ss = Math.min(w, h);
  const wd32 = w / 32;
  const vc = h / 2;
  const hc = w / 2;
  const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
  const maxAdj1 = cnstVal2 - a3;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const w1 = hc - wd32;
  const maxAdj2 = (cnstVal2 * w1) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const x1 = (ss * a2) / cnstVal2;
  const x4 = w - x1;
  const dy1 = (h * a1) / cnstVal3;
  const dy2 = (h * a3) / -cnstVal3;
  const ly1 = vc + dy2 - dy1;
  const ry4 = vc + dy1 - dy2;
  const ly2 = ly1 + dy1;
  const ry3 = h - ly2;
  const ly4 = ly2 * 2;
  const ry1 = h - ly4;
  const ly3 = ly4 - ly1;
  const ry2 = h - ly3;
  const hR = (a3 * ss) / cnstVal4;
  const x2 = hc - wd32;
  const x3 = hc + wd32;
  const y1 = ly1 + hR;
  const y2 = ry2 - hR;

  const d_val =
    "M" +
    0 +
    "," +
    ly2 +
    "L" +
    x1 +
    "," +
    0 +
    "L" +
    x1 +
    "," +
    ly1 +
    "L" +
    hc +
    "," +
    ly1 +
    shapeArc(hc, y1, wd32, hR, 270, 450, false).replace("M", "L") +
    shapeArc(hc, y2, wd32, hR, 270, 90, false).replace("M", "L") +
    "L" +
    x4 +
    "," +
    ry2 +
    "L" +
    x4 +
    "," +
    ry1 +
    "L" +
    w +
    "," +
    ry3 +
    "L" +
    x4 +
    "," +
    h +
    "L" +
    x4 +
    "," +
    ry4 +
    "L" +
    hc +
    "," +
    ry4 +
    shapeArc(hc, ry4 - hR, wd32, hR, 90, 180, false).replace("M", "L") +
    "L" +
    x2 +
    "," +
    ly3 +
    "L" +
    x1 +
    "," +
    ly3 +
    "L" +
    x1 +
    "," +
    ly4 +
    " z" +
    "M" +
    x3 +
    "," +
    y1 +
    "L" +
    x3 +
    "," +
    ry2 +
    "M" +
    x2 +
    "," +
    y2 +
    "L" +
    x2 +
    "," +
    ly3;

  return createPath(d_val, ctx);
}
