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
 * @param shapePropsNode - Shape properties node from PPTX
 * @returns Fill type as string constant
 */
export function getFillType(shapePropsNode: Record<string, unknown>): string {
  let detectedFillType = "";
  if (shapePropsNode["a:noFill"] !== undefined) {
    detectedFillType = "NO_FILL";
  }
  if (shapePropsNode["a:solidFill"] !== undefined) {
    detectedFillType = "SOLID_FILL";
  }
  if (shapePropsNode["a:gradFill"] !== undefined) {
    detectedFillType = "GRADIENT_FILL";
  }
  if (shapePropsNode["a:pattFill"] !== undefined) {
    detectedFillType = "PATTERN_FILL";
  }
  if (shapePropsNode["a:blipFill"] !== undefined) {
    detectedFillType = "PIC_FILL";
  }
  if (shapePropsNode["a:grpFill"] !== undefined) {
    detectedFillType = "GROUP_FILL";
  }

  return detectedFillType;
}
