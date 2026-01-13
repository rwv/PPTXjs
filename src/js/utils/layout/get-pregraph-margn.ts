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

type GetPregraphMargnOptions = {
  paragraphNode: XmlNode;
  paragraphIndex: number | string | undefined;
  elementType: string | undefined;
  isBulleted: boolean;
  warpContext: WarpContext;
  emuToPx: number;
};

export function getPregraphMargn({
  paragraphNode,
  paragraphIndex,
  elementType,
  isBulleted,
  warpContext,
  emuToPx,
}: GetPregraphMargnOptions): [string, number] {
  if (!isBulleted) {
    return ["", 0];
  }

  const parseEmuValue = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null) {
      return undefined;
    }
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed * emuToPx : undefined;
  };

  let marginLeftStyle = "",
    marginValue = 0;
  const paragraphPropsNode = asXmlNode(paragraphNode["a:pPr"]);
  const layoutMasterNode = getLayoutAndMasterNode({
    paragraphNode,
    layoutIndex: paragraphIndex,
    shapeType: elementType,
    warpContext,
  });
  const paragraphPropsNodeLayout = layoutMasterNode.nodeLayout;
  const paragraphPropsNodeMaster = layoutMasterNode.nodeMaster;

  // rtl
  const paragraphRtlValue = paragraphPropsNode
    ? getTextByPathList<string | number>({ node: paragraphPropsNode, path: ["attrs", "rtl"] })
    : undefined;
  let rtlValue = paragraphRtlValue !== undefined ? String(paragraphRtlValue) : undefined;
  if (rtlValue === undefined) {
    const layoutRtlValue = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>({
          node: paragraphPropsNodeLayout,
          path: ["attrs", "rtl"],
        })
      : undefined;
    rtlValue = layoutRtlValue !== undefined ? String(layoutRtlValue) : undefined;
    if (rtlValue === undefined && elementType !== "shape") {
      const masterRtlValue = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>({
            node: paragraphPropsNodeMaster,
            path: ["attrs", "rtl"],
          })
        : undefined;
      rtlValue = masterRtlValue !== undefined ? String(masterRtlValue) : undefined;
    }
  }
  let isRTL = false;
  if (rtlValue !== undefined && rtlValue === "1") {
    isRTL = true;
  }

  // indent
  let indentValueNode = paragraphPropsNode
    ? getTextByPathList<string | number>({ node: paragraphPropsNode, path: ["attrs", "indent"] })
    : undefined;
  if (indentValueNode === undefined) {
    indentValueNode = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>({
          node: paragraphPropsNodeLayout,
          path: ["attrs", "indent"],
        })
      : undefined;
    if (indentValueNode === undefined) {
      indentValueNode = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>({
            node: paragraphPropsNodeMaster,
            path: ["attrs", "indent"],
          })
        : undefined;
    }
  }
  let indent = 0;
  if (indentValueNode !== undefined) {
    const parsedIndent = parseEmuValue(indentValueNode);
    if (parsedIndent !== undefined) {
      indent = parsedIndent;
    }
  }

  // marL
  let marginLeftNode = paragraphPropsNode
    ? getTextByPathList<string | number>({ node: paragraphPropsNode, path: ["attrs", "marL"] })
    : undefined;
  if (marginLeftNode === undefined) {
    marginLeftNode = paragraphPropsNodeLayout
      ? getTextByPathList<string | number>({
          node: paragraphPropsNodeLayout,
          path: ["attrs", "marL"],
        })
      : undefined;
    if (marginLeftNode === undefined) {
      marginLeftNode = paragraphPropsNodeMaster
        ? getTextByPathList<string | number>({
            node: paragraphPropsNodeMaster,
            path: ["attrs", "marL"],
          })
        : undefined;
    }
  }
  let marginLeft = 0;
  if (marginLeftNode !== undefined) {
    const parsedMargin = parseEmuValue(marginLeftNode);
    if (parsedMargin !== undefined) {
      marginLeft = parsedMargin;
    }
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

  return [marginLeftStyle, marginValue];
}
