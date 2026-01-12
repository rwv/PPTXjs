/**
 * RGB color object
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

type HslToRgbOptions = {
  hue: number | string;
  saturation: number | string;
  lightness: number | string;
};

/**
 * Converts HSL color values to RGB
 *
 * @param hue - Hue value (0-360)
 * @param saturation - Saturation (0-1)
 * @param lightness - Lightness (0-1)
 * @returns RGB color object with r, g, b values (0-255)
 */
export function hslToRgb({ hue, saturation, lightness }: HslToRgbOptions): RgbColor {
  const hueValue = typeof hue === "number" ? hue : parseFloat(hue);
  const saturationValue = typeof saturation === "number" ? saturation : parseFloat(saturation);
  const lightnessValue = typeof lightness === "number" ? lightness : parseFloat(lightness);

  let temp2: number;
  const hueNorm = hueValue / 60;

  if (lightnessValue <= 0.5) {
    temp2 = lightnessValue * (saturationValue + 1);
  } else {
    temp2 = lightnessValue + saturationValue - lightnessValue * saturationValue;
  }

  const temp1 = lightnessValue * 2 - temp2;

  const r = hueToRgb({ temp1, temp2, hueValue: hueNorm + 2 }) * 255;
  const g = hueToRgb({ temp1, temp2, hueValue: hueNorm }) * 255;
  const b = hueToRgb({ temp1, temp2, hueValue: hueNorm - 2 }) * 255;

  return { r, g, b };
}

/**
 * Helper function for HSL to RGB conversion
 *
 * @param temp1 - Temporary value 1
 * @param temp2 - Temporary value 2
 * @param hueValue - Normalized hue value
 * @returns RGB component value (0-1)
 */
type HueToRgbOptions = {
  temp1: number;
  temp2: number;
  hueValue: number;
};

export function hueToRgb({ temp1, temp2, hueValue }: HueToRgbOptions): number {
  let normalizedHue = hueValue;
  if (normalizedHue < 0) normalizedHue += 6;
  if (normalizedHue >= 6) normalizedHue -= 6;
  if (normalizedHue < 1) return (temp2 - temp1) * normalizedHue + temp1;
  else if (normalizedHue < 3) return temp2;
  else if (normalizedHue < 4) return (temp2 - temp1) * (4 - normalizedHue) + temp1;
  else return temp1;
}
