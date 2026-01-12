import { getTextByPathList } from "../object/get-text-by-path-list";
import { getLayoutAndMasterNode } from "./get-layout-and-master-node";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

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
  paragraphNode: XmlNode,
  textBodyNode: XmlNode | undefined,
  paragraphIndex: number | string | undefined,
  elementType: string | undefined,
  warpContext: WarpContext
): string {
  void textBodyNode;
  const rtlValue = getTextByPathList<string | number>(paragraphNode, ["a:pPr", "attrs", "rtl"]);
  let rtlString = rtlValue !== undefined ? String(rtlValue) : undefined;
  //console.log("getPregraphDir node:", paragraphNode, "textBodyNode", textBodyNode, "rtl:", rtlValue, "paragraphIndex", paragraphIndex, "elementType", elementType, "warpContext", warpContext)

  if (rtlString === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode(
      paragraphNode,
      paragraphIndex,
      elementType,
      warpContext
    );
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLayout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;
    const layoutRtlValue = layoutParagraphPropsNode
      ? getTextByPathList<string | number>(layoutParagraphPropsNode, ["attrs", "rtl"])
      : undefined;
    rtlString = layoutRtlValue !== undefined ? String(layoutRtlValue) : undefined;
    if (rtlString === undefined && elementType !== "shape") {
      const masterRtlValue = masterParagraphPropsNode
        ? getTextByPathList<string | number>(masterParagraphPropsNode, ["attrs", "rtl"])
        : undefined;
      rtlString = masterRtlValue !== undefined ? String(masterRtlValue) : undefined;
    }
  }

  if (rtlString === "1") {
    return "pregraph-rtl";
  } else if (rtlString === "0") {
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
