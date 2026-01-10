/**
 * Get paragraph margin/padding styles for bulleted text
 *
 * @param pNode - Paragraph node
 * @param idx - Index
 * @param type - Element type
 * @param isBullate - Whether the paragraph has bullets
 * @param warpObj - The warp object containing layout tables
 * @param slideFactor - Conversion factor from EMU to pixels
 * @returns Array containing [margin CSS string, margin value in pixels]
 */
import { getTextByPathList } from "../object";
import { getLayoutAndMasterNode } from "./get-layout-and-master-node";

export function getPregraphMargn(
  paragraphNode: Record<string, unknown>,
  idx: number | string | undefined,
  type: string | undefined,
  isBulleted: boolean,
  warpObj: Record<string, unknown>,
  slideFactor: number
): [string, number] {
  if (!isBulleted) {
    return ["", 0];
  }

  let marginLeftStyle = "",
    marginValue = 0;
  const paragraphPropsNode = paragraphNode["a:pPr"];
  const layoutMasterNode = getLayoutAndMasterNode(paragraphNode, idx, type, warpObj);
  const paragraphPropsNodeLayout = layoutMasterNode.nodeLaout;
  const paragraphPropsNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  let rtlValue = getTextByPathList(paragraphPropsNode, ["attrs", "rtl"]);
  if (rtlValue === undefined) {
    rtlValue = getTextByPathList(paragraphPropsNodeLayout, ["attrs", "rtl"]);
    if (rtlValue === undefined && type !== "shape") {
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
    indent = parseInt(indentValueNode) * slideFactor;
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
    marginLeft = parseInt(marginLeftNode) * slideFactor;
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
