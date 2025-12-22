/**
 * Determines text decoration (underline and/or strikethrough)
 *
 * Handles combinations of:
 * - Underline (u attribute)
 * - Strikethrough (strike attribute)
 *
 * @param node - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns CSS text-decoration value ("underline", "line-through", "underline line-through", or "inherit")
 */
export function getFontDecoration(node: any, type: any, slideMasterTextStyles: any): string {
  if (node["a:rPr"] !== undefined) {
    var underLine =
      node["a:rPr"]["attrs"]["u"] !== undefined ? node["a:rPr"]["attrs"]["u"] : "none";
    var strikethrough =
      node["a:rPr"]["attrs"]["strike"] !== undefined
        ? node["a:rPr"]["attrs"]["strike"]
        : "noStrike";

    if (underLine != "none" && strikethrough == "noStrike") {
      return "underline";
    } else if (underLine == "none" && strikethrough != "noStrike") {
      return "line-through";
    } else if (underLine != "none" && strikethrough != "noStrike") {
      return "underline line-through";
    } else {
      return "inherit";
    }
  } else {
    return "inherit";
  }
}
