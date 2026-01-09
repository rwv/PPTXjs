import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { getFillAttr, getStrokeAttrs } from "./helpers";

export function renderChord(ctx: ArcShapeContext): string {
  const { node, w, h } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1,
    sAdj1_val = 45;
  let sAdj2,
    sAdj2_val = 270;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) / 60000;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) / 60000;
      }
    }
  }
  const hR = h / 2;
  const wR = w / 2;
  const d_val = shapeArc(wR, hR, wR, hR, sAdj1_val, sAdj2_val, true);
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
