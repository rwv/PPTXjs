import { eachElement } from "../object";
import { getTextByPathList } from "../object";
import type { XmlNode } from "../../types/pptx-xml";

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
  seriesNodeData: XmlNode | XmlNode[] | undefined;
};

export function extractChartData({ seriesNodeData }: ExtractChartDataOptions) {
  const chartSeries = [];

  if (seriesNodeData === undefined) {
    return chartSeries;
  }

  if (!Array.isArray(seriesNodeData) && seriesNodeData["c:xVal"] !== undefined) {
    let axisValues: number[] = [];
    const xValueNodes = getTextByPathList<XmlNode | XmlNode[]>({
      node: seriesNodeData,
      path: ["c:xVal", "c:numRef", "c:numCache", "c:pt"],
    });
    eachElement({
      node: xValueNodes,
      callback: function (pointEntry: XmlNode) {
        const value = getTextByPathList<string | number>({ node: pointEntry, path: ["c:v"] });
        axisValues.push(parseFloat(String(value ?? "")));
        return "";
      },
    });
    chartSeries.push(axisValues);
    axisValues = [];
    const yValueNodes = getTextByPathList<XmlNode | XmlNode[]>({
      node: seriesNodeData,
      path: ["c:yVal", "c:numRef", "c:numCache", "c:pt"],
    });
    eachElement({
      node: yValueNodes,
      callback: function (pointEntry: XmlNode) {
        const value = getTextByPathList<string | number>({ node: pointEntry, path: ["c:v"] });
        axisValues.push(parseFloat(String(value ?? "")));
        return "";
      },
    });
    chartSeries.push(axisValues);
  } else {
    eachElement({
      node: seriesNodeData,
      callback: function (seriesEntry: XmlNode, seriesIndex: number) {
        const seriesValues: Array<{ x: string | number; y: number }> = [];
        const seriesLabel =
          getTextByPathList({
            node: seriesEntry,
            path: ["c:tx", "c:strRef", "c:strCache", "c:pt", "c:v"],
          }) || seriesIndex;

        // Category (string or number)
        const categoryLabels: Record<string, string> = {};
        const stringCategoryNodes = getTextByPathList<XmlNode | XmlNode[]>({
          node: seriesEntry,
          path: ["c:cat", "c:strRef", "c:strCache", "c:pt"],
        });
        if (stringCategoryNodes !== undefined) {
          eachElement({
            node: stringCategoryNodes,
            callback: function (pointEntry: XmlNode) {
              const idx = getTextByPathList<string | number>({
                node: pointEntry,
                path: ["attrs", "idx"],
              });
              const value = getTextByPathList<string | number>({ node: pointEntry, path: ["c:v"] });
              if (idx !== undefined && value !== undefined) {
                categoryLabels[String(idx)] = String(value);
              }
              return "";
            },
          });
        } else {
          const numberCategoryNodes = getTextByPathList<XmlNode | XmlNode[]>({
            node: seriesEntry,
            path: ["c:cat", "c:numRef", "c:numCache", "c:pt"],
          });
          if (numberCategoryNodes !== undefined) {
            eachElement({
              node: numberCategoryNodes,
              callback: function (pointEntry: XmlNode) {
                const idx = getTextByPathList<string | number>({
                  node: pointEntry,
                  path: ["attrs", "idx"],
                });
                const value = getTextByPathList<string | number>({
                  node: pointEntry,
                  path: ["c:v"],
                });
                if (idx !== undefined && value !== undefined) {
                  categoryLabels[String(idx)] = String(value);
                }
                return "";
              },
            });
          }
        }

        // Value
        const valueNodes = getTextByPathList<XmlNode | XmlNode[]>({
          node: seriesEntry,
          path: ["c:val", "c:numRef", "c:numCache", "c:pt"],
        });
        if (valueNodes !== undefined) {
          eachElement({
            node: valueNodes,
            callback: function (pointEntry: XmlNode) {
              const idx = getTextByPathList<string | number>({
                node: pointEntry,
                path: ["attrs", "idx"],
              });
              const value = getTextByPathList<string | number>({ node: pointEntry, path: ["c:v"] });
              if (idx !== undefined && value !== undefined) {
                seriesValues.push({
                  x: idx,
                  y: parseFloat(String(value)),
                });
              }
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
