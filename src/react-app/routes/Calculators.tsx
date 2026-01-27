import { type ReactNode, useEffect, useMemo, useState } from "react";
import { RouterLink, useLocation } from "./router";
import { useCredits } from "../context/CreditsContext";

const GALLONS_PER_DRIP = 1 / 15140;
const GALLON_COST = 0.01;

const householdSegments = [
  {
    id: "apartment",
    label: "Apartment",
    avgBill: 60,
    householdSize: 2,
    note: "Typical U.S. renter averages",
  },
  {
    id: "home",
    label: "Single Family Home",
    avgBill: 120,
    householdSize: 4,
    note: "Typical U.S. homeowner averages",
  },
  {
    id: "commercial",
    label: "Commercial Business",
    avgBill: 400,
    householdSize: 15,
    note: "Small business average footprint",
  },
];

type AiInsight = {
  insight: string;
  reference: string;
  cta: string;
};

const Card = ({ title, children, id }: { title: string; children: ReactNode; id?: string }) => (
  <section
    id={id}
    aria-labelledby={id ? `${id}-title` : undefined}
    className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <h3 id={id ? `${id}-title` : undefined} className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
    </div>
    {children}
  </section>
);

const Calculators = () => {
  const { credits, deduct } = useCredits();
  const location = useLocation();
  const [segmentId, setSegmentId] = useState("home");
  const [billAmount, setBillAmount] = useState(120);
  const [householdSize, setHouseholdSize] = useState(4);
  const [billOverride, setBillOverride] = useState(false);
  const [dripsPerMinute, setDripsPerMinute] = useState(30);
  const [leakingFaucets, setLeakingFaucets] = useState(1);
  const [showerDuration, setShowerDuration] = useState(8);
  const [flowRate, setFlowRate] = useState(2.1);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const segment = useMemo(
    () => householdSegments.find((option) => option.id === segmentId) ?? householdSegments[1],
    [segmentId],
  );

  useEffect(() => {
    if (!billOverride) {
      setBillAmount(segment.avgBill);
    }
    setHouseholdSize(segment.householdSize);
  }, [segment, billOverride]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billParam = params.get("bill_amount");
    if (!billParam) return;
    const parsed = Number(billParam);
    if (!Number.isFinite(parsed)) return;
    setBillAmount(parsed);
    setBillOverride(true);
  }, [location.search]);

  const dripsPerDay = dripsPerMinute * 60 * 24 * leakingFaucets;
  // USGS reference: 15,140 drips = 1 gallon. Convert drips/day into gallons/day.
  const gallonsPerDay = dripsPerDay * GALLONS_PER_DRIP;
  const gallonsPerMonth = gallonsPerDay * 30;
  const gallonsPerYear = gallonsPerDay * 365;

  const showerGallons = showerDuration * flowRate;
  const bathGallons = 35;
  const maxSessionGallons = Math.max(showerGallons, bathGallons);
  const showerCost = showerGallons * GALLON_COST;
  const bathCost = bathGallons * GALLON_COST;

  const savingsRate = Math.min(0.35, Math.max(0.12, 0.12 + householdSize * 0.02));
  const savingsEstimate = billAmount * savingsRate;

  const handleGenerateInsight = async () => {
    setAiError(null);
    setAiInsight(null);
    if (credits <= 0) {
      setAiError("You are out of credits. Add more to unlock AI insights.");
      return;
    }
    // Credit check + deduction happens before the mocked AI call.
    const nextCredits = deduct(1);
    if (nextCredits == null) {
      setAiError("You are out of credits. Add more to unlock AI insights.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch("/api/calculator-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          segmentId,
          billAmount,
          householdSize,
          dripsPerMinute,
          leakingFaucets,
          showerDuration,
          flowRate,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "We couldn’t generate an insight yet.");
      }
      const payload = (await response.json()) as AiInsight;
      setAiInsight(payload);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Calculators Hub
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              See what smarter water habits can unlock
            </h1>
            <p className="max-w-2xl text-base text-slate-600">
              National averages from EPA/USGS benchmarks prefill the calculators, so you can quickly
              compare your household against typical U.S. usage and uncover savings.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Household profile</h2>
                <p className="text-sm text-slate-500">
                  Choose your segment to update the defaults and benchmarks.
                </p>
              </div>
              <div className="text-sm text-slate-500">Credits available: {credits}</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {householdSegments.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSegmentId(option.id)}
                  className={`min-h-[44px] flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    segmentId === option.id
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="block">{option.label}</span>
                  <span className="block text-xs font-normal text-slate-400">{option.note}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg Bill</p>
                <p className="text-lg font-semibold text-slate-900">${segment.avgBill}/mo</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Household Size</p>
                <p className="text-lg font-semibold text-slate-900">{segment.householdSize} people</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card id="leak-estimator" title="Leak Cost Estimator">
            <div className="flex flex-col gap-4 text-sm text-slate-600">
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Drips per minute</span>
                <input
                  className="h-12 accent-sky-600"
                  type="range"
                  min={0}
                  max={180}
                  value={dripsPerMinute}
                  onChange={(event) => setDripsPerMinute(Number(event.target.value))}
                />
                <span className="text-xs text-slate-500">{dripsPerMinute} drips/min</span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Leaking faucets</span>
                <input
                  className="h-12 rounded-xl border border-slate-200 px-3"
                  type="number"
                  min={1}
                  max={50}
                  value={leakingFaucets}
                  onChange={(event) => setLeakingFaucets(Number(event.target.value))}
                />
              </label>
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Daily waste</span>
                  <span className="font-semibold text-slate-900">
                    {gallonsPerDay.toFixed(1)} gal · ${(gallonsPerDay * GALLON_COST).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly waste</span>
                  <span className="font-semibold text-slate-900">
                    {gallonsPerMonth.toFixed(0)} gal · ${(gallonsPerMonth * GALLON_COST).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Yearly waste</span>
                  <span className="font-semibold text-slate-900">
                    {gallonsPerYear.toFixed(0)} gal · ${(gallonsPerYear * GALLON_COST).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card id="shower-bath" title="Shower vs. Bath Comparator">
            <div className="flex flex-col gap-4 text-sm text-slate-600">
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Shower duration</span>
                <input
                  className="h-12 accent-sky-600"
                  type="range"
                  min={2}
                  max={30}
                  value={showerDuration}
                  onChange={(event) => setShowerDuration(Number(event.target.value))}
                />
                <span className="text-xs text-slate-500">{showerDuration} minutes</span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Flow rate (GPM)</span>
                <input
                  className="h-12 rounded-xl border border-slate-200 px-3"
                  type="number"
                  step={0.1}
                  min={1}
                  max={5}
                  value={flowRate}
                  onChange={(event) => setFlowRate(Number(event.target.value))}
                />
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cost per session</span>
                  <span>${GALLON_COST.toFixed(2)} per gallon</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Shower</span>
                    <span className="font-semibold text-slate-900">
                      {showerGallons.toFixed(1)} gal · ${showerCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-sky-500"
                      style={{ width: `${(showerGallons / maxSessionGallons) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Bath</span>
                    <span className="font-semibold text-slate-900">
                      {bathGallons.toFixed(1)} gal · ${bathCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{ width: `${(bathGallons / maxSessionGallons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card id="bill-savings" title="Bill Savings Projector">
            <div className="flex flex-col gap-4 text-sm text-slate-600">
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Current bill amount</span>
                <input
                  className="h-12 rounded-xl border border-slate-200 px-3"
                  type="number"
                  min={0}
                  value={billAmount}
                  onChange={(event) => setBillAmount(Number(event.target.value))}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-medium text-slate-700">Household size</span>
                <input
                  className="h-12 rounded-xl border border-slate-200 px-3"
                  type="number"
                  min={1}
                  value={householdSize}
                  onChange={(event) => setHouseholdSize(Number(event.target.value))}
                />
              </label>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Conservative</p>
                <p className="text-lg font-semibold text-emerald-700">
                  ${savingsEstimate.toFixed(0)} saved per month
                </p>
                <p className="text-xs text-emerald-600">
                  Estimated {(savingsRate * 100).toFixed(0)}% usage reduction.
                </p>
              </div>
              <RouterLink
                className="min-h-[44px] rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                to="/dashboard"
              >
                Start Savings Plan
              </RouterLink>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Smart Insights
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Unlock AI-backed recommendations instantly
              </h2>
              <p className="text-sm text-slate-600">
                Use one credit to generate a tailored insight from your calculator inputs.
              </p>
              <button
                type="button"
                onClick={handleGenerateInsight}
                disabled={aiLoading}
                className="min-h-[44px] w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-70"
              >
                {aiLoading ? "Generating insight..." : "Get Personalized Insight"}
              </button>
              {aiError ? <p className="text-sm text-rose-500">{aiError}</p> : null}
            </div>
          </div>

          <div
            className={`rounded-2xl border border-dashed p-6 text-sm text-slate-600 transition ${
              aiInsight
                ? "border-transparent bg-gradient-to-br from-sky-200 via-white to-emerald-200"
                : "border-slate-300 bg-white"
            }`}
          >
            {aiInsight ? (
              <div className="flex h-full flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-base font-semibold text-slate-900">{aiInsight.insight}</p>
                <p className="text-sm text-slate-500">{aiInsight.reference}</p>
                <button
                  type="button"
                  className="min-h-[44px] rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  {aiInsight.cta}
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-base font-semibold text-slate-700">No insight yet.</p>
                <p className="text-sm text-slate-500">
                  Generate an insight to see personalized guidance and savings prompts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
