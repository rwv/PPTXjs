/**
 * Determines if text should be bold
 *
 * @param textRunNode - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns "bold" or "inherit"
 */
export function getFontBold(
  textRunNode: Record<string, unknown>,
  _shapeType: string | undefined,
  _masterTextStyles: unknown
): string {
  void _shapeType;
  void _masterTextStyles;
  return textRunNode["a:rPr"] !== undefined && textRunNode["a:rPr"]["attrs"]["b"] === "1"
    ? "bold"
    : "inherit";
}
