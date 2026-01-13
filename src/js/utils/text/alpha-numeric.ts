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
  let numValue = Math.floor(parsed);
  let alphaLabel = "";
  while (numValue > 0) {
    numValue -= 1;
    alphaLabel = String.fromCharCode((numValue % 26) + 65) + alphaLabel;
    numValue = Math.floor(numValue / 26);
  }

  return letterCase === "lowerCase" ? alphaLabel.toLowerCase() : alphaLabel.toUpperCase();
}
