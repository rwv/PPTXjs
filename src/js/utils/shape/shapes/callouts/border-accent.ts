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
 * Render border/accent callout shapes (1, 2, 3 variants)
 */
export function renderBorderAccentCallout({ ctx, shapeType }: CalloutRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments({ node });
  const refr = slideFactor;
  let sAdj1,
    adj1 = 18750 * refr;
  let sAdj2,
    adj2 = -8333 * refr;
  let sAdj3,
    adj3 = 18750 * refr;
  let sAdj4,
    adj4 = -16667 * refr;
  let sAdj5,
    adj5 = 100000 * refr;
  let sAdj6,
    adj6 = -16667 * refr;
  let sAdj7,
    adj7 = 112963 * refr;
  let sAdj8,
    adj8 = -8333 * refr;
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
    } else if (sAdj_name === "adj4") {
      sAdj4 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj4 !== undefined) {
        adj4 = parseInt(sAdj4.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj5") {
      sAdj5 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj5 !== undefined) {
        adj5 = parseInt(sAdj5.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj6") {
      sAdj6 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj6 !== undefined) {
        adj6 = parseInt(sAdj6.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj7") {
      sAdj7 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj7 !== undefined) {
        adj7 = parseInt(sAdj7.substr(4)) * refr;
      }
    } else if (sAdj_name === "adj8") {
      sAdj8 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj8 !== undefined) {
        adj8 = parseInt(sAdj8.substr(4)) * refr;
      }
    }
  }
  let d_val;
  const cnstVal1 = 100000 * refr;

  switch (shapeType) {
    case "borderCallout1":
    case "callout1": {
      if (shapAdjst_ary.length === 0) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2;
      break;
    }
    case "borderCallout2":
    case "callout2": {
      if (shapAdjst_ary.length === 0) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2;

      break;
    }
    case "borderCallout3":
    case "callout3": {
      if (shapAdjst_ary.length === 0) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 100000 * refr;
        adj6 = -16667 * refr;

        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      const y4 = (h * adj7) / cnstVal1;
      const x4 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x4 +
        "," +
        y4 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2;
      break;
    }
    case "accentBorderCallout1":
    case "accentCallout1": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;
      break;
    }
    case "accentBorderCallout2":
    case "accentCallout2": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;

      break;
    }
    case "accentBorderCallout3":
    case "accentCallout3": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 100000 * refr;
        adj6 = -16667 * refr;
        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      const y4 = (h * adj7) / cnstVal1;
      const x4 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x4 +
        "," +
        y4 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2 +
        "," +
        y2 +
        " M" +
        x1 +
        "," +
        0 +
        " L" +
        x1 +
        "," +
        h;
      break;
    }
    default:
      d_val = "";
  }

  return createPath({ d: d_val, ctx });
}
