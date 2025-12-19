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
 * @param node - Text node from PPTX
 * @param pNode - Parent paragraph node for fallback
 * @param type - Shape type (title, body, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns CSS text-align value ("left", "right", "center", "justify", or "inherit")
 */
export function getTextHorizontalAlign(
  node: any,
  pNode: any,
  type: any,
  warpObj: any
): string {
  //console.log("getTextHorizontalAlign: type: ", type, ", node: ", node)
  var getAlgn = getTextByPathList(node, ["a:pPr", "attrs", "algn"]);
  if (getAlgn === undefined) {
    getAlgn = getTextByPathList(pNode, ["a:pPr", "attrs", "algn"]);
  }
  if (getAlgn === undefined) {
    if (type == "title" || type == "ctrTitle" || type == "subTitle") {
      var lvlIdx = 1;
      var lvlNode = getTextByPathList(pNode, ["a:pPr", "attrs", "lvl"]);
      if (lvlNode !== undefined) {
        lvlIdx = parseInt(lvlNode) + 1;
      }
      var lvlStr = "a:lvl" + lvlIdx + "pPr";
      getAlgn = getTextByPathList(warpObj, ["slideLayoutTables", "typeTable", type, "p:txBody", "a:lstStyle", lvlStr, "attrs", "algn"]);
      if (getAlgn === undefined) {
        getAlgn = getTextByPathList(warpObj, ["slideMasterTables", "typeTable", type, "p:txBody", "a:lstStyle", lvlStr, "attrs", "algn"]);
        if (getAlgn === undefined) {
          getAlgn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:titleStyle", lvlStr, "attrs", "algn"]);
          if (getAlgn === undefined && type === "subTitle") {
            getAlgn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:bodyStyle", lvlStr, "attrs", "algn"]);
          }
        }
      }
    } else if (type == "body") {
      getAlgn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:bodyStyle", "a:lvl1pPr", "attrs", "algn"]);
    } else {
      getAlgn = getTextByPathList(warpObj, ["slideMasterTables", "typeTable", type, "p:txBody", "a:lstStyle", "a:lvl1pPr", "attrs", "algn"]);
    }

  }

  var align = "inherit";
  if (getAlgn !== undefined) {
    switch (getAlgn) {
      case "l":
        align = "left";
        break;
      case "r":
        align = "right";
        break;
      case "ctr":
        align = "center";
        break;
      case "just":
        align = "justify";
        break;
      case "dist":
        align = "justify";
        break;
      default:
        align = "inherit";
    }
  }
  return align;
}
