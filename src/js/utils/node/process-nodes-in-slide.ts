import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor, PptxSettings } from "../../types";
import { getTextByPathList } from "../object";
import { processSpNode } from "./process-sp-node";
import { processCxnSpNode } from "../shape/process-cxn-sp-node";
import { processPicNode } from "../media/process-pic-node";
import { processGraphicFrameNode, type GraphicFrameResult } from "./process-graphic-frame-node";
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
 * @param chartID - Chart ID counter
 * @param MsgQueue - Message queue for chart processing
 * @param settings - PPTXjs plugin settings
 * @returns HTML string for the node
 */
export function processNodesInSlide(
  nodeKey: string,
  nodeValue: PptxNode,
  nodes: PptxNode,
  warpObj: WarpObject,
  source: string,
  sType: string,
  tableStyles: PptxNode,
  isFirstBr: { value: boolean },
  styleTable: Record<string, { name: string; text: string }>,
  rtlLangsArray: string[],
  slideFactor: SlideFactor,
  fontSizeFactor: FontSizeFactor,
  chartID: number,
  MsgQueue: any[],
  settings: PptxSettings
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
    case "p:graphicFrame": {
      // Chart, Diagram, Table, OLE Objects
      const graphicResult: GraphicFrameResult = processGraphicFrameNode(
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
      if (Array.isArray(graphicResult)) {
        // Chart result: [html, chartID]
        result = graphicResult[0];
        chartID = graphicResult[1];
      } else if (typeof graphicResult === "object" && "oleNode" in graphicResult) {
        // OLE object: process as group shape
        result = processGroupSpNode(
          graphicResult.oleNode,
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
          settings,
          processNodesInSlide
        );
      } else {
        result = graphicResult;
      }
      break;
    }
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
        settings,
        processNodesInSlide
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
        settings,
        processNodesInSlide
      );
      break;
    }
    default:
    //console.log("nodeKey: ", nodeKey)
  }

  return result;
}
