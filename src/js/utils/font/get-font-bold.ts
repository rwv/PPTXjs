import type { PptxNode } from "../../types";

/**
 * Determines if text should be bold
 *
 * @param node - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns "bold" or "inherit"
 */
export function getFontBold(node: PptxNode, _type: string, _slideMasterTextStyles: PptxNode): string {
  return node["a:rPr"] !== undefined && node["a:rPr"]["attrs"]["b"] === "1" ? "bold" : "inherit";
}
