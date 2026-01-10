import tinycolor from "tinycolor2";

/**
 * Applies a luminance multiplier to a color
 *
 * @param colorValue - Color string (any format supported by tinycolor)
 * @param multiplier - Luminance multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyLumMod(
  colorValue: string,
  multiplier: number | string,
  isAlpha: boolean
): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new luminance
  let luminanceValue = color.l * multiplierValue;

  // Clamp to max 1
  if (luminanceValue >= 1) {
    luminanceValue = 1;
  }

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex();
}
