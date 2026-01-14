/**
 * Generate chart HTML from PPTX chart node
 *
 * @param chartNode - Chart node from PPTX
 * @param warpContext - Warp object containing slide resources and zip
 * @param chartId - Current chart ID counter
 * @param messageQueue - Message queue for chart rendering
 * @param emuToPx - Conversion factor from PPTX units to pixels
 * @returns Tuple of [HTML string, updated chartId]
 */
import { getTextByPathList } from "../object";
import { getPosition } from "../layout/get-position";
import { getSize } from "../layout/get-size";
import { readXmlFile } from "../xml/read-xml-file";
import { extractChartData } from "./extract-chart-data";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

type GenChartOptions = {
  chartNode: XmlNode;
  warpContext: WarpContext;
  chartId: number;
  messageQueue: Array<Record<string, unknown>>;
  emuToPx: number;
};

export async function genChart({
  chartNode,
  warpContext,
  chartId,
  messageQueue,
  emuToPx,
}: GenChartOptions): Promise<[string, number]> {
  type PositionOptions = Parameters<typeof getPosition>[0];
  type SizeOptions = Parameters<typeof getSize>[0];
  const zIndexOrder = chartNode.attrs?.order ?? 0;
  const transformNode = getTextByPathList<XmlNode>({ node: chartNode, path: ["p:xfrm"] });
  const htmlOutput =
    "<div id='chart" +
    chartId +
    "' class='block content' style='" +
    getPosition({
      slideSpNode: transformNode as PositionOptions["slideSpNode"],
      parentNode: chartNode,
      slideLayoutSpNode: undefined,
      slideMasterSpNode: undefined,
      shapeType: undefined,
      emuToPx,
    }) +
    getSize({
      slideSpNode: transformNode as SizeOptions["slideSpNode"],
      slideLayoutSpNode: undefined,
      slideMasterSpNode: undefined,
      emuToPx,
    }) +
    " z-index: " +
    zIndexOrder +
    ";'></div>";

  const relationshipId = getTextByPathList<string>({
    node: chartNode,
    path: ["a:graphic", "a:graphicData", "c:chart", "attrs", "r:id"],
  });
  if (!relationshipId) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const chartPath = warpContext.slideResObj[relationshipId]?.target;
  if (!chartPath) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const chartXml = await readXmlFile({ archive: warpContext.archive, filename: chartPath });
  if (!chartXml) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const plotAreaNode = getTextByPathList<XmlNode>({
    node: chartXml as XmlNode,
    path: ["c:chartSpace", "c:chart", "c:plotArea"],
  });
  if (!plotAreaNode) {
    chartId++;
    return [htmlOutput, chartId];
  }

  let chartPayload = null;
  for (const key of Object.keys(plotAreaNode)) {
    const plotAreaEntry = plotAreaNode[key] as XmlNode;
    const seriesNodes = plotAreaEntry["c:ser"] as XmlNode | XmlNode[] | undefined;
    switch (key) {
      case "c:lineChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "lineChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:barChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "barChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:pieChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pieChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:pie3DChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pie3DChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:areaChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "areaChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:scatterChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "scatterChart",
            chartData: extractChartData({ seriesNodeData: seriesNodes }),
          },
        };
        break;
      case "c:catAx":
        break;
      case "c:valAx":
        break;
      default:
    }
  }

  if (chartPayload !== null) {
    messageQueue.push(chartPayload);
  }

  chartId++;
  return [htmlOutput, chartId];
}
