import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines the font typeface (font family) for a PPTX text node
 *
 * Resolves font with fallback hierarchy:
 * 1. Explicit typeface in node (a:rPr -> a:latin -> typeface)
 * 2. Font scheme from theme (major for titles, minor for body text)
 *
 * @param node - Text run node from PPTX
 * @param type - Shape type (title, body, etc.) - determines major vs minor font
 * @param warpObj - Container object with theme content
 * @param pFontStyle - Paragraph font style (may specify font index)
 * @returns Font family name or "inherit"
 */
export function getFontType(node: any, type: any, warpObj: any, pFontStyle: any): string {
  var typeface = getTextByPathList(node, ["a:rPr", "a:latin", "attrs", "typeface"]);

  if (typeface === undefined) {
    var fontIdx = "";
    var fontGrup = "";
    if (pFontStyle !== undefined) {
      fontIdx = getTextByPathList(pFontStyle, ["attrs", "idx"]);
    }
    var fontSchemeNode = getTextByPathList(warpObj["themeContent"], [
      "a:theme",
      "a:themeElements",
      "a:fontScheme",
    ]);
    if (fontIdx == "") {
      if (type == "title" || type == "subTitle" || type == "ctrTitle") {
        fontIdx = "major";
      } else {
        fontIdx = "minor";
      }
    }
    fontGrup = "a:" + fontIdx + "Font";
    typeface = getTextByPathList(fontSchemeNode, [fontGrup, "a:latin", "attrs", "typeface"]);
  }

  return typeface === undefined ? "inherit" : typeface;
}
