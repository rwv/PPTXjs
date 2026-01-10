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
export function getNumTypeNum(numberingType: string, num: number | string): string {
  let formattedNumber: string;

  switch (numberingType) {
    case "arabicPeriod":
      formattedNumber = num + ". ";
      break;
    case "arabicParenR":
      formattedNumber = num + ") ";
      break;
    case "alphaLcParenR":
      formattedNumber = alphaNumeric(num, "lowerCase") + ") ";
      break;
    case "alphaLcPeriod":
      formattedNumber = alphaNumeric(num, "lowerCase") + ". ";
      break;
    case "alphaUcParenR":
      formattedNumber = alphaNumeric(num, "upperCase") + ") ";
      break;
    case "alphaUcPeriod":
      formattedNumber = alphaNumeric(num, "upperCase") + ". ";
      break;
    case "romanUcPeriod":
      formattedNumber = romanize(num) + ". ";
      break;
    case "romanLcParenR":
      formattedNumber = romanize(num) + ") ";
      break;
    case "hebrew2Minus":
      formattedNumber = hebrew2Minus.format(Number(num)) + "-";
      break;
    default:
      formattedNumber = String(num);
  }

  return formattedNumber;
}
