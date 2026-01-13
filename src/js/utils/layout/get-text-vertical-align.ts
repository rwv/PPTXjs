import { getTextByPathList } from "../object/get-text-by-path-list";
import type { XmlNode } from "../../types/pptx-xml";

/**
 * Determines vertical text alignment (baseline offset) for superscript/subscript
 *
 * Uses the baseline attribute from run properties to calculate vertical offset.
 * baseline value is in units that need to be divided by 1000 to get percentage.
 *
 * @param textRunNode - Text run node from PPTX
 * @returns CSS vertical-align value (percentage or "baseline")
 */
type GetTextVerticalAlignOptions = {
  textRunNode: XmlNode;
};

export function getTextVerticalAlign({ textRunNode }: GetTextVerticalAlignOptions): string {
  const baselineValue = getTextByPathList<string | number>({
    node: textRunNode,
    path: ["a:rPr", "attrs", "baseline"],
  });
  if (baselineValue === undefined) {
    return "baseline";
  }
  const parsedBaseline = Number.parseInt(String(baselineValue), 10);
  return Number.isFinite(parsedBaseline) ? parsedBaseline / 1000 + "%" : "baseline";
}
