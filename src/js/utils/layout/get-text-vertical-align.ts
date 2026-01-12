import { getTextByPathList } from "../object/get-text-by-path-list";
import type { XmlNode } from "../../types/pptx-xml";

/**
 * Determines vertical text alignment (baseline offset) for superscript/subscript
 *
 * Uses the baseline attribute from run properties to calculate vertical offset.
 * baseline value is in units that need to be divided by 1000 to get percentage.
 *
 * @param textRunNode - Text run node from PPTX
 * @param shapeType - Shape type (unused but kept for consistency)
 * @param masterTextStyles - Master text styles (unused but kept for consistency)
 * @returns CSS vertical-align value (percentage or "baseline")
 */
export function getTextVerticalAlign(
  textRunNode: XmlNode,
  shapeType: string | undefined,
  masterTextStyles: XmlNode | undefined
): string {
  void shapeType;
  void masterTextStyles;
  const baselineValue = getTextByPathList<string | number>(textRunNode, [
    "a:rPr",
    "attrs",
    "baseline",
  ]);
  return baselineValue === undefined
    ? "baseline"
    : parseInt(String(baselineValue), 10) / 1000 + "%";
}
