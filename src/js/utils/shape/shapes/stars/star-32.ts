import type { StarShapeContext } from "./types";
import { clamp, createPath, parseSingleAdj } from "./helpers";

/**
 * Render 32-pointed star
 */
export function renderStar32(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;

  const adj = parseSingleAdj({ node, defaultVal: 37500, slideFactor });
  const a = clamp({ val: adj, min: 0, max: maxAdj });

  const dx1 = (wd2 * 98079) / 100000;
  const dx2 = (wd2 * 92388) / 100000;
  const dx3 = (wd2 * 83147) / 100000;
  const dx4 = wd2 * Math.cos(0.7853981634);
  const dx5 = (wd2 * 55557) / 100000;
  const dx6 = (wd2 * 38268) / 100000;
  const dx7 = (wd2 * 19509) / 100000;
  const dy1 = (hd2 * 98079) / 100000;
  const dy2 = (hd2 * 92388) / 100000;
  const dy3 = (hd2 * 83147) / 100000;
  const dy4 = hd2 * Math.sin(0.7853981634);
  const dy5 = (hd2 * 55557) / 100000;
  const dy6 = (hd2 * 38268) / 100000;
  const dy7 = (hd2 * 19509) / 100000;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc - dx3;
  const x4 = hc - dx4;
  const x5 = hc - dx5;
  const x6 = hc - dx6;
  const x7 = hc - dx7;
  const x8 = hc + dx7;
  const x9 = hc + dx6;
  const x10 = hc + dx5;
  const x11 = hc + dx4;
  const x12 = hc + dx3;
  const x13 = hc + dx2;
  const x14 = hc + dx1;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc - dy3;
  const y4 = vc - dy4;
  const y5 = vc - dy5;
  const y6 = vc - dy6;
  const y7 = vc - dy7;
  const y8 = vc + dy7;
  const y9 = vc + dy6;
  const y10 = vc + dy5;
  const y11 = vc + dy4;
  const y12 = vc + dy3;
  const y13 = vc + dy2;
  const y14 = vc + dy1;
  const iwd2 = (wd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 99518) / 100000;
  const sdx2 = (iwd2 * 95694) / 100000;
  const sdx3 = (iwd2 * 88192) / 100000;
  const sdx4 = (iwd2 * 77301) / 100000;
  const sdx5 = (iwd2 * 63439) / 100000;
  const sdx6 = (iwd2 * 47140) / 100000;
  const sdx7 = (iwd2 * 29028) / 100000;
  const sdx8 = (iwd2 * 9802) / 100000;
  const sdy1 = (ihd2 * 99518) / 100000;
  const sdy2 = (ihd2 * 95694) / 100000;
  const sdy3 = (ihd2 * 88192) / 100000;
  const sdy4 = (ihd2 * 77301) / 100000;
  const sdy5 = (ihd2 * 63439) / 100000;
  const sdy6 = (ihd2 * 47140) / 100000;
  const sdy7 = (ihd2 * 29028) / 100000;
  const sdy8 = (ihd2 * 9802) / 100000;
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc - sdx3;
  const sx4 = hc - sdx4;
  const sx5 = hc - sdx5;
  const sx6 = hc - sdx6;
  const sx7 = hc - sdx7;
  const sx8 = hc - sdx8;
  const sx9 = hc + sdx8;
  const sx10 = hc + sdx7;
  const sx11 = hc + sdx6;
  const sx12 = hc + sdx5;
  const sx13 = hc + sdx4;
  const sx14 = hc + sdx3;
  const sx15 = hc + sdx2;
  const sx16 = hc + sdx1;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc - sdy3;
  const sy4 = vc - sdy4;
  const sy5 = vc - sdy5;
  const sy6 = vc - sdy6;
  const sy7 = vc - sdy7;
  const sy8 = vc - sdy8;
  const sy9 = vc + sdy8;
  const sy10 = vc + sdy7;
  const sy11 = vc + sdy6;
  const sy12 = vc + sdy5;
  const sy13 = vc + sdy4;
  const sy14 = vc + sdy3;
  const sy15 = vc + sdy2;
  const sy16 = vc + sdy1;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy8 +
    " L" +
    x1 +
    "," +
    y7 +
    " L" +
    sx2 +
    "," +
    sy7 +
    " L" +
    x2 +
    "," +
    y6 +
    " L" +
    sx3 +
    "," +
    sy6 +
    " L" +
    x3 +
    "," +
    y5 +
    " L" +
    sx4 +
    "," +
    sy5 +
    " L" +
    x4 +
    "," +
    y4 +
    " L" +
    sx5 +
    "," +
    sy4 +
    " L" +
    x5 +
    "," +
    y3 +
    " L" +
    sx6 +
    "," +
    sy3 +
    " L" +
    x6 +
    "," +
    y2 +
    " L" +
    sx7 +
    "," +
    sy2 +
    " L" +
    x7 +
    "," +
    y1 +
    " L" +
    sx8 +
    "," +
    sy1 +
    " L" +
    hc +
    "," +
    0 +
    " L" +
    sx9 +
    "," +
    sy1 +
    " L" +
    x8 +
    "," +
    y1 +
    " L" +
    sx10 +
    "," +
    sy2 +
    " L" +
    x9 +
    "," +
    y2 +
    " L" +
    sx11 +
    "," +
    sy3 +
    " L" +
    x10 +
    "," +
    y3 +
    " L" +
    sx12 +
    "," +
    sy4 +
    " L" +
    x11 +
    "," +
    y4 +
    " L" +
    sx13 +
    "," +
    sy5 +
    " L" +
    x12 +
    "," +
    y5 +
    " L" +
    sx14 +
    "," +
    sy6 +
    " L" +
    x13 +
    "," +
    y6 +
    " L" +
    sx15 +
    "," +
    sy7 +
    " L" +
    x14 +
    "," +
    y7 +
    " L" +
    sx16 +
    "," +
    sy8 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx16 +
    "," +
    sy9 +
    " L" +
    x14 +
    "," +
    y8 +
    " L" +
    sx15 +
    "," +
    sy10 +
    " L" +
    x13 +
    "," +
    y9 +
    " L" +
    sx14 +
    "," +
    sy11 +
    " L" +
    x12 +
    "," +
    y10 +
    " L" +
    sx13 +
    "," +
    sy12 +
    " L" +
    x11 +
    "," +
    y11 +
    " L" +
    sx12 +
    "," +
    sy13 +
    " L" +
    x10 +
    "," +
    y12 +
    " L" +
    sx11 +
    "," +
    sy14 +
    " L" +
    x9 +
    "," +
    y13 +
    " L" +
    sx10 +
    "," +
    sy15 +
    " L" +
    x8 +
    "," +
    y14 +
    " L" +
    sx9 +
    "," +
    sy16 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx8 +
    "," +
    sy16 +
    " L" +
    x7 +
    "," +
    y14 +
    " L" +
    sx7 +
    "," +
    sy15 +
    " L" +
    x6 +
    "," +
    y13 +
    " L" +
    sx6 +
    "," +
    sy14 +
    " L" +
    x5 +
    "," +
    y12 +
    " L" +
    sx5 +
    "," +
    sy13 +
    " L" +
    x4 +
    "," +
    y11 +
    " L" +
    sx4 +
    "," +
    sy12 +
    " L" +
    x3 +
    "," +
    y10 +
    " L" +
    sx3 +
    "," +
    sy11 +
    " L" +
    x2 +
    "," +
    y9 +
    " L" +
    sx2 +
    "," +
    sy10 +
    " L" +
    x1 +
    "," +
    y8 +
    " L" +
    sx1 +
    "," +
    sy9 +
    " z";

  return createPath({ d, ctx });
}
