import { alphaNumeric } from "./alpha-numeric";
import { romanize } from "./romanize";
import { hebrew2Minus } from "./archaic-numbers";

/**
 * Formats a number according to the specified numbering type
 * Used for bullet lists and numbered items in presentations
 *
 * @param numberingType - The numbering type/format to use
 * @param num - The number to format
 * @returns Formatted string with the number and appropriate punctuation
 */
type GetNumTypeNumOptions = {
  numberingType: string;
  num: number | string;
};

export function getNumTypeNum({ numberingType, num }: GetNumTypeNumOptions): string {
  let formattedNumber: string;
  const fallback = String(num);
  const numericValue = Number(num);
  const hasNumericValue = Number.isFinite(numericValue);

  switch (numberingType) {
    case "arabicPeriod":
      formattedNumber = fallback + ". ";
      break;
    case "arabicParenR":
      formattedNumber = fallback + ") ";
      break;
    case "alphaLcParenR":
      formattedNumber = (alphaNumeric({ num, letterCase: "lowerCase" }) || fallback) + ") ";
      break;
    case "alphaLcPeriod":
      formattedNumber = (alphaNumeric({ num, letterCase: "lowerCase" }) || fallback) + ". ";
      break;
    case "alphaUcParenR":
      formattedNumber = (alphaNumeric({ num, letterCase: "upperCase" }) || fallback) + ") ";
      break;
    case "alphaUcPeriod":
      formattedNumber = (alphaNumeric({ num, letterCase: "upperCase" }) || fallback) + ". ";
      break;
    case "romanUcPeriod":
      formattedNumber = (romanize(num) || fallback) + ". ";
      break;
    case "romanLcParenR":
      formattedNumber = (romanize(num) || fallback) + ") ";
      break;
    case "hebrew2Minus":
      formattedNumber = (hasNumericValue ? hebrew2Minus.format(numericValue) : fallback) + "-";
      break;
    default:
      formattedNumber = fallback;
  }

  return formattedNumber;
}
