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
 * @param paragraphNode - Paragraph node from PPTX
 * @param textBodyNode - Text body node (unused but kept for consistency)
 * @param paragraphIndex - Layout index for fallback lookup
 * @param elementType - Shape type (title, body, textBox, shape, etc.)
 * @param warpContext - Container object with layout tables and master styles
 * @returns CSS class name for text direction (pregraph-rtl, pregraph-ltr, or pregraph-inherit)
 */
export function getPregraphDir(
  paragraphNode: Record<string, unknown>,
  textBodyNode: Record<string, unknown> | undefined,
  paragraphIndex: number | string | undefined,
  elementType: string | undefined,
  warpContext: Record<string, unknown>
): string {
  let rtlValue = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "rtl"]);
  //console.log("getPregraphDir node:", paragraphNode, "textBodyNode", textBodyNode, "rtl:", rtlValue, "paragraphIndex", paragraphIndex, "elementType", elementType, "warpContext", warpContext)

  if (rtlValue === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode(
      paragraphNode,
      paragraphIndex,
      elementType,
      warpContext
    );
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLayout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;
    rtlValue = getTextByPathList(layoutParagraphPropsNode, ["attrs", "rtl"]);
    if (rtlValue === undefined && elementType !== "shape") {
      rtlValue = getTextByPathList(masterParagraphPropsNode, ["attrs", "rtl"]);
    }
  }

  if (rtlValue === "1") {
    return "pregraph-rtl";
  } else if (rtlValue === "0") {
    return "pregraph-ltr";
  }
  return "pregraph-inherit";

  // var contentDir = getContentDir(elementType, warpContext);
  // console.log("getPregraphDir node:", node["a:r"], "rtl:", rtl, "paragraphIndex", paragraphIndex, "elementType", elementType, "contentDir:", contentDir)

  // if (contentDir == "content"){
  //     return "pregraph-ltr";
  // } else if (contentDir == "content-rtl"){
  //     return "pregraph-rtl";
  // }
  // return "";
}
