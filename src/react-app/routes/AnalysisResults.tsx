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
  }, [location.pathname, recordState?.record]);

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

  const tierColorClass = (index: number, total: number) => {
    if (total <= 1) return "var(--ws-color-primary)";
    if (index === 0) return "var(--ws-color-primary)";
    if (index === total - 1) return "var(--ws-color-error)";
    return "var(--ws-color-secondary)";
  };

  return (
    <section className="ws-page" aria-labelledby="analysis-results-title">
      <section className="ws-hero ws-hero-layout" aria-labelledby="analysis-results-title">
        <div className="ws-hero-copy">
          <p className="eyebrow">Analysis results</p>
          <h1 id="analysis-results-title">Your water bill insights are ready.</h1>
          <p className="ws-hero-lede">
            Review your billing summary, usage charts, and savings opportunities. Your results stay
            available even without an account.
          </p>
        </div>
      </section>

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

      {record && (
        <section className="ws-section" aria-labelledby="billing-summary-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>analytics</span>
              Billing overview
            </p>
            <h2 id="billing-summary-title" className="ws-section-title">Billing summary</h2>
          </div>
          <div className="ws-info-card" aria-label="Billing summary">
            <div className="ws-summary-grid">
              <div>
                <p className="ws-subtitle" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.1rem", color: "var(--ws-color-primary)" }}>calendar_month</span>
                  Billing period
                </p>
                <p className="ws-data">{record.billingSummary.billingPeriod}</p>
              </div>
              <div>
                <p className="ws-subtitle" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.1rem", color: "var(--ws-color-tertiary)" }}>water_drop</span>
                  Total usage
                </p>
                <p className="ws-data">
                  {record.billingSummary.totalUsage.value.toLocaleString()}{" "}
                  {record.billingSummary.totalUsage.unit}
                </p>
              </div>
              <div>
                <p className="ws-subtitle" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.1rem", color: "var(--ws-color-secondary)" }}>payments</span>
                  Total cost
                </p>
                <p className="ws-data">${record.billingSummary.totalCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="ws-tier-grid">
              {record.billingSummary.rateTiers.map((tier, index) => (
                <div key={tier.name} className="ws-tier-card" style={{ borderTop: `3px solid ${tierColorClass(index, record.billingSummary.rateTiers.length)}`, overflow: "hidden" }}>
                  <h3>{tier.name}</h3>
                  <p className="ws-subtitle">{tier.usageLimit}</p>
                  <p>{tier.rate}</p>
                  <p>
                    <strong className="ws-data">${tier.cost.toFixed(2)}</strong> charged
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {record && (
        <section className="ws-section" aria-labelledby="charts-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>bar_chart</span>
              Visualize
            </p>
            <h2 id="charts-title" className="ws-section-title">Usage and cost charts</h2>
          </div>
          <div className="ws-info-card" aria-label="Charts">
            <UsageLineChart
              data={record.usageHistory}
              title="Monthly consumption vs. similar homes"
              highlightIndexes={spikes}
            />
            <CostBreakdownChart tiers={record.billingSummary.rateTiers} />
          </div>
        </section>
      )}

      {record && (
        <section className="ws-section" aria-labelledby="savings-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>lightbulb</span>
              Opportunities
            </p>
            <h2 id="savings-title" className="ws-section-title">Potential savings</h2>
          </div>
          <div className="ws-info-card" aria-label="Savings recommendations">
            <p style={{ fontSize: "var(--ws-title-lg)", lineHeight: 1.5 }}>{record.savingsSummary}</p>
            <button className="ws-button" type="button" onClick={handleSavePlan}>
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.1rem", verticalAlign: "text-bottom", marginRight: "0.35rem" }}>bookmark_add</span>
              Add to My Savings Plan
            </button>
            {notice && <p className="ws-subtitle" aria-live="polite">{notice}</p>}
          </div>
        </section>
      )}

      {record && (
        <section className="ws-section" aria-labelledby="alerts-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>warning</span>
              Attention
            </p>
            <h2 id="alerts-title" className="ws-section-title">Alerts to review</h2>
          </div>
          <div className="ws-info-card" aria-label="Alerts">
            <ul className="ws-alert-list">
              {record.alerts.map((alert) => (
                <li key={alert.id}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.2rem", color: "var(--ws-color-error)", flexShrink: 0, marginTop: "0.1rem" }}>warning</span>
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="ws-subtitle" style={{ margin: 0 }}>{alert.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {record && (
        <section className="ws-section" aria-labelledby="top-moves-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>lightbulb</span>
              Recommendations
            </p>
            <h2 id="top-moves-title" className="ws-section-title">Your top 3 moves</h2>
          </div>
          <div className="ws-info-card" aria-label="AI recommendations">
            <div className="ws-result-grid">
              {record.topMoves.map((move, index) => (
                <article key={move.title} className="ws-result-card">
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "var(--ws-radius-full)",
                        background: "var(--ws-color-primary)",
                        color: "var(--ws-color-on-primary)",
                        fontFamily: "var(--ws-font-data)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 style={{ margin: 0 }}>{move.title}</h3>
                      <p>{move.why}</p>
                    </div>
                  </div>
                  <div className="ws-result-meta">
                    <span className="ws-tag">Effort: {move.effort}</span>
                    <span className="ws-tag">Impact: {move.impact}</span>
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
        </section>
      )}

      {record && (
        <section className="ws-section" aria-labelledby="share-title">
          <div className="ws-section-header">
            <p className="eyebrow">
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-top", marginRight: "0.35rem" }}>share</span>
              Spread the word
            </p>
            <h2 id="share-title" className="ws-section-title">Share your results</h2>
            <p className="ws-section-lede">
              Share your analysis to help others track their water use.
            </p>
          </div>
          <div className="ws-info-card" aria-label="Share your results">
            <div className="ws-share-grid">
              <div className="ws-share-card">
                <div className="ws-share-card__copy">
                  <h3>Water bill insights summary</h3>
                  <p>{record.savingsSummary}</p>
                  <p className="ws-subtitle">
                    Total usage: <span className="ws-data">{record.billingSummary.totalUsage.value.toLocaleString()}{" "}
                    {record.billingSummary.totalUsage.unit}</span> · Total cost: <span className="ws-data">${record.billingSummary.totalCost.toFixed(2)}</span>
                  </p>
                  <p className="ws-subtitle">
                    Your share link includes a referral token so you earn extra credits when friends
                    sign up.
                  </p>
                  <div className="ws-share-actions" role="group" aria-label="Share actions">
                    <ActionButton type="button" onClick={handleCopyShare}>
                      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1rem", verticalAlign: "text-bottom", marginRight: "0.25rem" }}>content_copy</span>
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
        </section>
      )}

      <details className="ws-info-card">
        <summary>
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.1rem", verticalAlign: "text-bottom", marginRight: "0.35rem" }}>menu_book</span>
          Learn more about your bill
        </summary>
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

      {!user && (
        <div className="ws-info-card" role="status" style={{ textAlign: "center" }}>
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--ws-color-primary)" }}>bookmark</span>
          <h2>Save this analysis for next time</h2>
          <p className="ws-subtitle">
            Create a free account to sync bill history, alerts, and savings goals across devices.
          </p>
          <div className="ws-tool-grid" style={{ justifyContent: "center" }}>
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
    </section>
  );
};

export default AnalysisResults;
