import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines the font typeface (font family) for a PPTX text node
 *
 * Resolves font with fallback hierarchy:
 * 1. Explicit typeface in node (a:rPr -> a:latin -> typeface)
 * 2. Font scheme from theme (major for titles, minor for body text)
 *
 * @param textRunNode - Text run node from PPTX
 * @param shapeType - Shape type (title, body, etc.) - determines major vs minor font
 * @param warpContext - Container object with theme content
 * @param paragraphFontStyle - Paragraph font style (may specify font index)
 * @returns Font family name or "inherit"
 */
export function getFontType(
  textRunNode: Record<string, unknown>,
  shapeType: string | undefined,
  warpContext: Record<string, unknown>,
  paragraphFontStyle: Record<string, unknown> | undefined
): string {
  let typefaceValue = getTextByPathList(textRunNode, ["a:rPr", "a:latin", "attrs", "typeface"]);

  if (typefaceValue === undefined) {
    let fontIndexKey = "";
    let fontGroupKey = "";
    if (paragraphFontStyle !== undefined) {
      fontIndexKey = getTextByPathList(paragraphFontStyle, ["attrs", "idx"]);
    }
    const fontSchemeNode = getTextByPathList(warpContext["themeContent"], [
      "a:theme",
      "a:themeElements",
      "a:fontScheme",
    ]);
    if (fontIndexKey === "") {
      if (shapeType === "title" || shapeType === "subTitle" || shapeType === "ctrTitle") {
        fontIndexKey = "major";
      } else {
        fontIndexKey = "minor";
      }
    }
    fontGroupKey = "a:" + fontIndexKey + "Font";
    typefaceValue = getTextByPathList(fontSchemeNode, [
      fontGroupKey,
      "a:latin",
      "attrs",
      "typeface",
    ]);
  }

  return typefaceValue === undefined ? "inherit" : typefaceValue;
}
