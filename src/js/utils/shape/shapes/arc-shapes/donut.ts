import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

export function renderDonut(ctx: ArcShapeContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
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
    shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 270, 360, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
    " z" +
    "M" +
    dr +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 180, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 90, 0, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 0, -90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, iwd2, ihd2, 270, 180, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

/**
 * Render noSmoking shape
 */
