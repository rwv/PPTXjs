import { shapePie } from "../helpers/pie";
import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

export function renderPieArcShape(ctx: ArcShapeContext, shapType: string): string {
  const { node, w, h } = ctx;

  const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1, adj2, H, shapAdjst1, shapAdjst2, isClose;
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
  if (shapAdjst !== undefined) {
    shapAdjst1 = getTextByPathList(shapAdjst, ["attrs", "fmla"]);
    shapAdjst2 = shapAdjst1;
    if (shapAdjst1 === undefined) {
      shapAdjst1 = shapAdjst[0]["attrs"]["fmla"];
      shapAdjst2 = shapAdjst[1]["attrs"]["fmla"];
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
