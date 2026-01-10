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
  node: Record<string, unknown>,
  idx: number | string | undefined,
  type: string | undefined,
  warpObj: Record<string, unknown>
): { nodeLaout: unknown; nodeMaster: unknown } {
  let pPrNodeLaout: unknown;
  let pPrNodeMaster: unknown;
  const pPrNode = node["a:pPr"] as Record<string, unknown> | undefined;
  //lvl
  let lvl = 1;
  const lvlNode = getTextByPathList<string>(pPrNode, ["attrs", "lvl"]);
  if (lvlNode !== undefined) {
    lvl = parseInt(lvlNode) + 1;
  }
  if (idx !== undefined) {
    //slidelayout
    const slideLayoutTables = warpObj["slideLayoutTables"] as Record<string, unknown>;
    const idxTable = slideLayoutTables["idxTable"] as Record<string | number, unknown>;
    const idxNode = idxTable[idx];
    pPrNodeLaout = getTextByPathList(idxNode, ["p:txBody", "a:lstStyle", "a:lvl" + lvl + "pPr"]);
    if (pPrNodeLaout === undefined) {
      pPrNodeLaout = getTextByPathList(idxNode, ["p:txBody", "a:p", "a:pPr"]);
      if (pPrNodeLaout === undefined) {
        pPrNodeLaout = getTextByPathList(idxNode, ["p:txBody", "a:p", lvl - 1, "a:pPr"]);
      }
    }
  }
  if (type !== undefined) {
    //slidelayout
    const lvlStr = "a:lvl" + lvl + "pPr";
    if (pPrNodeLaout === undefined) {
      pPrNodeLaout = getTextByPathList(warpObj, [
        "slideLayoutTables",
        "typeTable",
        type,
        "p:txBody",
        "a:lstStyle",
        lvlStr,
      ]);
    }
    //masterlayout
    if (type === "title" || type === "ctrTitle") {
      pPrNodeMaster = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:titleStyle", lvlStr]);
    } else if (type === "body" || type === "obj" || type === "subTitle") {
      pPrNodeMaster = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:bodyStyle", lvlStr]);
    } else if (type === "shape" || type === "diagram") {
      pPrNodeMaster = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:otherStyle", lvlStr]);
    } else if (type === "textBox") {
      pPrNodeMaster = getTextByPathList(warpObj, ["defaultTextStyle", lvlStr]);
    } else {
      pPrNodeMaster = getTextByPathList(warpObj, [
        "slideMasterTables",
        "typeTable",
        type,
        "p:txBody",
        "a:lstStyle",
        lvlStr,
      ]);
    }
  }
  return {
    nodeLaout: pPrNodeLaout,
    nodeMaster: pPrNodeMaster,
  };
}
