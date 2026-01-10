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
 * @param textBodyContainerNode - Node containing text body
 * @param layoutShapeNode - Layout node with text body
 * @param masterShapeNode - Master slide node with text body
 * @param shapeType - Shape type (for debugging)
 * @returns CSS class name for vertical alignment ("v-mid", "v-down", or "v-up")
 */
export function getVerticalAlign(
  textBodyContainerNode: Record<string, unknown>,
  layoutShapeNode: Record<string, unknown> | undefined,
  masterShapeNode: Record<string, unknown> | undefined,
  _shapeType: string | undefined
): string {
  void _shapeType;
  // Find anchor with fallback hierarchy: node -> layout -> master -> default
  let anchorValue = getTextByPathList(textBodyContainerNode, [
    "p:txBody",
    "a:bodyPr",
    "attrs",
    "anchor",
  ]);

  if (anchorValue === undefined) {
    anchorValue = getTextByPathList(layoutShapeNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
    if (anchorValue === undefined) {
      anchorValue = getTextByPathList(masterShapeNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
      if (anchorValue === undefined) {
        // "If this attribute is omitted, then a value of t, or top is implied."
        anchorValue = "t";
      }
    }
  }

  // Map PPTX anchor values to CSS classes
  return anchorValue === "ctr" ? "v-mid" : anchorValue === "b" ? "v-down" : "v-up";
}
