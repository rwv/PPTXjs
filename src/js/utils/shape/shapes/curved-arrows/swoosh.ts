import { getTextByPathList } from "../../../object";
import type { CurvedArrowContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render swooshArrow shape
 */
export function renderSwooshArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = 25000 * refr;
  let sAdj2,
    adj2 = 16667 * refr;
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
  const cnstVal1 = 1 * refr;
  const cnstVal2 = 70000 * refr;
  const cnstVal3 = 75000 * refr;
  const cnstVal4 = 100000 * refr;
  const ss = Math.min(w, h);
  const ssd8 = ss / 8;
  const hd6 = h / 6;

  const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal3 ? cnstVal3 : adj1;
  const maxAdj2 = (cnstVal2 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const ad1 = (h * a1) / cnstVal4;
  const ad2 = (ss * a2) / cnstVal4;
  const xB = w - ad2;
  const yB = ssd8;
  const alfa = Math.PI / 2 / 14;
  const dx0 = ssd8 * Math.tan(alfa);
  const xC = xB - dx0;
  const dx1 = ad1 * Math.tan(alfa);
  const yF = yB + ad1;
  const xF = xB + dx1;
  const xE = xF + dx0;
  const yE = yF + ssd8;
  const dy2 = yE - 0;
  const dy22 = dy2 / 2;
  const dy3 = h / 20;
  const yD = dy22 - dy3;
  const dy4 = hd6;
  const yP1 = hd6 + dy4;
  const xP1 = w / 6;
  const dy5 = hd6 / 2;
  const yP2 = yF + dy5;
  const xP2 = w / 4;

  const dVal =
    "M" +
    0 +
    "," +
    h +
    " Q" +
    xP1 +
    "," +
    yP1 +
    " " +
    xB +
    "," +
    yB +
    " L" +
    xC +
    "," +
    0 +
    " L" +
    w +
    "," +
    yD +
    " L" +
    xE +
    "," +
    yE +
    " L" +
    xF +
    "," +
    yF +
    " Q" +
    xP2 +
    "," +
    yP2 +
    " " +
    0 +
    "," +
    h +
    " z";

  return createPath(dVal, ctx);
}

/**
 * Render circularArrow shape
 */
