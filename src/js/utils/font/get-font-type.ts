import { getTextByPathList } from "../object/get-text-by-path-list";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

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
  textRunNode: XmlNode,
  shapeType: string | undefined,
  warpContext: WarpContext,
  paragraphFontStyle: XmlNode | undefined
): string {
  const typefaceValueRaw = getTextByPathList<string | number>(textRunNode, [
    "a:rPr",
    "a:latin",
    "attrs",
    "typeface",
  ]);
  let typefaceValue = typefaceValueRaw !== undefined ? String(typefaceValueRaw) : undefined;

  if (typefaceValue === undefined) {
    let fontIndexKey = "";
    let fontGroupKey = "";
    if (paragraphFontStyle !== undefined) {
      const fontIndexValue = getTextByPathList<string | number>(paragraphFontStyle, [
        "attrs",
        "idx",
      ]);
      if (fontIndexValue !== undefined) {
        fontIndexKey = String(fontIndexValue);
      }
    }
    const fontSchemeNodeValue = warpContext.themeContent
      ? getTextByPathList(warpContext.themeContent, ["a:theme", "a:themeElements", "a:fontScheme"])
      : undefined;
    const fontSchemeNode = asXmlNode(fontSchemeNodeValue);
    if (fontIndexKey === "") {
      if (shapeType === "title" || shapeType === "subTitle" || shapeType === "ctrTitle") {
        fontIndexKey = "major";
      } else {
        fontIndexKey = "minor";
      }
    }
    fontGroupKey = "a:" + fontIndexKey + "Font";
    const fontTypefaceValue =
      fontSchemeNode !== undefined
        ? getTextByPathList<string | number>(fontSchemeNode, [
            fontGroupKey,
            "a:latin",
            "attrs",
            "typeface",
          ])
        : undefined;
    typefaceValue = fontTypefaceValue !== undefined ? String(fontTypefaceValue) : undefined;
  }

  return typefaceValue === undefined ? "inherit" : typefaceValue;
}
