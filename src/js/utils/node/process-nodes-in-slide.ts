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
 * @param nodeKey - The XML element name that identifies the node type
 * @param nodeValue - The node data/content
 * @param nodes - Parent nodes for context
 * @param warpObj - Warp object containing slide resources
 * @param source - Source context
 * @param sType - Shape type context
 * @param tableStyles - Table styles from presentation
 * @param isFirstBr - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLangsArray - RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @param chartID - Chart ID counter (modified in place)
 * @param MsgQueue - Message queue for chart processing
 * @param settings - Plugin settings
 * @returns HTML string for the node
 */
export function processNodesInSlide(
  nodeKey: string,
  nodeValue: any,
  nodes: any,
  warpObj: any,
  source: string,
  sType: string,
  tableStyles: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: number,
  fontSizeFactor: number,
  chartID: { value: number },
  MsgQueue: any,
  settings: any
): string {
  let result = "";

  switch (nodeKey) {
    case "p:sp": // Shape, Text
      result = processSpNode(
        nodeValue,
        nodes,
        warpObj,
        source,
        sType,
        slideFactor,
        styleTable,
        fontSizeFactor,
        rtlLangsArray,
        isFirstBr
      );
      break;
    case "p:cxnSp": // Shape, Text (with connection)
      result = processCxnSpNode(
        nodeValue,
        nodes,
        warpObj,
        source,
        sType,
        slideFactor,
        styleTable,
        fontSizeFactor,
        rtlLangsArray,
        isFirstBr
      );
      break;
    case "p:pic": // Picture
      result = processPicNode(nodeValue, warpObj, source, sType, slideFactor, settings);
      break;
    case "p:graphicFrame": // Chart, Diagram, Table
      result = processGraphicFrameNode(
        nodeValue,
        warpObj,
        source,
        sType,
        tableStyles,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        slideFactor,
        fontSizeFactor,
        chartID,
        MsgQueue,
        settings
      );
      break;
    case "p:grpSp":
      result = processGroupSpNode(
        nodeValue,
        warpObj,
        source,
        slideFactor,
        tableStyles,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        fontSizeFactor,
        chartID,
        MsgQueue,
        settings
      );
      break;
    case "mc:AlternateContent": {
      //Equations and formulas as Image
      //console.log("mc:AlternateContent nodeValue:" , nodeValue , "nodes:",nodes, "sType:",sType)
      const mcFallbackNode = getTextByPathList(nodeValue, ["mc:Fallback"]);
      result = processGroupSpNode(
        mcFallbackNode,
        warpObj,
        source,
        slideFactor,
        tableStyles,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        fontSizeFactor,
        chartID,
        MsgQueue,
        settings
      );
      break;
    }
    default:
    //console.log("nodeKey: ", nodeKey)
  }

  return result;
}
