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
  pNode: any,
  idx: any,
  type: any,
  isBullate: any,
  warpObj: any,
  slideFactor: number
): [string, number] {
  if (!isBullate) {
    return ["", 0];
  }

  var marLStr = "",
    marRStr = "",
    maginVal = 0;
  var pPrNode = pNode["a:pPr"];
  var layoutMasterNode = getLayoutAndMasterNode(pNode, idx, type, warpObj);
  var pPrNodeLaout = layoutMasterNode.nodeLaout;
  var pPrNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  var getRtlVal = getTextByPathList(pPrNode, ["attrs", "rtl"]);
  if (getRtlVal === undefined) {
    getRtlVal = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
    if (getRtlVal === undefined && type != "shape") {
      getRtlVal = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
    }
  }
  var isRTL = false;
  var dirStr = "ltr";
  if (getRtlVal !== undefined && getRtlVal == "1") {
    isRTL = true;
    dirStr = "rtl";
  }

  // align
  var alignNode = getTextByPathList(pPrNode, ["attrs", "algn"]);
  if (alignNode === undefined) {
    alignNode = getTextByPathList(pPrNodeLaout, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getTextByPathList(pPrNodeMaster, ["attrs", "algn"]);
    }
  }

  // indent
  var indentNode = getTextByPathList(pPrNode, ["attrs", "indent"]);
  if (indentNode === undefined) {
    indentNode = getTextByPathList(pPrNodeLaout, ["attrs", "indent"]);
    if (indentNode === undefined) {
      indentNode = getTextByPathList(pPrNodeMaster, ["attrs", "indent"]);
    }
  }
  var indent = 0;
  if (indentNode !== undefined) {
    indent = parseInt(indentNode) * slideFactor;
  }

  // marL
  var marLNode = getTextByPathList(pPrNode, ["attrs", "marL"]);
  if (marLNode === undefined) {
    marLNode = getTextByPathList(pPrNodeLaout, ["attrs", "marL"]);
    if (marLNode === undefined) {
      marLNode = getTextByPathList(pPrNodeMaster, ["attrs", "marL"]);
    }
  }
  var marginLeft = 0;
  if (marLNode !== undefined) {
    marginLeft = parseInt(marLNode) * slideFactor;
  }

  if (indentNode !== undefined || marLNode !== undefined) {
    if (isRTL) {
      marLStr = "padding-right: ";
    } else {
      marLStr = "padding-left: ";
    }
    if (isBullate) {
      maginVal = Math.abs(0 - indent);
      marLStr += maginVal + "px;";
    } else {
      maginVal = Math.abs(marginLeft + indent);
      marLStr += maginVal + "px;";
    }
  }

  // marR
  var marRNode = getTextByPathList(pPrNode, ["attrs", "marR"]);
  if (marRNode === undefined && marLNode === undefined) {
    marRNode = getTextByPathList(pPrNodeLaout, ["attrs", "marR"]);
    if (marRNode === undefined) {
      marRNode = getTextByPathList(pPrNodeMaster, ["attrs", "marR"]);
    }
  }
  if (marRNode !== undefined && isBullate) {
    var marginRight = parseInt(marRNode) * slideFactor;
    if (isRTL) {
      marRStr = "padding-right: ";
    } else {
      marRStr = "padding-left: ";
    }
    marRStr += Math.abs(0 - indent) + "px;";
  }

  return [marLStr, maginVal];
}
