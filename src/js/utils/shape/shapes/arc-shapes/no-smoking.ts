import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { ArcShapeContext } from "./types";
import { createPath } from "./helpers";

type ArcRenderOptions = {
  ctx: ArcShapeContext;
  shapeType: string;
};

export function renderNoSmoking({ ctx }: ArcRenderOptions): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst = getTextByPathList<string>({
    node: node,
    path: ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"],
  });
  let adj = 18750 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
  const dr = (Math.min(w, h) * a) / cnstVal2;
  const iwd2 = w / 2 - dr;
  const ihd2 = h / 2 - dr;
  const ang = Math.atan(h / w);
  const ct = ihd2 * Math.cos(ang);
  const st = iwd2 * Math.sin(ang);
  const m = Math.sqrt(ct * ct + st * st);
  const n = (iwd2 * ihd2) / m;
  const drd2 = dr / 2;
  const dang = Math.atan(drd2 / n);
  const dang2 = dang * 2;
  const swAng = -Math.PI + dang2;
  const stAng1 = ang - dang;
  const stAng2 = stAng1 - Math.PI;
  const ct1 = ihd2 * Math.cos(stAng1);
  const st1 = iwd2 * Math.sin(stAng1);
  const m1 = Math.sqrt(ct1 * ct1 + st1 * st1);
  const n1 = (iwd2 * ihd2) / m1;
  const dx1 = n1 * Math.cos(stAng1);
  const dy1 = n1 * Math.sin(stAng1);
  const x1 = w / 2 + dx1;
  const y1 = h / 2 + dy1;
  const x2 = w / 2 - dx1;
  const y2 = h / 2 - dy1;
  const stAng1deg = (stAng1 * 180) / Math.PI;
  const stAng2deg = (stAng2 * 180) / Math.PI;
  const swAng2deg = (swAng * 180) / Math.PI;
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
    x1 +
    "," +
    y1 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, stAng1deg, stAng1deg + swAng2deg, false).replace("M", "L") +
    " z" +
    "M" +
    x2 +
    "," +
    y2 +
    shapeArc(w / 2, h / 2, iwd2, ihd2, stAng2deg, stAng2deg + swAng2deg, false).replace("M", "L") +
    " z";

  return createPath(d, ctx);
}

/**
 * Render halfFrame shape
 */
