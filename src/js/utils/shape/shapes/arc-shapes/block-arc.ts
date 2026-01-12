import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

type ArcRenderOptions = {
  ctx: ArcShapeContext;
  shapeType: string;
};

export function renderBlockArc({ ctx }: ArcRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let adj1 = 180;
  let adj2 = 0;
  let adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) / 60000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) / 60000;
      }
    } else if (sAdj_name === "adj3") {
      const sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  const cd1 = 360;
  const stAng = adj1 < 0 ? 0 : adj1 > cd1 ? cd1 : adj1;
  const istAng = adj2 < 0 ? 0 : adj2 > cd1 ? cd1 : adj2;
  const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
  const sw11 = istAng - stAng;
  const sw12 = sw11 + cd1;
  const swAng = sw11 > 0 ? sw11 : sw12;
  const iswAng = -swAng;

  const endAng = stAng + swAng;
  const iendAng = istAng + iswAng;

  let wt1, ht1, dx1, dy1, x1, y1;
  const stRd = (stAng * Math.PI) / 180;
  const istRd = (istAng * Math.PI) / 180;
  const wd2 = w / 2;
  const hd2 = h / 2;
  const hc = w / 2;
  const vc = h / 2;
  if (stAng > 90 && stAng < 270) {
    wt1 = wd2 * Math.sin(Math.PI / 2 - stRd);
    ht1 = hd2 * Math.cos(Math.PI / 2 - stRd);

    dx1 = wd2 * Math.cos(Math.atan(ht1 / wt1));
    dy1 = hd2 * Math.sin(Math.atan(ht1 / wt1));

    x1 = hc - dx1;
    y1 = vc - dy1;
  } else {
    wt1 = wd2 * Math.sin(stRd);
    ht1 = hd2 * Math.cos(stRd);

    dx1 = wd2 * Math.cos(Math.atan(wt1 / ht1));
    dy1 = hd2 * Math.sin(Math.atan(wt1 / ht1));

    x1 = hc + dx1;
    y1 = vc + dy1;
  }
  let wt2, ht2, dx2, dy2, x2, y2;
  const dr = (Math.min(w, h) * a3) / cnstVal2;
  const iwd2 = wd2 - dr;
  const ihd2 = hd2 - dr;
  if ((endAng <= 450 && endAng > 270) || (endAng >= 630 && endAng < 720)) {
    wt2 = iwd2 * Math.sin(istRd);
    ht2 = ihd2 * Math.cos(istRd);
    dx2 = iwd2 * Math.cos(Math.atan(wt2 / ht2));
    dy2 = ihd2 * Math.sin(Math.atan(wt2 / ht2));
    x2 = hc + dx2;
    y2 = vc + dy2;
  } else {
    wt2 = iwd2 * Math.sin(Math.PI / 2 - istRd);
    ht2 = ihd2 * Math.cos(Math.PI / 2 - istRd);

    dx2 = iwd2 * Math.cos(Math.atan(ht2 / wt2));
    dy2 = ihd2 * Math.sin(Math.atan(ht2 / wt2));
    x2 = hc - dx2;
    y2 = vc - dy2;
  }
  const d =
    "M" +
    x1 +
    "," +
    y1 +
    shapeArc({
      cX: wd2,
      cY: hd2,
      rX: wd2,
      rY: hd2,
      stAng: stAng,
      endAng: endAng,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    x2 +
    "," +
    y2 +
    shapeArc({
      cX: wd2,
      cY: hd2,
      rX: iwd2,
      rY: ihd2,
      stAng: istAng,
      endAng: iendAng,
      isClose: false,
    }).replace("M", "L") +
    " z";
  return createPath({ d, ctx });
}
