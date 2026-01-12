import type { ActionButtonContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render actionButtonMovie - movie/video button
 */
export function renderActionButtonMovie(ctx: ActionButtonContext): string {
  const { w, h } = ctx;
  const hc = w / 2,
    vc = h / 2,
    ss = Math.min(w, h);
  const dx2 = (ss * 3) / 8;
  const g9 = vc - dx2;
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

  return createPath({ d, ctx });
}

/**
 * Render actionButtonSound - sound/speaker button
 */
export function renderActionButtonSound(ctx: ActionButtonContext): string {
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

  return createPath({ d, ctx });
}
