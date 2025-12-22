import { dingbat_unicode } from "../../dingbat";

/**
 * Converts dingbat characters to Unicode code points
 *
 * @param typefaceNode - Font typeface name (e.g., "Wingdings 2", "Wingdings 3")
 * @param buChar - Character to convert
 * @returns Unicode code point as string, or null if not found
 */
export function getDingbatToUnicode(typefaceNode: string, buChar: string): string | null {
  if (!dingbat_unicode) {
    return null;
  }

  // Use charCodeAt instead of codePointAt for better compatibility
  const dingbatCode = buChar.charCodeAt(0) & 0xfff;
  let charUnicode: string | null = null;
  let len = dingbat_unicode.length;
  let i = 0;

  while (len--) {
    const item = dingbat_unicode[i];
    if (item.f === typefaceNode && item.code === String(dingbatCode)) {
      charUnicode = item.unicode;
      break;
    }
    i++;
  }

  return charUnicode;
}
