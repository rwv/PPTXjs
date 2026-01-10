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
 * @param paragraphNode - Paragraph node from PPTX
 * @param layoutIndex - Layout index for lookup
 * @param shapeType - Shape type (title, body, textBox, shape, etc.)
 * @param warpContext - Container object with layout tables and master styles
 * @returns Object with nodeLaout and nodeMaster properties
 */
export function getLayoutAndMasterNode(
  paragraphNode: Record<string, unknown>,
  layoutIndex: number | string | undefined,
  shapeType: string | undefined,
  warpContext: Record<string, unknown>
): { nodeLaout: unknown; nodeMaster: unknown } {
  let layoutParagraphPropsNode: unknown;
  let masterParagraphPropsNode: unknown;
  const paragraphPropsNode = paragraphNode["a:pPr"] as Record<string, unknown> | undefined;
  //lvl
  let listLevel = 1;
  const levelAttr = getTextByPathList<string>(paragraphPropsNode, ["attrs", "lvl"]);
  if (levelAttr !== undefined) {
    listLevel = parseInt(levelAttr) + 1;
  }
  if (layoutIndex !== undefined) {
    //slidelayout
    const slideLayoutTables = warpContext["slideLayoutTables"] as Record<string, unknown>;
    const indexTable = slideLayoutTables["idxTable"] as Record<string | number, unknown>;
    const layoutTableEntry = indexTable[layoutIndex];
    layoutParagraphPropsNode = getTextByPathList(layoutTableEntry, [
      "p:txBody",
      "a:lstStyle",
      "a:lvl" + listLevel + "pPr",
    ]);
    if (layoutParagraphPropsNode === undefined) {
      layoutParagraphPropsNode = getTextByPathList(layoutTableEntry, ["p:txBody", "a:p", "a:pPr"]);
      if (layoutParagraphPropsNode === undefined) {
        layoutParagraphPropsNode = getTextByPathList(layoutTableEntry, [
          "p:txBody",
          "a:p",
          listLevel - 1,
          "a:pPr",
        ]);
      }
    }
  }
  if (shapeType !== undefined) {
    //slidelayout
    const levelKey = "a:lvl" + listLevel + "pPr";
    if (layoutParagraphPropsNode === undefined) {
      layoutParagraphPropsNode = getTextByPathList(warpContext, [
        "slideLayoutTables",
        "typeTable",
        shapeType,
        "p:txBody",
        "a:lstStyle",
        levelKey,
      ]);
    }
    //masterlayout
    if (shapeType === "title" || shapeType === "ctrTitle") {
      masterParagraphPropsNode = getTextByPathList(warpContext, [
        "slideMasterTextStyles",
        "p:titleStyle",
        levelKey,
      ]);
    } else if (shapeType === "body" || shapeType === "obj" || shapeType === "subTitle") {
      masterParagraphPropsNode = getTextByPathList(warpContext, [
        "slideMasterTextStyles",
        "p:bodyStyle",
        levelKey,
      ]);
    } else if (shapeType === "shape" || shapeType === "diagram") {
      masterParagraphPropsNode = getTextByPathList(warpContext, [
        "slideMasterTextStyles",
        "p:otherStyle",
        levelKey,
      ]);
    } else if (shapeType === "textBox") {
      masterParagraphPropsNode = getTextByPathList(warpContext, ["defaultTextStyle", levelKey]);
    } else {
      masterParagraphPropsNode = getTextByPathList(warpContext, [
        "slideMasterTables",
        "typeTable",
        shapeType,
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
