/**
 * Determines text decoration (underline and/or strikethrough)
 *
 * Handles combinations of:
 * - Underline (u attribute)
 * - Strikethrough (strike attribute)
 *
 * @param textRunNode - Text run node from PPTX
 * @returns CSS text-decoration value ("underline", "line-through", "underline line-through", or "inherit")
 */
type GetFontDecorationOptions = {
  textRunNode: Record<string, unknown>;
};

export function getFontDecoration({ textRunNode }: GetFontDecorationOptions): string {
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
