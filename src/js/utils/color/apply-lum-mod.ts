import tinycolor from "tinycolor2";

type ApplyLumModOptions = {
  colorValue: string;
  multiplier: number | string;
  isAlpha: boolean;
};

/**
 * Applies a luminance multiplier to a color
 *
 * @param colorValue - Color string (supported formats per tinycolor)
 * @param multiplier - Luminance multiplier (typically 0-2)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyLumMod({ colorValue, multiplier, isAlpha }: ApplyLumModOptions): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new luminance
  const safeMultiplier = Number.isFinite(multiplierValue) ? multiplierValue : 1;
  let luminanceValue = color.l * safeMultiplier;
  luminanceValue = Math.min(1, Math.max(0, luminanceValue));

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex();
}
