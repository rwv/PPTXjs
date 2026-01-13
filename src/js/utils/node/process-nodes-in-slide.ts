import { getTextByPathList } from "../object";
import { processSpNode } from "./process-sp-node";
import { processCxnSpNode } from "../shape/process-cxn-sp-node";
import { processPicNode } from "../media/process-pic-node";
import { processGraphicFrameNode } from "./process-graphic-frame-node";
import { processGroupSpNode } from "./process-group-sp-node";
import type { StyleTable } from "../../types/style";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function firstXmlNode(value: XmlNode | XmlNode[] | undefined): XmlNode | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

function asXmlNodeValue(value: XmlValue | undefined): XmlNode | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : undefined;
  }
  return typeof value === "object" ? (value as XmlNode) : undefined;
}

/**
 * Main dispatcher for processing slide nodes
 *
 * This is the central routing function that examines the node type (nodeKey)
 * and dispatches to the appropriate processor. It handles:
 * - Shapes (p:sp) and connection shapes (p:cxnSp)
 * - Pictures (p:pic)
 * - Graphic frames (p:graphicFrame) containing tables, charts, diagrams
 * - Group shapes (p:grpSp)
 * - Alternate content (mc:AlternateContent) for equations/formulas
 *
 * This function is called recursively for nested structures like groups.
 *
 * @param nodeType - The XML element name that identifies the node type
 * @param nodeData - The node data/content
 * @param parentNodes - Parent nodes for context
 * @param warpContext - Warp object containing slide resources
 * @param sourceType - Source context
 * @param shapeType - Shape type context
 * @param tableStyles - Table styles from presentation
 * @param firstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the node
 */
type ProcessNodesInSlideOptions = {
  nodeType: string;
  nodeData: XmlNode | XmlNode[] | undefined;
  parentNodes: XmlNode | XmlNode[] | undefined;
  warpContext: WarpContext | Record<string, unknown>;
  sourceType: string;
  shapeType: string;
  tableStyles: Record<string, unknown> | null;
  firstLineBreak: { value: boolean };
  styleTable: StyleTable;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
  chartIdCounter: { value: number };
  messageQueue: unknown;
  renderSettings: { mediaProcess: boolean } & Record<string, unknown>;
};

export async function processNodesInSlide({
  nodeType,
  nodeData,
  parentNodes,
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
}: ProcessNodesInSlideOptions): Promise<string> {
  let result = "";
  const nodeRecord = firstXmlNode(nodeData);

  switch (nodeType) {
    case "p:sp": // Shape, Text
      if (!nodeRecord) {
        break;
      }
      result = await processSpNode({
        spNode: nodeRecord,
        parentNodes: parentNodes as XmlNode | XmlNode[] | undefined,
        warpContext: warpContext as WarpContext,
        sourceType,
        shapeType,
        emuToPx,
        styleTable,
        fontSizeScale,
        rtlLanguages,
        firstLineBreak,
      });
      break;
    case "p:cxnSp": // Shape, Text (with connection)
      if (!nodeRecord) {
        break;
      }
      result = await processCxnSpNode({
        spNode: nodeRecord,
        parentNodes: parentNodes as XmlNode | XmlNode[] | undefined,
        warpContext: warpContext as WarpContext,
        sourceType,
        shapeType,
        emuToPx,
        styleTable,
        fontSizeScale,
        rtlLanguages,
        firstLineBreak,
      });
      break;
    case "p:pic": // Picture
      if (!nodeRecord) {
        break;
      }
      result = await processPicNode({
        picNode: nodeRecord,
        warpContext: warpContext as WarpContext,
        sourceType,
        emuToPx,
        renderSettings,
      });
      break;
    case "p:graphicFrame": // Chart, Diagram, Table
      if (!nodeRecord) {
        break;
      }
      result = await processGraphicFrameNode({
        graphicFrameNode: nodeRecord,
        warpContext: warpContext as WarpContext,
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
      break;
    case "p:grpSp":
      if (!nodeRecord) {
        break;
      }
      result = await processGroupSpNode({
        groupNode: nodeRecord,
        warpContext: warpContext as WarpContext,
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
      });
      break;
    case "mc:AlternateContent": {
      //Equations and formulas as Image
      //console.log("mc:AlternateContent nodeValue:" , nodeData , "nodes:",parentNodes, "shapeType:",shapeType)
      if (nodeRecord) {
        const mcFallbackNodeValue = getTextByPathList({ node: nodeRecord, path: ["mc:Fallback"] });
        const mcFallbackNode = asXmlNodeValue(mcFallbackNodeValue);
        if (mcFallbackNode) {
          result = await processGroupSpNode({
            groupNode: mcFallbackNode,
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
          });
        }
      }
      break;
    }
    default:
    //console.log("nodeKey: ", nodeType)
  }

  return result;
}
