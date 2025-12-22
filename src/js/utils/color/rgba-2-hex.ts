/**
 * Converts RGBA color string to hexadecimal format
 *
 * @param rgbaStr - RGBA or RGB color string (e.g., "rgba(255, 0, 0, 0.5)")
 * @returns Hex color string with alpha (8 digits)
 */
export function rgba2hex(rgbaStr: string): string {
  // Parse RGBA string
  const rgb = rgbaStr.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);

  const alpha = (rgb && rgb[4]) || "";
  const alphaVal = alpha.trim();

  if (!rgb) {
    // If parsing failed, return the original string
    return rgbaStr;
  }

  // Convert RGB to hex
  const hex =
    (parseInt(rgb[1]) | (1 << 8)).toString(16).slice(1) +
    (parseInt(rgb[2]) | (1 << 8)).toString(16).slice(1) +
    (parseInt(rgb[3]) | (1 << 8)).toString(16).slice(1);

  // Handle alpha channel
  let a: number;
  if (alphaVal !== "") {
    a = parseFloat(alphaVal);
  } else {
    a = 1;
  }

  // Convert alpha to hex (multiply by 255 and convert)
  const alphaHex = ((a * 255) | (1 << 8)).toString(16).slice(1);

  return hex + alphaHex;
}
