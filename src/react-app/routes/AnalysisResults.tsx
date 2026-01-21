import { useEffect, useMemo, useState } from "react";

import CostBreakdownChart from "../components/CostBreakdownChart";
import UsageLineChart from "../components/UsageLineChart";
import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink, useLocation } from "./router";
import { addSavingsPlanItem, getAnalysisHistory, saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult } from "../utils/analysisTransform";
import { useCreditsModal } from "../context/CreditsModalContext";
import { useSession } from "../context/SessionContext";
import { buildAnalysisShareSvg } from "../utils/shareCard";
import { appendReferralToUrl, fetchReferralToken } from "../utils/referral";
import { ActionButton, ActionLink } from "../components/ActionButton";
import WsImage from "../components/WsImage";

const AnalysisResults = () => {
  usePageMeta({
    title: "AI water bill analysis results | WaterShortcut",
    description:
      "Review your AI water bill analysis results, savings opportunities, and next steps to save water.",
    canonicalPath: "/analysis-results",
  });
  const location = useLocation();
  const [notice, setNotice] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const recordState = location.state as { record?: AnalysisResult; mode?: "upload" | "manual" } | null;
  const record = useMemo<AnalysisResult | null>(() => {
    const stateRecord = recordState?.record;
    if (stateRecord && isAnalysisResult(stateRecord)) {
      return stateRecord;
    }
    const id = location.pathname.split("/analysis-results/")[1] || "";
    const stored = getAnalysisHistory().find((entry) => entry.id === id);
    if (stored) return stored;
    return null;
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (!record) {
      setMissing(true);
      return;
    }
    const mode =
      recordState?.mode ??
      (typeof (record as { mode?: string }).mode === "string"
        ? ((record as { mode?: "upload" | "manual" }).mode ?? "upload")
        : "upload");
    saveAnalysisRecord({
      ...record,
      id: record.analysisId,
      createdAt: new Date().toISOString(),
      mode,
    });
  }, [record, recordState?.mode]);

  const spikes = useMemo(() => {
    if (!record) return [];
    return record.usageHistory
      .map((point, index) => ({ index, usage: point.usage, average: point.average }))
      .filter((point) => point.usage > point.average * 1.25)
      .map((point) => point.index);
  }, [record]);
  const { user } = useSession();
  const { openModal } = useCreditsModal();
  const shareLinkBase =
    typeof window !== "undefined"
      ? `${window.location.origin}/analyze-water-bill`
      : "https://www.watershortcut.com/analyze-water-bill";
  const shareUrl = appendReferralToUrl(shareLinkBase, shareToken);
  const shareText = record
    ? `My AI water bill analysis shows ${record.savingsSummary}`
    : "I just ran an AI water bill analysis with WaterShortcut.";
  const shareImage = useMemo(() => {
    if (!record) return null;
    const svg = buildAnalysisShareSvg({
      usage: record.billingSummary.totalUsage,
      cost: record.billingSummary.totalCost,
      summary: record.savingsSummary,
      linkLabel: "watershortcut.com",
    });
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [record]);

  useEffect(() => {
    if (!record) return;
    fetchReferralToken()
      .then((token) => setShareToken(token))
      .catch(() => setShareToken(null));
  }, [record]);

  const handleSavePlan = () => {
    if (!record) return;
    addSavingsPlanItem({
      id: `${record.analysisId}-summary`,
      title: "Add savings recommendation",
      description: record.savingsSummary,
      createdAt: new Date().toISOString(),
      source: "Analysis results",
    });
    setNotice("Saved to your dashboard savings plan.");
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShareStatus("Share link copied.");
    } catch {
      setShareStatus("Copy failed. Please select the link manually.");
    }
  };

  const shareTargets = useMemo(
    () => ({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`,
      )}`,
      email: `mailto:?subject=${encodeURIComponent("My AI water bill analysis")}&body=${encodeURIComponent(
        `${shareText}\n\n${shareUrl}`,
      )}`,
    }),
    [shareText, shareUrl],
  );

  return (
    <section className="ws-page" aria-labelledby="analysis-results-title">
      <div className="ws-hero">
        <p className="eyebrow">Analysis results</p>
        <h1 id="analysis-results-title">Your water bill insights are ready.</h1>
        <p>
          Review your billing summary, usage charts, and savings opportunities. Your results stay
          available even without an account.
        </p>
      </div>

      {missing && (
        <div className="ws-info-card" role="status">
          <h2>No analysis found</h2>
          <p className="ws-subtitle">
            We couldn&apos;t locate that analysis. Upload a bill or enter details to generate a new
            result.
          </p>
          <div className="ws-tool-grid">
            <RouterLink className="ws-button" to="/">
              Upload a bill
            </RouterLink>
            <RouterLink className="ws-button-secondary" to="/manual-entry">
              Enter manually
            </RouterLink>
          </div>
        </div>
      )}

      {!user && (
        <div className="ws-info-card" role="status">
          <h2>Save this analysis to your dashboard</h2>
          <p className="ws-subtitle">
            Create a free account to sync bill history, alerts, and savings goals across devices.
          </p>
          <div className="ws-tool-grid">
            <button className="ws-button" type="button" onClick={() => openModal()}>
              Create an account
            </button>
            <button
              className="ws-button-secondary"
              type="button"
              onClick={() => openModal()}
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="Billing summary">
        <h2>Billing summary</h2>
        <div className="ws-summary-grid">
          <div>
            <p className="ws-subtitle">Billing period</p>
            <p>{record.billingSummary.billingPeriod}</p>
          </div>
          <div>
            <p className="ws-subtitle">Total usage</p>
            <p>
              {record.billingSummary.totalUsage.value.toLocaleString()}{" "}
              {record.billingSummary.totalUsage.unit}
            </p>
          </div>
          <div>
            <p className="ws-subtitle">Total cost</p>
            <p>${record.billingSummary.totalCost.toFixed(2)}</p>
          </div>
        </div>
        <div className="ws-tier-grid">
          {record.billingSummary.rateTiers.map((tier) => (
            <div key={tier.name} className="ws-tier-card">
              <h3>{tier.name}</h3>
              <p className="ws-subtitle">{tier.usageLimit}</p>
              <p>{tier.rate}</p>
              <p>
                <strong>${tier.cost.toFixed(2)}</strong> charged
              </p>
            </div>
          ))}
        </div>
      </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="Charts">
          <UsageLineChart
            data={record.usageHistory}
            title="Monthly consumption vs. similar homes"
            highlightIndexes={spikes}
          />
          <CostBreakdownChart tiers={record.billingSummary.rateTiers} />
        </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="Savings recommendations">
          <h2>Potential savings</h2>
          <p>{record.savingsSummary}</p>
          <button className="ws-button" type="button" onClick={handleSavePlan}>
            Add to My Savings Plan
          </button>
          {notice && <p className="ws-subtitle" aria-live="polite">{notice}</p>}
        </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="Alerts">
          <h2>Alerts to review</h2>
          <ul className="ws-alert-list">
            {record.alerts.map((alert) => (
              <li key={alert.id}>
                <strong>{alert.title}</strong>
                <p className="ws-subtitle">{alert.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="AI recommendations">
          <h2>Your top 3 moves</h2>
          <div className="ws-result-grid">
            {record.topMoves.map((move) => (
              <article key={move.title} className="ws-result-card">
                <div>
                  <h3>{move.title}</h3>
                  <p>{move.why}</p>
                </div>
                <div className="ws-result-meta">
                  <span>Effort: {move.effort}</span>
                  <span>Impact: {move.impact}</span>
                </div>
                <ul className="ws-result-steps">
                  {move.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <div className="ws-result-actions">
                  <a className="ws-button-secondary" href={move.ctaHref}>
                    {move.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="ws-result-summary">
            <div>
              <h3>What you&apos;re paying for</h3>
              <p>{record.payingFor}</p>
            </div>
            <div>
              <h3>Your next best step</h3>
              <p>{record.nextStep}</p>
            </div>
            {record.confidenceNote && <p className="ws-subtitle">{record.confidenceNote}</p>}
          </div>
        </div>
      )}

      {record && (
        <div className="ws-info-card" aria-label="Share your results">
          <h2>Share your results</h2>
          <p className="ws-subtitle">
            Celebrate your water-saving momentum with a shareable summary card. Every share helps
            more households save water.
          </p>
          <div className="ws-share-grid">
            <div className="ws-share-card">
              <div className="ws-share-card__copy">
                <h3>Water bill insights summary</h3>
                <p>{record.savingsSummary}</p>
                <p className="ws-subtitle">
                  Total usage: {record.billingSummary.totalUsage.value.toLocaleString()}{" "}
                  {record.billingSummary.totalUsage.unit} · Total cost: $
                  {record.billingSummary.totalCost.toFixed(2)}
                </p>
                <p className="ws-subtitle">
                  Your share link includes a referral token so you earn extra credits when friends
                  sign up.
                </p>
                <div className="ws-share-actions" role="group" aria-label="Share actions">
                  <ActionButton type="button" onClick={handleCopyShare}>
                    Copy share link
                  </ActionButton>
                  <ActionLink variant="secondary" href={shareTargets.facebook} target="_blank" rel="noreferrer">
                    Share on Facebook
                  </ActionLink>
                  <ActionLink variant="secondary" href={shareTargets.twitter} target="_blank" rel="noreferrer">
                    Share on X
                  </ActionLink>
                  <ActionLink variant="secondary" href={shareTargets.email}>
                    Share via email
                  </ActionLink>
                </div>
                {shareStatus && <p className="ws-subtitle" role="status">{shareStatus}</p>}
              </div>
              <div className="ws-share-card__media">
                {shareImage && (
                  <WsImage
                    src={shareImage}
                    alt="Water bill analysis summary card preview"
                    width={520}
                    height={292}
                  />
                )}
                {shareImage && (
                  <a className="ws-footer-link" href={shareImage} download="watershortcut-summary.svg">
                    Download summary card
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <details className="ws-info-card">
        <summary>Learn more about your bill</summary>
        <div className="ws-learn-grid">
          <div>
            <h3>Meter reading</h3>
            <p>
              Your meter reading shows how much water passed through the meter during the billing
              period. Compare the read dates to confirm the timeline.
            </p>
          </div>
          <div>
            <h3>Service charges</h3>
            <p>
              These fixed fees cover system maintenance, infrastructure, and account servicing even
              when usage is low.
            </p>
          </div>
          <div>
            <h3>Tier rates</h3>
            <p>
              Tiered pricing charges more per gallon as usage increases. Staying below the next tier
              can keep costs steady.
            </p>
          </div>
        </div>
        <RouterLink className="ws-footer-link" to="/guides/water-bill" reloadDocument>
          Read the full guide →
        </RouterLink>
      </details>
    </section>
  );
};

export default AnalysisResults;
