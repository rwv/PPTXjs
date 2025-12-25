/**
 * Heart shape renderer.
 */

import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

export function renderHeart(ctx: MiscSymbolContext): string {
  const { w, h } = ctx;
  const dx1 = (w * 49) / 48,
    dx2 = (w * 10) / 48,
    x1 = w / 2 - dx1,
    x2 = w / 2 - dx2,
    x3 = w / 2 + dx2,
    x4 = w / 2 + dx1,
    y1 = -h / 3;
  const d_val =
    "M" +
    w / 2 +
    "," +
    h / 4 +
    "C" +
    x3 +
    "," +
    y1 +
    " " +
    x4 +
    "," +
    h / 4 +
    " " +
    w / 2 +
    "," +
    h +
    "C" +
    x1 +
    "," +
    h / 4 +
    " " +
    x2 +
    "," +
    y1 +
    " " +
    w / 2 +
    "," +
    h / 4 +
    " z";
  return `<path   d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
