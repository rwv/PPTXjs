/**
 * 5-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseMultiAdj, clamp } from "./shared";

/**
 * Render 5-pointed star
 */
export function renderStar5(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;

  const parsed = parseMultiAdj(node, { adj: 19098, hf: 105146, vf: 110557 }, slideFactor);
  const a = clamp(parsed.adj, 0, maxAdj);
  const hf = parsed.hf;
  const vf = parsed.vf;

  const swd2 = (wd2 * hf) / cnstVal1;
  const shd2 = (hd2 * vf) / cnstVal1;
  const svc = (vc * vf) / cnstVal1;
  const dx1 = swd2 * Math.cos(0.31415926536);
  const dx2 = swd2 * Math.cos(5.3407075111);
  const dy1 = shd2 * Math.sin(0.31415926536);
  const dy2 = shd2 * Math.sin(5.3407075111);
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const y1 = svc - dy1;
  const y2 = svc - dy2;
  const iwd2 = (swd2 * a) / maxAdj;
  const ihd2 = (shd2 * a) / maxAdj;
  const sdx1 = iwd2 * Math.cos(5.9690260418);
  const sdx2 = iwd2 * Math.cos(0.94247779608);
  const sdy1 = ihd2 * Math.sin(0.94247779608);
  const sdy2 = ihd2 * Math.sin(5.9690260418);
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc + sdx2;
  const sx4 = hc + sdx1;
  const sy1 = svc - sdy1;
  const sy2 = svc - sdy2;
  const sy3 = svc + ihd2;

  const d =
    "M" +
    x1 +
    "," +
    y1 +
    " L" +
    sx2 +
    "," +
    sy1 +
    " L" +
    hc +
    "," +
    0 +
    " L" +
    sx3 +
    "," +
    sy1 +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    sx4 +
    "," +
    sy2 +
    " L" +
    x3 +
    "," +
    y2 +
    " L" +
    hc +
    "," +
    sy3 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    sx1 +
    "," +
    sy2 +
    " z";

  return createStarPath(d, ctx);
}
