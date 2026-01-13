import { dingbat_unicode } from "./dingbat-unicode-map";

/**
 * Converts dingbat characters to Unicode code points
 *
 * @param typefaceNode - Font typeface name (e.g., "Wingdings 2", "Wingdings 3")
 * @param bulletChar - Character to convert
 * @returns Unicode code point as string, or null if not found
 */
type GetDingbatToUnicodeOptions = {
  typefaceNode: string;
  bulletChar: string;
};

export function getDingbatToUnicode({
  typefaceNode,
  bulletChar,
}: GetDingbatToUnicodeOptions): string | null {
  if (!dingbat_unicode || !typefaceNode || !bulletChar) {
    return null;
  }

  // Use charCodeAt instead of codePointAt for better compatibility
  const dingbatCharCode = bulletChar.charCodeAt(0) & 0xfff;
  let unicodeValue: string | null = null;
  let remaining = dingbat_unicode.length;
  let index = 0;

  while (remaining--) {
    const item = dingbat_unicode[index];
    if (item.f === typefaceNode && item.code === String(dingbatCharCode)) {
      unicodeValue = item.unicode;
      break;
    }
    index++;
  }

  return unicodeValue;
}
