import { getTextByPathList } from "../object";
import { angleToDegrees } from "../layout";
import { processNodesInSlide } from "./process-nodes-in-slide";
import type { StyleTable } from "../../types/style";
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
 * @param firstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the group
 */
type ProcessGroupSpNodeOptions = {
  groupNode: XmlNode;
  warpContext: WarpContext | Record<string, unknown>;
  sourceType: string;
  emuToPx: number;
  tableStyles: Record<string, unknown> | null;
  firstLineBreak: { value: boolean };
  styleTable: StyleTable;
  rtlLanguages: string[];
  fontSizeScale: number;
  chartIdCounter: { value: number };
  messageQueue: unknown;
  renderSettings: { mediaProcess: boolean } & Record<string, unknown>;
};

export async function processGroupSpNode({
  groupNode,
  warpContext,
  sourceType,
  emuToPx,
  tableStyles,
  firstLineBreak,
  styleTable,
  rtlLanguages,
  fontSizeScale,
  chartIdCounter,
  messageQueue,
  renderSettings,
}: ProcessGroupSpNodeOptions): Promise<string> {
  //console.log("processGroupSpNode: node: ", groupNode)
  const groupNodeRecord = groupNode as XmlNode;
  const transformNode = getTextByPathList<XmlNode>({
    node: groupNodeRecord,
    path: ["p:grpSpPr", "a:xfrm"],
  });
  let rotationCss = ""; //;" border: 3px solid black;";
  let topPx: number | undefined;
  let leftPx: number | undefined;
  let widthPx: number | undefined;
  let heightPx: number | undefined;
  let shapeType = "group";
  if (transformNode !== undefined) {
    const parseEmuValue = (value: string | number | undefined): number | undefined => {
      if (value === undefined || value === null) {
        return undefined;
      }
      const parsed = Number.parseInt(String(value), 10);
      return Number.isFinite(parsed) ? parsed * emuToPx : undefined;
    };

    const offsetX = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:off", "attrs", "x"] })
    );
    const offsetY = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:off", "attrs", "y"] })
    );
    const childOffsetX = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:chOff", "attrs", "x"] })
    );
    const childOffsetY = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:chOff", "attrs", "y"] })
    );
    const extentWidth = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:ext", "attrs", "cx"] })
    );
    const extentHeight = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:ext", "attrs", "cy"] })
    );
    const childExtentWidth = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:chExt", "attrs", "cx"] })
    );
    const childExtentHeight = parseEmuValue(
      getTextByPathList<string | number>({ node: transformNode, path: ["a:chExt", "attrs", "cy"] })
    );
    const rotationRaw = Number.parseInt(
      String(
        getTextByPathList<string | number>({ node: transformNode, path: ["attrs", "rot"] }) ?? ""
      ),
      10
    );
    // angleToDegrees(getTextByPathList({ node: slideXfrmNode, path: ["attrs", "rot"] }));
    // var rotX = 0;
    // var rotY = 0;
    if (offsetY !== undefined && childOffsetY !== undefined) {
      topPx = offsetY - childOffsetY;
    }
    if (offsetX !== undefined && childOffsetX !== undefined) {
      leftPx = offsetX - childOffsetX;
    }
    if (extentWidth !== undefined && childExtentWidth !== undefined) {
      widthPx = extentWidth - childExtentWidth;
    }
    if (extentHeight !== undefined && childExtentHeight !== undefined) {
      heightPx = extentHeight - childExtentHeight;
    }
    if (Number.isFinite(rotationRaw)) {
      const rotation = angleToDegrees({ angle: rotationRaw });
      rotationCss += "transform: rotate(" + rotation + "deg) ; transform-origin: center;";
      // var cLin = Math.sqrt(Math.pow((chy), 2) + Math.pow((chx), 2));
      // var rdian = degreesToRadians(rotate);
      // rotX = cLin * Math.cos(rdian);
      // rotY = cLin * Math.sin(rdian);
      if (rotation !== 0) {
        if (offsetY !== undefined) {
          topPx = offsetY;
        }
        if (offsetX !== undefined) {
          leftPx = offsetX;
        }
        if (extentWidth !== undefined) {
          widthPx = extentWidth;
        }
        if (extentHeight !== undefined) {
          heightPx = extentHeight;
        }
        shapeType = "group-rotate";
      }
    }
  }
  let groupStyle = "";

  if (rotationCss) {
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
  const attrs = groupNodeRecord["attrs"] as Record<string, string | number> | undefined;
  const zIndexRaw = attrs?.["order"];
  const zIndexParsed = Number.parseInt(String(zIndexRaw ?? ""), 10);
  const zIndexOrder = Number.isFinite(zIndexParsed) ? zIndexParsed : 0;

  let htmlOutput =
    "<div class='block group' style='z-index: " + zIndexOrder + ";" + groupStyle + "'>";

  // Process all child nodes
  for (const nodeKey in groupNodeRecord) {
    const childNode = groupNodeRecord[nodeKey] as XmlNode | XmlNode[] | undefined;
    if (Array.isArray(childNode)) {
      for (let i = 0; i < childNode.length; i++) {
        htmlOutput += await processNodesInSlide({
          nodeType: nodeKey,
          nodeData: childNode[i],
          parentNodes: groupNodeRecord,
          warpContext,
          sourceType,
          shapeType,
          tableStyles,
          firstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartIdCounter,
          messageQueue,
          renderSettings,
        });
      }
    } else {
      htmlOutput += await processNodesInSlide({
        nodeType: nodeKey,
        nodeData: childNode,
        parentNodes: groupNodeRecord,
        warpContext,
        sourceType,
        shapeType,
        tableStyles,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
        chartIdCounter,
        messageQueue,
        renderSettings,
      });
    }
  }

  htmlOutput += "</div>";

  return htmlOutput;
}
