/**
 * Wedge ellipse callout shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { CalloutContext } from "./shared";
import { createPath } from "./shared";

export function renderWedgeEllipseCallout(ctx: CalloutContext): string {
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
  const angVal1 = (11 * Math.PI) / 180;
  const _ss = Math.min(w, h);
  const vc = h / 2;
  const hc = w / 2;
  const dxPos = (w * adj1) / cnstVal1;
  const dyPos = (h * adj2) / cnstVal1;
  const xPos = hc + dxPos;
  const yPos = vc + dyPos;
  const sdx = dxPos * h;
  const sdy = dyPos * w;
  const pang = Math.atan(sdy / sdx);
  const stAng = pang + angVal1;
  const enAng = pang - angVal1;
  console.log("dxPos: ", dxPos, "dyPos: ", dyPos);
  const dx1 = hc * Math.cos(stAng);
  const dy1 = vc * Math.sin(stAng);
  const dx2 = hc * Math.cos(enAng);
  const dy2 = vc * Math.sin(enAng);
  const _stAng1 = 0;
  const _enAng1 = 0;
  const _swAng1 = 0;
  const _swAng2 = 0;
  const _swAng = 0;
  let x1, y1, x2, y2;
  if (dxPos >= 0) {
    x1 = hc + dx1;
    y1 = vc + dy1;
    x2 = hc + dx2;
    y2 = vc + dy2;
  } else {
    x1 = hc - dx1;
    y1 = vc - dy1;
    x2 = hc - dx2;
    y2 = vc - dy2;
  }
  const d_val =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    xPos +
    "," +
    yPos +
    " L" +
    x2 +
    "," +
    y2 +
    shapeArc(hc, vc, hc, vc, 0, 360, true);

  return createPath(d_val, ctx);
}
