import { eachElement } from "../object";
import { getTextByPathList } from "../object";

/**
 * Extract chart data from XML series node
 *
 * @param serNode - The chart series node from XML containing data points
 * @returns Array of data series. For scatter charts, returns [[xValues], [yValues]].
 *          For other charts, returns array of series objects with key, values, and xlabels.
 *
 * @example
 * // Scatter chart data
 * const scatterData = extractChartData(serNode);
 * // [[1, 2, 3], [10, 20, 30]]
 *
 * @example
 * // Bar/Line chart data
 * const chartData = extractChartData(serNode);
 * // [{ key: "Series1", values: [{x: "0", y: 10}], xlabels: {"0": "Jan"} }]
 */
export function extractChartData(seriesNode: any) {
  const dataSeries = [];

  if (seriesNode === undefined) {
    return dataSeries;
  }

  if (seriesNode["c:xVal"] !== undefined) {
    let valueSeries: number[] = [];
    eachElement(seriesNode["c:xVal"]["c:numRef"]["c:numCache"]["c:pt"], function (pointNode: any) {
      valueSeries.push(parseFloat(pointNode["c:v"]));
      return "";
    });
    dataSeries.push(valueSeries);
    valueSeries = [];
    eachElement(seriesNode["c:yVal"]["c:numRef"]["c:numCache"]["c:pt"], function (pointNode: any) {
      valueSeries.push(parseFloat(pointNode["c:v"]));
      return "";
    });
    dataSeries.push(valueSeries);
  } else {
    eachElement(seriesNode, function (seriesNodeItem: any, index: number) {
      const seriesValues: Array<{ x: string | number; y: number }> = [];
      const seriesLabel =
        getTextByPathList(seriesNodeItem, ["c:tx", "c:strRef", "c:strCache", "c:pt", "c:v"]) ||
        index;

      // Category (string or number)
      const categoryLabels: Record<string, string> = {};
      if (
        getTextByPathList(seriesNodeItem, ["c:cat", "c:strRef", "c:strCache", "c:pt"]) !== undefined
      ) {
        eachElement(
          seriesNodeItem["c:cat"]["c:strRef"]["c:strCache"]["c:pt"],
          function (pointNode: any) {
            categoryLabels[pointNode["attrs"]["idx"]] = pointNode["c:v"];
            return "";
          }
        );
      } else if (
        getTextByPathList(seriesNodeItem, ["c:cat", "c:numRef", "c:numCache", "c:pt"]) !== undefined
      ) {
        eachElement(
          seriesNodeItem["c:cat"]["c:numRef"]["c:numCache"]["c:pt"],
          function (pointNode: any) {
            categoryLabels[pointNode["attrs"]["idx"]] = pointNode["c:v"];
            return "";
          }
        );
      }

      // Value
      if (
        getTextByPathList(seriesNodeItem, ["c:val", "c:numRef", "c:numCache", "c:pt"]) !== undefined
      ) {
        eachElement(
          seriesNodeItem["c:val"]["c:numRef"]["c:numCache"]["c:pt"],
          function (pointNode: any) {
            seriesValues.push({
              x: pointNode["attrs"]["idx"],
              y: parseFloat(pointNode["c:v"]),
            });
            return "";
          }
        );
      }

      dataSeries.push({ key: seriesLabel, values: seriesValues, xlabels: categoryLabels });
      return "";
    });
  }

  return dataSeries;
}
