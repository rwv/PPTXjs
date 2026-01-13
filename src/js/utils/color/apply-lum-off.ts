import tinycolor from "tinycolor2";

type ApplyLumOffOptions = {
  colorValue: string;
  offset: number | string;
  isAlpha: boolean;
};

/**
 * Applies a luminance offset to a color
 *
 * @param colorValue - Color string (supported formats per tinycolor)
 * @param offset - Luminance offset to add (-1 to 1)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyLumOff({ colorValue, offset, isAlpha }: ApplyLumOffOptions): string {
  const offsetValue = typeof offset === "number" ? offset : parseFloat(offset);
  const color = tinycolor(colorValue).toHsl();

  // Calculate new luminance
  const safeOffset = Number.isFinite(offsetValue) ? offsetValue : 0;
  const luminanceValue = Math.min(1, Math.max(0, safeOffset + color.l));

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: luminanceValue, a: color.a }).toHex();
}
