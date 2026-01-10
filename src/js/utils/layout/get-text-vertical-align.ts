import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines vertical text alignment (baseline offset) for superscript/subscript
 *
 * Uses the baseline attribute from run properties to calculate vertical offset.
 * baseline value is in units that need to be divided by 1000 to get percentage.
 *
 * @param node - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns CSS vertical-align value (percentage or "baseline")
 */
export function getTextVerticalAlign(
  node: unknown,
  _type: string | undefined,
  _slideMasterTextStyles: unknown
): string {
  void _type;
  void _slideMasterTextStyles;
  const baseline = getTextByPathList(node, ["a:rPr", "attrs", "baseline"]);
  return baseline === undefined ? "baseline" : parseInt(baseline) / 1000 + "%";
}
