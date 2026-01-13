import { getTextByPathList } from "../object";
import { genTable } from "../table";
import { genChart } from "../chart";
import { genDiagram } from "../diagram";
import { processGroupSpNode } from "./process-group-sp-node";
import type { StyleTable } from "../../types/style";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

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
 * @param firstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter object (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for the graphic frame content
 */
type ProcessGraphicFrameNodeOptions = {
  graphicFrameNode: XmlNode;
  warpContext: WarpContext;
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

export async function processGraphicFrameNode({
  graphicFrameNode,
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
}: ProcessGraphicFrameNodeOptions): Promise<string> {
  let result = "";
  const chartIdState = chartIdCounter ?? { value: 0 };
  const graphicTypeUriValue = getTextByPathList<string | number>({
    node: graphicFrameNode,
    path: ["a:graphic", "a:graphicData", "attrs", "uri"],
  });
  const graphicTypeUri =
    graphicTypeUriValue !== undefined ? String(graphicTypeUriValue) : undefined;
  const chartMessageQueue: Array<Record<string, unknown>> = Array.isArray(messageQueue)
    ? (messageQueue as Array<Record<string, unknown>>)
    : [];

  switch (graphicTypeUri) {
    case "http://schemas.openxmlformats.org/drawingml/2006/table":
      result = await genTable({
        node: graphicFrameNode,
        warpContext,
        tableStyles,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
      });
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/chart":
      [result, chartIdState.value] = await genChart({
        chartNode: graphicFrameNode,
        warpContext,
        chartId: chartIdState.value,
        messageQueue: chartMessageQueue,
        emuToPx,
      });
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/diagram":
      result = await genDiagram({
        diagramNode: graphicFrameNode,
        warpContext,
        shapeType,
        emuToPx,
        styleTable,
        fontSizeFactor: fontSizeScale,
        rtlLanguages,
        firstLineBreak,
      });
      break;
    case "http://schemas.openxmlformats.org/presentationml/2006/ole": {
      //result = genDiagram(graphicFrameNode, warpContext, sourceType, shapeType);
      let oleObjectNode = asXmlNode(
        getTextByPathList({
          node: graphicFrameNode,
          path: ["a:graphic", "a:graphicData", "mc:AlternateContent", "mc:Fallback", "p:oleObj"],
        })
      );

      if (oleObjectNode === undefined) {
        oleObjectNode = asXmlNode(
          getTextByPathList({
            node: graphicFrameNode,
            path: ["a:graphic", "a:graphicData", "p:oleObj"],
          })
        );
      }
      //console.log("node:", node, "oleObjectNode:", oleObjectNode)
      if (oleObjectNode !== undefined) {
        result = await processGroupSpNode({
          groupNode: oleObjectNode,
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
      break;
    }
    default:
  }

  return result;
}
