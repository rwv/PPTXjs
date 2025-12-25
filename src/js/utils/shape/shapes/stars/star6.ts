/**
 * 6-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseMultiAdj, clamp } from "./shared";

/**
 * Render 6-pointed star
 */
export function renderStar6(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2,
    hd4 = h / 4;
  const maxAdj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;

  const parsed = parseMultiAdj(node, { adj: 28868, hf: 115470 }, slideFactor);
  const a = clamp(parsed.adj, 0, maxAdj);
  const hf = parsed.hf;

  const swd2 = (wd2 * hf) / cnstVal1;
  const dx1 = swd2 * Math.cos(0.5235987756);
  const x1 = hc - dx1;
  const x2 = hc + dx1;
  const y2 = vc + hd4;
  const iwd2 = (swd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx2 = iwd2 / 2;
  const sx1 = hc - iwd2;
  const sx2 = hc - sdx2;
  const sx3 = hc + sdx2;
  const sx4 = hc + iwd2;
  const sdy1 = ihd2 * Math.sin(1.0471975512);
  const sy1 = vc - sdy1;
  const sy2 = vc + sdy1;

  const d =
    "M" +
    x1 +
    "," +
    hd4 +
    " L" +
    sx2 +
    "," +
    sy1 +
    " L" +
    hc +
    ",0" +
    " L" +
    sx3 +
    "," +
    sy1 +
    " L" +
    x2 +
    "," +
    hd4 +
    " L" +
    sx4 +
    "," +
    vc +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    sx3 +
    "," +
    sy2 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx2 +
    "," +
    sy2 +
    " L" +
    x1 +
    "," +
    y2 +
    " L" +
    sx1 +
    "," +
    vc +
    " z";

  return createStarPath(d, ctx);
}
