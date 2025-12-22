import tinycolor from "tinycolor2";

/**
 * Applies a saturation multiplier to a color
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param multiplier - Saturation multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applySatMod(rgbStr: string, multiplier: number | string, isAlpha: boolean): string {
  const mult = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(rgbStr).toHsl();

  // Calculate new saturation
  let calcS = color.s * mult;

  // Clamp to max 1
  if (calcS >= 1) {
    calcS = 1;
  }

  if (isAlpha) {
    return tinycolor({ h: color.h, s: calcS, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: calcS, l: color.l, a: color.a }).toHex();
}
