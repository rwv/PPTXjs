/**
 * Determines if text should be italic
 *
 * @param textRunNode - Text run node from PPTX
 * @returns "italic" or "inherit"
 */
type GetFontItalicOptions = {
  textRunNode: Record<string, unknown>;
};

export function getFontItalic({ textRunNode }: GetFontItalicOptions): string {
  return textRunNode["a:rPr"] !== undefined && textRunNode["a:rPr"]["attrs"]["i"] === "1"
    ? "italic"
    : "inherit";
}
