import { useCallback, useEffect, useMemo } from "react";

import { decodeToken, hookFactById, moveMeta, personaFor } from "../lib/waterIq";
import { appJs, stylesCss } from "../worker/assets";
import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import "../react-app/App.css";
import { useCredits } from "../react-app/context/CreditsContext";
import { useCreditsCheckout } from "../react-app/hooks/useCreditsCheckout";

const WORKER_STYLES_ID = "ws-worker-styles";
const WORKER_APP_SCRIPT_ID = "ws-worker-app-js";
const WORKER_INLINE_STYLES_ID = "ws-worker-inline-styles";
const WORKER_INLINE_SCRIPT_ID = "ws-worker-inline-app-js";

const ensureInlineWorkerStyles = () => {
  if (document.getElementById(WORKER_INLINE_STYLES_ID)) return;
  const style = document.createElement("style");
  style.id = WORKER_INLINE_STYLES_ID;
  style.textContent = stylesCss;
  document.head.appendChild(style);
};

const ensureWorkerStyles = () => {
  if (document.getElementById(WORKER_STYLES_ID) || document.getElementById(WORKER_INLINE_STYLES_ID)) {
    return;
  }
  const link = document.createElement("link");
  link.id = WORKER_STYLES_ID;
  link.rel = "stylesheet";
  link.href = "/assets/styles.css";
  link.addEventListener(
    "error",
    () => {
      link.remove();
      ensureInlineWorkerStyles();
    },
    { once: true },
  );
  document.head.appendChild(link);
};

const waitForScriptLoad = (script: HTMLScriptElement) =>
  new Promise<boolean>((resolve) => {
    if (script.dataset.loaded === "true") {
      resolve(true);
      return;
    }
    if (script.dataset.loaded === "false") {
      resolve(false);
      return;
    }
    const readyState = (script as HTMLScriptElement & { readyState?: string }).readyState;
    if (readyState === "complete" || readyState === "loaded") {
      script.dataset.loaded = "true";
      resolve(true);
      return;
    }
    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve(true);
    };
    const handleError = () => {
      script.dataset.loaded = "false";
      resolve(false);
    };
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
  });

const ensureWorkerScript = () => {
  const existing = document.getElementById(WORKER_APP_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    const readyState = (existing as HTMLScriptElement & { readyState?: string }).readyState;
    const hasLoaded =
      existing.dataset.loaded === "true" || readyState === "complete" || readyState === "loaded";
    if (hasLoaded && existing.dataset.loaded !== "true") {
      existing.dataset.loaded = "true";
    }
    return { loadPromise: waitForScriptLoad(existing), alreadyLoaded: hasLoaded };
  }
  const script = document.createElement("script");
  script.id = WORKER_APP_SCRIPT_ID;
  script.src = "/assets/app.js";
  script.defer = true;
  const loadPromise = waitForScriptLoad(script);
  document.body.appendChild(script);
  return { loadPromise, alreadyLoaded: false };
};

const ensureInlineWorkerScript = () => {
  const existing = document.getElementById(WORKER_INLINE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    const readyState = (existing as HTMLScriptElement & { readyState?: string }).readyState;
    const hasLoaded =
      existing.dataset.loaded === "true" || readyState === "complete" || readyState === "loaded";
    if (hasLoaded && existing.dataset.loaded !== "true") {
      existing.dataset.loaded = "true";
    }
    return { loadPromise: waitForScriptLoad(existing), alreadyLoaded: hasLoaded };
  }
  const script = document.createElement("script");
  const blobUrl = URL.createObjectURL(new Blob([appJs], { type: "application/javascript" }));
  script.id = WORKER_INLINE_SCRIPT_ID;
  script.src = blobUrl;
  script.defer = true;
  const loadPromise = waitForScriptLoad(script).then((loaded) => {
    URL.revokeObjectURL(blobUrl);
    return loaded;
  });
  document.body.appendChild(script);
  return { loadPromise, alreadyLoaded: false };
};

const triggerWorkerBoot = (alreadyLoaded: boolean) => {
  if (!alreadyLoaded) {
    document.dispatchEvent(new Event("DOMContentLoaded"));
    return;
  }
  (
    window as typeof window & { __WS_REINIT_WATER_IQ__?: () => void }
  ).__WS_REINIT_WATER_IQ__?.();
};

const useWorkerAssets = () => {
  useEffect(() => {
    ensureWorkerStyles();
    const { loadPromise, alreadyLoaded } = ensureWorkerScript();
    void loadPromise.then((loaded) => {
      if (!loaded) {
        const { loadPromise: inlineLoadPromise } = ensureInlineWorkerScript();
        void inlineLoadPromise.then((inlineLoaded) => {
          if (!inlineLoaded) return;
          triggerWorkerBoot(false);
        });
        return;
      }
      triggerWorkerBoot(alreadyLoaded);
    });
  }, []);
};

const WaterIqQuiz = () => (
  <section className="section water-iq">
    <div className="water-iq-card" data-water-iq-root>
      <h1 className="wsH1">Water IQ Challenge</h1>
      <p className="wsP">Loading the 3-minute quiz…</p>
      <p className="wsMuted">
        If this stays blank, refresh the page or open the challenge in a new tab.
      </p>
      <a className="wsBtnPrimary" href="/water-iq">
        Reload the challenge
      </a>
      <noscript>
        <p className="wsP">This quiz needs JavaScript to run. Please enable it and reload.</p>
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
  const { credits, pulse, setPulse } = useCredits();
  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);
  const { startCheckout } = useCreditsCheckout({ onPulse: triggerCreditPulse });
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/water-iq";
  const tokenMatch = pathname.match(/^\/water-iq\/r\/([^/]+)$/);

  return (
    <div className="app">
      <SiteNav credits={credits} pulse={pulse} onCreditsClick={startCheckout} />
      <main className="main-wrapper">
        {tokenMatch ? <WaterIqResult token={tokenMatch[1]} /> : <WaterIqQuiz />}
      </main>
      <SiteFooter />
    </div>
  );
};

export default WaterIqPage;
