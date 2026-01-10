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
 * @param type - Shape type (title, body, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns CSS text-align value ("left", "right", "center", "justify", or "inherit")
 */
export function getTextHorizontalAlign(
  textNode: Record<string, unknown>,
  paragraphNode: Record<string, unknown>,
  type: string | undefined,
  warpObj: Record<string, unknown>
): string {
  //console.log("getTextHorizontalAlign: type: ", type, ", node: ", textNode)
  let alignmentValue = getTextByPathList(textNode, ["a:pPr", "attrs", "algn"]);
  if (alignmentValue === undefined) {
    alignmentValue = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "algn"]);
  }
  if (alignmentValue === undefined) {
    if (type === "title" || type === "ctrTitle" || type === "subTitle") {
      let levelIndex = 1;
      const levelNode = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "lvl"]);
      if (levelNode !== undefined) {
        levelIndex = parseInt(levelNode) + 1;
      }
      const levelKey = "a:lvl" + levelIndex + "pPr";
      alignmentValue = getTextByPathList(warpObj, [
        "slideLayoutTables",
        "typeTable",
        type,
        "p:txBody",
        "a:lstStyle",
        levelKey,
        "attrs",
        "algn",
      ]);
      if (alignmentValue === undefined) {
        alignmentValue = getTextByPathList(warpObj, [
          "slideMasterTables",
          "typeTable",
          type,
          "p:txBody",
          "a:lstStyle",
          levelKey,
          "attrs",
          "algn",
        ]);
        if (alignmentValue === undefined) {
          alignmentValue = getTextByPathList(warpObj, [
            "slideMasterTextStyles",
            "p:titleStyle",
            levelKey,
            "attrs",
            "algn",
          ]);
          if (alignmentValue === undefined && type === "subTitle") {
            alignmentValue = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:bodyStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          }
        }
      }
    } else if (type === "body") {
      alignmentValue = getTextByPathList(warpObj, [
        "slideMasterTextStyles",
        "p:bodyStyle",
        "a:lvl1pPr",
        "attrs",
        "algn",
      ]);
    } else {
      alignmentValue = getTextByPathList(warpObj, [
        "slideMasterTables",
        "typeTable",
        type,
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
