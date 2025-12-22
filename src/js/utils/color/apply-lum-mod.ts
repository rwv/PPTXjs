import tinycolor from "tinycolor2";

/**
 * Applies a luminance multiplier to a color
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param multiplier - Luminance multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyLumMod(rgbStr: string, multiplier: number | string, isAlpha: boolean): string {
  const mult = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(rgbStr).toHsl();

  // Calculate new luminance
  let calcL = color.l * mult;

  // Clamp to max 1
  if (calcL >= 1) {
    calcL = 1;
  }

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex();
}
