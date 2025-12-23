import { getTextByPathList } from "../object/get-text-by-path-list";
import { getLayoutAndMasterNode } from "./get-layout-and-master-node";

/**
 * Determines paragraph text direction (RTL/LTR) for a PPTX paragraph node
 *
 * Handles RTL (right-to-left) text direction with fallback hierarchy:
 * 1. Paragraph-level rtl attribute (highest priority)
 * 2. Layout-level rtl attribute
 * 3. Master slide rtl attribute (lowest priority)
 * 4. Default to "pregraph-inherit" if not specified
 *
 * @param node - Paragraph node from PPTX
 * @param textBodyNode - Text body node (unused but kept for consistency)
 * @param idx - Layout index for fallback lookup
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns CSS class name for text direction (pregraph-rtl, pregraph-ltr, or pregraph-inherit)
 */
export function getPregraphDir(
  node: any,
  textBodyNode: any,
  idx: any,
  type: any,
  warpObj: any
): string {
  let rtl = getTextByPathList(node, ["a:pPr", "attrs", "rtl"]);
  //console.log("getPregraphDir node:", node, "textBodyNode", textBodyNode, "rtl:", rtl, "idx", idx, "type", type, "warpObj", warpObj)

  if (rtl === undefined) {
    const layoutMasterNode = getLayoutAndMasterNode(node, idx, type, warpObj);
    const pPrNodeLaout = layoutMasterNode.nodeLaout;
    const pPrNodeMaster = layoutMasterNode.nodeMaster;
    rtl = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
    if (rtl === undefined && type != "shape") {
      rtl = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
    }
  }

  if (rtl == "1") {
    return "pregraph-rtl";
  } else if (rtl == "0") {
    return "pregraph-ltr";
  }
  return "pregraph-inherit";

  // var contentDir = getContentDir(type, warpObj);
  // console.log("getPregraphDir node:", node["a:r"], "rtl:", rtl, "idx", idx, "type", type, "contentDir:", contentDir)

  // if (contentDir == "content"){
  //     return "pregraph-ltr";
  // } else if (contentDir == "content-rtl"){
  //     return "pregraph-rtl";
  // }
  // return "";
}
