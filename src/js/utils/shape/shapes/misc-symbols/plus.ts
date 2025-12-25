/**
 * Plus shape renderer.
 */

import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

export function renderPlus(ctx: MiscSymbolContext): string {
  const { node, w, h } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 0.25;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) / 100000;
  }
  const adj2 = 1 - adj1;
  return ` <polygon points='${adj1 * w} 0,${adj1 * w} ${adj1 * h},0 ${adj1 * h},0 ${adj2 * h},${adj1 * w} ${adj2 * h},${adj1 * w} ${h},${adj2 * w} ${h},${adj2 * w} ${adj2 * h},${w} ${adj2 * h},${w} ${adj1 * h},${adj2 * w} ${adj1 * h},${adj2 * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
