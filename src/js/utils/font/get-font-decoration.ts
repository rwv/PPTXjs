/**
 * Determines text decoration (underline and/or strikethrough)
 *
 * Handles combinations of:
 * - Underline (u attribute)
 * - Strikethrough (strike attribute)
 *
 * @param textRunNode - Text run node from PPTX
 * @param type - Shape type (unused but kept for consistency)
 * @param slideMasterTextStyles - Master text styles (unused but kept for consistency)
 * @returns CSS text-decoration value ("underline", "line-through", "underline line-through", or "inherit")
 */
export function getFontDecoration(
  textRunNode: Record<string, unknown>,
  _shapeType: string | undefined,
  _masterTextStyles: unknown
): string {
  void _shapeType;
  void _masterTextStyles;
  if (textRunNode["a:rPr"] !== undefined) {
    const underlineStyle =
      textRunNode["a:rPr"]["attrs"]["u"] !== undefined
        ? textRunNode["a:rPr"]["attrs"]["u"]
        : "none";
    const strikethroughStyle =
      textRunNode["a:rPr"]["attrs"]["strike"] !== undefined
        ? textRunNode["a:rPr"]["attrs"]["strike"]
        : "noStrike";

    if (underlineStyle !== "none" && strikethroughStyle === "noStrike") {
      return "underline";
    } else if (underlineStyle === "none" && strikethroughStyle !== "noStrike") {
      return "line-through";
    } else if (underlineStyle !== "none" && strikethroughStyle !== "noStrike") {
      return "underline line-through";
    } else {
      return "inherit";
    }
  } else {
    return "inherit";
  }
}
