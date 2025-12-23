/**
 * Generate chart HTML from PPTX chart node
 *
 * @param node - Chart node from PPTX
 * @param warpObj - Warp object containing slide resources and zip
 * @param chartID - Current chart ID counter
 * @param MsgQueue - Message queue for chart rendering
 * @param slideFactor - Conversion factor from PPTX units to pixels
 * @returns Tuple of [HTML string, updated chartID]
 */
import { getTextByPathList } from "../object";
import { getPosition } from "../layout/get-position";
import { getSize } from "../layout/get-size";
import { readXmlFile } from "../xml/read-xml-file";
import { extractChartData } from "./extract-chart-data";

export function genChart(
  node: any,
  warpObj: any,
  chartID: number,
  MsgQueue: any[],
  slideFactor: number
): [string, number] {
  const order = node["attrs"]["order"];
  const xfrmNode = getTextByPathList(node, ["p:xfrm"]);
  const result =
    "<div id='chart" +
    chartID +
    "' class='block content' style='" +
    getPosition(xfrmNode, node, undefined, undefined, undefined, slideFactor) +
    getSize(xfrmNode, undefined, undefined, slideFactor) +
    " z-index: " +
    order +
    ";'></div>";

  const rid = node["a:graphic"]["a:graphicData"]["c:chart"]["attrs"]["r:id"];
  const refName = warpObj["slideResObj"][rid]["target"];
  const archive = warpObj["archive"] ?? warpObj["zip"];
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const content = readXmlFile(archive, refName);
  const plotArea = getTextByPathList(content, ["c:chartSpace", "c:chart", "c:plotArea"]);

  let chartData = null;
  for (const key in plotArea) {
    switch (key) {
      case "c:lineChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "lineChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
          },
        };
        break;
      case "c:barChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "barChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
          },
        };
        break;
      case "c:pieChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "pieChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
          },
        };
        break;
      case "c:pie3DChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "pie3DChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
          },
        };
        break;
      case "c:areaChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "areaChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
          },
        };
        break;
      case "c:scatterChart":
        chartData = {
          type: "createChart",
          data: {
            chartID: "chart" + chartID,
            chartType: "scatterChart",
            chartData: extractChartData(plotArea[key]["c:ser"]),
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

  if (chartData !== null) {
    MsgQueue.push(chartData);
  }

  chartID++;
  return [result, chartID];
}
