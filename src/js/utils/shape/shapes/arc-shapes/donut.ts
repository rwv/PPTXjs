import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

type ArcRenderOptions = {
  ctx: ArcShapeContext;
  shapeType: string;
};

export function renderDonut({ ctx }: ArcRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const dr = (Math.min(w, h) * a) / cnstVal2;
  const iwd2 = w / 2 - dr;
  const ihd2 = h / 2 - dr;
  const d =
    "M" +
    0 +
    "," +
    h / 2 +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: w / 2,
      rY: h / 2,
      stAng: 180,
      endAng: 270,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: w / 2,
      rY: h / 2,
      stAng: 270,
      endAng: 360,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: w / 2,
      rY: h / 2,
      stAng: 0,
      endAng: 90,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: w / 2,
      rY: h / 2,
      stAng: 90,
      endAng: 180,
      isClose: false,
    }).replace("M", "L") +
    " z" +
    "M" +
    dr +
    "," +
    h / 2 +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: iwd2,
      rY: ihd2,
      stAng: 180,
      endAng: 90,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: iwd2,
      rY: ihd2,
      stAng: 90,
      endAng: 0,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: iwd2,
      rY: ihd2,
      stAng: 0,
      endAng: -90,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: w / 2,
      cY: h / 2,
      rX: iwd2,
      rY: ihd2,
      stAng: 270,
      endAng: 180,
      isClose: false,
    }).replace("M", "L") +
    " z";
  return createPath({ d, ctx });
}

/**
 * Render noSmoking shape
 */
