import tinycolor from "tinycolor2";

type ApplyHueModOptions = {
  colorValue: string;
  multiplier: number | string;
  isAlpha: boolean;
};

/**
 * Applies a hue multiplier to a color
 * FIXED BUG: Original code had typo "cocacl_h" in one place
 *
 * @param colorValue - Color string (supported formats per tinycolor)
 * @param multiplier - Hue multiplier
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyHueMod({ colorValue, multiplier, isAlpha }: ApplyHueModOptions): string {
  const multiplierValue = typeof multiplier === "number" ? multiplier : parseFloat(multiplier);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new hue
  const safeMultiplier = Number.isFinite(multiplierValue) ? multiplierValue : 1;
  let hueValue = color.h * safeMultiplier;
  // Wrap hue to 0-360 range
  hueValue = ((hueValue % 360) + 360) % 360;

  // BUG FIX: Original code used "cocacl_h" (typo) in the isAlpha branch
  if (isAlpha) {
    return tinycolor({ h: hueValue, s: color.s, l: color.l, a: color.a }).toHex8();
  }
  return tinycolor({ h: hueValue, s: color.s, l: color.l, a: color.a }).toHex();
}
