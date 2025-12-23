/**
 * Converts a number to alphabetic characters (A, B, C... Z, AA, AB...)
 *
 * @param num - Number to convert (1-based index)
 * @param upperLower - "upperCase" or "lowerCase"
 * @returns Alphabetic string representation
 */
export function alphaNumeric(num: number | string, upperLower: "upperCase" | "lowerCase"): string {
  const numValue = Number(num) - 1;
  let aNum = "";

  if (upperLower === "upperCase") {
    aNum = (
      (numValue / 26 >= 1 ? String.fromCharCode(numValue / 26 + 64) : "") +
      String.fromCharCode((numValue % 26) + 65)
    ).toUpperCase();
  } else if (upperLower === "lowerCase") {
    aNum = (
      (numValue / 26 >= 1 ? String.fromCharCode(numValue / 26 + 64) : "") +
      String.fromCharCode((numValue % 26) + 65)
    ).toLowerCase();
  }

  return aNum;
}
