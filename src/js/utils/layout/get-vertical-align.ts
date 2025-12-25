import type { PptxNode } from "../../types";
import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Gets the vertical alignment CSS class for a PPTX text body
 *
 * Handles vertical alignment with fallback hierarchy:
 * 1. Node-level alignment (highest priority)
 * 2. Layout-level alignment
 * 3. Master slide alignment (lowest priority)
 * 4. Default to "t" (top) if not specified
 *
 * Maps PPTX anchor values to CSS classes:
 * - "ctr" (center) → "v-mid"
 * - "b" (bottom) → "v-down"
 * - "t" (top) or undefined → "v-up"
 *
 * @param node - Node containing text body
 * @param slideLayoutSpNode - Layout node with text body
 * @param slideMasterSpNode - Master slide node with text body
 * @param type - Shape type (for debugging)
 * @returns CSS class name for vertical alignment ("v-mid", "v-down", or "v-up")
 */
export function getVerticalAlign(
  node: PptxNode,
  slideLayoutSpNode: PptxNode,
  slideMasterSpNode: PptxNode,
  _type: string
): string {
  // Find anchor with fallback hierarchy: node -> layout -> master -> default
  let anchor = getTextByPathList(node, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);

  if (anchor === undefined) {
    anchor = getTextByPathList(slideLayoutSpNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
    if (anchor === undefined) {
      anchor = getTextByPathList(slideMasterSpNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
      if (anchor === undefined) {
        // "If this attribute is omitted, then a value of t, or top is implied."
        anchor = "t";
      }
    }
  }

  // Map PPTX anchor values to CSS classes
  return anchor === "ctr" ? "v-mid" : anchor === "b" ? "v-down" : "v-up";
}
