import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Retrieves layout and master slide nodes for paragraph properties
 *
 * Handles node retrieval with fallback hierarchy:
 * 1. Layout-level node lookup by index
 * 2. Layout-level node lookup by type
 * 3. Master slide node lookup by type
 *
 * The level (lvl) is determined from the paragraph properties or defaults to 1.
 *
 * @param node - Paragraph node from PPTX
 * @param idx - Layout index for lookup
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns Object with nodeLaout and nodeMaster properties
 */
export function getLayoutAndMasterNode(
  paragraphNode: Record<string, unknown>,
  idx: number | string | undefined,
  type: string | undefined,
  warpObj: Record<string, unknown>
): { nodeLaout: unknown; nodeMaster: unknown } {
  let layoutParagraphPropsNode: unknown;
  let masterParagraphPropsNode: unknown;
  const paragraphPropsNode = paragraphNode["a:pPr"] as Record<string, unknown> | undefined;
  //lvl
  let level = 1;
  const levelNode = getTextByPathList<string>(paragraphPropsNode, ["attrs", "lvl"]);
  if (levelNode !== undefined) {
    level = parseInt(levelNode) + 1;
  }
  if (idx !== undefined) {
    //slidelayout
    const slideLayoutTables = warpObj["slideLayoutTables"] as Record<string, unknown>;
    const idxTable = slideLayoutTables["idxTable"] as Record<string | number, unknown>;
    const layoutNode = idxTable[idx];
    layoutParagraphPropsNode = getTextByPathList(layoutNode, [
      "p:txBody",
      "a:lstStyle",
      "a:lvl" + level + "pPr",
    ]);
    if (layoutParagraphPropsNode === undefined) {
      layoutParagraphPropsNode = getTextByPathList(layoutNode, ["p:txBody", "a:p", "a:pPr"]);
      if (layoutParagraphPropsNode === undefined) {
        layoutParagraphPropsNode = getTextByPathList(layoutNode, [
          "p:txBody",
          "a:p",
          level - 1,
          "a:pPr",
        ]);
      }
    }
  }
  if (type !== undefined) {
    //slidelayout
    const levelKey = "a:lvl" + level + "pPr";
    if (layoutParagraphPropsNode === undefined) {
      layoutParagraphPropsNode = getTextByPathList(warpObj, [
        "slideLayoutTables",
        "typeTable",
        type,
        "p:txBody",
        "a:lstStyle",
        levelKey,
      ]);
    }
    //masterlayout
    if (type === "title" || type === "ctrTitle") {
      masterParagraphPropsNode = getTextByPathList(warpObj, [
        "slideMasterTextStyles",
        "p:titleStyle",
        levelKey,
      ]);
    } else if (type === "body" || type === "obj" || type === "subTitle") {
      masterParagraphPropsNode = getTextByPathList(warpObj, [
        "slideMasterTextStyles",
        "p:bodyStyle",
        levelKey,
      ]);
    } else if (type === "shape" || type === "diagram") {
      masterParagraphPropsNode = getTextByPathList(warpObj, [
        "slideMasterTextStyles",
        "p:otherStyle",
        levelKey,
      ]);
    } else if (type === "textBox") {
      masterParagraphPropsNode = getTextByPathList(warpObj, ["defaultTextStyle", levelKey]);
    } else {
      masterParagraphPropsNode = getTextByPathList(warpObj, [
        "slideMasterTables",
        "typeTable",
        type,
        "p:txBody",
        "a:lstStyle",
        levelKey,
      ]);
    }
  }
  return {
    nodeLaout: layoutParagraphPropsNode,
    nodeMaster: masterParagraphPropsNode,
  };
}
