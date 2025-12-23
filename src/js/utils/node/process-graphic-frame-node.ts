import { getTextByPathList } from "../object";

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
 * @param chartID - Chart ID counter (modified in place)
 * @param MsgQueue - Message queue for chart processing
 * @param genTable - genTable function
 * @param genChart - genChart function
 * @param genDiagram - genDiagram function
 * @param processGroupSpNode - processGroupSpNode function
 * @param processNodesInSlide - processNodesInSlide function
 * @param processSpNode - processSpNode function
 * @param genShape - genShape function
 * @returns HTML string or [HTML string, chartID] for charts
 */
export function processGraphicFrameNode(
  node: any,
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
  genTable: any,
  genChart: any,
  genDiagram: any,
  processGroupSpNode: any,
  processNodesInSlide: any,
  processSpNode: any,
  genShape: any
): string | [string, any] {
  let result = "";
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
      [result, chartID] = genChart(node, warpObj, chartID, MsgQueue, slideFactor);
      break;
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
    case "http://schemas.openxmlformats.org/presentationml/2006/ole":
      //result = genDiagram(node, warpObj, source, sType);
      var oleObjNode = getTextByPathList(node, [
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
        result = processGroupSpNode(oleObjNode, warpObj, source, slideFactor, processNodesInSlide);
      }
      break;
    default:
  }

  return result;
}
