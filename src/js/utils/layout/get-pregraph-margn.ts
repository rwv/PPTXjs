/**
 * Get paragraph margin/padding styles for bulleted text
 *
 * @param paragraphNode - Paragraph node
 * @param paragraphIndex - Index
 * @param elementType - Element type
 * @param isBulleted - Whether the paragraph has bullets
 * @param warpContext - The warp context containing layout tables
 * @param emuToPx - Conversion factor from EMU to pixels
 * @returns Array containing [margin CSS string, margin value in pixels]
 */
import { getTextByPathList } from "../object";
import { getLayoutAndMasterNode } from "./get-layout-and-master-node";

export function getPregraphMargn(
  paragraphNode: Record<string, unknown>,
  paragraphIndex: number | string | undefined,
  elementType: string | undefined,
  isBulleted: boolean,
  warpContext: Record<string, unknown>,
  emuToPx: number
): [string, number] {
  if (!isBulleted) {
    return ["", 0];
  }

  let marginLeftStyle = "",
    marginValue = 0;
  const paragraphPropsNode = paragraphNode["a:pPr"];
  const layoutMasterNode = getLayoutAndMasterNode(
    paragraphNode,
    paragraphIndex,
    elementType,
    warpContext
  );
  const paragraphPropsNodeLayout = layoutMasterNode.nodeLayout;
  const paragraphPropsNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  let rtlValue = getTextByPathList(paragraphPropsNode, ["attrs", "rtl"]);
  if (rtlValue === undefined) {
    rtlValue = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "rtl"]);
    if (rtlValue === undefined && elementType !== "shape") {
      rtlValue = getTextByPathList(paragraphPropsNodeMaster, ["attrs", "rtl"]);
    }
  }
  let isRTL = false;
  if (rtlValue !== undefined && rtlValue === "1") {
    isRTL = true;
  }

  // align
  let alignNode = getTextByPathList(paragraphPropsNode, ["attrs", "algn"]);
  if (alignNode === undefined) {
    alignNode = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getTextByPathList(paragraphPropsNodeMaster, ["attrs", "algn"]);
    }
  }

  // indent
  let indentValueNode = getTextByPathList(paragraphPropsNode, ["attrs", "indent"]);
  if (indentValueNode === undefined) {
    indentValueNode = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "indent"]);
    if (indentValueNode === undefined) {
      indentValueNode = getTextByPathList(paragraphPropsNodeMaster, ["attrs", "indent"]);
    }
  }
  let indent = 0;
  if (indentValueNode !== undefined) {
    indent = parseInt(indentValueNode) * emuToPx;
  }

  // marL
  let marginLeftNode = getTextByPathList(paragraphPropsNode, ["attrs", "marL"]);
  if (marginLeftNode === undefined) {
    marginLeftNode = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "marL"]);
    if (marginLeftNode === undefined) {
      marginLeftNode = getTextByPathList(paragraphPropsNodeMaster, ["attrs", "marL"]);
    }
  }
  let marginLeft = 0;
  if (marginLeftNode !== undefined) {
    marginLeft = parseInt(marginLeftNode) * emuToPx;
  }

  if (indentValueNode !== undefined || marginLeftNode !== undefined) {
    if (isRTL) {
      marginLeftStyle = "padding-right: ";
    } else {
      marginLeftStyle = "padding-left: ";
    }
    if (isBulleted) {
      marginValue = Math.abs(0 - indent);
      marginLeftStyle += marginValue + "px;";
    } else {
      marginValue = Math.abs(marginLeft + indent);
      marginLeftStyle += marginValue + "px;";
    }
  }

  // marR
  let marginRightNode = getTextByPathList(paragraphPropsNode, ["attrs", "marR"]);
  if (marginRightNode === undefined && marginLeftNode === undefined) {
    marginRightNode = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "marR"]);
    if (marginRightNode === undefined) {
      marginRightNode = getTextByPathList(paragraphPropsNodeMaster, ["attrs", "marR"]);
    }
  }
  void marginRightNode;

  return [marginLeftStyle, marginValue];
}
