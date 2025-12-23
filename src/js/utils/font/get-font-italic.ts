import type { PptxNode } from "../../types";

/**
 * Determines if text should be italic
 *
 * @param node - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns "italic" or "inherit"
 */
export function getFontItalic(node: PptxNode, _type: any, _slideMasterTextStyles: any): string {
  return node["a:rPr"] !== undefined && node["a:rPr"]["attrs"]["i"] === "1" ? "italic" : "inherit";
}
