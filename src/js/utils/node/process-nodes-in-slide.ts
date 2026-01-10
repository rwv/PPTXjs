import { getTextByPathList } from "../object";
import { processSpNode } from "./process-sp-node";
import { processCxnSpNode } from "../shape/process-cxn-sp-node";
import { processPicNode } from "../media/process-pic-node";
import { processGraphicFrameNode } from "./process-graphic-frame-node";
import { processGroupSpNode } from "./process-group-sp-node";

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
 * @param isFirstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the node
 */
export async function processNodesInSlide(
  nodeType: string,
  nodeData: unknown,
  parentNodes: unknown,
  warpContext: unknown,
  sourceType: string,
  shapeType: string,
  tableStyles: unknown,
  isFirstLineBreak: { value: boolean },
  styleTable: unknown,
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number,
  chartIdCounter: { value: number },
  messageQueue: unknown,
  renderSettings: { mediaProcess: boolean } & Record<string, unknown>
): Promise<string> {
  let result = "";

  switch (nodeType) {
    case "p:sp": // Shape, Text
      result = await processSpNode(
        nodeData,
        parentNodes,
        warpContext,
        sourceType,
        shapeType,
        emuToPx,
        styleTable,
        fontSizeScale,
        rtlLanguages,
        isFirstLineBreak
      );
      break;
    case "p:cxnSp": // Shape, Text (with connection)
      result = await processCxnSpNode(
        nodeData,
        parentNodes,
        warpContext,
        sourceType,
        shapeType,
        emuToPx,
        styleTable,
        fontSizeScale,
        rtlLanguages,
        isFirstLineBreak
      );
      break;
    case "p:pic": // Picture
      result = await processPicNode(
        nodeData,
        warpContext,
        sourceType,
        shapeType,
        emuToPx,
        renderSettings
      );
      break;
    case "p:graphicFrame": // Chart, Diagram, Table
      result = await processGraphicFrameNode(
        nodeData,
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
      break;
    case "p:grpSp":
      result = await processGroupSpNode(
        nodeData,
        warpContext,
        sourceType,
        emuToPx,
        tableStyles,
        isFirstLineBreak,
        styleTable,
        rtlLanguages,
        fontSizeScale,
        chartIdCounter,
        messageQueue,
        renderSettings
      );
      break;
    case "mc:AlternateContent": {
      //Equations and formulas as Image
      //console.log("mc:AlternateContent nodeValue:" , nodeData , "nodes:",parentNodes, "shapeType:",shapeType)
      const mcFallbackNode = getTextByPathList(nodeData, ["mc:Fallback"]);
      result = await processGroupSpNode(
        mcFallbackNode,
        warpContext,
        sourceType,
        emuToPx,
        tableStyles,
        isFirstLineBreak,
        styleTable,
        rtlLanguages,
        fontSizeScale,
        chartIdCounter,
        messageQueue,
        renderSettings
      );
      break;
    }
    default:
    //console.log("nodeKey: ", nodeType)
  }

  return result;
}
