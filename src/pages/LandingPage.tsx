import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import "../react-app/App.css";
import { useCredits } from "../react-app/context/CreditsContext";
import { QUESTIONS, type WaterIqMCQ } from "../lib/waterIq";

type Feature = {
  title: string;
  description: string;
  outcome: string;
  href: string;
  cta: string;
};

const features: Feature[] = [
  {
    title: "Scan your bill in minutes",
    description: "Upload a statement and get instant pattern flags.",
    outcome: "Know exactly where your spend spiked.",
    href: "/analyze-water-bill",
    cta: "Analyze now",
  },
  {
    title: "Build a savings plan",
    description: "Pick the fastest fixes that match your home.",
    outcome: "Turn 3 quick wins into monthly savings.",
    href: "/savings-plan",
    cta: "See my plan",
  },
  {
    title: "Spot leaks fast",
    description: "Run a lightweight check to catch quiet waste.",
    outcome: "Stop hidden drips before they grow.",
    href: "/leak-check",
    cta: "Run leak check",
  },
];

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [waterIqStep, setWaterIqStep] = useState(0);
  const [waterIqAnswers, setWaterIqAnswers] = useState<Record<string, string>>({});
  const [isWaterIqTransitioning, setIsWaterIqTransitioning] = useState(false);
  const waterIqTimeoutRef = useRef<number | null>(null);
  const { credits, pulse, setPulse } = useCredits();
  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);
  const handleCreditsClick = useCallback(() => {
    triggerCreditPulse();
    window.location.assign("/credits");
  }, [triggerCreditPulse]);

  const activeFeature = useMemo(() => features[activeIndex], [activeIndex]);
  const waterIqQuestions = useMemo(
    () => QUESTIONS.filter((question): question is WaterIqMCQ => question.kind === "mcq").slice(0, 2),
    [],
  );
  const totalWaterIqQuestions = waterIqQuestions.length;
  const currentWaterIqQuestion = waterIqQuestions[waterIqStep] ?? waterIqQuestions[0];
  const answeredCount = Object.keys(waterIqAnswers).length;
  const waterIqScore = Math.min(answeredCount, totalWaterIqQuestions);
  const waterIqTotalScore = 10;
  const scoreRatio = waterIqTotalScore ? waterIqScore / waterIqTotalScore : 0;
  const scoreCircumference = 2 * Math.PI * 52;
  const scoreDashOffset = scoreCircumference * (1 - scoreRatio);
  const focusAnswer = waterIqAnswers.q_focus;
  const recommendedSteps =
    focusAnswer === "outdoor"
      ? ["Inspect sprinklers", "Refresh watering schedule", "Check irrigation leaks"]
      : focusAnswer === "indoor"
        ? ["Run a leak check", "Install faucet aerators", "Review shower time"]
        : ["Run a leak check", "Tune outdoor schedule", "Analyze your bill"];

  useEffect(
    () => () => {
      if (waterIqTimeoutRef.current) {
        window.clearTimeout(waterIqTimeoutRef.current);
      }
    },
    [],
  );

  const handleWaterIqAnswer = useCallback(
    (optionId: string) => {
      if (!currentWaterIqQuestion || isWaterIqTransitioning) return;
      setWaterIqAnswers((prev) => ({ ...prev, [currentWaterIqQuestion.id]: optionId }));
      if (waterIqStep < totalWaterIqQuestions - 1) {
        setIsWaterIqTransitioning(true);
        waterIqTimeoutRef.current = window.setTimeout(() => {
          setWaterIqStep((prev) => prev + 1);
          setIsWaterIqTransitioning(false);
        }, 300);
      }
    },
    [currentWaterIqQuestion, isWaterIqTransitioning, totalWaterIqQuestions, waterIqStep],
  );

  return (
    <div className="app landing-page">
      <SiteNav credits={credits} pulse={pulse} onCreditsClick={handleCreditsClick} />
      <main className="landing-main">
        <section className="landing-hero">
          <p className="landing-eyebrow">WaterShortcut mobile</p>
          <h1>Cut your water bill in minutes.</h1>
          <p className="landing-subtitle">
            Snap to the savings. Find leaks, track spikes, and build a plan that pays you
            back every month.
          </p>
          <div className="landing-cta">
            <a className="primary-button" href="/analyze-water-bill">
              Start with my bill
            </a>
            <a className="secondary-button" href="/calculators">
              Try a calculator
            </a>
            <a className="secondary-button" href="/water-iq">
              Take the Water IQ Challenge
            </a>
          </div>
          <div className="landing-proof">
            <span>2-minute setup</span>
            <span>•</span>
            <span>Mobile-first</span>
            <span>•</span>
            <span>Actionable next steps</span>
          </div>
        </section>

        <section className="landing-water-iq" aria-label="Water IQ Challenge preview">
          <div className="landing-section-heading">
            <h2>Try the first Water IQ Challenge question.</h2>
            <p>Answer once and you will glide into question two with a live score preview.</p>
          </div>
          <div className="landing-water-iq-grid">
            <div
              className={`landing-water-iq-quiz ${isWaterIqTransitioning ? "is-transitioning" : ""}`}
              aria-live="polite"
            >
              <p className="landing-water-iq-progress">
                Question {Math.min(waterIqStep + 1, totalWaterIqQuestions)} of {totalWaterIqQuestions}
              </p>
              <h3 className="landing-water-iq-question">{currentWaterIqQuestion?.prompt}</h3>
              <div className="landing-water-iq-options" role="group" aria-label="Water IQ answer choices">
                {currentWaterIqQuestion?.options.map((option) => {
                  const isSelected =
                    currentWaterIqQuestion && waterIqAnswers[currentWaterIqQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`landing-water-iq-option ${isSelected ? "is-selected" : ""}`}
                      aria-pressed={isSelected}
                      onClick={() => handleWaterIqAnswer(option.id)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="landing-water-iq-cta">
                {waterIqStep >= totalWaterIqQuestions - 1 ? (
                  <a className="primary-button" href="/water-iq">
                    Continue the Water IQ Challenge
                  </a>
                ) : (
                  <span>Tap an answer to continue.</span>
                )}
              </div>
            </div>
            <div className="landing-water-iq-score">
              <svg viewBox="0 0 260 200" role="img" aria-label="Water IQ score preview">
                <defs>
                  <linearGradient id="waterIqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="80" r="52" fill="none" stroke="rgba(148, 197, 255, 0.2)" strokeWidth="12" />
                <circle
                  cx="70"
                  cy="80"
                  r="52"
                  fill="none"
                  stroke="url(#waterIqGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${scoreCircumference} ${scoreCircumference}`}
                  strokeDashoffset={scoreDashOffset}
                />
                <text x="70" y="78" textAnchor="middle" fontSize="18" fill="#f8fafc" fontWeight="700">
                  {waterIqScore}/{waterIqTotalScore}
                </text>
                <text x="70" y="98" textAnchor="middle" fontSize="10" fill="rgba(226, 232, 240, 0.7)">
                  Score preview
                </text>
                <text x="140" y="42" fontSize="12" fill="rgba(226, 232, 240, 0.7)">
                  Recommended next steps
                </text>
                {recommendedSteps.map((step, index) => (
                  <g key={step}>
                    <circle cx="140" cy={70 + index * 24} r="4" fill="#7dd3fc" />
                    <text x="152" y={74 + index * 24} fontSize="12" fill="#f8fafc">
                      {step}
                    </text>
                  </g>
                ))}
              </svg>
              <p className="landing-water-iq-caption">
                Keep going to unlock your full Water IQ score and a tailored action plan.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-interactive" aria-label="Interactive highlights">
          <div className="landing-section-heading">
            <h2>Tap to choose your fastest win.</h2>
            <p>Each card animates with the outcome you will see first.</p>
          </div>
          <div className="landing-feature-grid" role="list">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                className={`landing-feature-card ${index === activeIndex ? "active" : ""}`}
                type="button"
                role="listitem"
                onClick={() => setActiveIndex(index)}
              >
                <span className="feature-title">{feature.title}</span>
                <span className="feature-description">{feature.description}</span>
              </button>
            ))}
          </div>
          <div className="landing-feature-detail" aria-live="polite">
            <p className="feature-outcome">{activeFeature.outcome}</p>
            <a className="primary-button" href={activeFeature.href}>
              {activeFeature.cta}
            </a>
          </div>
        </section>

        <section className="landing-quick-actions">
          <h2>Only the essentials, all in one place.</h2>
          <div className="landing-action-grid">
            <div className="landing-action-tile">
              <h3>Bill clarity</h3>
              <p>See where your usage jumps with a quick scan.</p>
            </div>
            <div className="landing-action-tile">
              <h3>Leak confidence</h3>
              <p>Catch silent leaks before they become expensive.</p>
            </div>
            <div className="landing-action-tile">
              <h3>Instant tools</h3>
              <p>Use fast calculators to estimate savings now.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LandingPage;
