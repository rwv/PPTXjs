import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines horizontal text alignment for a text node
 *
 * Resolves alignment with fallback hierarchy:
 * 1. Node paragraph properties
 * 2. Parent node paragraph properties
 * 3. Layout/master text styles based on type
 *
 * Maps PPTX alignment values to CSS:
 * - "l" → "left"
 * - "r" → "right"
 * - "ctr" → "center"
 * - "just"/"dist" → "justify"
 *
 * @param textNode - Text node from PPTX
 * @param paragraphNode - Parent paragraph node for fallback
 * @param shapeType - Shape type (title, body, etc.)
 * @param warpContext - Container object with layout tables and master styles
 * @returns CSS text-align value ("left", "right", "center", "justify", or "inherit")
 */
export function getTextHorizontalAlign(
  textNode: Record<string, unknown>,
  paragraphNode: Record<string, unknown>,
  shapeType: string | undefined,
  warpContext: Record<string, unknown>
): string {
  //console.log("getTextHorizontalAlign: type: ", shapeType, ", node: ", textNode)
  let alignmentValue = getTextByPathList(textNode, ["a:pPr", "attrs", "algn"]);
  if (alignmentValue === undefined) {
    alignmentValue = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "algn"]);
  }
  if (alignmentValue === undefined) {
    if (shapeType === "title" || shapeType === "ctrTitle" || shapeType === "subTitle") {
      let listLevel = 1;
      const levelAttr = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "lvl"]);
      if (levelAttr !== undefined) {
        listLevel = parseInt(levelAttr) + 1;
      }
      const levelKey = "a:lvl" + listLevel + "pPr";
      alignmentValue = getTextByPathList(warpContext, [
        "slideLayoutTables",
        "typeTable",
        shapeType,
        "p:txBody",
        "a:lstStyle",
        levelKey,
        "attrs",
        "algn",
      ]);
      if (alignmentValue === undefined) {
        alignmentValue = getTextByPathList(warpContext, [
          "slideMasterTables",
          "typeTable",
          shapeType,
          "p:txBody",
          "a:lstStyle",
          levelKey,
          "attrs",
          "algn",
        ]);
        if (alignmentValue === undefined) {
          alignmentValue = getTextByPathList(warpContext, [
            "slideMasterTextStyles",
            "p:titleStyle",
            levelKey,
            "attrs",
            "algn",
          ]);
          if (alignmentValue === undefined && shapeType === "subTitle") {
            alignmentValue = getTextByPathList(warpContext, [
              "slideMasterTextStyles",
              "p:bodyStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          }
        }
      }
    } else if (shapeType === "body") {
      alignmentValue = getTextByPathList(warpContext, [
        "slideMasterTextStyles",
        "p:bodyStyle",
        "a:lvl1pPr",
        "attrs",
        "algn",
      ]);
    } else {
      alignmentValue = getTextByPathList(warpContext, [
        "slideMasterTables",
        "typeTable",
        shapeType,
        "p:txBody",
        "a:lstStyle",
        "a:lvl1pPr",
        "attrs",
        "algn",
      ]);
    }
  }

  let textAlign = "inherit";
  if (alignmentValue !== undefined) {
    switch (alignmentValue) {
      case "l":
        textAlign = "left";
        break;
      case "r":
        textAlign = "right";
        break;
      case "ctr":
        textAlign = "center";
        break;
      case "just":
        textAlign = "justify";
        break;
      case "dist":
        textAlign = "justify";
        break;
      default:
        textAlign = "inherit";
    }
  }
  return textAlign;
}
