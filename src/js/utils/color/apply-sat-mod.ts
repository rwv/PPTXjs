import tinycolor from "tinycolor2";

type ApplySatModOptions = {
  colorValue: string;
  multiplier: number | string;
  isAlpha: boolean;
};

/**
 * Applies a saturation multiplier to a color
 *
 * @param colorValue - Color string (supported formats per tinycolor)
 * @param multiplier - Saturation multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applySatMod({ colorValue, multiplier, isAlpha }: ApplySatModOptions): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new saturation
  const safeMultiplier = Number.isFinite(multiplierValue) ? multiplierValue : 1;
  let saturationValue = color.s * safeMultiplier;
  saturationValue = Math.min(1, Math.max(0, saturationValue));

  if (isAlpha) {
    return tinycolor({ h: color.h, s: saturationValue, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: saturationValue, l: color.l, a: color.a }).toHex();
}
