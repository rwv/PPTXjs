/**
 * Navigation action button renderers.
 *
 * Handles: back/previous, forward/next, beginning, end buttons
 */

import type { ActionButtonContext } from "./shared";
import { createPath } from "./shared";

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

  return createPath(d, ctx);
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

  return createPath(d, ctx);
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

  return createPath(d, ctx);
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

  return createPath(d, ctx);
}
