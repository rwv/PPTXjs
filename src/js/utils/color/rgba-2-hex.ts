/**
 * Converts RGBA color string to hexadecimal format
 *
 * @param rgbaValue - RGBA or RGB color string (e.g., "rgba(255, 0, 0, 0.5)")
 * @returns Hex color string with alpha (8 digits)
 */
type Rgba2HexOptions = {
  rgbaValue: string;
};

export function rgba2hex({ rgbaValue }: Rgba2HexOptions): string {
  // Parse RGBA string
  const rgbMatch = rgbaValue.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  const clampByte = (value: number): number => Math.min(255, Math.max(0, value));

  const alpha = (rgbMatch && rgbMatch[4]) || "";
  const alphaValue = alpha.trim();

  if (!rgbMatch) {
    // If parsing failed, return the original string
    return rgbaValue;
  }

  // Convert RGB to hex
  const red = clampByte(parseInt(rgbMatch[1], 10));
  const green = clampByte(parseInt(rgbMatch[2], 10));
  const blue = clampByte(parseInt(rgbMatch[3], 10));
  const rgbHex =
    (red | (1 << 8)).toString(16).slice(1) +
    (green | (1 << 8)).toString(16).slice(1) +
    (blue | (1 << 8)).toString(16).slice(1);

  // Handle alpha channel
  let alphaNumber = 1;
  if (alphaValue !== "") {
    const parsedAlpha = parseFloat(alphaValue);
    if (Number.isFinite(parsedAlpha)) {
      alphaNumber = alphaValue.endsWith("%") ? parsedAlpha / 100 : parsedAlpha;
    }
  }
  alphaNumber = Math.min(1, Math.max(0, alphaNumber));

  // Convert alpha to hex (multiply by 255 and convert)
  const alphaByte = clampByte(Math.floor(alphaNumber * 255));
  const alphaHex = (alphaByte | (1 << 8)).toString(16).slice(1);

  return rgbHex + alphaHex;
}
