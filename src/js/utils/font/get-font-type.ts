import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines the font typeface (font family) for a PPTX text node
 *
 * Resolves font with fallback hierarchy:
 * 1. Explicit typeface in node (a:rPr -> a:latin -> typeface)
 * 2. Font scheme from theme (major for titles, minor for body text)
 *
 * @param textRunNode - Text run node from PPTX
 * @param type - Shape type (title, body, etc.) - determines major vs minor font
 * @param warpObj - Container object with theme content
 * @param paragraphFontStyle - Paragraph font style (may specify font index)
 * @returns Font family name or "inherit"
 */
export function getFontType(
  textRunNode: Record<string, unknown>,
  type: string | undefined,
  warpObj: Record<string, unknown>,
  paragraphFontStyle: Record<string, unknown> | undefined
): string {
  let typefaceValue = getTextByPathList(textRunNode, ["a:rPr", "a:latin", "attrs", "typeface"]);

  if (typefaceValue === undefined) {
    let fontIndex = "";
    let fontGroupKey = "";
    if (paragraphFontStyle !== undefined) {
      fontIndex = getTextByPathList(paragraphFontStyle, ["attrs", "idx"]);
    }
    const fontSchemeNode = getTextByPathList(warpObj["themeContent"], [
      "a:theme",
      "a:themeElements",
      "a:fontScheme",
    ]);
    if (fontIndex === "") {
      if (type === "title" || type === "subTitle" || type === "ctrTitle") {
        fontIndex = "major";
      } else {
        fontIndex = "minor";
      }
    }
    fontGroupKey = "a:" + fontIndex + "Font";
    typefaceValue = getTextByPathList(fontSchemeNode, [
      fontGroupKey,
      "a:latin",
      "attrs",
      "typeface",
    ]);
  }

  return typefaceValue === undefined ? "inherit" : typefaceValue;
}
