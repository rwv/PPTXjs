/**
 * Determines if text should be bold
 *
 * @param textRunNode - Text run node from PPTX
 * @returns "bold" or "inherit"
 */
type GetFontBoldOptions = {
  textRunNode: Record<string, unknown>;
};

export function getFontBold({ textRunNode }: GetFontBoldOptions): string {
  return textRunNode["a:rPr"] !== undefined && textRunNode["a:rPr"]["attrs"]["b"] === "1"
    ? "bold"
    : "inherit";
}
