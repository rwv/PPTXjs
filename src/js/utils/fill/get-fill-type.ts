import type { PptxNode } from "../../types";

/**
 * Determines the fill type for a PPTX shape node
 *
 * Possible fill types:
 * - NO_FILL: No fill (a:noFill)
 * - SOLID_FILL: Solid color fill (a:solidFill)
 * - GRADIENT_FILL: Gradient fill (a:gradFill)
 * - PATTERN_FILL: Pattern fill (a:pattFill)
 * - PIC_FILL: Picture/image fill (a:blipFill)
 * - GROUP_FILL: Group fill (a:grpFill)
 *
 * @param node - Shape properties node from PPTX
 * @returns Fill type as string constant
 */
export function getFillType(node: PptxNode): string {
  let fillType = "";
  if (node["a:noFill"] !== undefined) {
    fillType = "NO_FILL";
  }
  if (node["a:solidFill"] !== undefined) {
    fillType = "SOLID_FILL";
  }
  if (node["a:gradFill"] !== undefined) {
    fillType = "GRADIENT_FILL";
  }
  if (node["a:pattFill"] !== undefined) {
    fillType = "PATTERN_FILL";
  }
  if (node["a:blipFill"] !== undefined) {
    fillType = "PIC_FILL";
  }
  if (node["a:grpFill"] !== undefined) {
    fillType = "GROUP_FILL";
  }

  return fillType;
}
