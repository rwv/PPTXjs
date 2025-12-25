/**
 * Sun shape renderer.
 */

import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderSun(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj1 = 25000 * refr;
  const cnstVal1 = 12500 * refr;
  const cnstVal2 = 46875 * refr;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * refr;
  }
  const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const cnstVa3 = 50000 * refr;
  const cnstVa4 = 100000 * refr;
  const g0 = cnstVa3 - a1,
    g1 = (g0 * (30274 * refr)) / (32768 * refr),
    g2 = (g0 * (12540 * refr)) / (32768 * refr),
    _g3 = g1 + cnstVa3,
    _g4 = g2 + cnstVa3,
    g5 = cnstVa3 - g1,
    g6 = cnstVa3 - g2,
    g7 = (g0 * (23170 * refr)) / (32768 * refr),
    g8 = cnstVa3 + g7,
    g9 = cnstVa3 - g7,
    g10 = (g5 * 3) / 4,
    g11 = (g6 * 3) / 4,
    g12 = g10 + 3662 * refr,
    g13 = g11 + 36620 * refr,
    g14 = g11 + 12500 * refr,
    g15 = cnstVa4 - g10,
    g16 = cnstVa4 - g12,
    g17 = cnstVa4 - g13,
    g18 = cnstVa4 - g14,
    ox1 = (w * (18436 * refr)) / (21600 * refr),
    oy1 = (h * (3163 * refr)) / (21600 * refr),
    ox2 = (w * (3163 * refr)) / (21600 * refr),
    oy2 = (h * (18436 * refr)) / (21600 * refr),
    _x8 = (w * g8) / cnstVa4,
    _x9 = (w * g9) / cnstVa4,
    x10 = (w * g10) / cnstVa4,
    x12 = (w * g12) / cnstVa4,
    x13 = (w * g13) / cnstVa4,
    x14 = (w * g14) / cnstVa4,
    x15 = (w * g15) / cnstVa4,
    x16 = (w * g16) / cnstVa4,
    x17 = (w * g17) / cnstVa4,
    x18 = (w * g18) / cnstVa4,
    x19 = (w * a1) / cnstVa4,
    wR = (w * g0) / cnstVa4,
    hR = (h * g0) / cnstVa4,
    _y8 = (h * g8) / cnstVa4,
    _y9 = (h * g9) / cnstVa4,
    y10 = (h * g10) / cnstVa4,
    y12 = (h * g12) / cnstVa4,
    y13 = (h * g13) / cnstVa4,
    y14 = (h * g14) / cnstVa4,
    y15 = (h * g15) / cnstVa4,
    y16 = (h * g16) / cnstVa4,
    y17 = (h * g17) / cnstVa4,
    y18 = (h * g18) / cnstVa4;

  const d_val =
    "M" +
    w +
    "," +
    h / 2 +
    " L" +
    x15 +
    "," +
    y18 +
    " L" +
    x15 +
    "," +
    y14 +
    "z" +
    " M" +
    ox1 +
    "," +
    oy1 +
    " L" +
    x16 +
    "," +
    y17 +
    " L" +
    x13 +
    "," +
    y12 +
    "z" +
    " M" +
    w / 2 +
    ",0 L" +
    x18 +
    "," +
    y10 +
    " L" +
    x14 +
    "," +
    y10 +
    "z" +
    " M" +
    ox2 +
    "," +
    oy1 +
    " L" +
    x17 +
    "," +
    y12 +
    " L" +
    x12 +
    "," +
    y17 +
    "z" +
    " M0," +
    h / 2 +
    " L" +
    x10 +
    "," +
    y14 +
    " L" +
    x10 +
    "," +
    y18 +
    "z" +
    " M" +
    ox2 +
    "," +
    oy2 +
    " L" +
    x12 +
    "," +
    y13 +
    " L" +
    x17 +
    "," +
    y16 +
    "z" +
    " M" +
    w / 2 +
    "," +
    h +
    " L" +
    x14 +
    "," +
    y15 +
    " L" +
    x18 +
    "," +
    y15 +
    "z" +
    " M" +
    ox1 +
    "," +
    oy2 +
    " L" +
    x13 +
    "," +
    y16 +
    " L" +
    x16 +
    "," +
    y13 +
    " z" +
    " M" +
    x19 +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, wR, hR, 180, 540, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}
