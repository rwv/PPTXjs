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

export async function genChart(
  chartNode: XmlNode,
  warpContext: WarpContext,
  chartId: number,
  messageQueue: Array<Record<string, unknown>>,
  emuToPx: number
): Promise<[string, number]> {
  const zIndexOrder = chartNode.attrs?.order ?? 0;
  const transformNode = getTextByPathList<XmlNode>(chartNode, ["p:xfrm"]);
  const htmlOutput =
    "<div id='chart" +
    chartId +
    "' class='block content' style='" +
    getPosition(
      transformNode as Parameters<typeof getPosition>[0],
      chartNode,
      undefined,
      undefined,
      undefined,
      emuToPx
    ) +
    getSize(transformNode as Parameters<typeof getSize>[0], undefined, undefined, emuToPx) +
    " z-index: " +
    zIndexOrder +
    ";'></div>";

  const relationshipId = getTextByPathList<string>(chartNode, [
    "a:graphic",
    "a:graphicData",
    "c:chart",
    "attrs",
    "r:id",
  ]);
  if (!relationshipId) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const chartPath = warpContext.slideResObj[relationshipId]?.target;
  if (!chartPath) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const chartXml = await readXmlFile(warpContext.archive, chartPath);
  if (!chartXml) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const plotAreaNode = getTextByPathList<XmlNode>(chartXml as XmlNode, [
    "c:chartSpace",
    "c:chart",
    "c:plotArea",
  ]);
  if (!plotAreaNode) {
    chartId++;
    return [htmlOutput, chartId];
  }

  let chartPayload = null;
  for (const key in plotAreaNode) {
    const plotAreaEntry = plotAreaNode[key] as XmlNode;
    switch (key) {
      case "c:lineChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "lineChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
          },
        };
        break;
      case "c:barChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "barChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
          },
        };
        break;
      case "c:pieChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pieChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
          },
        };
        break;
      case "c:pie3DChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pie3DChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
          },
        };
        break;
      case "c:areaChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "areaChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
          },
        };
        break;
      case "c:scatterChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "scatterChart",
            chartData: extractChartData(plotAreaEntry["c:ser"]),
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
