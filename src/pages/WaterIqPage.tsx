import { useEffect, useMemo } from "react";

import { decodeToken, hookFactById, moveMeta, personaFor } from "../lib/waterIq";

const WORKER_STYLES_ID = "ws-worker-styles";
const WORKER_APP_SCRIPT_ID = "ws-worker-app-js";

const ensureWorkerStyles = () => {
  if (document.getElementById(WORKER_STYLES_ID)) return;
  const link = document.createElement("link");
  link.id = WORKER_STYLES_ID;
  link.rel = "stylesheet";
  link.href = "/assets/styles.css";
  document.head.appendChild(link);
};

const waitForScriptLoad = (script: HTMLScriptElement) =>
  new Promise<void>((resolve) => {
    if (script.dataset.loaded === "true") {
      resolve();
      return;
    }
    const readyState = (script as HTMLScriptElement & { readyState?: string }).readyState;
    if (readyState === "complete" || readyState === "loaded") {
      script.dataset.loaded = "true";
      resolve();
      return;
    }
    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
  });

const ensureWorkerScript = () => {
  const existing = document.getElementById(WORKER_APP_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return waitForScriptLoad(existing);
  }
  const script = document.createElement("script");
  script.id = WORKER_APP_SCRIPT_ID;
  script.src = "/assets/app.js";
  script.defer = true;
  const loadPromise = waitForScriptLoad(script);
  document.body.appendChild(script);
  return loadPromise;
};

const useWorkerAssets = () => {
  useEffect(() => {
    ensureWorkerStyles();
    void ensureWorkerScript().then(() => {
      document.dispatchEvent(new Event("DOMContentLoaded"));
    });
  }, []);
};

const WaterIqQuiz = () => (
  <section className="section water-iq">
    <div className="water-iq-card" data-water-iq-root>
      <noscript>
        <h1 className="wsH1">Water IQ Challenge</h1>
        <p className="wsP">This quiz needs JavaScript to run. Please enable it and reload.</p>
        <a className="wsBtnPrimary" href="/water-iq">
          Reload
        </a>
      </noscript>
    </div>
  </section>
);

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
      <div
        className="water-iq-card water-iq-card--result"
        data-water-iq-result
        data-token={token}
        data-persona={payload.persona.code ?? "CS"}
        data-score={decoded.score}
        data-badge={decoded.badge}
        data-delta={decoded.delta}
      >
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
          <div className="wsMuted" data-water-iq-delta>
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
            <a key={move.id} className="wsResultMove" data-water-iq-cta={move.id} href={move.href}>
              <strong>{move.title}</strong>
              <span>Tap to open in WaterShortcut.</span>
            </a>
          ))}
        </div>

        <div className="wsExplain">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Completed a big step?</div>
          <p className="wsMuted">Claim 1 WaterShortcut credit for each top action you finish.</p>
          <div className="wsRow">
            {payload.moves.map((move) => (
              <button key={move.id} className="wsBtnGhost" data-water-iq-reward={move.id}>
                Mark {move.title} done (+1 credit)
              </button>
            ))}
          </div>
          <div className="wsMuted" data-water-iq-reward-status></div>
        </div>

        <div className="wsExplain">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Social proof (transparent)</div>
          <div data-water-iq-social className="wsMuted">
            Loading social proof…
          </div>
          <button className="wsBtnGhost" data-water-iq-share-proof style={{ marginTop: 8 }}>
            Share social proof
          </button>
          <div className="wsMuted" style={{ marginTop: 8, fontSize: 12 }}>
            Note: In constrained contexts, social norms can land differently. See{" "}
            <a
              className="wsLink"
              href="https://www.sciencedirect.com/science/article/pii/S0095069623000700"
              target="_blank"
              rel="noreferrer"
            >
              Brick et al. (2023)
            </a>
            .
          </div>
        </div>

        <div className="wsExplain">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Beat your city average (optional)</div>
          <div className="wsRow" style={{ marginTop: 0 }}>
            <input className="wsNum" data-water-iq-city placeholder="Enter your city" />
            <button className="wsBtnPrimary" data-water-iq-city-submit>
              Compare
            </button>
          </div>
          <div className="wsMuted" data-water-iq-city-result>
            City averages appear once enough people in your city participate.
          </div>
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,.10)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Make it viral (in a good way)</h3>
          <p className="wsMuted" style={{ margin: "0 0 10px" }}>
            Post your score. Tag 3 friends. Beat your city average.
          </p>
          <div className="wsRow">
            <button className="wsBtnPrimary wsBtnPrimary--pill" data-water-iq-share>
              Challenge 3 friends
            </button>
            <button className="wsBtnGhost" data-water-iq-challenge>
              Copy challenge link
            </button>
            <a className="wsBtnGhost" href="/water-iq">
              Take again
            </a>
          </div>
          <div className="wsMuted" style={{ marginTop: 10, fontSize: 12 }}>
            Private by default — you choose if you share.
          </div>
        </div>

        <div className="wsExplain">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Optional follow-up (7–21 days)</div>
          <div className="wsMuted" style={{ marginBottom: 8 }}>
            If you opt in, we’ll send one check-in email. No spam.
          </div>
          <form data-water-iq-followup>
            <div className="wsRow" style={{ marginTop: 0 }}>
              <input className="wsNum" name="email" placeholder="Email address" />
              <select className="wsNum" name="days">
                <option value="7">7-day check-in</option>
                <option value="21">21-day check-in</option>
              </select>
              <button className="wsBtnPrimary" type="submit">
                Schedule
              </button>
            </div>
            <label className="wsRow" style={{ gap: 8 }}>
              <input type="checkbox" name="consent" />
              <span className="wsMuted">I consent to receive one check-in email about my pledge.</span>
            </label>
          </form>
          <div className="wsMuted" data-water-iq-followup-status></div>
        </div>

        <div className="wsFoot">
          <span>We celebrate improvement.</span>
          <span>Private by default.</span>
        </div>
      </div>
    </section>
  );
};

const WaterIqPage = () => {
  useWorkerAssets();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/water-iq";
  const tokenMatch = pathname.match(/^\/water-iq\/r\/([^/]+)$/);

  if (tokenMatch) {
    return <WaterIqResult token={tokenMatch[1]} />;
  }

  return <WaterIqQuiz />;
};

export default WaterIqPage;
