type ChartModule = typeof import("chart.js/auto");
type ChartConstructor = ChartModule["default"];

let chartPromise: Promise<ChartConstructor> | null = null;

export const loadChartJs = () => {
  if (chartPromise) return chartPromise;
  chartPromise = import("chart.js/auto").then((module: ChartModule) => {
    const chartExport = module.default ?? module.Chart;
    if (typeof window !== "undefined") {
      (window as typeof window & { __WS_CHART_JS_LOADED__?: boolean }).__WS_CHART_JS_LOADED__ = true;
    }
    if (!chartExport) {
      throw new Error("Chart.js module did not load.");
    }
    return chartExport;
  });
  return chartPromise;
};
