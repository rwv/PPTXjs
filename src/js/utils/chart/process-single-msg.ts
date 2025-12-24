/**
 * Process a single chart rendering message using D3 and NVD3
 *
 * @param d - Chart configuration data containing chartID, chartType, and chartData
 * @returns True if chart was successfully rendered, false otherwise
 */

interface ChartMessage {
  chartID: string;
  chartType: string;
  chartData: any;
}

export function processSingleMsg(d: ChartMessage): boolean {
  const chartID = d.chartID;
  const chartType = d.chartType;
  const chartData = d.chartData;

  let data = [];

  let chart = null;
  switch (chartType) {
    case "lineChart":
      data = chartData;
      chart = nv.models.lineChart().useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (d: number | string) {
        return chartData[0].xlabels[d] || d;
      });
      break;
    case "barChart":
      data = chartData;
      chart = nv.models.multiBarChart();
      chart.xAxis.tickFormat(function (d: number | string) {
        return chartData[0].xlabels[d] || d;
      });
      break;
    case "pieChart":
    case "pie3DChart":
      if (chartData.length > 0) {
        data = chartData[0].values;
      }
      chart = nv.models.pieChart();
      break;
    case "areaChart":
      data = chartData;
      chart = nv.models.stackedAreaChart().clipEdge(true).useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (d: number | string) {
        return chartData[0].xlabels[d] || d;
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
      chart = nv.models
        .scatterChart()
        .showDistX(true)
        .showDistY(true)
        .color(d3.scale.category10().range());
      chart.xAxis.axisLabel("X").tickFormat(d3.format(".02f"));
      chart.yAxis.axisLabel("Y").tickFormat(d3.format(".02f"));
      break;
    default:
  }

  if (chart !== null) {
    d3.select("#" + chartID)
      .append("svg")
      .datum(data)
      .transition()
      .duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);
    return true;
  }

  return false;
}
