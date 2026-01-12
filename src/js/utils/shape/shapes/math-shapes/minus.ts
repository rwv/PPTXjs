import type { MathShapeContext } from "./types";
import { createPath, getMathShapeAdjustments } from "./helpers";

export function renderMathMinus(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const adjustments = getMathShapeAdjustments(node);
  let { adj1 } = adjustments;
  const cnstVal2 = 100000 * slideFactor;
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
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const dy1 = (h * a1) / cnstVal3;
  const dx1 = (w * cnstVal6) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc + dy1;
  const x1 = hc - dx1;
  const x2 = hc + dx1;

  dVal =
    "M" + x1 + "," + y1 + " L" + x2 + "," + y1 + " L" + x2 + "," + y2 + " L" + x1 + "," + y2 + " z";
  return createPath({ d: dVal, ctx });
}
