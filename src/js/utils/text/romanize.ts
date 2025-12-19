/**
 * Converts a number to Roman numerals
 *
 * @param num - Number to convert (positive integers)
 * @returns Roman numeral string, or false if invalid input
 */
export function romanize(num: number | string): string | false {
  const numValue = +num;
  if (!numValue) {
    return false;
  }

  const digits = String(numValue).split("");
  const key = [
    "",
    "C",
    "CC",
    "CCC",
    "CD",
    "D",
    "DC",
    "DCC",
    "DCCC",
    "CM",
    "",
    "X",
    "XX",
    "XXX",
    "XL",
    "L",
    "LX",
    "LXX",
    "LXXX",
    "XC",
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
  ];

  let roman = "";
  let i = 3;

  while (i--) {
    const digit = digits.pop();
    const keyIndex = (digit ? +digit : 0) + i * 10;
    roman = (key[keyIndex] || "") + roman;
  }

  return Array(+digits.join("") + 1).join("M") + roman;
}
