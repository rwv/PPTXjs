import tinycolor from "tinycolor2";

/**
 * Applies a saturation multiplier to a color
 *
 * @param colorValue - Color string (any format supported by tinycolor)
 * @param multiplier - Saturation multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applySatMod(
  colorValue: string,
  multiplier: number | string,
  isAlpha: boolean
): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new saturation
  let saturationValue = color.s * multiplierValue;

  // Clamp to max 1
  if (saturationValue >= 1) {
    saturationValue = 1;
  }

  if (isAlpha) {
    return tinycolor({ h: color.h, s: saturationValue, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: saturationValue, l: color.l, a: color.a }).toHex();
}
