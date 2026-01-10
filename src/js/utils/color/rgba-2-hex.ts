/**
 * Converts RGBA color string to hexadecimal format
 *
 * @param rgbaValue - RGBA or RGB color string (e.g., "rgba(255, 0, 0, 0.5)")
 * @returns Hex color string with alpha (8 digits)
 */
export function rgba2hex(rgbaValue: string): string {
  // Parse RGBA string
  const rgbMatch = rgbaValue.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);

  const alpha = (rgbMatch && rgbMatch[4]) || "";
  const alphaValue = alpha.trim();

  if (!rgbMatch) {
    // If parsing failed, return the original string
    return rgbaValue;
  }

  // Convert RGB to hex
  const rgbHex =
    (parseInt(rgbMatch[1]) | (1 << 8)).toString(16).slice(1) +
    (parseInt(rgbMatch[2]) | (1 << 8)).toString(16).slice(1) +
    (parseInt(rgbMatch[3]) | (1 << 8)).toString(16).slice(1);

  // Handle alpha channel
  let alphaNumber: number;
  if (alphaValue !== "") {
    alphaNumber = parseFloat(alphaValue);
  } else {
    alphaNumber = 1;
  }

  // Convert alpha to hex (multiply by 255 and convert)
  const alphaHex = ((alphaNumber * 255) | (1 << 8)).toString(16).slice(1);

  return rgbHex + alphaHex;
}
