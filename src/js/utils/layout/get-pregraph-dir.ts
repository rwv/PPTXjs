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
  paragraphNode: Record<string, unknown>,
  textBodyNode: Record<string, unknown> | undefined,
  idx: number | string | undefined,
  type: string | undefined,
  warpObj: Record<string, unknown>
): string {
  let rtlValue = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "rtl"]);
  //console.log("getPregraphDir node:", paragraphNode, "textBodyNode", textBodyNode, "rtl:", rtlValue, "idx", idx, "type", type, "warpObj", warpObj)

  if (rtlValue === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode(paragraphNode, idx, type, warpObj);
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLaout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;
    rtlValue = getTextByPathList(layoutParagraphPropsNode, ["attrs", "rtl"]);
    if (rtlValue === undefined && type !== "shape") {
      rtlValue = getTextByPathList(masterParagraphPropsNode, ["attrs", "rtl"]);
    }
  }

  if (rtlValue === "1") {
    return "pregraph-rtl";
  } else if (rtlValue === "0") {
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
