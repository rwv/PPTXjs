import { getTextByPathList } from "../object";
import { angleToDegrees } from "../layout";
import { processNodesInSlide } from "./process-nodes-in-slide";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

/**
 * Process group shape node (p:grpSp) to generate HTML
 *
 * Group shapes are containers that hold multiple child shapes together.
 * They have their own transform properties that affect all children.
 *
 * Processes group transforms:
 * - Position offset (a:off) and child offset (a:chOff)
 * - Extents (a:ext) and child extents (a:chExt)
 * - Rotation with transform-origin at center
 *
 * Creates wrapper div with positioning and recursively processes children
 * via processNodesInSlide.
 *
 * @param groupNode - Group shape node (p:grpSp)
 * @param warpContext - Warp object containing slide resources
 * @param sourceType - Source context
 * @param emuToPx - EMU to pixel conversion factor
 * @param tableStyles - Table styles from presentation
 * @param isFirstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the group
 */
export async function processGroupSpNode(
  groupNode: XmlNode,
  warpContext: WarpContext | Record<string, unknown>,
  sourceType: string,
  emuToPx: number,
  tableStyles: unknown,
  isFirstLineBreak: { value: boolean },
  styleTable: unknown,
  rtlLanguages: string[],
  fontSizeScale: number,
  chartIdCounter: { value: number },
  messageQueue: unknown,
  renderSettings: { mediaProcess: boolean } & Record<string, unknown>
): Promise<string> {
  //console.log("processGroupSpNode: node: ", groupNode)
  const groupNodeRecord = groupNode as XmlNode;
  const transformNode = getTextByPathList<XmlNode>(groupNodeRecord, ["p:grpSpPr", "a:xfrm"]);
  let rotationCss = ""; //;" border: 3px solid black;";
  let topPx;
  let leftPx;
  let widthPx;
  let heightPx;
  let shapeType = "group";
  if (transformNode !== undefined) {
    const offsetAttrs = (transformNode["a:off"] as XmlNode)["attrs"] as Record<string, string>;
    const childOffsetAttrs = (transformNode["a:chOff"] as XmlNode)["attrs"] as Record<
      string,
      string
    >;
    const extentAttrs = (transformNode["a:ext"] as XmlNode)["attrs"] as Record<string, string>;
    const childExtentAttrs = (transformNode["a:chExt"] as XmlNode)["attrs"] as Record<
      string,
      string
    >;
    const offsetX = parseInt(offsetAttrs["x"]) * emuToPx;
    const offsetY = parseInt(offsetAttrs["y"]) * emuToPx;
    const childOffsetX = parseInt(childOffsetAttrs["x"]) * emuToPx;
    const childOffsetY = parseInt(childOffsetAttrs["y"]) * emuToPx;
    const extentWidth = parseInt(extentAttrs["cx"]) * emuToPx;
    const extentHeight = parseInt(extentAttrs["cy"]) * emuToPx;
    const childExtentWidth = parseInt(childExtentAttrs["cx"]) * emuToPx;
    const childExtentHeight = parseInt(childExtentAttrs["cy"]) * emuToPx;
    let rotation = parseInt((transformNode["attrs"] as Record<string, string>)["rot"]);
    // angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));
    // var rotX = 0;
    // var rotY = 0;
    topPx = offsetY - childOffsetY;
    leftPx = offsetX - childOffsetX;
    widthPx = extentWidth - childExtentWidth;
    heightPx = extentHeight - childExtentHeight;
    if (!isNaN(rotation)) {
      rotation = angleToDegrees(rotation);
      rotationCss += "transform: rotate(" + rotation + "deg) ; transform-origin: center;";
      // var cLin = Math.sqrt(Math.pow((chy), 2) + Math.pow((chx), 2));
      // var rdian = degreesToRadians(rotate);
      // rotX = cLin * Math.cos(rdian);
      // rotY = cLin * Math.sin(rdian);
      if (rotation !== 0) {
        topPx = offsetY;
        leftPx = offsetX;
        widthPx = extentWidth;
        heightPx = extentHeight;
        shapeType = "group-rotate";
      }
    }
  }
  let groupStyle = "";

  if (rotationCss !== undefined && rotationCss !== "") {
    groupStyle += rotationCss;
  }

  if (topPx !== undefined) {
    groupStyle += "top: " + topPx + "px;";
  }
  if (leftPx !== undefined) {
    groupStyle += "left: " + leftPx + "px;";
  }
  if (widthPx !== undefined) {
    groupStyle += "width:" + widthPx + "px;";
  }
  if (heightPx !== undefined) {
    groupStyle += "height: " + heightPx + "px;";
  }
  const zIndexOrder = (groupNodeRecord["attrs"] as Record<string, string | number>)["order"];

  let htmlOutput =
    "<div class='block group' style='z-index: " +
    zIndexOrder +
    ";" +
    groupStyle +
    " border:1px solid red;'>";

  // Process all child nodes
  for (const nodeKey in groupNodeRecord) {
    const childNode = groupNodeRecord[nodeKey] as XmlNode | XmlNode[] | undefined;
    if (Array.isArray(childNode)) {
      for (let i = 0; i < childNode.length; i++) {
        htmlOutput += await processNodesInSlide(
          nodeKey,
          childNode[i],
          groupNodeRecord,
          warpContext,
          sourceType,
          shapeType,
          tableStyles,
          isFirstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartIdCounter,
          messageQueue,
          renderSettings
        );
      }
    } else {
      htmlOutput += await processNodesInSlide(
        nodeKey,
        childNode,
        groupNodeRecord,
        warpContext,
        sourceType,
        shapeType,
        tableStyles,
        isFirstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
        chartIdCounter,
        messageQueue,
        renderSettings
      );
    }
  }

  htmlOutput += "</div>";

  return htmlOutput;
}
