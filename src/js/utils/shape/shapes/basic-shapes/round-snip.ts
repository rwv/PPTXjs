import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import { shapeSnipRoundRect } from "../helpers/snip-round-rect";
import type { BasicShapeParams } from "./types";

type RenderRoundSnipRectOptions = {
  shapeType: string;
  params: BasicShapeParams;
};

export function renderRoundSnipRect({ shapeType, params }: RenderRoundSnipRectOptions): string {
  const { node, w, h, shpId, fillColor, grndFillFlg, imgFillFlg, border } = params;
  let result = "";
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let sAdj1;
  let sAdj1_val;
  let sAdj2;
  let sAdj2_val;
  let shpTyp;
  let adjTyp;
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
  if (shapAdjst_ary.length === 1 && sAdj1_val === undefined) {
    const sAdj = getTextByPathList<string>({ node: shapAdjst_ary[0], path: ["attrs", "fmla"] });
    if (sAdj !== undefined) {
      sAdj1_val = parseInt(sAdj.substr(4)) / 50000;
      sAdj2_val = 0;
    }
  }
  //console.log("shapeType: ",shapeType,",node: ",node )
  let tranglRott = "";
  switch (shapeType) {
    case "roundRect":
    case "flowChartAlternateProcess":
      shpTyp = "round";
      adjTyp = "cornrAll";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      sAdj2_val = 0;
      break;
    case "round1Rect":
      shpTyp = "round";
      adjTyp = "cornr1";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      sAdj2_val = 0;
      break;
    case "round2DiagRect":
      shpTyp = "round";
      adjTyp = "diag";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      if (sAdj2_val === undefined) sAdj2_val = 0;
      break;
    case "round2SameRect":
      shpTyp = "round";
      adjTyp = "cornr2";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      if (sAdj2_val === undefined) sAdj2_val = 0;
      break;
    case "snip1Rect":
    case "flowChartPunchedCard":
      shpTyp = "snip";
      adjTyp = "cornr1";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      sAdj2_val = 0;
      if (shapeType === "flowChartPunchedCard") {
        tranglRott = "transform='translate(" + w + ",0) scale(-1,1)'";
      }
      break;
    case "snip2DiagRect":
      shpTyp = "snip";
      adjTyp = "diag";
      if (sAdj1_val === undefined) sAdj1_val = 0;
      if (sAdj2_val === undefined) sAdj2_val = 0.33334;
      break;
    case "snip2SameRect":
      shpTyp = "snip";
      adjTyp = "cornr2";
      if (sAdj1_val === undefined) sAdj1_val = 0.33334;
      if (sAdj2_val === undefined) sAdj2_val = 0;
      break;
  }
  const d_val = shapeSnipRoundRect(w, h, sAdj1_val, sAdj2_val, shpTyp, adjTyp);
  result +=
    "<path " +
    tranglRott +
    "  d='" +
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
