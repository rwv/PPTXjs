/**
 * Determines if text should be italic
 *
 * @param textRunNode - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns "italic" or "inherit"
 */
export function getFontItalic(
  textRunNode: Record<string, unknown>,
  _shapeType: string | undefined,
  _masterTextStyles: unknown
): string {
  void _shapeType;
  void _masterTextStyles;
  return textRunNode["a:rPr"] !== undefined && textRunNode["a:rPr"]["attrs"]["i"] === "1"
    ? "italic"
    : "inherit";
}
