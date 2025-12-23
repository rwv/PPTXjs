import { getTextByPathList } from "../object";

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
 * @param processSpNode - processSpNode function
 * @param processCxnSpNode - processCxnSpNode function
 * @param processPicNode - processPicNode function
 * @param processGraphicFrameNode - processGraphicFrameNode function
 * @param processGroupSpNode - processGroupSpNode function
 * @param genShape - genShape function
 * @param genTable - genTable function
 * @param genChart - genChart function
 * @param genDiagram - genDiagram function
 * @returns HTML string for the node
 */
export function processNodesInSlide(
  nodeKey: any,
  nodeValue: any,
  nodes: any,
  warpObj: any,
  source: any,
  sType: any,
  tableStyles: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: number,
  fontSizeFactor: number,
  chartID: any,
  MsgQueue: any,
  settings: any,
  processSpNode: any,
  processCxnSpNode: any,
  processPicNode: any,
  processGraphicFrameNode: any,
  processGroupSpNode: any,
  genShape: any,
  genTable: any,
  genChart: any,
  genDiagram: any
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
        genTable,
        genChart,
        genDiagram,
        processGroupSpNode,
        processNodesInSlide,
        processSpNode,
        genShape
      );
      break;
    case "p:grpSp":
      result = processGroupSpNode(nodeValue, warpObj, source, slideFactor, processNodesInSlide);
      break;
    case "mc:AlternateContent": //Equations and formulas as Image
      //console.log("mc:AlternateContent nodeValue:" , nodeValue , "nodes:",nodes, "sType:",sType)
      var mcFallbackNode = getTextByPathList(nodeValue, ["mc:Fallback"]);
      result = processGroupSpNode(
        mcFallbackNode,
        warpObj,
        source,
        slideFactor,
        processNodesInSlide
      );
      break;
    default:
    //console.log("nodeKey: ", nodeKey)
  }

  return result;
}
