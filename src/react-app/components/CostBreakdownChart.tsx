import { useEffect, useRef } from "react";

import type { AnalysisTier } from "../types";

type CostBreakdownChartProps = {
  tiers: AnalysisTier[];
};

const CostBreakdownChart = ({ tiers }: CostBreakdownChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return undefined;
    const ChartConstructor = (window as typeof window & {
      Chart?: new (...args: unknown[]) => { destroy: () => void };
    }).Chart;
    if (!ChartConstructor) return undefined;
    const chart = new ChartConstructor(canvasRef.current, {
      type: "bar",
      data: {
        labels: tiers.map((tier) => tier.name),
        datasets: [
          {
            label: "Cost by tier ($)",
            data: tiers.map((tier) => tier.cost),
            backgroundColor: ["#14b8a6", "#38bdf8", "#f97316"],
            borderRadius: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Cost breakdown by tier" },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `$${value}`,
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [tiers]);

  return (
    <div className="ws-chart">
      <canvas ref={canvasRef} role="img" aria-label="Cost breakdown by tier" />
    </div>
  );
};

export default CostBreakdownChart;
