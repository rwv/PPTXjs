import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { CalloutContext } from "./types";
import { createPath } from "./helpers";

type CalloutRenderOptions = {
  ctx: CalloutContext;
  shapeType: string;
};

const getShapeAdjustments = ({ node }: { node: XmlNode }): XmlNode[] => {
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  return Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
};

/**
 * Render wedgeEllipseCallout shape
 */
export function renderWedgeEllipseCallout({ ctx }: CalloutRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments({ node });
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const angVal1 = (11 * Math.PI) / 180;
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const sdx = dxPos * h;
  const sdy = dyPos * w;
  const pang = Math.atan(sdy / sdx);
  const stAng = pang + angVal1;
  const enAng = pang - angVal1;
  console.log("dxPos: ", dxPos, "dyPos: ", dyPos);
  const dx1 = hc * Math.cos(stAng);
  const dy1 = vc * Math.sin(stAng);
  const dx2 = hc * Math.cos(enAng);
  const dy2 = vc * Math.sin(enAng);
  let x1;
  let y1;
  let x2;
  let y2;
  if (dxPos >= 0) {
    x1 = hc + dx1;
    y1 = vc + dy1;
    x2 = hc + dx2;
    y2 = vc + dy2;
  } else {
    x1 = hc - dx1;
    y1 = vc - dy1;
    x2 = hc - dx2;
    y2 = vc - dy2;
  }
  const d_val =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    xPos +
    "," +
    yPos +
    " L" +
    x2 +
    "," +
    y2 +
    shapeArc({ cX: hc, cY: vc, rX: hc, rY: vc, stAng: 0, endAng: 360, isClose: true });

  return createPath({ d: d_val, ctx });
}

/**
 * Render wedgeRectCallout shape
 */
export function renderWedgeRectCallout({ ctx }: CalloutRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments({ node });
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const dq = (dxPos * h) / w;
  const ady = Math.abs(dyPos);
  const adq = Math.abs(dq);
  const dz = ady - adq;
  const xg1 = dxPos > 0 ? 7 : 2;
  const xg2 = dxPos > 0 ? 10 : 5;
  const x1 = (w * xg1) / 12;
  const x2 = (w * xg2) / 12;
  const yg1 = dyPos > 0 ? 7 : 2;
  const yg2 = dyPos > 0 ? 10 : 5;
  const y1 = (h * yg1) / 12;
  const y2 = (h * yg2) / 12;
  const t1 = dxPos > 0 ? 0 : xPos;
  const xl = dz > 0 ? 0 : t1;
  const t2 = dyPos > 0 ? x1 : xPos;
  const xt = dz > 0 ? t2 : x1;
  const t3 = dxPos > 0 ? xPos : w;
  const xr = dz > 0 ? w : t3;
  const t4 = dyPos > 0 ? xPos : x1;
  const xb = dz > 0 ? t4 : x1;
  const t5 = dxPos > 0 ? y1 : yPos;
  const yl = dz > 0 ? y1 : t5;
  const t6 = dyPos > 0 ? 0 : yPos;
  const yt = dz > 0 ? t6 : 0;
  const t7 = dxPos > 0 ? yPos : y1;
  const yr = dz > 0 ? y1 : t7;
  const t8 = dyPos > 0 ? yPos : h;
  const yb = dz > 0 ? t8 : h;

  const d_val =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    xt +
    "," +
    yt +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    xr +
    "," +
    yr +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    w +
    "," +
    h +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    xb +
    "," +
    yb +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " L" +
    0 +
    "," +
    y2 +
    " L" +
    xl +
    "," +
    yl +
    " L" +
    0 +
    "," +
    y1 +
    " z";

  return createPath({ d: d_val, ctx });
}

/**
 * Render wedgeRoundRectCallout shape
 */
export function renderWedgeRoundRectCallout({ ctx }: CalloutRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments({ node });
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  let sAdj3,
    adj3 = 16667 * refr;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const ss = Math.min(w, h);
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const dq = (dxPos * h) / w;
  const ady = Math.abs(dyPos);
  const adq = Math.abs(dq);
  const dz = ady - adq;
  const xg1 = dxPos > 0 ? 7 : 2;
  const xg2 = dxPos > 0 ? 10 : 5;
  const x1 = (w * xg1) / 12;
  const x2 = (w * xg2) / 12;
  const yg1 = dyPos > 0 ? 7 : 2;
  const yg2 = dyPos > 0 ? 10 : 5;
  const y1 = (h * yg1) / 12;
  const y2 = (h * yg2) / 12;
  const t1 = dxPos > 0 ? 0 : xPos;
  const xl = dz > 0 ? 0 : t1;
  const t2 = dyPos > 0 ? x1 : xPos;
  const xt = dz > 0 ? t2 : x1;
  const t3 = dxPos > 0 ? xPos : w;
  const xr = dz > 0 ? w : t3;
  const t4 = dyPos > 0 ? xPos : x1;
  const xb = dz > 0 ? t4 : x1;
  const t5 = dxPos > 0 ? y1 : yPos;
  const yl = dz > 0 ? y1 : t5;
  const t6 = dyPos > 0 ? 0 : yPos;
  const yt = dz > 0 ? t6 : 0;
  const t7 = dxPos > 0 ? yPos : y1;
  const yr = dz > 0 ? y1 : t7;
  const t8 = dyPos > 0 ? yPos : h;
  const yb = dz > 0 ? t8 : h;
  const u1 = (ss * adj3) / cnstVal1;
  const u2 = w - u1;
  const v2 = h - u1;
  const d_val =
    "M" +
    0 +
    "," +
    u1 +
    shapeArc({ cX: u1, cY: u1, rX: u1, rY: u1, stAng: 180, endAng: 270, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    xt +
    "," +
    yt +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    u2 +
    "," +
    0 +
    shapeArc({ cX: u2, cY: u1, rX: u1, rY: u1, stAng: 270, endAng: 360, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    xr +
    "," +
    yr +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    w +
    "," +
    v2 +
    shapeArc({ cX: u2, cY: v2, rX: u1, rY: u1, stAng: 0, endAng: 90, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    xb +
    "," +
    yb +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    u1 +
    "," +
    h +
    shapeArc({ cX: u1, cY: v2, rX: u1, rY: u1, stAng: 90, endAng: 180, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    0 +
    "," +
    y2 +
    " L" +
    xl +
    "," +
    yl +
    " L" +
    0 +
    "," +
    y1 +
    " z";

  return createPath({ d: d_val, ctx });
}
