import type { StarShapeContext } from "./types";
import { clamp, createPath, parseSingleAdj } from "./helpers";

/**
 * Render 12-pointed star
 */
export function renderStar12(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2,
    hd4 = h / 4,
    wd4 = w / 4;
  const maxAdj = 50000 * slideFactor;

  const adj = parseSingleAdj({ node, defaultVal: 37500, slideFactor });
  const a = clamp({ val: adj, min: 0, max: maxAdj });

  const dx1 = wd2 * Math.cos(0.5235987756);
  const dy1 = hd2 * Math.sin(1.0471975512);
  const x1 = hc - dx1;
  const x3 = (w * 3) / 4;
  const x4 = hc + dx1;
  const y1 = vc - dy1;
  const y3 = (h * 3) / 4;
  const y4 = vc + dy1;
  const iwd2 = (wd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = iwd2 * Math.cos(0.2617993878);
  const sdx2 = iwd2 * Math.cos(0.7853981634);
  const sdx3 = iwd2 * Math.cos(1.308996939);
  const sdy1 = ihd2 * Math.sin(1.308996939);
  const sdy2 = ihd2 * Math.sin(0.7853981634);
  const sdy3 = ihd2 * Math.sin(0.2617993878);
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc - sdx3;
  const sx4 = hc + sdx3;
  const sx5 = hc + sdx2;
  const sx6 = hc + sdx1;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc - sdy3;
  const sy4 = vc + sdy3;
  const sy5 = vc + sdy2;
  const sy6 = vc + sdy1;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy3 +
    " L" +
    x1 +
    "," +
    hd4 +
    " L" +
    sx2 +
    "," +
    sy2 +
    " L" +
    wd4 +
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
    hd4 +
    " L" +
    sx6 +
    "," +
    sy3 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx6 +
    "," +
    sy4 +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    sx5 +
    "," +
    sy5 +
    " L" +
    x3 +
    "," +
    y4 +
    " L" +
    sx4 +
    "," +
    sy6 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx3 +
    "," +
    sy6 +
    " L" +
    wd4 +
    "," +
    y4 +
    " L" +
    sx2 +
    "," +
    sy5 +
    " L" +
    x1 +
    "," +
    y3 +
    " L" +
    sx1 +
    "," +
    sy4 +
    " z";

  return createPath({ d, ctx });
}
