import { useCallback, useEffect, useMemo, useState } from "react";

import "../react-app/App.css";
import { decodeToken, hookFactById, moveMeta, personaFor } from "../lib/waterIq";
import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import WaterIQQuiz from "../react-app/components/WaterIQQuiz";
import { useCredits } from "../react-app/context/CreditsContext";
import { useCreditsCheckout } from "../react-app/hooks/useCreditsCheckout";

const COMPLETION_KEY = "ws_water_iq_completed";
const VISIT_KEY = "ws_water_iq_visited";

const WaterIqInvalid = () => (
  <section className="section water-iq">
    <div className="water-iq-card water-iq-card--result">
      <h1 className="water-iq-title">Invalid result link</h1>
      <p className="wsP">This link looks broken. Try the quiz again.</p>
      <a className="wsBtnPrimary" href="/water-iq">
        Go to Water IQ Challenge
      </a>
    </div>
  </section>
);

const WaterIqResult = ({ token }: { token: string }) => {
  const decoded = useMemo(() => decodeToken(token), [token]);

  const payload = useMemo(() => {
    if (!decoded) return null;
    const persona = personaFor(decoded.score);
    const hook = hookFactById(decoded.hook);
    const moves = decoded.moves.map((id) => ({ id, ...moveMeta(id) }));
    return { persona, hook, moves };
  }, [decoded]);

  if (!decoded || !payload) return <WaterIqInvalid />;

  const badgeLabel = decoded.badge.replace(/_/g, " ");

  return (
    <section className="section water-iq">
      <div className="water-iq-card water-iq-card--result">
        <div className="water-iq-result-header">
          <h1 className="water-iq-title">Water IQ Challenge</h1>
          <span className="water-iq-ellipsis" aria-hidden="true">
            •••
          </span>
        </div>
        <div className="water-iq-divider" role="presentation"></div>
        <div className="water-iq-result-meta">
          <div className="water-iq-score-circle" aria-label="Score">
            <div className="water-iq-score-value">
              {decoded.score}
              <span>/10</span>
            </div>
          </div>
          <div className="water-iq-result-copy">
            <div className="water-iq-badge-pill">
              <span className="water-iq-badge-icon" aria-hidden="true">
                💧
              </span>
              {badgeLabel}
            </div>
            <div className="water-iq-fact">{payload.hook.short}</div>
          </div>
        </div>

        <div className="wsExplain">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Your learning delta</div>
          <div className="wsMuted">
            Knowledge delta: {decoded.delta >= 0 ? "+" : ""}
            {decoded.delta}
          </div>
          <div className="wsMuted" style={{ marginTop: 6, fontSize: 12 }}>
            We repeat two questions to measure whether the Impact Reveal changes intuition.
          </div>
        </div>

        <h2 className="wsH2">Your next best steps</h2>
        <div className="wsResultMoves">
          {payload.moves.map((move) => (
            <a key={move.id} className="wsResultMove" href={move.href}>
              <strong>{move.title}</strong>
              <span>Tap to open in WaterShortcut.</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,.10)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Keep the momentum going</h3>
          <p className="wsMuted" style={{ margin: "0 0 10px" }}>
            Share your score or run the quiz again to track progress.
          </p>
          <div className="wsRow">
            <a className="wsBtnPrimary wsBtnPrimary--pill" href="/water-iq">
              Take again
            </a>
            <a className="wsBtnGhost" href="/">
              Return home
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const WaterIqPage = () => {
  const { credits, pulse, setPulse } = useCredits();
  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);
  const { startCheckout } = useCreditsCheckout({ onPulse: triggerCreditPulse });
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/water-iq";
  const tokenMatch = pathname.match(/^\/water-iq\/r\/([^/]+)$/);

  useEffect(() => {
    // Read localStorage to see if this is a first visit and whether the quiz was completed.
    try {
      const completed = window.localStorage.getItem(COMPLETION_KEY) === "true";
      const hasVisited = window.localStorage.getItem(VISIT_KEY) === "true";
      if (!hasVisited) {
        window.localStorage.setItem(VISIT_KEY, "true");
      }
      setHasCompletedQuiz(completed);
    } catch {
      setHasCompletedQuiz(false);
    }
  }, []);

  const handleQuizComplete = useCallback(() => {
    // Persist completion so ads + credits stay visible on future visits.
    setHasCompletedQuiz(true);
    try {
      window.localStorage.setItem(COMPLETION_KEY, "true");
    } catch {
      // Ignore storage failures (privacy mode, etc.).
    }
  }, []);

  useEffect(() => {
    if (tokenMatch) {
      setHasCompletedQuiz(true);
    }
  }, [tokenMatch]);

  return (
    <div className="app">
      <SiteNav
        credits={credits}
        pulse={pulse}
        onCreditsClick={startCheckout}
        hideCredits={!hasCompletedQuiz}
      />
      <main className="main-wrapper">
        {/* Hidden nav keeps the Water IQ route discoverable for crawlers. */}
        <nav className="ws-hidden-nav" aria-hidden="true">
          <a href="/water-iq">Water IQ Challenge</a>
        </nav>
        {tokenMatch ? (
          <WaterIqResult token={tokenMatch[1]} />
        ) : (
          <WaterIQQuiz onComplete={handleQuizComplete} />
        )}
      </main>
      <SiteFooter hideAds={!hasCompletedQuiz} />
    </div>
  );
};

export default WaterIqPage;
