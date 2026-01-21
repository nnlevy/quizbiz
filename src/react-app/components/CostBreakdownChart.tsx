import { useEffect, useRef, useState } from "react";

import type { AnalysisTier } from "../types";
import { loadChartJs } from "../lib/chartLoader";
import { useNearViewport } from "../hooks/useNearViewport";

type CostBreakdownChartProps = {
  tiers: AnalysisTier[];
};

const CostBreakdownChart = ({ tiers }: CostBreakdownChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isNearViewport = useNearViewport(containerRef);
  const [chartReady, setChartReady] = useState(false);
  const [ChartConstructor, setChartConstructor] = useState<
    (new (element: HTMLCanvasElement, config: Record<string, unknown>) => { destroy: () => void }) | null
  >(null);

  useEffect(() => {
    if (!isNearViewport || ChartConstructor) return undefined;
    let isCancelled = false;
    loadChartJs()
      .then((Chart) => {
        if (!isCancelled) {
          setChartConstructor(() => Chart);
        }
      })
      .catch(() => undefined);
    return () => {
      isCancelled = true;
    };
  }, [ChartConstructor, isNearViewport]);

  useEffect(() => {
    if (!canvasRef.current || !ChartConstructor || typeof window === "undefined") return undefined;
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
              callback: (value: number | string) => `$${value}`,
            },
          },
        },
      },
    });
    setChartReady(true);

    return () => {
      chart.destroy();
      setChartReady(false);
    };
  }, [ChartConstructor, tiers]);

  return (
    <div className="ws-chart" ref={containerRef} data-chart-status={chartReady ? "ready" : "idle"}>
      <canvas ref={canvasRef} role="img" aria-label="Cost breakdown by tier" />
    </div>
  );
};

export default CostBreakdownChart;
