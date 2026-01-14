import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { BasicShapeParams } from "./types";

type RenderSnipRoundRectOptions = {
  params: BasicShapeParams;
};

export function renderSnipRoundRect({ params }: RenderSnipRoundRectOptions): string {
  const { node, w, h, shpId, fillColor, grndFillFlg, imgFillFlg, border } = params;
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return "";
  }
  let result = "";
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let sAdj1;
  let sAdj1_val = 0.33334;
  let sAdj2;
  let sAdj2_val = 0.33334;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        sAdj1_val = parseInt(sAdj1.substr(4)) / 50000;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        sAdj2_val = parseInt(sAdj2.substr(4)) / 50000;
      }
    }
  }
  const d_val =
    "M0," +
    h +
    " L" +
    w +
    "," +
    h +
    " L" +
    w +
    "," +
    (h / 2) * sAdj2_val +
    " L" +
    (w / 2 + (w / 2) * (1 - sAdj2_val)) +
    ",0 L" +
    (w / 2) * sAdj1_val +
    ",0 Q0,0 0," +
    (h / 2) * sAdj1_val +
    " z";

  result +=
    "<path   d='" +
    d_val +
    "'  fill='" +
    (!imgFillFlg
      ? grndFillFlg
        ? "url(#linGrd_" + shpId + ")"
        : fillColor
      : "url(#imgPtrn_" + shpId + ")") +
    "' stroke='" +
    border.color +
    "' stroke-width='" +
    border.width +
    "' stroke-dasharray='" +
    border.strokeDasharray +
    "' />";
  return result;
}
