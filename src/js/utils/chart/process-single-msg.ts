type ChartMessage = {
  chartID: string | number;
  chartType: string;
  chartData: any[];
};

function isChartMessage(value: unknown): value is ChartMessage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    (typeof record.chartID === "string" || typeof record.chartID === "number") &&
    typeof record.chartType === "string" &&
    Array.isArray(record.chartData)
  );
}

/**
 * Process a single chart rendering message using D3 and NVD3
 *
 * @param d - Chart configuration data containing chartID, chartType, and chartData
 * @returns True if chart was successfully rendered, false otherwise
 */
export function processSingleMsg(d: unknown): boolean {
  if (!isChartMessage(d)) {
    return false;
  }

  const { chartID, chartType, chartData } = d;

  let data = [];

  let chart = null;
  switch (chartType) {
    case "lineChart":
      data = chartData;
      // @ts-expect-error TS(2304): Cannot find name 'nv'.
      chart = nv.models.lineChart().useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        return chartData[0].xlabels[value] || value;
      });
      break;
    case "barChart":
      data = chartData;
      // @ts-expect-error TS(2304): Cannot find name 'nv'.
      chart = nv.models.multiBarChart();
      chart.xAxis.tickFormat(function (value: number) {
        return chartData[0].xlabels[value] || value;
      });
      break;
    case "pieChart":
    case "pie3DChart":
      if (chartData.length > 0) {
        data = chartData[0].values;
      }
      // @ts-expect-error TS(2304): Cannot find name 'nv'.
      chart = nv.models.pieChart();
      break;
    case "areaChart":
      data = chartData;
      // @ts-expect-error TS(2304): Cannot find name 'nv'.
      chart = nv.models.stackedAreaChart().clipEdge(true).useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        return chartData[0].xlabels[value] || value;
      });
      break;
    case "scatterChart":
      for (let i = 0; i < chartData.length; i++) {
        const arr = [];
        for (let j = 0; j < chartData[i].length; j++) {
          arr.push({ x: j, y: chartData[i][j] });
        }
        data.push({ key: "data" + (i + 1), values: arr });
      }

      //data = chartData;
      // @ts-expect-error TS(2304): Cannot find name 'nv'.
      chart = nv.models
        .scatterChart()
        .showDistX(true)
        .showDistY(true)
        // @ts-expect-error TS(2304): Cannot find name 'd3'.
        .color(d3.scale.category10().range());
      // @ts-expect-error TS(2304): Cannot find name 'd3'.
      chart.xAxis.axisLabel("X").tickFormat(d3.format(".02f"));
      // @ts-expect-error TS(2304): Cannot find name 'd3'.
      chart.yAxis.axisLabel("Y").tickFormat(d3.format(".02f"));
      break;
    default:
  }

  if (chart !== null) {
    // @ts-expect-error TS(2304): Cannot find name 'd3'.
    d3.select("#" + chartID)
      .append("svg")
      .datum(data)
      .transition()
      .duration(500)
      .call(chart);

    // @ts-expect-error TS(2304): Cannot find name 'nv'.
    nv.utils.windowResize(chart.update);
    return true;
  }

  return false;
}
