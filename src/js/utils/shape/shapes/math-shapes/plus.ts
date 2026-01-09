import type { MathShapeContext } from "./types";
import { createPath, getMathShapeAdjustments } from "./helpers";

export function renderMathPlus(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const adjustments = getMathShapeAdjustments(node);
  let { adj1 } = adjustments;
  const cnstVal3 = 200000 * slideFactor;
  const hc = w / 2;
  const vc = h / 2;
  let dVal = "";
  if (!adjustments.hasAdjustments) {
    adj1 = 23520 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
  }
  const cnstVal6 = 73490 * slideFactor;
  const ss = Math.min(w, h);
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const dy1 = (h * cnstVal6) / cnstVal3;
  const dx2 = (ss * a1) / cnstVal3;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const y1 = vc - dy1;
  const y2 = vc - dx2;
  const y3 = vc + dx2;
  const y4 = vc + dy1;

  dVal =
    "M" +
    x1 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y2 +
    " L" +
    x2 +
    "," +
    y1 +
    " L" +
    x3 +
    "," +
    y1 +
    " L" +
    x3 +
    "," +
    y2 +
    " L" +
    x4 +
    "," +
    y2 +
    " L" +
    x4 +
    "," +
    y3 +
    " L" +
    x3 +
    "," +
    y3 +
    " L" +
    x3 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y4 +
    " L" +
    x2 +
    "," +
    y3 +
    " L" +
    x1 +
    "," +
    y3 +
    " z";
  return createPath(dVal, ctx);
}
