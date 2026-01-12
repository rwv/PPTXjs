import { eachElement } from "../object";
import { getTextByPathList } from "../object";

/**
 * Extract chart data from XML series node
 *
 * @param seriesNodeData - The chart series node from XML containing data points
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
type ExtractChartDataOptions = {
  seriesNodeData: any;
};

export function extractChartData({ seriesNodeData }: ExtractChartDataOptions) {
  const chartSeries = [];

  if (seriesNodeData === undefined) {
    return chartSeries;
  }

  if (seriesNodeData["c:xVal"] !== undefined) {
    let axisValues: number[] = [];
    eachElement({
      node: seriesNodeData["c:xVal"]["c:numRef"]["c:numCache"]["c:pt"],
      callback: function (pointEntry: any) {
        axisValues.push(parseFloat(pointEntry["c:v"]));
        return "";
      },
    });
    chartSeries.push(axisValues);
    axisValues = [];
    eachElement({
      node: seriesNodeData["c:yVal"]["c:numRef"]["c:numCache"]["c:pt"],
      callback: function (pointEntry: any) {
        axisValues.push(parseFloat(pointEntry["c:v"]));
        return "";
      },
    });
    chartSeries.push(axisValues);
  } else {
    eachElement({
      node: seriesNodeData,
      callback: function (seriesEntry: any, seriesIndex: number) {
        const seriesValues: Array<{ x: string | number; y: number }> = [];
        const seriesLabel =
          getTextByPathList({
            node: seriesEntry,
            path: ["c:tx", "c:strRef", "c:strCache", "c:pt", "c:v"],
          }) || seriesIndex;

        // Category (string or number)
        const categoryLabels: Record<string, string> = {};
        if (
          getTextByPathList({
            node: seriesEntry,
            path: ["c:cat", "c:strRef", "c:strCache", "c:pt"],
          }) !== undefined
        ) {
          eachElement({
            node: seriesEntry["c:cat"]["c:strRef"]["c:strCache"]["c:pt"],
            callback: function (pointEntry: any) {
              categoryLabels[pointEntry["attrs"]["idx"]] = pointEntry["c:v"];
              return "";
            },
          });
        } else if (
          getTextByPathList({
            node: seriesEntry,
            path: ["c:cat", "c:numRef", "c:numCache", "c:pt"],
          }) !== undefined
        ) {
          eachElement({
            node: seriesEntry["c:cat"]["c:numRef"]["c:numCache"]["c:pt"],
            callback: function (pointEntry: any) {
              categoryLabels[pointEntry["attrs"]["idx"]] = pointEntry["c:v"];
              return "";
            },
          });
        }

        // Value
        if (
          getTextByPathList({
            node: seriesEntry,
            path: ["c:val", "c:numRef", "c:numCache", "c:pt"],
          }) !== undefined
        ) {
          eachElement({
            node: seriesEntry["c:val"]["c:numRef"]["c:numCache"]["c:pt"],
            callback: function (pointEntry: any) {
              seriesValues.push({
                x: pointEntry["attrs"]["idx"],
                y: parseFloat(pointEntry["c:v"]),
              });
              return "";
            },
          });
        }

        chartSeries.push({ key: seriesLabel, values: seriesValues, xlabels: categoryLabels });
        return "";
      },
    });
  }

  return chartSeries;
}
