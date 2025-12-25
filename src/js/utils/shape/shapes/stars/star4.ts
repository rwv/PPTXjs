/**
 * 4-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseSingleAdj, clamp } from "./shared";

/**
 * Render 4-pointed star
 */
export function renderStar4(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const cnstVal1 = 50000 * slideFactor;

  const adj = parseSingleAdj(node, 19098, slideFactor);
  const a = clamp(adj, 0, cnstVal1);

  const iwd2 = (wd2 * a) / cnstVal1;
  const ihd2 = (hd2 * a) / cnstVal1;
  const sdx = iwd2 * Math.cos(0.7853981634);
  const sdy = ihd2 * Math.sin(0.7853981634);
  const sx1 = hc - sdx;
  const sx2 = hc + sdx;
  const sy1 = vc - sdy;
  const sy2 = vc + sdy;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy1 +
    " L" +
    hc +
    ",0" +
    " L" +
    sx2 +
    "," +
    sy1 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx2 +
    "," +
    sy2 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx1 +
    "," +
    sy2 +
    " z";

  return createStarPath(d, ctx);
}
