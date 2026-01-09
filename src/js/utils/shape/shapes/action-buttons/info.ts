import { shapeArc } from "../helpers/arc";
import type { ActionButtonContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render actionButtonDocument - document button
 */
export function renderActionButtonDocument(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g10 = vc + dx2;
  const dx1 = (ss * 9) / 32;
  const g11 = hc - dx1;
  const g12 = hc + dx1;
  const g13 = (ss * 3) / 16;
  const g14 = g12 - g13;
  const g15 = g9 + g13;

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
    g9 +
    " L" +
    g14 +
    "," +
    g9 +
    " L" +
    g12 +
    "," +
    g15 +
    " L" +
    g12 +
    "," +
    g10 +
    " L" +
    g11 +
    "," +
    g10 +
    " z" +
    "M" +
    g14 +
    "," +
    g9 +
    " L" +
    g14 +
    "," +
    g15 +
    " L" +
    g12 +
    "," +
    g15 +
    " z";

  return createPath(d, ctx);
}

/**
 * Render actionButtonHelp - help button with question mark
 */
export function renderActionButtonHelp(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g11 = hc - dx2;
  const g13 = (ss * 3) / 4;
  const g14 = g13 / 7;
  const g15 = (g13 * 3) / 14;
  const g16 = (g13 * 2) / 7;
  const g19 = (g13 * 3) / 7;
  const g20 = (g13 * 4) / 7;
  const g21 = (g13 * 17) / 28;
  const g23 = (g13 * 21) / 28;
  const g24 = (g13 * 11) / 14;
  const g27 = g9 + g16;
  const g29 = g9 + g21;
  const g30 = g9 + g23;
  const g31 = g9 + g24;
  const g33 = g11 + g15;
  const g36 = g11 + g19;
  const g37 = g11 + g20;
  const g41 = g13 / 14;
  const g42 = (g13 * 3) / 28;
  const cX1 = g33 + g16;
  const cX2 = g36 + g14;
  const cY3 = g31 + g42;
  const cX4 = (g37 + g36 + g16) / 2;

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
    g33 +
    "," +
    g27 +
    shapeArc(cX1, g27, g16, g16, 180, 360, false).replace("M", "L") +
    shapeArc(cX4, g27, g14, g15, 0, 90, false).replace("M", "L") +
    shapeArc(cX4, g29, g41, g42, 270, 180, false).replace("M", "L") +
    " L" +
    g37 +
    "," +
    g30 +
    " L" +
    g36 +
    "," +
    g30 +
    " L" +
    g36 +
    "," +
    g29 +
    shapeArc(cX2, g29, g14, g15, 180, 270, false).replace("M", "L") +
    shapeArc(g37, g27, g41, g42, 90, 0, false).replace("M", "L") +
    shapeArc(cX1, g27, g14, g14, 0, -180, false).replace("M", "L") +
    " z" +
    "M" +
    hc +
    "," +
    g31 +
    shapeArc(hc, cY3, g42, g42, 270, 630, false).replace("M", "L") +
    " z";

  return createPath(d, ctx);
}

/**
 * Render actionButtonHome - home navigation button
 */
export function renderActionButtonHome(ctx: ActionButtonContext): string {
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
  const g14 = g13 / 16;
  const g15 = g13 / 8;
  const g16 = (g13 * 3) / 16;
  const g17 = (g13 * 5) / 16;
  const g18 = (g13 * 7) / 16;
  const g19 = (g13 * 9) / 16;
  const g20 = (g13 * 11) / 16;
  const g21 = (g13 * 3) / 4;
  const g22 = (g13 * 13) / 16;
  const g23 = (g13 * 7) / 8;
  const g24 = g9 + g14;
  const g25 = g9 + g16;
  const g26 = g9 + g17;
  const g27 = g9 + g21;
  const g28 = g11 + g15;
  const g29 = g11 + g18;
  const g30 = g11 + g19;
  const g31 = g11 + g20;
  const g32 = g11 + g22;
  const g33 = g11 + g23;

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
    " M" +
    hc +
    "," +
    g9 +
    " L" +
    g11 +
    "," +
    vc +
    " L" +
    g28 +
    "," +
    vc +
    " L" +
    g28 +
    "," +
    g10 +
    " L" +
    g33 +
    "," +
    g10 +
    " L" +
    g33 +
    "," +
    vc +
    " L" +
    g12 +
    "," +
    vc +
    " L" +
    g32 +
    "," +
    g26 +
    " L" +
    g32 +
    "," +
    g24 +
    " L" +
    g31 +
    "," +
    g24 +
    " L" +
    g31 +
    "," +
    g25 +
    " z" +
    " M" +
    g29 +
    "," +
    g27 +
    " L" +
    g30 +
    "," +
    g27 +
    " L" +
    g30 +
    "," +
    g10 +
    " L" +
    g29 +
    "," +
    g10 +
    " z";

  return createPath(d, ctx);
}

/**
 * Render actionButtonInformation - information button with "i"
 */
export function renderActionButtonInformation(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const g11 = hc - dx2;
  const g13 = (ss * 3) / 4;
  const g14 = g13 / 32;
  const g17 = (g13 * 5) / 16;
  const g18 = (g13 * 3) / 8;
  const g19 = (g13 * 13) / 32;
  const g20 = (g13 * 19) / 32;
  const g22 = (g13 * 11) / 16;
  const g23 = (g13 * 13) / 16;
  const g24 = (g13 * 7) / 8;
  const g25 = g9 + g14;
  const g28 = g9 + g17;
  const g29 = g9 + g18;
  const g30 = g9 + g23;
  const g31 = g9 + g24;
  const g32 = g11 + g17;
  const g34 = g11 + g19;
  const g35 = g11 + g20;
  const g37 = g11 + g22;
  const g38 = (g13 * 3) / 32;
  const cY1 = g9 + dx2;
  const cY2 = g25 + g38;

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
    hc +
    "," +
    g9 +
    shapeArc(hc, cY1, dx2, dx2, 270, 630, false).replace("M", "L") +
    " z" +
    "M" +
    hc +
    "," +
    g25 +
    shapeArc(hc, cY2, g38, g38, 270, 630, false).replace("M", "L") +
    "M" +
    g32 +
    "," +
    g28 +
    " L" +
    g35 +
    "," +
    g28 +
    " L" +
    g35 +
    "," +
    g30 +
    " L" +
    g37 +
    "," +
    g30 +
    " L" +
    g37 +
    "," +
    g31 +
    " L" +
    g32 +
    "," +
    g31 +
    " L" +
    g32 +
    "," +
    g30 +
    " L" +
    g34 +
    "," +
    g30 +
    " L" +
    g34 +
    "," +
    g29 +
    " L" +
    g32 +
    "," +
    g29 +
    " z";

  return createPath(d, ctx);
}
