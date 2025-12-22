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
export function extractChartData(serNode: any) {
  const dataMat = new Array();

  if (serNode === undefined) {
    return dataMat;
  }

  if (serNode["c:xVal"] !== undefined) {
    let dataRow = new Array();
    eachElement(
      serNode["c:xVal"]["c:numRef"]["c:numCache"]["c:pt"],
      function (innerNode: any, index: any) {
        dataRow.push(parseFloat(innerNode["c:v"]));
        return "";
      }
    );
    dataMat.push(dataRow);
    dataRow = new Array();
    eachElement(
      serNode["c:yVal"]["c:numRef"]["c:numCache"]["c:pt"],
      function (innerNode: any, index: any) {
        dataRow.push(parseFloat(innerNode["c:v"]));
        return "";
      }
    );
    dataMat.push(dataRow);
  } else {
    eachElement(serNode, function (innerNode: any, index: any) {
      const dataRow = new Array();
      const colName =
        getTextByPathList(innerNode, ["c:tx", "c:strRef", "c:strCache", "c:pt", "c:v"]) || index;

      // Category (string or number)
      const rowNames = {};
      if (getTextByPathList(innerNode, ["c:cat", "c:strRef", "c:strCache", "c:pt"]) !== undefined) {
        eachElement(
          innerNode["c:cat"]["c:strRef"]["c:strCache"]["c:pt"],
          function (innerNode: any, index: any) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            rowNames[innerNode["attrs"]["idx"]] = innerNode["c:v"];
            return "";
          }
        );
      } else if (
        getTextByPathList(innerNode, ["c:cat", "c:numRef", "c:numCache", "c:pt"]) !== undefined
      ) {
        eachElement(
          innerNode["c:cat"]["c:numRef"]["c:numCache"]["c:pt"],
          function (innerNode: any, index: any) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            rowNames[innerNode["attrs"]["idx"]] = innerNode["c:v"];
            return "";
          }
        );
      }

      // Value
      if (getTextByPathList(innerNode, ["c:val", "c:numRef", "c:numCache", "c:pt"]) !== undefined) {
        eachElement(
          innerNode["c:val"]["c:numRef"]["c:numCache"]["c:pt"],
          function (innerNode: any, index: any) {
            dataRow.push({
              x: innerNode["attrs"]["idx"],
              y: parseFloat(innerNode["c:v"]),
            });
            return "";
          }
        );
      }

      dataMat.push({ key: colName, values: dataRow, xlabels: rowNames });
      return "";
    });
  }

  return dataMat;
}
