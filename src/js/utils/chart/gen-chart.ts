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

export async function genChart(
  chartNode: any,
  warpContext: any,
  chartId: number,
  messageQueue: any[],
  emuToPx: number
): Promise<[string, number]> {
  const zIndexOrder = chartNode["attrs"]["order"];
  const transformNode = getTextByPathList(chartNode, ["p:xfrm"]);
  const htmlOutput =
    "<div id='chart" +
    chartId +
    "' class='block content' style='" +
    getPosition(transformNode, chartNode, undefined, undefined, undefined, emuToPx) +
    getSize(transformNode, undefined, undefined, emuToPx) +
    " z-index: " +
    zIndexOrder +
    ";'></div>";

  const relationshipId = chartNode["a:graphic"]["a:graphicData"]["c:chart"]["attrs"]["r:id"];
  const chartPath = warpContext["slideResObj"][relationshipId]["target"];
  const chartXml = await readXmlFile(warpContext["archive"], chartPath);
  if (!chartXml) {
    chartId++;
    return [htmlOutput, chartId];
  }
  const plotAreaNode = getTextByPathList(chartXml, ["c:chartSpace", "c:chart", "c:plotArea"]);

  let chartPayload = null;
  for (const key in plotAreaNode) {
    switch (key) {
      case "c:lineChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "lineChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
          },
        };
        break;
      case "c:barChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "barChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
          },
        };
        break;
      case "c:pieChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pieChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
          },
        };
        break;
      case "c:pie3DChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "pie3DChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
          },
        };
        break;
      case "c:areaChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "areaChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
          },
        };
        break;
      case "c:scatterChart":
        chartPayload = {
          type: "createChart",
          data: {
            chartID: "chart" + chartId,
            chartType: "scatterChart",
            chartData: extractChartData(plotAreaNode[key]["c:ser"]),
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
