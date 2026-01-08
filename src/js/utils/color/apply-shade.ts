import tinycolor from "tinycolor2";

/**
 * Applies a shade transformation to a color
 * Shade makes colors darker by reducing lightness
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param shadeValue - Shade amount (0-1, where 0 is black, 1 is original)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyShade(
  rgbStr: string,
  shadeValue: number | string,
  isAlpha: boolean
): string {
  const shade =
    typeof shadeValue === "number" ? shadeValue : parseFloat(shadeValue);
  const color = tinycolor(rgbStr).toHsl();

  // Clamp shade value to max 1
  const clampedShade = Math.min(shade, 1);

  // Calculate new lightness (darker)
  const calcL = Math.min(color.l * clampedShade, 1);

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: calcL, a: color.a }).toHex();
}
