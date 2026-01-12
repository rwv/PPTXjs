import type { StarShapeContext } from "./types";
import { clamp, createPath, parseMultiAdj, parseSingleAdj } from "./helpers";

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

  const adj = parseSingleAdj({ node, defaultVal: 19098, slideFactor });
  const a = clamp({ val: adj, min: 0, max: cnstVal1 });

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

  return createPath({ d, ctx });
}

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

  const parsed = parseMultiAdj({
    node,
    defaults: { adj: 19098, hf: 105146, vf: 110557 },
    slideFactor,
  });
  const a = clamp({ val: parsed.adj, min: 0, max: maxAdj });
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

  return createPath({ d, ctx });
}

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

  const parsed = parseMultiAdj({
    node,
    defaults: { adj: 28868, hf: 115470 },
    slideFactor,
  });
  const a = clamp({ val: parsed.adj, min: 0, max: maxAdj });
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

  return createPath({ d, ctx });
}

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

  const parsed = parseMultiAdj({
    node,
    defaults: { adj: 34601, hf: 102572, vf: 105210 },
    slideFactor,
  });
  const a = clamp({ val: parsed.adj, min: 0, max: maxAdj });
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

  return createPath({ d, ctx });
}

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

  const adj = parseSingleAdj({ node, defaultVal: 37500, slideFactor });
  const a = clamp({ val: adj, min: 0, max: maxAdj });

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

  return createPath({ d, ctx });
}

/**
 * Render 10-pointed star
 */
