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
type GetPregraphDirOptions = {
  paragraphNode: XmlNode;
  paragraphIndex: number | string | undefined;
  elementType: string | undefined;
  warpContext: WarpContext;
};

export function getPregraphDir({
  paragraphNode,
  paragraphIndex,
  elementType,
  warpContext,
}: GetPregraphDirOptions): string {
  const rtlValue = getTextByPathList<string | number>({
    node: paragraphNode,
    path: ["a:pPr", "attrs", "rtl"],
  });
  let rtlString = rtlValue !== undefined ? String(rtlValue) : undefined;
  //console.log("getPregraphDir node:", paragraphNode, "textBodyNode", textBodyNode, "rtl:", rtlValue, "paragraphIndex", paragraphIndex, "elementType", elementType, "warpContext", warpContext)

  if (rtlString === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode({
      paragraphNode,
      layoutIndex: paragraphIndex,
      shapeType: elementType,
      warpContext,
    });
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLayout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;
    const layoutRtlValue = layoutParagraphPropsNode
      ? getTextByPathList<string | number>({
          node: layoutParagraphPropsNode,
          path: ["attrs", "rtl"],
        })
      : undefined;
    rtlString = layoutRtlValue !== undefined ? String(layoutRtlValue) : undefined;
    if (rtlString === undefined && elementType !== "shape") {
      const masterRtlValue = masterParagraphPropsNode
        ? getTextByPathList<string | number>({
            node: masterParagraphPropsNode,
            path: ["attrs", "rtl"],
          })
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
