/**
 * Wedge rect callout shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { CalloutContext } from "./shared";
import { createPath } from "./shared";

export function renderWedgeRectCallout(ctx: CalloutContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = -20833 * refr;
  let sAdj2,
    adj2 = 62500 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * slideFactor;
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const _dx = xPos - hc;
  const _dy = yPos - vc;
  const dq = (dxPos * h) / w;
  const ady = Math.abs(dyPos);
  const adq = Math.abs(dq);
  const dz = ady - adq;
  const xg1 = dxPos > 0 ? 7 : 2;
  const xg2 = dxPos > 0 ? 10 : 5;
  const x1 = (w * xg1) / 12;
  const x2 = (w * xg2) / 12;
  const yg1 = dyPos > 0 ? 7 : 2;
  const yg2 = dyPos > 0 ? 10 : 5;
  const y1 = (h * yg1) / 12;
  const y2 = (h * yg2) / 12;
  const t1 = dxPos > 0 ? 0 : xPos;
  const xl = dz > 0 ? 0 : t1;
  const t2 = dyPos > 0 ? x1 : xPos;
  const xt = dz > 0 ? t2 : x1;
  const t3 = dxPos > 0 ? xPos : w;
  const xr = dz > 0 ? w : t3;
  const t4 = dyPos > 0 ? xPos : x1;
  const xb = dz > 0 ? t4 : x1;
  const t5 = dxPos > 0 ? y1 : yPos;
  const yl = dz > 0 ? y1 : t5;
  const t6 = dyPos > 0 ? 0 : yPos;
  const yt = dz > 0 ? t6 : 0;
  const t7 = dxPos > 0 ? yPos : y1;
  const yr = dz > 0 ? y1 : t7;
  const t8 = dyPos > 0 ? yPos : h;
  const yb = dz > 0 ? t8 : h;

  const d_val =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    x1 +
    "," +
    0 +
    " L" +
    xt +
    "," +
    yt +
    " L" +
    x2 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    xr +
    "," +
    yr +
    " L" +
    w +
    "," +
    y2 +
    " L" +
    w +
    "," +
    h +
    " L" +
    x2 +
    "," +
    h +
    " L" +
    xb +
    "," +
    yb +
    " L" +
    x1 +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " L" +
    0 +
    "," +
    y2 +
    " L" +
    xl +
    "," +
    yl +
    " L" +
    0 +
    "," +
    y1 +
    " z";

  return createPath(d_val, ctx);
}
