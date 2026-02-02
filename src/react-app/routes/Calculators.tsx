import { useEffect, useMemo, useState } from "react";
import { RouterLink, useLocation } from "./router";
import { useCredits } from "../context/CreditsContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Slider from "../components/Slider";
import "./Calculators.css";

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
    <div className="ws-calculators">
      <div className="ws-calculators__container">
        <header className="ws-calculators__header">
          <div className="ws-calculators__hero">
            <p className="ws-calculators__eyebrow">Calculators Hub</p>
            <h1 className="ws-calculators__title">See what smarter water habits can unlock</h1>
            <p className="ws-calculators__lede">
              National averages from EPA/USGS benchmarks prefill the calculators, so you can quickly
              compare your household against typical U.S. usage and uncover savings.
            </p>
          </div>
          <div className="ws-calculators__segment-card">
            <div className="ws-calculators__segment-header">
              <div>
                <h2 className="ws-calculators__segment-title">Household profile</h2>
                <p className="ws-calculators__segment-subtitle">
                  Choose your segment to update the defaults and benchmarks.
                </p>
              </div>
              <div className="ws-calculators__credits">Credits available: {credits}</div>
            </div>
            <div className="ws-calculators__segment-buttons">
              {householdSegments.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  onClick={() => setSegmentId(option.id)}
                  className={`ws-calculators__segment-button ${
                    segmentId === option.id ? "is-active" : ""
                  }`}
                >
                  <span className="ws-calculators__segment-label">{option.label}</span>
                  <span className="ws-calculators__segment-note">{option.note}</span>
                </Button>
              ))}
            </div>
            <div className="ws-calculators__stat-grid">
              <div className="ws-calculators__stat-card">
                <p className="ws-calculators__stat-label">Avg Bill</p>
                <p className="ws-calculators__stat-value">${segment.avgBill}/mo</p>
              </div>
              <div className="ws-calculators__stat-card">
                <p className="ws-calculators__stat-label">Household Size</p>
                <p className="ws-calculators__stat-value">{segment.householdSize} people</p>
              </div>
            </div>
          </div>
        </header>

        <div className="ws-calculators__grid">
          <Card id="leak-estimator" title="Leak Cost Estimator">
            <div className="ws-card__body">
              <label className="ws-calculators__label">
                <span>Drips per minute</span>
                <Slider
                  min={0}
                  max={180}
                  value={dripsPerMinute}
                  onChange={(event) => setDripsPerMinute(Number(event.target.value))}
                />
                <span className="ws-calculators__range-value">{dripsPerMinute} drips/min</span>
              </label>
              <label className="ws-calculators__label">
                <span>Leaking faucets</span>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={leakingFaucets}
                  onChange={(event) => setLeakingFaucets(Number(event.target.value))}
                />
              </label>
              <div className="ws-calculators__summary">
                <div className="ws-calculators__summary-row">
                  <span>Daily waste</span>
                  <span className="ws-calculators__summary-value">
                    {gallonsPerDay.toFixed(1)} gal · ${(gallonsPerDay * GALLON_COST).toFixed(2)}
                  </span>
                </div>
                <div className="ws-calculators__summary-row">
                  <span>Monthly waste</span>
                  <span className="ws-calculators__summary-value">
                    {gallonsPerMonth.toFixed(0)} gal · ${(gallonsPerMonth * GALLON_COST).toFixed(2)}
                  </span>
                </div>
                <div className="ws-calculators__summary-row">
                  <span>Yearly waste</span>
                  <span className="ws-calculators__summary-value">
                    {gallonsPerYear.toFixed(0)} gal · ${(gallonsPerYear * GALLON_COST).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card id="shower-bath" title="Shower vs. Bath Comparator">
            <div className="ws-card__body">
              <label className="ws-calculators__label">
                <span>Shower duration</span>
                <Slider
                  min={2}
                  max={30}
                  value={showerDuration}
                  onChange={(event) => setShowerDuration(Number(event.target.value))}
                />
                <span className="ws-calculators__range-value">{showerDuration} minutes</span>
              </label>
              <label className="ws-calculators__label">
                <span>Flow rate (GPM)</span>
                <Input
                  type="number"
                  step={0.1}
                  min={1}
                  max={5}
                  value={flowRate}
                  onChange={(event) => setFlowRate(Number(event.target.value))}
                />
              </label>
              <div className="ws-calculators__summary">
                <div className="ws-calculators__divider-labels">
                  <span>Cost per session</span>
                  <span>${GALLON_COST.toFixed(2)} per gallon</span>
                </div>
                <div className="ws-calculators__summary">
                  <div className="ws-calculators__summary-row">
                    <span>Shower</span>
                    <span className="ws-calculators__summary-value">
                      {showerGallons.toFixed(1)} gal · ${showerCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="ws-calculators__bar-track">
                    <div
                      className="ws-calculators__bar-fill is-sky"
                      style={{ width: `${(showerGallons / maxSessionGallons) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ws-calculators__summary">
                  <div className="ws-calculators__summary-row">
                    <span>Bath</span>
                    <span className="ws-calculators__summary-value">
                      {bathGallons.toFixed(1)} gal · ${bathCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="ws-calculators__bar-track">
                    <div
                      className="ws-calculators__bar-fill is-emerald"
                      style={{ width: `${(bathGallons / maxSessionGallons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card id="bill-savings" title="Bill Savings Projector">
            <div className="ws-card__body">
              <label className="ws-calculators__label">
                <span>Current bill amount</span>
                <Input
                  type="number"
                  min={0}
                  value={billAmount}
                  onChange={(event) => setBillAmount(Number(event.target.value))}
                />
              </label>
              <label className="ws-calculators__label">
                <span>Household size</span>
                <Input
                  type="number"
                  min={1}
                  value={householdSize}
                  onChange={(event) => setHouseholdSize(Number(event.target.value))}
                />
              </label>
              <div className="ws-calculators__savings">
                <p className="ws-calculators__savings-label">Conservative</p>
                <p className="ws-calculators__savings-value">
                  ${savingsEstimate.toFixed(0)} saved per month
                </p>
                <p className="ws-calculators__savings-note">
                  Estimated {(savingsRate * 100).toFixed(0)}% usage reduction.
                </p>
              </div>
              <RouterLink className="ws-calculators__link-button" to="/dashboard">
                Start Savings Plan
              </RouterLink>
            </div>
          </Card>
        </div>

        <div className="ws-calculators__insight-grid">
          <div className="ws-card">
            <div className="ws-calculators__insight-content">
              <p className="ws-calculators__eyebrow">Smart Insights</p>
              <h2 className="ws-card__title">
                Unlock AI-backed recommendations instantly
              </h2>
              <p className="ws-calculators__lede">
                Use one credit to generate a tailored insight from your calculator inputs.
              </p>
              <Button
                type="button"
                onClick={handleGenerateInsight}
                disabled={aiLoading}
                className="ws-calculators__insight-button"
              >
                {aiLoading ? "Generating insight..." : "Get Personalized Insight"}
              </Button>
              {aiError ? <p className="ws-calculators__error">{aiError}</p> : null}
            </div>
          </div>

          <div
            className={`ws-calculators__insight-card ${aiInsight ? "is-filled" : ""}`}
          >
            {aiInsight ? (
              <div className="ws-calculators__insight-shell">
                <p className="ws-calculators__insight-title">{aiInsight.insight}</p>
                <p className="ws-calculators__insight-note">{aiInsight.reference}</p>
                <Button type="button" className="ws-calculators__insight-cta">
                  {aiInsight.cta}
                </Button>
              </div>
            ) : (
              <div className="ws-calculators__insight-empty">
                <p className="ws-calculators__insight-empty-title">No insight yet.</p>
                <p className="ws-calculators__insight-empty-text">
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
