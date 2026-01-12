import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

type ArcRenderOptions = {
  ctx: ArcShapeContext;
  shapeType: string;
};

export function renderFrame({ ctx }: ArcRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj1 = 12500 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
  const x1 = (Math.min(w, h) * a1) / cnstVal2;
  const x4 = w - x1;
  const y4 = h - x1;
  const d =
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
    "M" +
    x1 +
    "," +
    x1 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x4 +
    "," +
    y4 +
    " L" +
    x4 +
    "," +
    x1 +
    " z";
  return createPath({ d, ctx });
}

/**
 * Render donut shape
 */
