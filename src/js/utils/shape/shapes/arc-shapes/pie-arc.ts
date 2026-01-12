import { shapePie } from "../helpers/pie";
import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

export function renderPieArcShape(ctx: ArcShapeContext, shapType: string): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  const shapAdjst_ary = Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
  let adj1;
  let adj2;
  let H;
  let shapAdjst1: string | undefined;
  let shapAdjst2: string | undefined;
  let isClose;
  if (shapType === "pie") {
    adj1 = 0;
    adj2 = 270;
    H = h;
    isClose = true;
  } else if (shapType === "pieWedge") {
    adj1 = 180;
    adj2 = 270;
    H = 2 * h;
    isClose = true;
  } else if (shapType === "arc") {
    adj1 = 270;
    adj2 = 0;
    H = h;
    isClose = false;
  }
  if (shapAdjst_ary.length > 0) {
    if (shapAdjst_ary.length === 1) {
      shapAdjst1 = getTextByPathList<string>(shapAdjst_ary[0], ["attrs", "fmla"]);
      shapAdjst2 = shapAdjst1;
    } else {
      shapAdjst1 = getTextByPathList<string>(shapAdjst_ary[0], ["attrs", "fmla"]);
      shapAdjst2 = getTextByPathList<string>(shapAdjst_ary[1], ["attrs", "fmla"]);
    }
    if (shapAdjst1 !== undefined) {
      adj1 = parseInt(shapAdjst1.substr(4)) / 60000;
    }
    if (shapAdjst2 !== undefined) {
      adj2 = parseInt(shapAdjst2.substr(4)) / 60000;
    }
  }
  const pieVals = shapePie(H, w, adj1, adj2, isClose);
  return createPath(pieVals[0], ctx, pieVals[1]);
}
