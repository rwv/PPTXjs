/**
 * Moon shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderMoon(ctx: MiscSymbolContext): string {
  const { node, w, h } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 0.5;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) / 100000;
  }
  const hd2 = h / 2;
  const cd2 = 180;
  const cd4 = 90;
  const adj2 = (1 - adj) * w;
  const d =
    "M" +
    w +
    "," +
    h +
    shapeArc(w, hd2, w, hd2, cd4, cd4 + cd2, false).replace("M", "L") +
    shapeArc(w, hd2, adj2, hd2, cd4 + cd2, cd4, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}
