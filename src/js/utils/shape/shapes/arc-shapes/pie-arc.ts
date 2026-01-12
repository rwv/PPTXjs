import { shapePie } from "../helpers/pie";
import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

type ArcRenderOptions = {
  ctx: ArcShapeContext;
  shapeType: string;
};

export function renderPieArcShape({ ctx, shapeType }: ArcRenderOptions): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"],
  });
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let adj1;
  let adj2;
  let H;
  let shapAdjst1: string | undefined;
  let shapAdjst2: string | undefined;
  let isClose;
  if (shapeType === "pie") {
    adj1 = 0;
    adj2 = 270;
    H = h;
    isClose = true;
  } else if (shapeType === "pieWedge") {
    adj1 = 180;
    adj2 = 270;
    H = 2 * h;
    isClose = true;
  } else if (shapeType === "arc") {
    adj1 = 270;
    adj2 = 0;
    H = h;
    isClose = false;
  }
  if (shapAdjst_ary.length > 0) {
    if (shapAdjst_ary.length === 1) {
      shapAdjst1 = getTextByPathList<string>({ node: shapAdjst_ary[0], path: ["attrs", "fmla"] });
      shapAdjst2 = shapAdjst1;
    } else {
      shapAdjst1 = getTextByPathList<string>({ node: shapAdjst_ary[0], path: ["attrs", "fmla"] });
      shapAdjst2 = getTextByPathList<string>({ node: shapAdjst_ary[1], path: ["attrs", "fmla"] });
    }
    if (shapAdjst1 !== undefined) {
      adj1 = parseInt(shapAdjst1.substr(4)) / 60000;
    }
    if (shapAdjst2 !== undefined) {
      adj2 = parseInt(shapAdjst2.substr(4)) / 60000;
    }
  }
  const pieVals = shapePie({ H, w, adj1, adj2, isClose });
  return createPath({ d: pieVals[0], ctx, transform: pieVals[1] });
}
