import { getTextByPathList } from "../object/get-text-by-path-list";
import type { XmlNode, WarpContext } from "../../types/pptx-xml";

type GetLayoutAndMasterNodeOptions = {
  paragraphNode: XmlNode | Record<string, unknown>;
  layoutIndex: number | string | undefined;
  shapeType: string | undefined;
  warpContext: WarpContext | Record<string, unknown>;
};

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
 * @returns Object with nodeLayout and nodeMaster properties
 */
export function getLayoutAndMasterNode({
  paragraphNode,
  layoutIndex,
  shapeType,
  warpContext,
}: GetLayoutAndMasterNodeOptions): {
  nodeLayout?: XmlNode;
  nodeMaster?: XmlNode;
  nodeLaout?: XmlNode;
} {
  const context = warpContext as WarpContext;
  let layoutParagraphPropsNode: XmlNode | undefined;
  let masterParagraphPropsNode: XmlNode | undefined;
  const paragraphPropsNode = (paragraphNode as XmlNode)["a:pPr"] as XmlNode | undefined;
  //lvl
  let listLevel = 1;
  const levelAttr = getTextByPathList<string>({ node: paragraphPropsNode, path: ["attrs", "lvl"] });
  if (levelAttr !== undefined) {
    const parsedLevel = Number.parseInt(levelAttr, 10);
    if (Number.isFinite(parsedLevel)) {
      listLevel = parsedLevel + 1;
    }
  }
  if (layoutIndex !== undefined && context.slideLayoutTables !== undefined) {
    //slidelayout
    const slideLayoutTables = context.slideLayoutTables;
    const indexTable = slideLayoutTables.idxTable;
    const layoutTableEntry = indexTable[layoutIndex];
    layoutParagraphPropsNode = getTextByPathList({
      node: layoutTableEntry,
      path: ["p:txBody", "a:lstStyle", "a:lvl" + listLevel + "pPr"],
    }) as XmlNode | undefined;
    if (layoutParagraphPropsNode === undefined) {
      layoutParagraphPropsNode = getTextByPathList({
        node: layoutTableEntry,
        path: ["p:txBody", "a:p", "a:pPr"],
      });
      if (layoutParagraphPropsNode === undefined) {
        layoutParagraphPropsNode = getTextByPathList({
          node: layoutTableEntry,
          path: ["p:txBody", "a:p", listLevel - 1, "a:pPr"],
        }) as XmlNode | undefined;
      }
    }
  }
  if (shapeType !== undefined) {
    //slidelayout
    const levelKey = "a:lvl" + listLevel + "pPr";
    if (layoutParagraphPropsNode === undefined && context.slideLayoutTables !== undefined) {
      layoutParagraphPropsNode = getTextByPathList({
        node: context.slideLayoutTables.typeTable,
        path: [shapeType, "p:txBody", "a:lstStyle", levelKey],
      }) as XmlNode | undefined;
    }
    //masterlayout
    if (shapeType === "title" || shapeType === "ctrTitle") {
      masterParagraphPropsNode = getTextByPathList({
        node: context.slideMasterTextStyles,
        path: ["p:titleStyle", levelKey],
      }) as XmlNode | undefined;
    } else if (shapeType === "body" || shapeType === "obj" || shapeType === "subTitle") {
      masterParagraphPropsNode = getTextByPathList({
        node: context.slideMasterTextStyles,
        path: ["p:bodyStyle", levelKey],
      }) as XmlNode | undefined;
    } else if (shapeType === "shape" || shapeType === "diagram") {
      masterParagraphPropsNode = getTextByPathList({
        node: context.slideMasterTextStyles,
        path: ["p:otherStyle", levelKey],
      }) as XmlNode | undefined;
    } else if (shapeType === "textBox") {
      masterParagraphPropsNode = getTextByPathList({
        node: context.defaultTextStyle,
        path: [levelKey],
      }) as XmlNode | undefined;
    } else {
      masterParagraphPropsNode = getTextByPathList({
        node: context.slideMasterTables?.typeTable,
        path: [shapeType, "p:txBody", "a:lstStyle", levelKey],
      }) as XmlNode | undefined;
    }
  }
  return {
    nodeLayout: layoutParagraphPropsNode,
    nodeMaster: masterParagraphPropsNode,
    // Backward compatibility until all call sites are updated.
    nodeLaout: layoutParagraphPropsNode,
  };
}
