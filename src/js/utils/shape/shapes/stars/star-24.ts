import type { StarShapeContext } from "./types";
import { clamp, createPath, parseSingleAdj } from "./helpers";

/**
 * Render 24-pointed star
 */
export function renderStar24(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2,
    hd4 = h / 4,
    wd4 = w / 4;
  const maxAdj = 50000 * slideFactor;

  const adj = parseSingleAdj(node, 37500, slideFactor);
  const a = clamp(adj, 0, maxAdj);

  const dx1 = wd2 * Math.cos(0.2617993878);
  const dx2 = wd2 * Math.cos(0.5235987756);
  const dx3 = wd2 * Math.cos(0.7853981634);
  const dx4 = wd4;
  const dx5 = wd2 * Math.cos(1.308996939);
  const dy1 = hd2 * Math.sin(1.308996939);
  const dy2 = hd2 * Math.sin(1.0471975512);
  const dy3 = hd2 * Math.sin(0.7853981634);
  const dy4 = hd4;
  const dy5 = hd2 * Math.sin(0.2617993878);
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc - dx3;
  const x4 = hc - dx4;
  const x5 = hc - dx5;
  const x6 = hc + dx5;
  const x7 = hc + dx4;
  const x8 = hc + dx3;
  const x9 = hc + dx2;
  const x10 = hc + dx1;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc - dy3;
  const y4 = vc - dy4;
  const y5 = vc - dy5;
  const y6 = vc + dy5;
  const y7 = vc + dy4;
  const y8 = vc + dy3;
  const y9 = vc + dy2;
  const y10 = vc + dy1;
  const iwd2 = (wd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 99144) / 100000;
  const sdx2 = (iwd2 * 92388) / 100000;
  const sdx3 = (iwd2 * 79335) / 100000;
  const sdx4 = (iwd2 * 60876) / 100000;
  const sdx5 = (iwd2 * 38268) / 100000;
  const sdx6 = (iwd2 * 13053) / 100000;
  const sdy1 = (ihd2 * 99144) / 100000;
  const sdy2 = (ihd2 * 92388) / 100000;
  const sdy3 = (ihd2 * 79335) / 100000;
  const sdy4 = (ihd2 * 60876) / 100000;
  const sdy5 = (ihd2 * 38268) / 100000;
  const sdy6 = (ihd2 * 13053) / 100000;
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc - sdx3;
  const sx4 = hc - sdx4;
  const sx5 = hc - sdx5;
  const sx6 = hc - sdx6;
  const sx7 = hc + sdx6;
  const sx8 = hc + sdx5;
  const sx9 = hc + sdx4;
  const sx10 = hc + sdx3;
  const sx11 = hc + sdx2;
  const sx12 = hc + sdx1;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc - sdy3;
  const sy4 = vc - sdy4;
  const sy5 = vc - sdy5;
  const sy6 = vc - sdy6;
  const sy7 = vc + sdy6;
  const sy8 = vc + sdy5;
  const sy9 = vc + sdy4;
  const sy10 = vc + sdy3;
  const sy11 = vc + sdy2;
  const sy12 = vc + sdy1;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy6 +
    " L" +
    x1 +
    "," +
    y5 +
    " L" +
    sx2 +
    "," +
    sy5 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    sx3 +
    "," +
    sy4 +
    " L" +
    x3 +
    "," +
    y3 +
    " L" +
    sx4 +
    "," +
    sy3 +
    " L" +
    x4 +
    "," +
    y2 +
    " L" +
    sx5 +
    "," +
    sy2 +
    " L" +
    x5 +
    "," +
    y1 +
    " L" +
    sx6 +
    "," +
    sy1 +
    " L" +
    hc +
    "," +
    0 +
    " L" +
    sx7 +
    "," +
    sy1 +
    " L" +
    x6 +
    "," +
    y1 +
    " L" +
    sx8 +
    "," +
    sy2 +
    " L" +
    x7 +
    "," +
    y2 +
    " L" +
    sx9 +
    "," +
    sy3 +
    " L" +
    x8 +
    "," +
    y3 +
    " L" +
    sx10 +
    "," +
    sy4 +
    " L" +
    x9 +
    "," +
    y4 +
    " L" +
    sx11 +
    "," +
    sy5 +
    " L" +
    x10 +
    "," +
    y5 +
    " L" +
    sx12 +
    "," +
    sy6 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx12 +
    "," +
    sy7 +
    " L" +
    x10 +
    "," +
    y6 +
    " L" +
    sx11 +
    "," +
    sy8 +
    " L" +
    x9 +
    "," +
    y7 +
    " L" +
    sx10 +
    "," +
    sy9 +
    " L" +
    x8 +
    "," +
    y8 +
    " L" +
    sx9 +
    "," +
    sy10 +
    " L" +
    x7 +
    "," +
    y9 +
    " L" +
    sx8 +
    "," +
    sy11 +
    " L" +
    x6 +
    "," +
    y10 +
    " L" +
    sx7 +
    "," +
    sy12 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx6 +
    "," +
    sy12 +
    " L" +
    x5 +
    "," +
    y10 +
    " L" +
    sx5 +
    "," +
    sy11 +
    " L" +
    x4 +
    "," +
    y9 +
    " L" +
    sx4 +
    "," +
    sy10 +
    " L" +
    x3 +
    "," +
    y8 +
    " L" +
    sx3 +
    "," +
    sy9 +
    " L" +
    x2 +
    "," +
    y7 +
    " L" +
    sx2 +
    "," +
    sy8 +
    " L" +
    x1 +
    "," +
    y6 +
    " L" +
    sx1 +
    "," +
    sy7 +
    " z";

  return createPath(d, ctx);
}
