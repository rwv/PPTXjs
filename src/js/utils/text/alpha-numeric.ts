/**
 * Converts a number to alphabetic characters (A, B, C... Z, AA, AB...)
 *
 * @param num - Number to convert (1-based index)
 * @param letterCase - "upperCase" or "lowerCase"
 * @returns Alphabetic string representation
 */
type AlphaNumericOptions = {
  num: number | string;
  letterCase: "upperCase" | "lowerCase";
};

export function alphaNumeric({ num, letterCase }: AlphaNumericOptions): string {
  const parsed = Number(num);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }
  const numValue = Math.floor(parsed) - 1;
  let alphaLabel = "";
  const firstChar = numValue / 26 >= 1 ? String.fromCharCode(Math.floor(numValue / 26) + 64) : "";
  const secondChar = String.fromCharCode((numValue % 26) + 65);

  if (letterCase === "upperCase") {
    alphaLabel = (firstChar + secondChar).toUpperCase();
  } else if (letterCase === "lowerCase") {
    alphaLabel = (firstChar + secondChar).toLowerCase();
  }

  return alphaLabel;
}
