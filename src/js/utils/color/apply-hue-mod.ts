import tinycolor from "tinycolor2";

/**
 * Applies a hue multiplier to a color
 * FIXED BUG: Original code had typo "cocacl_h" in one place
 *
 * @param colorValue - Color string (any format supported by tinycolor)
 * @param multiplier - Hue multiplier
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyHueMod(
  colorValue: string,
  multiplier: number | string,
  isAlpha: boolean
): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new hue
  let hueValue = color.h * multiplierValue;

  // Wrap hue to 0-360 range
  if (hueValue >= 360) {
    hueValue = hueValue - 360;
  }

  // BUG FIX: Original code used "cocacl_h" (typo) in the isAlpha branch
  if (isAlpha) {
    return tinycolor({ h: hueValue, s: color.s, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: hueValue, s: color.s, l: color.l, a: color.a }).toHex();
}
