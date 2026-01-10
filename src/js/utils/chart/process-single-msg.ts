type ChartMessage = {
  chartID: string | number;
  chartType: string;
  chartData: unknown[];
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
  const { nv, d3 } = window as { nv: any; d3: any };

  let data: unknown = [];

  let chart = null;
  switch (chartType) {
    case "lineChart": {
      data = chartData;
      chart = nv.models.lineChart().useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        const series = chartData[0] as { xlabels?: Array<string | number> } | undefined;
        return series?.xlabels?.[value] ?? value;
      });
      break;
    }
    case "barChart": {
      data = chartData;
      chart = nv.models.multiBarChart();
      chart.xAxis.tickFormat(function (value: number) {
        const series = chartData[0] as { xlabels?: Array<string | number> } | undefined;
        return series?.xlabels?.[value] ?? value;
      });
      break;
    }
    case "pieChart":
    case "pie3DChart": {
      if (chartData.length > 0) {
        const series = chartData[0] as { values?: unknown } | undefined;
        data = series?.values ?? [];
      }
      chart = nv.models.pieChart();
      break;
    }
    case "areaChart": {
      data = chartData;
      chart = nv.models.stackedAreaChart().clipEdge(true).useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        const series = chartData[0] as { xlabels?: Array<string | number> } | undefined;
        return series?.xlabels?.[value] ?? value;
      });
      break;
    }
    case "scatterChart": {
      const scatterData: Array<{ key: string; values: Array<{ x: number; y: number }> }> = [];
      const seriesList = chartData as Array<number[]>;
      for (let i = 0; i < seriesList.length; i++) {
        const arr: Array<{ x: number; y: number }> = [];
        for (let j = 0; j < seriesList[i].length; j++) {
          arr.push({ x: j, y: seriesList[i][j] });
        }
        scatterData.push({ key: "data" + (i + 1), values: arr });
      }
      data = scatterData;

      //data = chartData;
      chart = nv.models
        .scatterChart()
        .showDistX(true)
        .showDistY(true)
        .color(d3.scale.category10().range());
      chart.xAxis.axisLabel("X").tickFormat(d3.format(".02f"));
      chart.yAxis.axisLabel("Y").tickFormat(d3.format(".02f"));
      break;
    }
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
