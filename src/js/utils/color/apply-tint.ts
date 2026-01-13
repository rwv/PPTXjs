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
 * @param colorValue - Color string (supported formats per tinycolor)
 * @param tintValue - Tint amount (0-1, where 0 is white, 1 is original)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyTint({ colorValue, tintValue, isAlpha }: ApplyTintOptions): string {
  const tintAmount = typeof tintValue === "number" ? tintValue : parseFloat(tintValue);
  const color = tinycolor(colorValue).toHsl();

  const safeTint = Number.isFinite(tintAmount) ? tintAmount : 1;
  const clampedTint = Math.min(Math.max(safeTint, 0), 1);

  // Calculate new lightness (lighter)
  const lightnessValue = Math.min(Math.max(color.l * clampedTint + (1 - clampedTint), 0), 1);

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: lightnessValue, a: color.a }).toHex();
}
