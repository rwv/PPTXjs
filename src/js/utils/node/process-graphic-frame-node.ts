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
 * @param graphicFrameNode - Graphic frame node (p:graphicFrame)
 * @param warpContext - Warp object containing slide resources
 * @param sourceType - Source context
 * @param shapeType - Shape type context
 * @param tableStyles - Table styles from presentation
 * @param isFirstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter object (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the graphic frame content
 */
export async function processGraphicFrameNode(
  graphicFrameNode: unknown,
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
  const chartIdRef = chartIdCounter ?? { value: 0 };
  const graphicTypeUri = getTextByPathList(graphicFrameNode, [
    "a:graphic",
    "a:graphicData",
    "attrs",
    "uri",
  ]);
  const msgQueue: unknown[] = Array.isArray(messageQueue) ? messageQueue : [];

  switch (graphicTypeUri) {
    case "http://schemas.openxmlformats.org/drawingml/2006/table":
      result = await genTable(
        graphicFrameNode,
        warpContext,
        tableStyles,
        isFirstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale
      );
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/chart":
      [result, chartIdRef.value] = await genChart(
        graphicFrameNode,
        warpContext,
        chartIdRef.value,
        msgQueue,
        emuToPx
      );
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/diagram":
      result = await genDiagram(
        graphicFrameNode,
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
    case "http://schemas.openxmlformats.org/presentationml/2006/ole": {
      //result = genDiagram(graphicFrameNode, warpContext, sourceType, shapeType);
      let oleObjNode = getTextByPathList(graphicFrameNode, [
        "a:graphic",
        "a:graphicData",
        "mc:AlternateContent",
        "mc:Fallback",
        "p:oleObj",
      ]);

      if (oleObjNode === undefined) {
        oleObjNode = getTextByPathList(graphicFrameNode, [
          "a:graphic",
          "a:graphicData",
          "p:oleObj",
        ]);
      }
      //console.log("node:", node, "oleObjNode:", oleObjNode)
      if (oleObjNode !== undefined) {
        result = await processGroupSpNode(
          oleObjNode,
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
      }
      break;
    }
    default:
  }

  return result;
}
