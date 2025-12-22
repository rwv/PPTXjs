import tinycolor from "tinycolor2";

/**
 * Applies a hue multiplier to a color
 * FIXED BUG: Original code had typo "cocacl_h" in one place
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param multiplier - Hue multiplier
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyHueMod(rgbStr: string, multiplier: number | string, isAlpha: boolean): string {
  const mult = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(rgbStr).toHsl();

  // Calculate new hue
  let calcH = color.h * mult;

  // Wrap hue to 0-360 range
  if (calcH >= 360) {
    calcH = calcH - 360;
  }

  // BUG FIX: Original code used "cocacl_h" (typo) in the isAlpha branch
  if (isAlpha) {
    return tinycolor({ h: calcH, s: color.s, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: calcH, s: color.s, l: color.l, a: color.a }).toHex();
}
