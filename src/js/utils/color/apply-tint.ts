import tinycolor from "tinycolor2";

type ApplyTintOptions = {
  colorValue: string;
  tintValue: number | string;
  isAlpha: boolean;
};

/**
 * Applies a tint transformation to a color
 * Tint makes colors lighter by increasing lightness
 *
 * @param colorValue - Color string (any format supported by tinycolor)
 * @param tintValue - Tint amount (0-1, where 0 is white, 1 is original)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyTint({ colorValue, tintValue, isAlpha }: ApplyTintOptions): string {
  const tintAmount = typeof tintValue === "number" ? tintValue : parseFloat(tintValue);
  const color = tinycolor(colorValue).toHsl();

  // Clamp tint value to max 1
  const clampedTint = Math.min(tintAmount, 1);

  // Calculate new lightness (lighter)
  const lightnessValue = color.l * clampedTint + (1 - clampedTint);

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex();
}
