import tinycolor from "tinycolor2";

/**
 * Applies a tint transformation to a color
 * Tint makes colors lighter by increasing lightness
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param tintValue - Tint amount (0-1, where 0 is white, 1 is original)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyTint(rgbStr: string, tintValue: number | string, isAlpha: boolean): string {
  const tint = typeof tintValue === "number" ? tintValue : parseFloat(tintValue);
  const color = tinycolor(rgbStr).toHsl();

  // Clamp tint value to max 1
  const clampedTint = Math.min(tint, 1);

  // Calculate new lightness (lighter)
  const calcL = color.l * clampedTint + (1 - clampedTint);

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex();
}
