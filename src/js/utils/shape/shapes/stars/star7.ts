/**
 * 7-pointed star shape renderer.
 */

import type { StarShapeContext } from "./shared";
import { createStarPath, parseMultiAdj, clamp } from "./shared";

/**
 * Render 7-pointed star
 */
export function renderStar7(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;

  const parsed = parseMultiAdj(node, { adj: 34601, hf: 102572, vf: 105210 }, slideFactor);
  const a = clamp(parsed.adj, 0, maxAdj);
  const hf = parsed.hf;
  const vf = parsed.vf;

  const swd2 = (wd2 * hf) / cnstVal1;
  const shd2 = (hd2 * vf) / cnstVal1;
  const svc = (vc * vf) / cnstVal1;
  const dx1 = (swd2 * 97493) / 100000;
  const dx2 = (swd2 * 78183) / 100000;
  const dx3 = (swd2 * 43388) / 100000;
  const dy1 = (shd2 * 62349) / 100000;
  const dy2 = (shd2 * 22252) / 100000;
  const dy3 = (shd2 * 90097) / 100000;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc - dx3;
  const x4 = hc + dx3;
  const x5 = hc + dx2;
  const x6 = hc + dx1;
  const y1 = svc - dy1;
  const y2 = svc + dy2;
  const y3 = svc + dy3;
  const iwd2 = (swd2 * a) / maxAdj;
  const ihd2 = (shd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 97493) / 100000;
  const sdx2 = (iwd2 * 78183) / 100000;
  const sdx3 = (iwd2 * 43388) / 100000;
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc - sdx3;
  const sx4 = hc + sdx3;
  const sx5 = hc + sdx2;
  const sx6 = hc + sdx1;
  const sdy1 = (ihd2 * 90097) / 100000;
  const sdy2 = (ihd2 * 22252) / 100000;
  const sdy3 = (ihd2 * 62349) / 100000;
  const sy1 = svc - sdy1;
  const sy2 = svc - sdy2;
  const sy3 = svc + sdy3;
  const sy4 = svc + ihd2;

  const d =
    "M" +
    x1 +
    "," +
    y2 +
    " L" +
    sx1 +
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
    x5 +
    "," +
    y1 +
    " L" +
    sx6 +
    "," +
    sy2 +
    " L" +
    x6 +
    "," +
    y2 +
    " L" +
    sx5 +
    "," +
    sy3 +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    hc +
    "," +
    sy4 +
    " L" +
    x3 +
    "," +
    y3 +
    " L" +
    sx2 +
    "," +
    sy3 +
    " z";

  return createStarPath(d, ctx);
}
