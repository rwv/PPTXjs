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
import type { PptxNode, WarpObject } from "../../types";
import { getTextByPathList } from "../object";
import { getLayoutAndMasterNode } from "./get-layout-and-master-node";

export function getPregraphMargn(
  pNode: PptxNode,
  idx: number | undefined,
  type: string,
  isBullate: boolean,
  warpObj: WarpObject,
  slideFactor: number
): [string, number] {
  if (!isBullate) {
    return ["", 0];
  }

  let marLStr = "",
    _marRStr = "",
    maginVal = 0;
  const pPrNode = pNode["a:pPr"];
  const layoutMasterNode = getLayoutAndMasterNode(pNode, idx, type, warpObj);
  const pPrNodeLaout = layoutMasterNode.nodeLaout;
  const pPrNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  let getRtlVal = getTextByPathList(pPrNode, ["attrs", "rtl"]);
  if (getRtlVal === undefined) {
    getRtlVal = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
    if (getRtlVal === undefined && type !== "shape") {
      getRtlVal = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
    }
  }
  let isRTL = false;
  let _dirStr = "ltr";
  if (getRtlVal !== undefined && getRtlVal === "1") {
    isRTL = true;
    _dirStr = "rtl";
  }

  // align
  let alignNode = getTextByPathList(pPrNode, ["attrs", "algn"]);
  if (alignNode === undefined) {
    alignNode = getTextByPathList(pPrNodeLaout, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getTextByPathList(pPrNodeMaster, ["attrs", "algn"]);
    }
  }

  // indent
  let indentNode = getTextByPathList(pPrNode, ["attrs", "indent"]);
  if (indentNode === undefined) {
    indentNode = getTextByPathList(pPrNodeLaout, ["attrs", "indent"]);
    if (indentNode === undefined) {
      indentNode = getTextByPathList(pPrNodeMaster, ["attrs", "indent"]);
    }
  }
  let indent = 0;
  if (indentNode !== undefined) {
    indent = parseInt(indentNode) * slideFactor;
  }

  // marL
  let marLNode = getTextByPathList(pPrNode, ["attrs", "marL"]);
  if (marLNode === undefined) {
    marLNode = getTextByPathList(pPrNodeLaout, ["attrs", "marL"]);
    if (marLNode === undefined) {
      marLNode = getTextByPathList(pPrNodeMaster, ["attrs", "marL"]);
    }
  }
  let marginLeft = 0;
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
  let marRNode = getTextByPathList(pPrNode, ["attrs", "marR"]);
  if (marRNode === undefined && marLNode === undefined) {
    marRNode = getTextByPathList(pPrNodeLaout, ["attrs", "marR"]);
    if (marRNode === undefined) {
      marRNode = getTextByPathList(pPrNodeMaster, ["attrs", "marR"]);
    }
  }
  if (marRNode !== undefined && isBullate) {
    const _marginRight = parseInt(marRNode) * slideFactor;
    if (isRTL) {
      _marRStr = "padding-right: ";
    } else {
      _marRStr = "padding-left: ";
    }
    _marRStr += Math.abs(0 - indent) + "px;";
  }

  return [marLStr, maginVal];
}
