import tinycolor from "tinycolor2";

/**
 * Applies a luminance offset to a color
 *
 * @param rgbStr - Color string (any format supported by tinycolor)
 * @param offset - Luminance offset to add (-1 to 1)
 * @param isAlpha - Whether to include alpha channel in output
 * @returns Hex color string (with or without alpha)
 */
export function applyLumOff(rgbStr: string, offset: number | string, isAlpha: boolean): string {
  const off = typeof offset === "number" ? offset : parseFloat(offset);
  const color = tinycolor(rgbStr).toHsl();

  // Calculate new luminance
  const lum = off + color.l;

  // Clamp to max 1
  if (lum >= 1) {
    if (isAlpha) {
      return tinycolor({ h: color.h, s: color.s, l: 1, a: color.a }).toHex8();
    }
    return tinycolor({ h: color.h, s: color.s, l: 1, a: color.a }).toHex();
  }

  if (isAlpha) {
    return tinycolor({ h: color.h, s: color.s, l: lum, a: color.a }).toHex8();
  }
  return tinycolor({ h: color.h, s: color.s, l: lum, a: color.a }).toHex();
}
