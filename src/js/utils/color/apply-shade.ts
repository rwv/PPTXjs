import tinycolor from "tinycolor2";

/**
 * Applies a shade transformation to a color
 * Shade makes colors darker by reducing lightness
 *
 * @param colorValue - Color string (any format supported by tinycolor)
 * @param shadeValue - Shade amount (0-1, where 0 is black, 1 is original)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyShade(
  colorValue: string,
  shadeValue: number | string,
  isAlpha: boolean
): string {
  const shadeAmount = typeof shadeValue === "number" ? shadeValue : parseFloat(shadeValue);
  const color = tinycolor(colorValue).toHsl();

  // Clamp shade value to max 1
  const clampedShade = Math.min(shadeAmount, 1);

  // Calculate new lightness (darker)
  const lightnessValue = Math.min(color.l * clampedShade, 1);

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex();
}
