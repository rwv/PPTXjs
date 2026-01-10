import { getTextByPathList } from "../object";
import { genTable } from "../table";
import { genChart } from "../chart";
import { genDiagram } from "../diagram";
import { processGroupSpNode } from "./process-group-sp-node";

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
 * @param chartID - Chart ID counter object (modified in place)
 * @param MsgQueue - Message queue for chart processing
 * @param settings - Plugin settings
 * @returns HTML string for the graphic frame content
 */
export function processGraphicFrameNode(
  node: unknown,
  warpObj: unknown,
  source: string,
  sType: string,
  tableStyles: unknown,
  isFirstBr: { value: boolean },
  styleTable: unknown,
  rtlLangsArray: string[],
  slideFactor: number,
  fontSizeFactor: number,
  chartID: { value: number },
  MsgQueue: unknown,
  settings: { mediaProcess: boolean } & Record<string, unknown>
): string {
  let result = "";
  const chartIdRef = chartID ?? { value: 0 };
  const graphicTypeUri = getTextByPathList(node, ["a:graphic", "a:graphicData", "attrs", "uri"]);
  const msgQueue: unknown[] = Array.isArray(MsgQueue) ? MsgQueue : [];

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
      [result, chartIdRef.value] = genChart(node, warpObj, chartIdRef.value, msgQueue, slideFactor);
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
        result = processGroupSpNode(
          oleObjNode,
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
      }
      break;
    }
    default:
  }

  return result;
}
