import { useEffect, useMemo, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink, useLocation, useNavigate } from "./router";
import UsageLineChart from "../components/UsageLineChart";
import { addSavingsPlanItem, getAnalysisHistory } from "../utils/dashboard";

type AnalyzeState = {
  mode?: "upload" | "demo" | "manual";
  fileName?: string;
};

const Analyze = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as AnalyzeState;
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [alertExpanded, setAlertExpanded] = useState<string | null>(null);
  const [tipNotice, setTipNotice] = useState<string | null>(null);

  const isDemo = state.mode === "demo";
  const isManual = state.mode === "manual";
  const hasUpload = state.mode === "upload" || Boolean(state.fileName);
  const hasMode = isDemo || isManual || hasUpload;

  const metaTitle = !hasMode
    ? "Analyze your water bill | WaterShortcut"
    : complete
      ? "Water bill analysis results | WaterShortcut"
      : "AI water bill analysis in progress | WaterShortcut";

  const metaDescription = !hasMode
    ? "Upload a water bill PDF, try a demo bill, or enter totals manually to get a clear savings plan."
    : complete
      ? "Your water bill insights are ready: spikes, tier jumps, and the fastest ways to save."
      : "Watch AI water bill analysis progress and see insights that help you save water and money.";

  usePageMeta({
    title: metaTitle,
    description: metaDescription,
    canonicalPath: "/analyze-water-bill",
  });
  const latestAnalysis = useMemo(() => getAnalysisHistory()[0] ?? null, []);
  const spikes = useMemo(() => {
    if (!latestAnalysis) return [];
    return latestAnalysis.usageHistory
      .map((point, index) => ({ index, usage: point.usage, average: point.average }))
      .filter((point) => point.usage > point.average * 1.25)
      .map((point) => point.index);
  }, [latestAnalysis]);

  const modeLabel = useMemo(() => {
    if (state.mode === "demo") return "Demo bill";
    if (state.mode === "manual") return "Manual entry";
    if (state.fileName) return `Uploaded: ${state.fileName}`;
    return hasMode ? "Uploaded bill" : "No bill selected yet";
  }, [hasMode, state.mode, state.fileName]);

  const heroEyebrow = !hasMode
    ? "Start your analysis"
    : complete
      ? "Analysis complete"
      : "Analysis in progress";
  const heroTitle = complete
    ? isDemo
      ? "Demo insights are ready."
      : isManual
        ? "Manual insights are ready."
        : "Your bill insights are ready."
    : isDemo
      ? "Reviewing the demo bill."
      : isManual
        ? "Preparing your manual insights."
        : hasUpload
          ? "We’re reading your bill with care."
          : "Ready when you are.";

  const heroSupport = complete
      ? isDemo
      ? "See how things change with a real bill upload."
      : isManual
        ? "Upload a bill later to refine the insights."
        : "Keep the momentum going with extra tools below."
    : hasMode
      ? "We translate usage tiers, spikes, and leak signals into clear actions."
      : "Pick a mode to start your analysis.";

  useEffect(() => {
    if (!hasMode) {
      setProgress(0);
      setComplete(false);
      return;
    }
    let current = 0;
    setComplete(false);
    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;
      if (current >= 100) {
        current = 100;
        window.clearInterval(interval);
        setComplete(true);
      }
      setProgress(current);
    }, 450);
    return () => window.clearInterval(interval);
  }, [hasMode, state.mode, state.fileName]);

  const handleTipSave = (title: string, description: string) => {
    addSavingsPlanItem({
      id: `${title.toLowerCase().replace(/\\s+/g, "-")}`,
      title,
      description,
      createdAt: new Date().toISOString(),
      source: "Community tips",
    });
    setTipNotice(`Saved “${title}” to your dashboard plan.`);
  };

  return (
    <section className="ws-page" aria-labelledby="analysis-title">
      <div className="ws-hero">
        <p className="eyebrow">{heroEyebrow}</p>
        <h1 id="analysis-title">{heroTitle}</h1>
        <p>{heroSupport}</p>
        <p>{modeLabel}</p>
        {isDemo && (
          <div className="ws-demo-cta">
            <p>Want custom insights? Upload your own bill for a tailored plan.</p>
            <button className="ws-button-secondary" type="button" onClick={() => navigate("/")}>
              Upload my bill
            </button>
          </div>
        )}
      </div>

      {!hasMode ? (
        <div className="ws-progress" role="status" aria-live="polite">
          <h2>Start your analysis</h2>
          <p>Upload a bill, try the demo bill, or use manual entry to generate insights.</p>
          <div className="ws-tool-grid">
            <button className="ws-button" type="button" onClick={() => navigate("/")}> 
              Upload a bill
            </button>
            <button
              className="ws-button-secondary"
              type="button"
              onClick={() => navigate("/analyze-water-bill", { state: { mode: "demo" } })}
            >
              Try demo bill
            </button>
            <button
              className="ws-button-secondary"
              type="button"
              onClick={() => navigate("/manual-entry")}
            >
              Manual entry
            </button>
          </div>
        </div>
      ) : !complete ? (
        <div className="ws-progress" role="status" aria-live="polite">
          <p>Analyzing usage tiers, spikes, and leak signals…</p>
          <progress value={progress} max={100} aria-label="Analysis progress" />
          <p>{progress}% complete</p>
        </div>
      ) : (
        <>
          <div className="ws-progress" role="status" aria-live="polite">
            <h2>Insights checklist</h2>
            <ul className="ws-checklist">
              <li>
                <strong>Detected leaks:</strong> No active leaks detected, but bathroom faucets show
                above-average flow. Confirm overnight meter stability.
              </li>
              <li>
                <strong>Tier-jump warning:</strong> Your next billing tier triggers at +9% usage—set
                a daily target to avoid the jump.
              </li>
              <li>
                <strong>Potential savings:</strong> Trim 1.8k gallons/month by tightening irrigation
                windows and swapping to a low-flow showerhead.
              </li>
              <li>
                <strong>Next actions:</strong> Schedule a 15-minute leak patrol, request a free
                utility audit, and monitor weekend usage.
              </li>
            </ul>
          </div>

          <div className="ws-progress" aria-label="Deeper tools">
            <h2>Go deeper</h2>
            <div className="ws-tool-grid">
              <a href="#usage-insights">Usage insights</a>
              <a href="#abnormality-alerts">Abnormality alerts</a>
              <a href="#community-tips">Community tips</a>
            </div>
          </div>

          <div id="usage-insights" className="ws-progress">
            <h3>Usage insights</h3>
            {latestAnalysis ? (
              <>
                <p className="ws-subtitle">
                  Compare your last 12 months to similar homes and spot summertime spikes.
                </p>
                <UsageLineChart
                  data={latestAnalysis.usageHistory}
                  title="Last 12 months of water use"
                  highlightIndexes={spikes}
                />
                <p>
                  {latestAnalysis.savingsSummary} Shift watering to early mornings to avoid heat
                  loss.
                </p>
              </>
            ) : (
              <p className="ws-subtitle">
                No recent analysis yet. Upload a bill to unlock personalized usage insights.
              </p>
            )}
          </div>
          <div id="abnormality-alerts" className="ws-progress">
            <h3>Abnormality alerts</h3>
            {latestAnalysis ? (
              <div className="ws-alert-grid">
                {latestAnalysis.alerts.map((alert) => (
                  <div key={alert.id} className="ws-alert-card">
                    <div className="ws-alert-header">
                      <span className="ws-alert-icon" aria-hidden="true">
                        {alert.title.toLowerCase().includes("leak") ? "💧" : "📈"}
                      </span>
                      <div>
                        <p>{alert.title}</p>
                        <button
                          className="ws-button-secondary"
                          type="button"
                          onClick={() =>
                            setAlertExpanded((prev) => (prev === alert.id ? null : alert.id))
                          }
                        >
                          View details
                        </button>
                      </div>
                    </div>
                    {alertExpanded === alert.id && (
                      <p className="ws-subtitle">{alert.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="ws-subtitle">
                Run an analysis to see leak alerts, tier jumps, and wastewater anomalies.
              </p>
            )}
          </div>
          <div id="community-tips" className="ws-progress">
            <h3>Community tips</h3>
            <p className="ws-subtitle">
              Tips crowdsourced from neighbors, plumbers, and utility experts.
            </p>
            <div className="ws-tip-grid">
              {[
                {
                  title: "Use a broom instead of a hose",
                  description:
                    "Sweep driveways and patios to save up to 150 gallons per cleanup.",
                },
                {
                  title: "Install low-flow showerheads",
                  description:
                    "Switch to WaterSense showerheads to cut shower use by ~20%.",
                },
                {
                  title: "Check toilet flappers monthly",
                  description:
                    "Silent leaks can waste 200 gallons a day. Replace worn flappers early.",
                },
                {
                  title: "Group laundry into full loads",
                  description:
                    "Running full loads trims wastewater charges and keeps Tier 2 usage lower.",
                },
              ].map((tip) => (
                <article key={tip.title} className="ws-tip-card">
                  <h4>{tip.title}</h4>
                  <p className="ws-subtitle">{tip.description}</p>
                  <button
                    className="ws-button-secondary"
                    type="button"
                    onClick={() => handleTipSave(tip.title, tip.description)}
                  >
                    Save to My Plan
                  </button>
                </article>
              ))}
            </div>
            {tipNotice && <p className="ws-subtitle" aria-live="polite">{tipNotice}</p>}
            <RouterLink className="ws-footer-link" to="/research">
              Research rebates and alerts →
            </RouterLink>
          </div>

          <div id="more-tools" className="ws-progress">
            <h2>More tools</h2>
            <p>Keep exploring while your insights are fresh.</p>
            <div className="ws-tool-grid">
              <RouterLink to="/water-iq">Take the Water IQ Challenge</RouterLink>
              <RouterLink to="/water-iq">Water IQ Challenge</RouterLink>
              <RouterLink to="/research">Build a research plan</RouterLink>
              <RouterLink to="/eject-water">Open Eject Water</RouterLink>
            </div>
          </div>
        </>
      )}

      <div className="ws-progress" aria-label="Next steps">
        <h2>Keep exploring</h2>
        <div className="ws-tool-grid">
          <button className="ws-button" type="button" onClick={() => navigate("/research")}>
            Build a research plan
          </button>
          <button className="ws-button-secondary" type="button" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
};

export default Analyze;
