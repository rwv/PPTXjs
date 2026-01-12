import type { StarShapeContext } from "./types";
import { clamp, createPath, parseSingleAdj } from "./helpers";

/**
 * Render 16-pointed star
 */
export function renderStar16(ctx: StarShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const hc = w / 2,
    vc = h / 2,
    wd2 = w / 2,
    hd2 = h / 2;
  const maxAdj = 50000 * slideFactor;

  const adj = parseSingleAdj({ node, defaultVal: 37500, slideFactor });
  const a = clamp({ val: adj, min: 0, max: maxAdj });

  const dx1 = (wd2 * 92388) / 100000;
  const dx2 = (wd2 * 70711) / 100000;
  const dx3 = (wd2 * 38268) / 100000;
  const dy1 = (hd2 * 92388) / 100000;
  const dy2 = (hd2 * 70711) / 100000;
  const dy3 = (hd2 * 38268) / 100000;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc - dx3;
  const x4 = hc + dx3;
  const x5 = hc + dx2;
  const x6 = hc + dx1;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc - dy3;
  const y4 = vc + dy3;
  const y5 = vc + dy2;
  const y6 = vc + dy1;
  const iwd2 = (wd2 * a) / maxAdj;
  const ihd2 = (hd2 * a) / maxAdj;
  const sdx1 = (iwd2 * 98079) / 100000;
  const sdx2 = (iwd2 * 83147) / 100000;
  const sdx3 = (iwd2 * 55557) / 100000;
  const sdx4 = (iwd2 * 19509) / 100000;
  const sdy1 = (ihd2 * 98079) / 100000;
  const sdy2 = (ihd2 * 83147) / 100000;
  const sdy3 = (ihd2 * 55557) / 100000;
  const sdy4 = (ihd2 * 19509) / 100000;
  const sx1 = hc - sdx1;
  const sx2 = hc - sdx2;
  const sx3 = hc - sdx3;
  const sx4 = hc - sdx4;
  const sx5 = hc + sdx4;
  const sx6 = hc + sdx3;
  const sx7 = hc + sdx2;
  const sx8 = hc + sdx1;
  const sy1 = vc - sdy1;
  const sy2 = vc - sdy2;
  const sy3 = vc - sdy3;
  const sy4 = vc - sdy4;
  const sy5 = vc + sdy4;
  const sy6 = vc + sdy3;
  const sy7 = vc + sdy2;
  const sy8 = vc + sdy1;

  const d =
    "M0," +
    vc +
    " L" +
    sx1 +
    "," +
    sy4 +
    " L" +
    x1 +
    "," +
    y3 +
    " L" +
    sx2 +
    "," +
    sy3 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    sx3 +
    "," +
    sy2 +
    " L" +
    x3 +
    "," +
    y1 +
    " L" +
    sx4 +
    "," +
    sy1 +
    " L" +
    hc +
    ",0" +
    " L" +
    sx5 +
    "," +
    sy1 +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    sx6 +
    "," +
    sy2 +
    " L" +
    x5 +
    "," +
    y2 +
    " L" +
    sx7 +
    "," +
    sy3 +
    " L" +
    x6 +
    "," +
    y3 +
    " L" +
    sx8 +
    "," +
    sy4 +
    " L" +
    w +
    "," +
    vc +
    " L" +
    sx8 +
    "," +
    sy5 +
    " L" +
    x6 +
    "," +
    y4 +
    " L" +
    sx7 +
    "," +
    sy6 +
    " L" +
    x5 +
    "," +
    y5 +
    " L" +
    sx6 +
    "," +
    sy7 +
    " L" +
    x4 +
    "," +
    y6 +
    " L" +
    sx5 +
    "," +
    sy8 +
    " L" +
    hc +
    "," +
    h +
    " L" +
    sx4 +
    "," +
    sy8 +
    " L" +
    x3 +
    "," +
    y6 +
    " L" +
    sx3 +
    "," +
    sy7 +
    " L" +
    x2 +
    "," +
    y5 +
    " L" +
    sx2 +
    "," +
    sy6 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    sx1 +
    "," +
    sy5 +
    " z";

  return createPath({ d, ctx });
}
