/**
 * 10-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseMultiAdj, clamp } from "./shared";

/**
 * Render 10-pointed star
 */
export function renderStar10(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;

  const parsed = parseMultiAdj(node, { adj: 42533, hf: 105146 }, slideFactor);
  const a = clamp(parsed.adj, 0, maxAdj);
  const hf = parsed.hf;

  const swd2 = (wd2 * hf) / cnstVal1;
  const dx1 = (swd2 * 95106) / 100000;
  const dx2 = (swd2 * 58779) / 100000;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const dy1 = (hd2 * 80902) / 100000;
  const dy2 = (hd2 * 30902) / 100000;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y4 = vc + dy1;
  const iwd2 = (swd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 80902) / 100000;
  const sdx2 = (iwd2 * 30902) / 100000;
  const sdy1 = (ihd2 * 95106) / 100000;
  const sdy2 = (ihd2 * 58779) / 100000;
  const sx1 = hc - iwd2;
  const sx2 = hc - sdx1;
  const sx3 = hc - sdx2;
  const sx4 = hc + sdx2;
  const sx5 = hc + sdx1;
  const sx6 = hc + iwd2;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc + sdy2;
  const sy4 = vc + sdy1;

  const d =
    "M" +
    x1 +
    "," +
    y2 +
    " L" +
    sx2 +
    "," +
    sy2 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    sx3 +
    "," +
    sy1 +
    " L" +
    hc +
    ",0" +
    " L" +
    sx4 +
    "," +
    sy1 +
    " L" +
    x3 +
    "," +
    y1 +
    " L" +
    sx5 +
    "," +
    sy2 +
    " L" +
    x4 +
    "," +
    y2 +
    " L" +
    sx6 +
    "," +
    vc +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    sx5 +
    "," +
    sy3 +
    " L" +
    x3 +
    "," +
    y4 +
    " L" +
    sx4 +
    "," +
    sy4 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx3 +
    "," +
    sy4 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    sx2 +
    "," +
    sy3 +
    " L" +
    x1 +
    "," +
    y3 +
    " L" +
    sx1 +
    "," +
    vc +
    " z";

  return createStarPath(d, ctx);
}
