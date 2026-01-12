import { shapeArc } from "../helpers/arc";
import type { ActionButtonContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render actionButtonBackPrevious - back/previous navigation button
 */
export function renderActionButtonBackPrevious(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;

  const d =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " z" +
    "M" +
    g11 +
    "," +
    vc +
    " L" +
    g12 +
    "," +
    g9 +
    " L" +
    g12 +
    "," +
    g10 +
    " z";

  return createPath({ d, ctx });
}

/**
 * Render actionButtonBeginning - beginning/first navigation button
 */
export function renderActionButtonBeginning(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;
  const g13 = (ss * 3) / 4;
  const g14 = g13 / 8;
  const g15 = g13 / 4;
  const g16 = g11 + g14;
  const g17 = g11 + g15;

  const d =
    "M" +
    0 +
    "," +
    0 +
    " L" +
    w +
    "," +
    0 +
    " L" +
    w +
    "," +
    h +
    " L" +
    0 +
    "," +
    h +
    " z" +
    "M" +
    g17 +
    "," +
    vc +
    " L" +
    g12 +
    "," +
    g9 +
    " L" +
    g12 +
    "," +
    g10 +
    " z" +
    "M" +
    g16 +
    "," +
    g9 +
    " L" +
    g11 +
    "," +
    g9 +
    " L" +
    g11 +
    "," +
    g10 +
    " L" +
    g16 +
    "," +
    g10 +
    " z";

  return createPath({ d, ctx });
}

/**
 * Render actionButtonEnd - end/last navigation button
 */
export function renderActionButtonEnd(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;
  const g13 = (ss * 3) / 4;
  const g14 = (g13 * 3) / 4;
  const g15 = (g13 * 7) / 8;
  const g16 = g11 + g14;
  const g17 = g11 + g15;

  const d =
    "M" +
    0 +
    "," +
    h +
    " L" +
    w +
    "," +
    h +
    " L" +
    w +
    "," +
    0 +
    " L" +
    0 +
    "," +
    0 +
    " z" +
    " M" +
    g17 +
    "," +
    g9 +
    " L" +
    g12 +
    "," +
    g9 +
    " L" +
    g12 +
    "," +
    g10 +
    " L" +
    g17 +
    "," +
    g10 +
    " z" +
    " M" +
    g16 +
    "," +
    vc +
    " L" +
    g11 +
    "," +
    g9 +
    " L" +
    g11 +
    "," +
    g10 +
    " z";

  return createPath({ d, ctx });
}

/**
 * Render actionButtonForwardNext - forward/next navigation button
 */
export function renderActionButtonForwardNext(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;

  const d =
    "M" +
    0 +
    "," +
    h +
    " L" +
    w +
    "," +
    h +
    " L" +
    w +
    "," +
    0 +
    " L" +
    0 +
    "," +
    0 +
    " z" +
    " M" +
    g12 +
    "," +
    vc +
    " L" +
    g11 +
    "," +
    g9 +
    " L" +
    g11 +
    "," +
    g10 +
    " z";

  return createPath({ d, ctx });
}

/**
 * Render actionButtonReturn - return/back button
 */
export function renderActionButtonReturn(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;
  const g13 = (ss * 3) / 4;
  const g14 = (g13 * 7) / 8;
  const g15 = (g13 * 3) / 4;
  const g16 = (g13 * 5) / 8;
  const g17 = (g13 * 3) / 8;
  const g18 = g13 / 4;
  const g19 = g9 + g15;
  const g20 = g9 + g16;
  const g21 = g9 + g18;
  const g22 = g11 + g14;
  const g23 = g11 + g15;
  const g24 = g11 + g16;
  const g25 = g11 + g17;
  const g26 = g11 + g18;
  const g27 = g13 / 8;
  const cX1 = g24 - g27;
  const cY2 = g19 - g27;
  const cX3 = g11 + g17;
  const cY4 = g10 - g17;

  const d =
    "M" +
    0 +
    "," +
    h +
    " L" +
    w +
    "," +
    h +
    " L" +
    w +
    "," +
    0 +
    " L" +
    0 +
    "," +
    0 +
    " z" +
    " M" +
    g12 +
    "," +
    g21 +
    " L" +
    g23 +
    "," +
    g9 +
    " L" +
    hc +
    "," +
    g21 +
    " L" +
    g24 +
    "," +
    g21 +
    " L" +
    g24 +
    "," +
    g20 +
    shapeArc({ cX: cX1, cY: g20, rX: g27, rY: g27, stAng: 0, endAng: 90, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    g25 +
    "," +
    g19 +
    shapeArc({
      cX: g25,
      cY: cY2,
      rX: g27,
      rY: g27,
      stAng: 90,
      endAng: 180,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    g26 +
    "," +
    g21 +
    " L" +
    g11 +
    "," +
    g21 +
    " L" +
    g11 +
    "," +
    g20 +
    shapeArc({
      cX: cX3,
      cY: g20,
      rX: g17,
      rY: g17,
      stAng: 180,
      endAng: 90,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    hc +
    "," +
    g10 +
    shapeArc({ cX: hc, cY: cY4, rX: g17, rY: g17, stAng: 90, endAng: 0, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    g22 +
    "," +
    g21 +
    " z";

  return createPath({ d, ctx });
}
