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
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

export function getPregraphMargn(
  paragraphNode: XmlNode,
  paragraphIndex: number | string | undefined,
  elementType: string | undefined,
  isBulleted: boolean,
  warpContext: WarpContext,
  emuToPx: number
): [string, number] {
  if (!isBulleted) {
    return ["", 0];
  }

  let marginLeftStyle = "",
    marginValue = 0;
  const paragraphPropsNode = asXmlNode(paragraphNode["a:pPr"]);
  const layoutMasterNode = getLayoutAndMasterNode(
    paragraphNode,
    paragraphIndex,
    elementType,
    warpContext
  );
  const paragraphPropsNodeLayout = layoutMasterNode.nodeLayout;
  const paragraphPropsNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  const paragraphRtlValue = paragraphPropsNode
    ? getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "rtl"])
    : undefined;
  let rtlValue = paragraphRtlValue !== undefined ? String(paragraphRtlValue) : undefined;
  if (rtlValue === undefined) {
    const layoutRtlValue = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>(paragraphPropsNodeLayout, ["attrs", "rtl"])
      : undefined;
    rtlValue = layoutRtlValue !== undefined ? String(layoutRtlValue) : undefined;
    if (rtlValue === undefined && elementType !== "shape") {
      const masterRtlValue = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>(paragraphPropsNodeMaster, ["attrs", "rtl"])
        : undefined;
      rtlValue = masterRtlValue !== undefined ? String(masterRtlValue) : undefined;
    }
  }
  let isRTL = false;
  if (rtlValue !== undefined && rtlValue === "1") {
    isRTL = true;
  }

  // align
  const paragraphAlignValue = paragraphPropsNode
    ? getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "algn"])
    : undefined;
  let alignNode = paragraphAlignValue !== undefined ? String(paragraphAlignValue) : undefined;
  if (alignNode === undefined) {
    const layoutAlignValue = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>(paragraphPropsNodeLayout, ["attrs", "algn"])
      : undefined;
    alignNode = layoutAlignValue !== undefined ? String(layoutAlignValue) : undefined;
    if (alignNode === undefined) {
      const masterAlignValue = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>(paragraphPropsNodeMaster, ["attrs", "algn"])
        : undefined;
      alignNode = masterAlignValue !== undefined ? String(masterAlignValue) : undefined;
    }
  }
  void alignNode;

  // indent
  let indentValueNode = paragraphPropsNode
    ? getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "indent"])
    : undefined;
  if (indentValueNode === undefined) {
    indentValueNode = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>(paragraphPropsNodeLayout, ["attrs", "indent"])
      : undefined;
    if (indentValueNode === undefined) {
      indentValueNode = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>(paragraphPropsNodeMaster, ["attrs", "indent"])
        : undefined;
    }
  }
  let indent = 0;
  if (indentValueNode !== undefined) {
    indent = parseInt(String(indentValueNode), 10) * emuToPx;
  }

  // marL
  let marginLeftNode = paragraphPropsNode
    ? getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "marL"])
    : undefined;
  if (marginLeftNode === undefined) {
    marginLeftNode = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>(paragraphPropsNodeLayout, ["attrs", "marL"])
      : undefined;
    if (marginLeftNode === undefined) {
      marginLeftNode = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>(paragraphPropsNodeMaster, ["attrs", "marL"])
        : undefined;
    }
  }
  let marginLeft = 0;
  if (marginLeftNode !== undefined) {
    marginLeft = parseInt(String(marginLeftNode), 10) * emuToPx;
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
  let marginRightNode = paragraphPropsNode
    ? getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "marR"])
    : undefined;
  if (marginRightNode === undefined && marginLeftNode === undefined) {
    marginRightNode = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>(paragraphPropsNodeLayout, ["attrs", "marR"])
      : undefined;
    if (marginRightNode === undefined) {
      marginRightNode = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>(paragraphPropsNodeMaster, ["attrs", "marR"])
        : undefined;
    }
  }
  void marginRightNode;

  return [marginLeftStyle, marginValue];
}
