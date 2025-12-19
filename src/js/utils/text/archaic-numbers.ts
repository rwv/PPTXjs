/**
 * Type definition for archaic number conversion rules
 * Can be either a numeric value with its character representation,
 * or a regex pattern with its replacement string
 */
type ArchaicRule = [number | RegExp, string];

/**
 * Creates an archaic number formatter (e.g., Hebrew numerals)
 * This function processes an array of conversion rules to format numbers
 * into archaic numeral systems
 *
 * @param arr - Array of conversion rules [value, character] or [regex, replacement]
 * @returns Object with format method to convert numbers
 */
export function archaicNumbers(arr: ArchaicRule[]) {
  return {
    format: function (n: number): string {
      let ret = "";

      // Process each rule in order
      for (let i = 0; i < arr.length; i++) {
        const rule = arr[i];
        const num = rule[0];
        const char = rule[1];

        if (typeof num === "number" && num > 0) {
          // For numeric rules, repeatedly subtract and append character
          while (n >= num) {
            ret += char;
            n -= num;
          }
        } else if (num instanceof RegExp) {
          // For regex rules, perform replacement
          ret = ret.replace(num, char);
        }
      }

      return ret;
    },
  };
}

/**
 * Hebrew numbering system formatter
 * Uses Hebrew letters for numbers with special handling for 15 and 16
 */
export const hebrew2Minus = archaicNumbers([
  [1000, ""],
  [400, "ת"],
  [300, "ש"],
  [200, "ר"],
  [100, "ק"],
  [90, "צ"],
  [80, "פ"],
  [70, "ע"],
  [60, "ס"],
  [50, "נ"],
  [40, "מ"],
  [30, "ל"],
  [20, "כ"],
  [10, "י"],
  [9, "ט"],
  [8, "ח"],
  [7, "ז"],
  [6, "ו"],
  [5, "ה"],
  [4, "ד"],
  [3, "ג"],
  [2, "ב"],
  [1, "א"],
  [/יה/, "ט״ו"], // 15 special case
  [/יו/, "ט״ז"], // 16 special case
  [/([א-ת])([א-ת])$/, '$1״$2'], // Add gershayim for multi-letter
  [/^([א-ת])$/, "$1׳"], // Add geresh for single letter
]);
