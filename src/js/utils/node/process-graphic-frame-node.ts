import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor, PptxSettings } from "../../types";
import { getTextByPathList } from "../object";
import { genTable } from "../table";
import { genChart } from "../chart";
import { genDiagram } from "../diagram";

/**
 * Result type for processGraphicFrameNode
 * - string: HTML result
 * - [string, number]: HTML result with updated chartID
 * - { oleNode: PptxNode }: OLE object that needs group processing by caller
 */
export type GraphicFrameResult =
  | string
  | [string, number]
  | { oleNode: PptxNode };

/**
 * Process graphic frame node (p:graphicFrame) to generate HTML
 *
 * Graphic frames are containers for complex content like tables, charts,
 * diagrams, and OLE objects. This function dispatches to the appropriate
 * handler based on the graphic type URI.
 *
 * Supported graphic types:
 * - Tables: http://schemas.openxmlformats.org/drawingml/2006/table
 * - Charts: http://schemas.openxmlformats.org/drawingml/2006/chart
 * - Diagrams: http://schemas.openxmlformats.org/drawingml/2006/diagram
 * - OLE Objects: http://schemas.openxmlformats.org/presentationml/2006/ole
 *
 * @param node - Graphic frame node (p:graphicFrame)
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
 * @returns GraphicFrameResult - HTML string, [HTML, chartID] for charts, or {oleNode} for OLE objects
 */
export function processGraphicFrameNode(
  node: PptxNode,
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
  _settings: PptxSettings
): GraphicFrameResult {
  let result = "";
  let updatedChartID = chartID;
  const graphicTypeUri = getTextByPathList(node, ["a:graphic", "a:graphicData", "attrs", "uri"]);

  switch (graphicTypeUri) {
    case "http://schemas.openxmlformats.org/drawingml/2006/table":
      result = genTable(
        node,
        warpObj,
        tableStyles,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        slideFactor,
        fontSizeFactor
      );
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/chart":
      [result, updatedChartID] = genChart(node, warpObj, chartID, MsgQueue, slideFactor);
      return [result, updatedChartID];
    case "http://schemas.openxmlformats.org/drawingml/2006/diagram":
      result = genDiagram(
        node,
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
    case "http://schemas.openxmlformats.org/presentationml/2006/ole": {
      //result = genDiagram(node, warpObj, source, sType);
      let oleObjNode = getTextByPathList(node, [
        "a:graphic",
        "a:graphicData",
        "mc:AlternateContent",
        "mc:Fallback",
        "p:oleObj",
      ]);

      if (oleObjNode === undefined) {
        oleObjNode = getTextByPathList(node, ["a:graphic", "a:graphicData", "p:oleObj"]);
      }
      //console.log("node:", node, "oleObjNode:", oleObjNode)
      if (oleObjNode !== undefined) {
        // Return oleNode for caller to process as group shape (avoids circular dependency)
        return { oleNode: oleObjNode };
      }
      break;
    }
    default:
  }

  return result;
}
