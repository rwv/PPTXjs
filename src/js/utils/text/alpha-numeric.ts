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
  const numValue = Number(num) - 1;
  let alphaLabel = "";

  if (letterCase === "upperCase") {
    alphaLabel = (
      (numValue / 26 >= 1 ? String.fromCharCode(numValue / 26 + 64) : "") +
      String.fromCharCode((numValue % 26) + 65)
    ).toUpperCase();
  } else if (letterCase === "lowerCase") {
    alphaLabel = (
      (numValue / 26 >= 1 ? String.fromCharCode(numValue / 26 + 64) : "") +
      String.fromCharCode((numValue % 26) + 65)
    ).toLowerCase();
  }

  return alphaLabel;
}
