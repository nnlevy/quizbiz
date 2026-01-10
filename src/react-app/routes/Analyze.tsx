import { useEffect, useMemo, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink, useLocation, useNavigate } from "./router";

type AnalyzeState = {
  mode?: "upload" | "demo" | "manual";
  fileName?: string;
};

const Analyze = () => {
  useDocumentTitle("WaterShortcut | Analysis");
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as AnalyzeState;
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const modeLabel = useMemo(() => {
    if (state.mode === "demo") return "Demo bill";
    if (state.mode === "manual") return "Manual entry";
    return state.fileName ? `Uploaded: ${state.fileName}` : "Uploaded bill";
  }, [state.mode, state.fileName]);

  useEffect(() => {
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
  }, [state.mode, state.fileName]);

  return (
    <section className="ws-page" aria-labelledby="analysis-title">
      <div className="ws-hero">
        <p className="eyebrow">Analysis in progress</p>
        <h1 id="analysis-title">We’re reading your bill with care.</h1>
        <p>{modeLabel}</p>
      </div>

      {!complete ? (
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
            <p>
              Track your weekday baseline and compare against weekends to spot silent usage creep.
            </p>
          </div>
          <div id="abnormality-alerts" className="ws-progress">
            <h3>Abnormality alerts</h3>
            <p>
              Set a weekly meter check reminder so sudden spikes are flagged before the next bill.
            </p>
          </div>
          <div id="community-tips" className="ws-progress">
            <h3>Community tips</h3>
            <p>
              Learn what neighbors are doing to save water and check local programs for equipment
              rebates.
            </p>
            <RouterLink className="ws-footer-link" to="/research">
              Research rebates and alerts →
            </RouterLink>
          </div>

          <div id="more-tools" className="ws-progress">
            <h2>More tools</h2>
            <p>Need a quick iPhone fix? Trigger the iOS shortcut that ejects water.</p>
            <RouterLink className="ws-footer-link" to="/eject-water">
              Open Eject Water
            </RouterLink>
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
