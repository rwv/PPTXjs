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
 * @param message - Chart configuration data containing chartID, chartType, and chartData
 * @returns True if chart was successfully rendered, false otherwise
 */
export function processSingleMsg(message: unknown): boolean {
  if (!isChartMessage(message)) {
    return false;
  }

  const { chartID: chartId, chartType, chartData } = message;
  type D3Module = typeof import("d3");
  type NvModule = typeof import("nvd3");
  const { nv, d3 } = window as { nv: NvModule; d3: D3Module };

  let chartDataset: unknown = [];

  let chart = null;
  switch (chartType) {
    case "lineChart": {
      chartDataset = chartData;
      chart = nv.models.lineChart().useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        const series = chartData[0] as { xlabels?: Array<string | number> } | undefined;
        return series?.xlabels?.[value] ?? value;
      });
      break;
    }
    case "barChart": {
      chartDataset = chartData;
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
        chartDataset = series?.values ?? [];
      }
      chart = nv.models.pieChart();
      break;
    }
    case "areaChart": {
      chartDataset = chartData;
      chart = nv.models.stackedAreaChart().clipEdge(true).useInteractiveGuideline(true);
      chart.xAxis.tickFormat(function (value: number) {
        const series = chartData[0] as { xlabels?: Array<string | number> } | undefined;
        return series?.xlabels?.[value] ?? value;
      });
      break;
    }
    case "scatterChart": {
      const scatterSeries: Array<{ key: string; values: Array<{ x: number; y: number }> }> = [];
      const seriesData = chartData as Array<number[]>;
      for (let seriesIndex = 0; seriesIndex < seriesData.length; seriesIndex += 1) {
        const points: Array<{ x: number; y: number }> = [];
        for (let pointIndex = 0; pointIndex < seriesData[seriesIndex].length; pointIndex += 1) {
          points.push({ x: pointIndex, y: seriesData[seriesIndex][pointIndex] });
        }
        scatterSeries.push({ key: "data" + (seriesIndex + 1), values: points });
      }
      chartDataset = scatterSeries;

      //chartDataset = chartData;
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
    d3.select("#" + chartId)
      .append("svg")
      .datum(chartDataset)
      .transition()
      .duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);
    return true;
  }

  return false;
}
