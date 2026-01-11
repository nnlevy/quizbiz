import { useCallback, useEffect, useMemo, useState } from "react";

import "../react-app/App.css";
import { decodeToken, hookFactById, moveMeta, personaFor } from "../lib/waterIq";
import WaterIQQuiz from "../react-app/components/WaterIQQuiz";
import { useCredits } from "../react-app/context/CreditsContext";

const COMPLETION_KEY = "ws_water_iq_completed";
const VISIT_KEY = "ws_water_iq_visited";
const SCORE_REWARD_KEY = "ws_water_iq_score_reward_claimed";

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
  const { refund } = useCredits();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const payload = useMemo(() => {
    if (!decoded) return null;
    const persona = personaFor(decoded.score);
    const hook = hookFactById(decoded.hook);
    const moves = decoded.moves.map((id) => ({ id, ...moveMeta(id) }));
    return { persona, hook, moves };
  }, [decoded]);

  if (!decoded || !payload) return <WaterIqInvalid />;

  const badgeLabel = decoded.badge.replace(/_/g, " ");
  const challengeLink = `/water-iq?ref=${token}`;
  const sharePageUrl = `/water-iq/r/${token}`;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `/water-iq/r/${token}`;
  const scoreAngle = Math.min(Math.max(decoded.score, 0), 10) * 36;
  const shareText = `I scored ${decoded.score}/10 on WaterShortcut’s Water IQ (${badgeLabel}). ${payload.hook.short}`;

  const rewardShareCredit = useCallback(
    (channel: string) => {
      const rewardKey = `ws_water_iq_share_reward_${token}`;
      try {
        if (window.localStorage.getItem(rewardKey) === "true") {
          setShareStatus("Thanks for sharing—credit already claimed.");
          return;
        }
        window.localStorage.setItem(rewardKey, "true");
      } catch {
        // Ignore storage errors.
      }
      refund(1);
      setShareStatus(`Shared via ${channel}. +1 credit added.`);
    },
    [refund, token],
  );

  const handleCopyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      rewardShareCredit("copy link");
    } catch {
      setShareStatus("Copy failed. Please select the link manually.");
    }
  }, [rewardShareCredit, shareText, shareUrl]);

  const handleCopyDraft = useCallback(async () => {
    const draft = draftText ? `${draftText}\n\n${shareUrl}` : `${shareText} ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(draft);
      rewardShareCredit("draft share");
    } catch {
      setShareStatus("Copy failed. Please select the draft text manually.");
    }
  }, [draftText, rewardShareCredit, shareText, shareUrl]);

  const handleGenerateDraft = useCallback(() => {
    const draft = `🌊 I just scored ${decoded.score}/10 on WaterShortcut’s Water IQ (${badgeLabel}).\n\n${payload.hook.short}\n\nTry it and tag 3 friends: ${challengeLink}`;
    setDraftText(draft);
  }, [badgeLabel, challengeLink, decoded.score, payload.hook.short]);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${shareText} ${shareUrl}`,
  )}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`;

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
          <div
            className="water-iq-score-circle"
            style={{ ["--score-angle" as string]: `${scoreAngle}deg` }}
            aria-label="Score"
          >
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
            <a className="wsBtnGhost" href="#results-dashboard">
              View results dashboard
            </a>
            <a className="wsBtnGhost" href="/">
              Return home
            </a>
          </div>
        </div>

        <div className="water-iq-share">
          <h3>Share your score</h3>
          <p className="wsMuted">
            Earn +1 credit when you share on social. Pick a channel or copy the link.
          </p>
          <div className="water-iq-share__actions">
            <a
              className="wsBtnPrimary wsBtnPrimary--pill"
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => rewardShareCredit("X")}
            >
              Share on X
            </a>
            <a
              className="wsBtnGhost"
              href={linkedInShareUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => rewardShareCredit("LinkedIn")}
            >
              Share on LinkedIn
            </a>
            <button type="button" className="wsBtnGhost" onClick={handleCopyShare}>
              Copy share link
            </button>
            <a className="wsBtnGhost" href={sharePageUrl}>
              Compare with friends
            </a>
          </div>
          {shareStatus && <div className="wsMuted">{shareStatus}</div>}
        </div>

        <div className="water-iq-draft">
          <div className="water-iq-draft__header">
            <h3>AI-assisted post draft</h3>
            <button type="button" className="wsBtnGhost" onClick={handleGenerateDraft}>
              Generate draft
            </button>
          </div>
          <textarea
            className="water-iq-draft__text"
            rows={5}
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            placeholder="Generate a post draft to share your results."
          />
          <div className="water-iq-draft__actions">
            <button type="button" className="wsBtnPrimary wsBtnPrimary--pill" onClick={handleCopyDraft}>
              Copy draft + link
            </button>
          </div>
        </div>

        <div className="water-iq-dashboard" id="results-dashboard">
          <div className="water-iq-dashboard__header">
            <h3>Results dashboard</h3>
            <p className="wsMuted">
              Keep your Water IQ badge handy and inspire friends to compare scores.
            </p>
          </div>
          <div className="water-iq-badge-grid">
            <div className="water-iq-badge-card is-earned">
              <span className="water-iq-badge-emoji" aria-hidden="true">
                💧
              </span>
              <div>
                <strong>{badgeLabel}</strong>
                <span className="wsMuted">Current badge</span>
              </div>
            </div>
            <div className="water-iq-badge-card">
              <span className="water-iq-badge-emoji" aria-hidden="true">
                🔎
              </span>
              <div>
                <strong>Leak Detective</strong>
                <span className="wsMuted">Finish a leak check to unlock</span>
              </div>
            </div>
            <div className="water-iq-badge-card">
              <span className="water-iq-badge-emoji" aria-hidden="true">
                🌿
              </span>
              <div>
                <strong>Garden Guardian</strong>
                <span className="wsMuted">Share your score to unlock</span>
              </div>
            </div>
          </div>
          <div className="water-iq-dashboard__actions">
            <a className="wsBtnPrimary wsBtnPrimary--pill" href={challengeLink}>
              Challenge 3 friends
            </a>
            <a className="wsBtnGhost" href={challengeLink}>
              Copy share link
            </a>
          </div>
          <div className="wsMuted" style={{ fontSize: 12 }}>
            Your dashboard is private until you share it.
          </div>
        </div>
      </div>
    </section>
  );
};

const WaterIqPage = () => {
  const { refund } = useCredits();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
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

  const handleQuizComplete = useCallback(
    (payload: { score: number; total: number }) => {
      const perfectScore = payload.total > 0 && payload.score === payload.total;
      const highScore = payload.total > 0 && payload.score >= 8;
      let rewardAlreadyClaimed = false;
      if (perfectScore || highScore) {
        try {
          rewardAlreadyClaimed = window.localStorage.getItem(SCORE_REWARD_KEY) === "true";
        } catch {
          rewardAlreadyClaimed = hasCompletedQuiz;
        }
      }

      if ((perfectScore || highScore) && rewardAlreadyClaimed) {
        setRewardMessage("Great score! Your WaterShortcut credit reward is already claimed.");
      } else if (perfectScore) {
        refund(2);
        setRewardMessage("Perfect score! You just earned +2 WaterShortcut credits.");
        try {
          window.localStorage.setItem(SCORE_REWARD_KEY, "true");
        } catch {
          // Ignore storage failures (privacy mode, etc.).
        }
      } else if (highScore) {
        refund(1);
        setRewardMessage("Nice work! You earned +1 WaterShortcut credit for a top score.");
        try {
          window.localStorage.setItem(SCORE_REWARD_KEY, "true");
        } catch {
          // Ignore storage failures (privacy mode, etc.).
        }
      } else {
        setRewardMessage(null);
      }
      // Persist completion so ads + credits stay visible on future visits.
      setHasCompletedQuiz(true);
      try {
        window.localStorage.setItem(COMPLETION_KEY, "true");
      } catch {
        // Ignore storage failures (privacy mode, etc.).
      }
    },
    [hasCompletedQuiz, refund],
  );

  useEffect(() => {
    if (tokenMatch) {
      setHasCompletedQuiz(true);
    }
  }, [tokenMatch]);

  return (
    <div className="app">
      <main className="main-wrapper">
        {/* Hidden nav keeps the Water IQ route discoverable for crawlers. */}
        <nav className="ws-hidden-nav" aria-hidden="true">
          <a href="/water-iq">Water IQ Challenge</a>
        </nav>
        {tokenMatch ? (
          <WaterIqResult token={tokenMatch[1]} />
        ) : (
          <WaterIQQuiz onComplete={handleQuizComplete} rewardMessage={rewardMessage} />
        )}
      </main>
    </div>
  );
};

export default WaterIqPage;
