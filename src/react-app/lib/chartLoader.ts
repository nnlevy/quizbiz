type ChartConstructor = new (
  element: HTMLCanvasElement,
  config: Record<string, unknown>,
) => { destroy: () => void };

let chartPromise: Promise<ChartConstructor> | null = null;

export const loadChartJs = () => {
  if (chartPromise) return chartPromise;
  chartPromise = import("chart.js/auto").then((module) => {
    const chartExport = (module as { default?: ChartConstructor; Chart?: ChartConstructor }).default ??
      (module as { Chart?: ChartConstructor }).Chart;
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
