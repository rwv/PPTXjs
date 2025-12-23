/**
 * Action button shape rendering functions.
 *
 * Handles PowerPoint action button shapes:
 * - actionButtonBackPrevious, actionButtonBeginning, actionButtonDocument
 * - actionButtonEnd, actionButtonForwardNext, actionButtonHelp
 * - actionButtonHome, actionButtonInformation, actionButtonMovie
 * - actionButtonReturn, actionButtonSound
 *
 * Note: actionButtonBlank shares rendering with rect and remains in gen-shape.ts
 */

import { shapeArc } from "./helpers/arc";

/**
 * Context for rendering action button shapes
 */
export interface ActionButtonContext {
  w: number;
  h: number;
  shpId: string;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
}

/**
 * List of action button shape types handled by this module
 */
export const ACTION_BUTTON_TYPES = [
  "actionButtonBackPrevious",
  "actionButtonBeginning",
  "actionButtonDocument",
  "actionButtonEnd",
  "actionButtonForwardNext",
  "actionButtonHelp",
  "actionButtonHome",
  "actionButtonInformation",
  "actionButtonMovie",
  "actionButtonReturn",
  "actionButtonSound",
] as const;

/**
 * Generate fill attribute string for SVG path
 */
function getFillAttr(ctx: ActionButtonContext): string {
  const { imgFillFlg, grndFillFlg, shpId, fillColor } = ctx;
  if (imgFillFlg) {
    return `url(#imgPtrn_${shpId})`;
  }
  if (grndFillFlg) {
    return `url(#linGrd_${shpId})`;
  }
  return fillColor;
}

/**
 * Generate stroke attributes string for SVG path
 */
function getStrokeAttrs(ctx: ActionButtonContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element with fill and stroke
 */
function createPath(d: string, ctx: ActionButtonContext): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Action Button Shape Renderers
// =============================================================================

/**
 * Render actionButtonBackPrevious - back/previous navigation button
 */
function renderActionButtonBackPrevious(ctx: ActionButtonContext): string {
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

  return createPath(d, ctx);
}

/**
 * Render actionButtonBeginning - beginning/first navigation button
 */
function renderActionButtonBeginning(ctx: ActionButtonContext): string {
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

  return createPath(d, ctx);
}

/**
 * Render actionButtonDocument - document button
 */
function renderActionButtonDocument(ctx: ActionButtonContext): string {
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
 * Render actionButtonEnd - end/last navigation button
 */
function renderActionButtonEnd(ctx: ActionButtonContext): string {
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

  return createPath(d, ctx);
}

/**
 * Render actionButtonForwardNext - forward/next navigation button
 */
function renderActionButtonForwardNext(ctx: ActionButtonContext): string {
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

  return createPath(d, ctx);
}

/**
 * Render actionButtonHelp - help button with question mark
 */
function renderActionButtonHelp(ctx: ActionButtonContext): string {
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
function renderActionButtonHome(ctx: ActionButtonContext): string {
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
function renderActionButtonInformation(ctx: ActionButtonContext): string {
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

/**
 * Render actionButtonMovie - movie/video button
 */
function renderActionButtonMovie(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
  const _g10 = vc + dx2;
  const g11 = hc - dx2;
  const g12 = hc + dx2;
  const g13 = (ss * 3) / 4;
  const g14 = (g13 * 1455) / 21600;
  const g15 = (g13 * 1905) / 21600;
  const g16 = (g13 * 2325) / 21600;
  const g17 = (g13 * 16155) / 21600;
  const g18 = (g13 * 17010) / 21600;
  const g19 = (g13 * 19335) / 21600;
  const g20 = (g13 * 19725) / 21600;
  const g21 = (g13 * 20595) / 21600;
  const g22 = (g13 * 5280) / 21600;
  const g23 = (g13 * 5730) / 21600;
  const g24 = (g13 * 6630) / 21600;
  const g25 = (g13 * 7492) / 21600;
  const g26 = (g13 * 9067) / 21600;
  const g27 = (g13 * 9555) / 21600;
  const g28 = (g13 * 13342) / 21600;
  const g29 = (g13 * 14580) / 21600;
  const g30 = (g13 * 15592) / 21600;
  const g31 = g11 + g14;
  const g32 = g11 + g15;
  const g33 = g11 + g16;
  const g34 = g11 + g17;
  const g35 = g11 + g18;
  const g36 = g11 + g19;
  const g37 = g11 + g20;
  const g38 = g11 + g21;
  const g39 = g9 + g22;
  const g40 = g9 + g23;
  const g41 = g9 + g24;
  const g42 = g9 + g25;
  const g43 = g9 + g26;
  const g44 = g9 + g27;
  const g45 = g9 + g28;
  const g46 = g9 + g29;
  const g47 = g9 + g30;

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
    "M" +
    g11 +
    "," +
    g39 +
    " L" +
    g11 +
    "," +
    g44 +
    " L" +
    g31 +
    "," +
    g44 +
    " L" +
    g32 +
    "," +
    g43 +
    " L" +
    g33 +
    "," +
    g43 +
    " L" +
    g33 +
    "," +
    g47 +
    " L" +
    g35 +
    "," +
    g47 +
    " L" +
    g35 +
    "," +
    g45 +
    " L" +
    g36 +
    "," +
    g45 +
    " L" +
    g38 +
    "," +
    g46 +
    " L" +
    g12 +
    "," +
    g46 +
    " L" +
    g12 +
    "," +
    g41 +
    " L" +
    g38 +
    "," +
    g41 +
    " L" +
    g37 +
    "," +
    g42 +
    " L" +
    g35 +
    "," +
    g42 +
    " L" +
    g35 +
    "," +
    g41 +
    " L" +
    g34 +
    "," +
    g40 +
    " L" +
    g32 +
    "," +
    g40 +
    " L" +
    g31 +
    "," +
    g39 +
    " z";

  return createPath(d, ctx);
}

/**
 * Render actionButtonReturn - return/back button
 */
function renderActionButtonReturn(ctx: ActionButtonContext): string {
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
    shapeArc(cX1, g20, g27, g27, 0, 90, false).replace("M", "L") +
    " L" +
    g25 +
    "," +
    g19 +
    shapeArc(g25, cY2, g27, g27, 90, 180, false).replace("M", "L") +
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
    shapeArc(cX3, g20, g17, g17, 180, 90, false).replace("M", "L") +
    " L" +
    hc +
    "," +
    g10 +
    shapeArc(hc, cY4, g17, g17, 90, 0, false).replace("M", "L") +
    " L" +
    g22 +
    "," +
    g21 +
    " z";

  return createPath(d, ctx);
}

/**
 * Render actionButtonSound - sound/speaker button
 */
function renderActionButtonSound(ctx: ActionButtonContext): string {
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
  const g15 = (g13 * 5) / 16;
  const g16 = (g13 * 5) / 8;
  const g17 = (g13 * 11) / 16;
  const g18 = (g13 * 3) / 4;
  const g19 = (g13 * 7) / 8;
  const g20 = g9 + g14;
  const g21 = g9 + g15;
  const g22 = g9 + g17;
  const g23 = g9 + g19;
  const g24 = g11 + g15;
  const g25 = g11 + g16;
  const g26 = g11 + g18;

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
    g11 +
    "," +
    g21 +
    " L" +
    g24 +
    "," +
    g21 +
    " L" +
    g25 +
    "," +
    g9 +
    " L" +
    g25 +
    "," +
    g10 +
    " L" +
    g24 +
    "," +
    g22 +
    " L" +
    g11 +
    "," +
    g22 +
    " z" +
    " M" +
    g26 +
    "," +
    g21 +
    " L" +
    g12 +
    "," +
    g20 +
    " M" +
    g26 +
    "," +
    vc +
    " L" +
    g12 +
    "," +
    vc +
    " M" +
    g26 +
    "," +
    g22 +
    " L" +
    g12 +
    "," +
    g23;

  return createPath(d, ctx);
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const ACTION_BUTTON_RENDERERS: Record<string, (ctx: ActionButtonContext) => string> = {
  actionButtonBackPrevious: renderActionButtonBackPrevious,
  actionButtonBeginning: renderActionButtonBeginning,
  actionButtonDocument: renderActionButtonDocument,
  actionButtonEnd: renderActionButtonEnd,
  actionButtonForwardNext: renderActionButtonForwardNext,
  actionButtonHelp: renderActionButtonHelp,
  actionButtonHome: renderActionButtonHome,
  actionButtonInformation: renderActionButtonInformation,
  actionButtonMovie: renderActionButtonMovie,
  actionButtonReturn: renderActionButtonReturn,
  actionButtonSound: renderActionButtonSound,
};

/**
 * Check if a shape type is an action button shape handled by this module
 */
export function isActionButtonShape(shapType: string): boolean {
  return shapType in ACTION_BUTTON_RENDERERS;
}

/**
 * Render an action button shape
 * @returns SVG string for the shape, or empty string if not an action button shape
 */
export function renderActionButtonShape(shapType: string, ctx: ActionButtonContext): string {
  const renderer = ACTION_BUTTON_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
