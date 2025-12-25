/**
 * Lightning bolt shape renderer.
 */

import type { MiscSymbolContext } from "./shared";
import { getFillAttr, getStrokeAttrs } from "./shared";

export function renderLightningBolt(ctx: MiscSymbolContext): string {
  const { w, h } = ctx;
  const x1 = (w * 5022) / 21600,
    x2 = (w * 11050) / 21600,
    x3 = (w * 8472) / 21600,
    _x4 = (w * 8757) / 21600,
    x5 = (w * 10012) / 21600,
    x6 = (w * 14767) / 21600,
    x7 = (w * 12222) / 21600,
    x8 = (w * 12860) / 21600,
    _x9 = (w * 13917) / 21600,
    x10 = (w * 7602) / 21600,
    x11 = (w * 16577) / 21600,
    y1 = (h * 3890) / 21600,
    y2 = (h * 6080) / 21600,
    y3 = (h * 6797) / 21600,
    _y4 = (h * 7437) / 21600,
    y5 = (h * 12877) / 21600,
    y6 = (h * 9705) / 21600,
    y7 = (h * 12007) / 21600,
    y8 = (h * 13987) / 21600,
    y9 = (h * 8382) / 21600,
    _y10 = (h * 14277) / 21600,
    y11 = (h * 14915) / 21600;
  const d_val =
    "M" +
    x3 +
    ",0 L" +
    x8 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y3 +
    " L" +
    x11 +
    "," +
    y7 +
    " L" +
    x6 +
    "," +
    y5 +
    " L" +
    w +
    "," +
    h +
    " L" +
    x5 +
    "," +
    y11 +
    " L" +
    x7 +
    "," +
    y8 +
    " L" +
    x1 +
    "," +
    y6 +
    " L" +
    x10 +
    "," +
    y9 +
    " L0," +
    y1 +
    " z";
  return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
