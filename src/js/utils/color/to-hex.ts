/**
 * Converts a number to a two-digit hexadecimal string
 *
 * @param value - Number to convert (0-255)
 * @returns Two-digit hex string (e.g., "0a", "ff")
 */
export function toHex(value: number | string): string {
  const numericValue = typeof value === "number" ? value : parseFloat(value);

  // Handle invalid input
  if (isNaN(numericValue)) {
    return "00";
  }

  // Clamp to valid range 0-255
  const clampedValue = Math.max(0, Math.min(255, Math.round(numericValue)));

  let hexValue = clampedValue.toString(16);
  while (hexValue.length < 2) {
    hexValue = "0" + hexValue;
  }
  return hexValue;
}
