import { useEffect, useMemo, useRef, useState } from "react";

import { logEvent } from "../analytics";
import {
  assignWaterIqBadge,
  buildInsightCacheKey,
  computeWaterIqScore,
  normalizeViralInputs,
} from "../../lib/viralWaterIq";
import type { ViralWaterIqInputs, ViralWaterIqBadge } from "../../lib/viralWaterIq";

type ViralWaterIqCardProps = {
  inputs: ViralWaterIqInputs;
  isActive: boolean;
  headline?: string;
  subhead?: string;
  contextNote?: string;
  shareCtaLabel?: string;
  viewLabel?: string;
  footnote?: string;
  analyticsContext?: string;
};

type InsightState = {
  status: "idle" | "loading" | "ready" | "error";
  insight: string | null;
  shareUrl: string | null;
  badge: ViralWaterIqBadge | null;
  score: number;
};

const ViralWaterIqCard = ({
  inputs,
  isActive,
  headline = "Water IQ Snapshot",
  subhead = "Your habits translated into a shareable score.",
  contextNote,
  shareCtaLabel = "Share your result",
  viewLabel = "Compare with friends",
  footnote = "Private by default. Your link is anonymous and only includes the score and insight.",
  analyticsContext = "default",
}: ViralWaterIqCardProps) => {
  const normalized = useMemo(() => normalizeViralInputs(inputs), [inputs]);
  const score = useMemo(() => computeWaterIqScore(normalized), [normalized]);
  const badge = useMemo(() => assignWaterIqBadge(normalized, score), [normalized, score]);
  const [state, setState] = useState<InsightState>({
    status: "idle",
    insight: null,
    shareUrl: null,
    badge: null,
    score,
  });
  const [shareLabel, setShareLabel] = useState(shareCtaLabel);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const key = buildInsightCacheKey(normalized, score, badge.id);
    if (lastKeyRef.current === key && state.status !== "error") {
      return;
    }
    lastKeyRef.current = key;
    setState((prev) => ({ ...prev, status: "loading", score }));

    const loadInsight = async () => {
      try {
        const response = await fetch("/api/viral/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized),
        });
        if (!response.ok) {
          throw new Error("Insight request failed");
        }
        const data = (await response.json()) as {
          insight: string;
          shareUrl: string;
          badge: ViralWaterIqBadge;
          score: number;
        };
        setState({
          status: "ready",
          insight: data.insight,
          shareUrl: data.shareUrl,
          badge: data.badge,
          score: data.score,
        });
        logEvent("viral_score_generated", { score: data.score, context: analyticsContext });
      } catch (error) {
        console.error(error);
        setState((prev) => ({ ...prev, status: "error" }));
      }
    };

    void loadInsight();
  }, [analyticsContext, badge.id, isActive, normalized, score, state.status]);

  const handleShare = async () => {
    if (!state.shareUrl) {
      return;
    }
    const shareUrl = state.shareUrl.startsWith("http")
      ? state.shareUrl
      : `${window.location.origin}${state.shareUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Water IQ Snapshot",
          text: state.insight ?? "",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareLabel("Link ready");
      setTimeout(() => setShareLabel(shareCtaLabel), 1500);
    } catch {
      setShareLabel("Share failed");
      setTimeout(() => setShareLabel(shareCtaLabel), 1500);
    }
  };

  if (!isActive) {
    return null;
  }

  const resolvedBadge = state.badge ?? badge;
  const resolvedScore = state.score;

  return (
    <section className="viral-iq-card" aria-live="polite">
      <div className="viral-iq-card__header">
        <p className="eyebrow">{headline}</p>
        <h3>{subhead}</h3>
        {contextNote && <p className="viral-iq-context">{contextNote}</p>}
      </div>
      <div className="viral-iq-card__body">
        <div className="viral-iq-metric">
          <span className="viral-iq-label">Score</span>
          <span className="viral-iq-score">{resolvedScore}/100</span>
        </div>
        <div className="viral-iq-metric">
          <span className="viral-iq-label">Badge</span>
          <span className="viral-iq-badge">{resolvedBadge.label}</span>
        </div>
        <div className="viral-iq-insight">
          {state.status === "loading" && "Building a quick insight from your inputs..."}
          {state.status === "error" &&
            "We can still share your score. Tap to compare with friends and try again."}
          {state.status === "ready" && state.insight}
          {state.status === "idle" && "Interact with a tool to reveal your insight."}
        </div>
      </div>
      <div className="viral-iq-card__actions">
        <button type="button" className="secondary-button" onClick={handleShare}>
          {shareLabel}
        </button>
        {state.shareUrl && (
          <a className="ghost-button" href={state.shareUrl}>
            {viewLabel}
          </a>
        )}
      </div>
      <p className="viral-iq-footnote">{footnote}</p>
    </section>
  );
};

export default ViralWaterIqCard;
