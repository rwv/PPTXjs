/**
 * 8-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseSingleAdj, clamp } from "./shared";

/**
 * Render 8-pointed star
 */
export function renderStar8(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;

  const adj = parseSingleAdj(node, 37500, slideFactor);
  const a = clamp(adj, 0, maxAdj);

  const dx1 = wd2 * Math.cos(0.7853981634);
  const x1 = hc - dx1;
  const x2 = hc + dx1;
  const dy1 = hd2 * Math.sin(0.7853981634);
  const y1 = vc - dy1;
  const y2 = vc + dy1;
  const iwd2 = (wd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 92388) / 100000;
  const sdx2 = (iwd2 * 38268) / 100000;
  const sdy1 = (ihd2 * 92388) / 100000;
  const sdy2 = (ihd2 * 38268) / 100000;
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc + sdx2;
  const sx4 = hc + sdx1;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc + sdy2;
  const sy4 = vc + sdy1;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy2 +
    " L" +
    x1 +
    "," +
    y1 +
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
    y1 +
    " L" +
    sx4 +
    "," +
    sy2 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx4 +
    "," +
    sy3 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    sx3 +
    "," +
    sy4 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx2 +
    "," +
    sy4 +
    " L" +
    x1 +
    "," +
    y2 +
    " L" +
    sx1 +
    "," +
    sy3 +
    " z";

  return createStarPath(d, ctx);
}
