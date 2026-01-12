import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { ArcShapeContext } from "./types";
import { getFillAttr, getStrokeAttrs } from "./helpers";

export function renderChord(ctx: ArcShapeContext): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let sAdj1_val = 45;
  let sAdj2_val = 270;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = parseInt(sAdj1.substr(4)) / 60000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        sAdj2_val = parseInt(sAdj2.substr(4)) / 60000;
      }
    }
  }
  const hR = h / 2;
  const wR = w / 2;
  const d_val = shapeArc(wR, hR, wR, hR, sAdj1_val, sAdj2_val, true);
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
