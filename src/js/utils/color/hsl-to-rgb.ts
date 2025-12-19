/**
 * RGB color object
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts HSL color values to RGB
 *
 * @param hue - Hue value (0-360)
 * @param sat - Saturation (0-1)
 * @param light - Lightness (0-1)
 * @returns RGB color object with r, g, b values (0-255)
 */
export function hslToRgb(
  hue: number | string,
  sat: number | string,
  light: number | string
): RgbColor {
  const h = typeof hue === "number" ? hue : parseFloat(hue);
  const s = typeof sat === "number" ? sat : parseFloat(sat);
  const l = typeof light === "number" ? light : parseFloat(light);

  let t1: number;
  let t2: number;
  const hueNorm = h / 60;

  if (l <= 0.5) {
    t2 = l * (s + 1);
  } else {
    t2 = l + s - l * s;
  }

  t1 = l * 2 - t2;

  const r = hueToRgb(t1, t2, hueNorm + 2) * 255;
  const g = hueToRgb(t1, t2, hueNorm) * 255;
  const b = hueToRgb(t1, t2, hueNorm - 2) * 255;

  return { r, g, b };
}

/**
 * Helper function for HSL to RGB conversion
 *
 * @param t1 - Temporary value 1
 * @param t2 - Temporary value 2
 * @param hue - Normalized hue value
 * @returns RGB component value (0-1)
 */
export function hueToRgb(t1: number, t2: number, hue: number): number {
  let h = hue;
  if (h < 0) h += 6;
  if (h >= 6) h -= 6;
  if (h < 1) return (t2 - t1) * h + t1;
  else if (h < 3) return t2;
  else if (h < 4) return (t2 - t1) * (4 - h) + t1;
  else return t1;
}
