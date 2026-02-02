import { type ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import { useLocation } from "./router";
import { useCredits } from "../context/CreditsContext";
import BillAmountStep from "../components/calculators/steps/BillAmountStep";
import DripsPerMinuteStep from "../components/calculators/steps/DripsPerMinuteStep";
import FlowRateStep from "../components/calculators/steps/FlowRateStep";
import HouseholdSizeStep from "../components/calculators/steps/HouseholdSizeStep";
import LeakingFaucetsStep from "../components/calculators/steps/LeakingFaucetsStep";
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

type AiInsight = {
  insight: string;
  reference: string;
  cta: string;
};

const Card = ({ title, children, id }: { title: string; children: ReactNode; id?: string }) => (
  <section
    id={id}
    aria-labelledby={id ? `${id}-title` : undefined}
    className="ws-calculators__card"
  >
    <div className="flex items-center justify-between">
      <h3 id={id ? `${id}-title` : undefined} className="ws-calculators__card-title">
        {title}
      </h3>
    </div>
    {children}
  </section>
);

type StepAction =
  | { type: "NEXT"; maxIndex: number }
  | { type: "BACK" }
  | { type: "GO_TO"; index: number };

const stepReducer = (state: number, action: StepAction) => {
  switch (action.type) {
    case "NEXT":
      return Math.min(state + 1, action.maxIndex);
    case "BACK":
      return Math.max(state - 1, 0);
    case "GO_TO":
      return action.index;
    default:
      return state;
  }
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

  const steps = [
    {
      id: "drips",
      title: "Leak Cost Estimator",
      subtitle: "Track how quickly drips add up.",
      content: <DripsPerMinuteStep value={dripsPerMinute} onChange={setDripsPerMinute} />,
    },
    {
      id: "faucets",
      title: "Leak Cost Estimator",
      subtitle: "How many fixtures are leaking?",
      content: <LeakingFaucetsStep value={leakingFaucets} onChange={setLeakingFaucets} />,
    },
    {
      id: "shower-duration",
      title: "Shower vs. Bath Comparator",
      subtitle: "Measure your shower time.",
      content: <ShowerDurationStep value={showerDuration} onChange={setShowerDuration} />,
    },
    {
      id: "flow-rate",
      title: "Shower vs. Bath Comparator",
      subtitle: "Confirm your flow rate.",
      content: <FlowRateStep value={flowRate} onChange={setFlowRate} />,
    },
    {
      id: "bill-amount",
      title: "Bill Savings Projector",
      subtitle: "Add your latest bill.",
      content: <BillAmountStep value={billAmount} onChange={setBillAmount} />,
    },
    {
      id: "household",
      title: "Bill Savings Projector",
      subtitle: "How many people are in your home?",
      content: <HouseholdSizeStep value={householdSize} onChange={setHouseholdSize} />,
    },
    {
      id: "summary",
      title: "Summary",
      subtitle: "Review your savings opportunities.",
      content: (
        <SummaryStep
          gallonsPerDay={gallonsPerDay}
          gallonsPerMonth={gallonsPerMonth}
          gallonsPerYear={gallonsPerYear}
          showerGallons={showerGallons}
          bathGallons={bathGallons}
          showerCost={showerCost}
          bathCost={bathCost}
          savingsEstimate={savingsEstimate}
          savingsRate={savingsRate}
          tips={tips}
        />
      ),
    },
  ];

  const [stepIndex, dispatch] = useReducer(stepReducer, 0);
  const maxStepIndex = steps.length - 1;
  const currentStep = steps[stepIndex];
  const isSummaryStep = stepIndex === maxStepIndex;
  const progressPercent = ((stepIndex + 1) / steps.length) * 100;

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

        <div className="ws-calculators__stepper">
          <div className="ws-calculators__progress">
            <div className="ws-calculators__progress-header">
              <div>
                <p className="ws-calculators__progress-label">Progress</p>
                <p className="ws-calculators__progress-title">
                  Step {stepIndex + 1} of {steps.length}
                </p>
              </div>
              <div className="ws-calculators__progress-count">
                {currentStep.title}
              </div>
            </div>
            <div className="ws-calculators__progress-track" aria-hidden="true">
              <span
                className="ws-calculators__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <ol className="ws-calculators__progress-steps">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`ws-calculators__progress-step ${
                    index === stepIndex ? "is-active" : ""
                  } ${index < stepIndex ? "is-complete" : ""}`}
                >
                  <span className="ws-calculators__progress-index">{index + 1}</span>
                  <span className="ws-calculators__progress-text">{step.subtitle}</span>
                </li>
              ))}
            </ol>
          </div>

          <Card id={`step-${currentStep.id}`} title={currentStep.title}>
            <div className="ws-calculators__card-body">
              <p className="ws-calculators__step-subtitle">{currentStep.subtitle}</p>
              {currentStep.content}
            </div>
          </Card>

          <div className="ws-calculators__step-actions">
            <button
              type="button"
              className="ws-calculators__ghost-button"
              onClick={() => dispatch({ type: "BACK" })}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            {!isSummaryStep ? (
              <button
                type="button"
                className="ws-calculators__primary-button"
                onClick={() => dispatch({ type: "NEXT", maxIndex: maxStepIndex })}
              >
                {stepIndex === maxStepIndex - 1 ? "View summary" : "Next"}
              </button>
            ) : null}
          </div>
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
