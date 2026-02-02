import { useEffect, useMemo, useReducer, useState } from "react";
import { RouterLink, useLocation } from "./router";
import Button from "../components/Button";
import { useCredits } from "../context/CreditsContext";
import BillAmountStep from "../components/calculators/steps/BillAmountStep";
import FlowRateStep from "../components/calculators/steps/FlowRateStep";
import HouseholdSizeStep from "../components/calculators/steps/HouseholdSizeStep";
import LeakDripsStep from "../components/calculators/steps/LeakDripsStep";
import LeakFaucetsStep from "../components/calculators/steps/LeakFaucetsStep";
import ShowerDurationStep from "../components/calculators/steps/ShowerDurationStep";
import SummaryStep from "../components/calculators/steps/SummaryStep";
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

const calculatorSteps = [
  { id: "drips", title: "Leak rate" },
  { id: "faucets", title: "Leaking faucets" },
  { id: "shower", title: "Shower duration" },
  { id: "flow", title: "Flow rate" },
  { id: "bill", title: "Monthly bill" },
  { id: "size", title: "Household size" },
  { id: "summary", title: "Summary" },
] as const;

type StepId = (typeof calculatorSteps)[number]["id"];

type StepAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GOTO"; index: number };

const stepReducer = (state: number, action: StepAction) => {
  switch (action.type) {
    case "NEXT":
      return Math.min(state + 1, calculatorSteps.length - 1);
    case "BACK":
      return Math.max(0, state - 1);
    case "GOTO":
      return Math.min(Math.max(action.index, 0), calculatorSteps.length - 1);
    default:
      return state;
  }
};

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
  const [stepIndex, dispatch] = useReducer(stepReducer, 0);

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

  const tips = [
    `Repairing ${leakingFaucets} faucet${leakingFaucets === 1 ? "" : "s"} could save about $${(
      gallonsPerYear * GALLON_COST
    ).toFixed(0)} per year.`,
    `Trimming showers by 2 minutes could save roughly $${Math.max(
      0,
      2 * flowRate * GALLON_COST * 30,
    ).toFixed(0)} per month.`,
    `Households of ${householdSize} people often reach a ${(savingsRate * 100).toFixed(
      0,
    )}% reduction by upgrading fixtures.`,
  ];

  const handleGenerateInsight = async () => {
    setAiError(null);
    setAiInsight(null);
    if (credits <= 0) {
      setAiError("You are out of credits. Add more to unlock AI insights.");
      return;
    }
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

  const activeStep = calculatorSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === calculatorSteps.length - 1;

  const handleBillAmountChange = (nextValue: number) => {
    setBillAmount(nextValue);
    setBillOverride(true);
  };

  const renderStep = (step: StepId) => {
    switch (step) {
      case "drips":
        return <LeakDripsStep value={dripsPerMinute} onChange={setDripsPerMinute} />;
      case "faucets":
        return <LeakFaucetsStep value={leakingFaucets} onChange={setLeakingFaucets} />;
      case "shower":
        return <ShowerDurationStep value={showerDuration} onChange={setShowerDuration} />;
      case "flow":
        return <FlowRateStep value={flowRate} onChange={setFlowRate} />;
      case "bill":
        return <BillAmountStep value={billAmount} onChange={handleBillAmountChange} />;
      case "size":
        return <HouseholdSizeStep value={householdSize} onChange={setHouseholdSize} />;
      case "summary":
        return (
          <SummaryStep
            gallonsPerDay={gallonsPerDay}
            gallonsPerMonth={gallonsPerMonth}
            gallonsPerYear={gallonsPerYear}
            showerGallons={showerGallons}
            showerCost={showerCost}
            bathGallons={bathGallons}
            bathCost={bathCost}
            maxSessionGallons={maxSessionGallons}
            savingsEstimate={savingsEstimate}
            savingsRate={savingsRate}
            tips={tips}
          />
        );
      default:
        return null;
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

        <section className="ws-calculators__stepper">
          <div className="ws-calculators__card">
            <div className="ws-calculators__step-header">
              <div>
                <p className="ws-calculators__progress-label">
                  Step {stepIndex + 1} of {calculatorSteps.length}
                </p>
                <h2 className="ws-calculators__step-title">{activeStep.title}</h2>
              </div>
              <div className="ws-calculators__progress-dots">
                {calculatorSteps.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    className={`ws-calculators__progress-dot ${
                      index === stepIndex ? "is-active" : ""
                    }`}
                    onClick={() => dispatch({ type: "GOTO", index })}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="ws-calculators__card-body ws-calculators__step-body">
              {renderStep(activeStep.id)}
            </div>
            <div className="ws-calculators__step-actions">
              <button
                type="button"
                className="ws-calculators__step-button is-secondary"
                onClick={() => dispatch({ type: "BACK" })}
                disabled={isFirstStep}
              >
                Back
              </button>
              {!isLastStep ? (
                <button
                  type="button"
                  className="ws-calculators__step-button"
                  onClick={() => dispatch({ type: "NEXT" })}
                >
                  {stepIndex === calculatorSteps.length - 2 ? "View Summary" : "Next"}
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <div className="ws-calculators__insight-grid">
          <div className="ws-card">
            <div className="ws-calculators__insight-content">
              <p className="ws-calculators__eyebrow">Smart Insights</p>
              <h2 className="ws-card__title">Unlock AI-backed recommendations instantly</h2>
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

          <div className={`ws-calculators__insight-card ${aiInsight ? "is-filled" : ""}`}>
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

        <RouterLink className="ws-calculators__link-button" to="/dashboard">
          Start Savings Plan
        </RouterLink>
      </div>
    </div>
  );
};

export default Calculators;
