/**
 * Converts a number to a two-digit hexadecimal string
 *
 * @param n - Number to convert (0-255)
 * @returns Two-digit hex string (e.g., "0a", "ff")
 */
export function toHex(n: number | string): string {
  const num = typeof n === "number" ? n : parseFloat(n);

  // Handle invalid input
  if (isNaN(num)) {
    return "00";
  }

  // Clamp to valid range 0-255
  const clamped = Math.max(0, Math.min(255, Math.round(num)));

  let hex = clamped.toString(16);
  while (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}
