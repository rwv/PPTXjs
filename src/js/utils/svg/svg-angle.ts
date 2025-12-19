/**
 * Calculates SVG gradient angle coordinates
 * Converts a degree angle to SVG gradient x1, y1, x2, y2 percentages
 *
 * @param deg - Angle in degrees (0-360)
 * @param svgHeight - SVG height
 * @param svgWidth - SVG width
 * @returns Array of [x1, y1, x2, y2] as percentages
 */
export function svgAngle(
  deg: number | string,
  svgHeight: number | string,
  svgWidth: number | string
): [number, number, number, number] {
  const w = parseFloat(String(svgWidth));
  const h = parseFloat(String(svgHeight));
  const ang = parseFloat(String(deg));

  let o = 2;
  let n = 2;
  const wc = w / 2;
  const hc = h / 2;
  let tx1 = 2;
  let ty1 = 2;
  let tx2 = 2;
  let ty2 = 2;

  const k = ((ang % 360) + 360) % 360;
  const j = ((360 - k) * Math.PI) / 180;
  const i = Math.tan(j);
  const l = hc - i * wc;

  // Handle special angles
  if (k === 0) {
    tx1 = w;
    ty1 = hc;
    tx2 = 0;
    ty2 = hc;
  } else if (k < 90) {
    n = w;
    o = 0;
  } else if (k === 90) {
    tx1 = wc;
    ty1 = 0;
    tx2 = wc;
    ty2 = h;
  } else if (k < 180) {
    n = 0;
    o = 0;
  } else if (k === 180) {
    tx1 = 0;
    ty1 = hc;
    tx2 = w;
    ty2 = hc;
  } else if (k < 270) {
    n = 0;
    o = h;
  } else if (k === 270) {
    tx1 = wc;
    ty1 = h;
    tx2 = wc;
    ty2 = 0;
  } else {
    n = w;
    o = h;
  }

  // Calculate gradient line coordinates
  const m = o + n / i;
  tx1 = tx1 === 2 ? (i * (m - l)) / (Math.pow(i, 2) + 1) : tx1;
  ty1 = ty1 === 2 ? i * tx1 + l : ty1;
  tx2 = tx2 === 2 ? w - tx1 : tx2;
  ty2 = ty2 === 2 ? h - ty1 : ty2;

  const x1 = Math.round((tx2 / w) * 100 * 100) / 100;
  const y1 = Math.round((ty2 / h) * 100 * 100) / 100;
  const x2 = Math.round((tx1 / w) * 100 * 100) / 100;
  const y2 = Math.round((ty1 / h) * 100 * 100) / 100;

  return [x1, y1, x2, y2];
}
