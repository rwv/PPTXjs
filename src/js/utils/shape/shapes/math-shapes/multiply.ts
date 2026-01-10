import type { MathShapeContext } from "./types";
import { createPath, getMathShapeAdjustments } from "./helpers";

export function renderMathMultiply(ctx: MathShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const adjustments = getMathShapeAdjustments(node);
  let { adj1 } = adjustments;
  const cnstVal2 = 100000 * slideFactor;
  const hc = w / 2;
  const vc = h / 2;
  let dVal = "";
  if (!adjustments.hasAdjustments) {
    adj1 = 23520 * slideFactor;
  } else {
    adj1 = adj1 * slideFactor;
  }
  const cnstVal6 = 51965 * slideFactor;
  const ss = Math.min(w, h);
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
  const th = (ss * a1) / cnstVal2;
  const a = Math.atan(h / w);
  const sa = 1 * Math.sin(a);
  const ca = 1 * Math.cos(a);
  const ta = 1 * Math.tan(a);
  const dl = Math.sqrt(w * w + h * h);
  const rw = (dl * cnstVal6) / cnstVal2;
  const lM = dl - rw;
  const xM = (ca * lM) / 2;
  const yM = (sa * lM) / 2;
  const dxAM = (sa * th) / 2;
  const dyAM = (ca * th) / 2;
  const xA = xM - dxAM;
  const yA = yM + dyAM;
  const xB = xM + dxAM;
  const yB = yM - dyAM;
  const xBC = hc - xB;
  const yBC = xBC * ta;
  const yC = yBC + yB;
  const xD = w - xB;
  const xE = w - xA;
  const yFE = vc - yA;
  const xFE = yFE / ta;
  const xF = xE - xFE;
  const xL = xA + xFE;
  const yG = h - yA;
  const yH = h - yB;
  const yI = h - yC;

  dVal =
    "M" +
    xA +
    "," +
    yA +
    " L" +
    xB +
    "," +
    yB +
    " L" +
    hc +
    "," +
    yC +
    " L" +
    xD +
    "," +
    yB +
    " L" +
    xE +
    "," +
    yA +
    " L" +
    xF +
    "," +
    vc +
    " L" +
    xE +
    "," +
    yG +
    " L" +
    xD +
    "," +
    yH +
    " L" +
    hc +
    "," +
    yI +
    " L" +
    xB +
    "," +
    yH +
    " L" +
    xA +
    "," +
    yG +
    " L" +
    xL +
    "," +
    vc +
    " z";
  return createPath(dVal, ctx);
}
