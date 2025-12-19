import { alphaNumeric } from "./alpha-numeric";
import { romanize } from "./romanize";
import { hebrew2Minus } from "./archaic-numbers";

/**
 * Formats a number according to the specified numbering type
 * Used for bullet lists and numbered items in presentations
 *
 * @param numTyp - The numbering type/format to use
 * @param num - The number to format
 * @returns Formatted string with the number and appropriate punctuation
 */
export function getNumTypeNum(numTyp: string, num: number | string): string {
  let rtrnNum: string;

  switch (numTyp) {
    case "arabicPeriod":
      rtrnNum = num + ". ";
      break;
    case "arabicParenR":
      rtrnNum = num + ") ";
      break;
    case "alphaLcParenR":
      rtrnNum = alphaNumeric(num, "lowerCase") + ") ";
      break;
    case "alphaLcPeriod":
      rtrnNum = alphaNumeric(num, "lowerCase") + ". ";
      break;
    case "alphaUcParenR":
      rtrnNum = alphaNumeric(num, "upperCase") + ") ";
      break;
    case "alphaUcPeriod":
      rtrnNum = alphaNumeric(num, "upperCase") + ". ";
      break;
    case "romanUcPeriod":
      rtrnNum = romanize(num) + ". ";
      break;
    case "romanLcParenR":
      rtrnNum = romanize(num) + ") ";
      break;
    case "hebrew2Minus":
      rtrnNum = hebrew2Minus.format(Number(num)) + "-";
      break;
    default:
      rtrnNum = String(num);
  }

  return rtrnNum;
}
