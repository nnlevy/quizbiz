import { useEffect, useMemo, useRef } from "react";

import type { UsageHistoryPoint } from "../types";

type UsageLineChartProps = {
  data: UsageHistoryPoint[];
  title: string;
  highlightIndexes?: number[];
};

const UsageLineChart = ({ data, title, highlightIndexes = [] }: UsageLineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const highlightSet = useMemo(() => new Set(highlightIndexes), [highlightIndexes]);

  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return undefined;
    const ChartConstructor = (window as typeof window & {
      Chart?: new (...args: unknown[]) => { destroy: () => void };
    }).Chart;
    if (!ChartConstructor) return undefined;
    const chart = new ChartConstructor(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((point) => point.label),
        datasets: [
          {
            label: "Household usage",
            data: data.map((point, index) => ({
              x: point.label,
              y: point.usage,
              pointRadius: highlightSet.has(index) ? 5 : 3,
            })),
            borderColor: "#0f766e",
            backgroundColor: "rgba(15, 118, 110, 0.18)",
            pointBackgroundColor: data.map((_, index) =>
              highlightSet.has(index) ? "#ef4444" : "#0f766e",
            ),
            fill: true,
            tension: 0.35,
          },
          {
            label: "Similar homes average",
            data: data.map((point) => point.average),
            borderColor: "#94a3b8",
            backgroundColor: "rgba(148, 163, 184, 0.2)",
            borderDash: [6, 6],
            pointRadius: 0,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: title,
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value: number | string) => `${value} gal`,
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data, highlightSet, title]);

  return (
    <div className="ws-chart">
      <canvas ref={canvasRef} role="img" aria-label={title} />
    </div>
  );
};

export default UsageLineChart;
