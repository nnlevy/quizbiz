import { FormEvent, useEffect, useMemo, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";
import { useCredits } from "../context/CreditsContext";
import { useCreditsModal } from "../context/CreditsModalContext";
import { useSession } from "../context/SessionContext";
import { useCreditsCheckout } from "../hooks/useCreditsCheckout";
import { CREDIT_TOPUP_AMOUNT, CREDIT_TOPUP_PRICE } from "../utils/credits";
import {
  addSavingsPlanItem,
  getAnalysisHistory,
  getBadges,
  getGoals,
  getSavingsPlan,
  saveGoals,
  type Goal,
} from "../utils/dashboard";

const Dashboard = () => {
  usePageMeta({
    title: "WaterShortcut dashboard | Save water",
    description:
      "Track your AI water bill analysis history, savings plan, and progress toward saving water.",
    canonicalPath: "/dashboard",
  });
  const [goals, setGoals] = useState<Goal[]>(getGoals());
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("10% over 6 months");
  const [goalProgress, setGoalProgress] = useState(15);
  const [trendCity, setTrendCity] = useState("");
  const [trendState, setTrendState] = useState("");
  const [trendZip, setTrendZip] = useState("");
  const [trendStatus, setTrendStatus] = useState<string | null>(null);
  const [trendResult, setTrendResult] = useState<{
    summary: string;
    seasonalPatterns: Array<{ season: string; trend: string; drivers: string[] }>;
    recommendations: string[];
    utilityPrograms: Array<{ name: string; detail: string }>;
  } | null>(null);

  const { credits } = useCredits();
  const { openModal } = useCreditsModal();
  const { user, refreshSession } = useSession();
  const [notice, setNotice] = useState<string | null>(null);
  const { startCheckout } = useCreditsCheckout({ onNotice: setNotice });

  const history = useMemo(() => getAnalysisHistory(), []);
  const [plan, setPlan] = useState(getSavingsPlan());
  const badges = useMemo(() => getBadges(), []);
  const latestAlerts = history[0]?.alerts ?? [];
  const [portfolioLeads, setPortfolioLeads] = useState<any[]>([]);
  useEffect(() => {
    // Pull growth.business contact/access request submissions so they surface here (fixes the integration gap).
    fetch('/api/growth/contacts/recent?limit=8')
      .then(r => r.json().catch(() => ({})))
      .then((d: any) => setPortfolioLeads(Array.isArray(d?.data?.items) ? d.data.items : (d?.items || [])))
      .catch(() => setPortfolioLeads([]));
  }, []);
  const sampleHistory = [
    {
      id: "sample-history-june",
      billingPeriod: "May 2026",
      date: "6/3/2026",
      usage: "12,480 gallons",
      cost: "$74.22",
    },
    {
      id: "sample-history-may",
      billingPeriod: "Apr 2026",
      date: "5/2/2026",
      usage: "11,930 gallons",
      cost: "$69.18",
    },
  ];
  const sampleAlert = {
    id: "sample-alert-tier",
    title: "Usage approaching next tier",
    detail: "Irrigation use may push you into a higher-priced tier next cycle.",
  };
  const sampleTip = {
    id: "sample-tip-aerator",
    title: "Install high-efficiency faucet aerators",
    description: "Typical homes save 700-1,000 gallons each month with 1.0 GPM models.",
    source: "AI analysis sample",
  };
  const sampleGoal = {
    id: "sample-goal",
    title: "Cut outdoor water use",
    target: "12% in 4 months",
    progress: 38,
  };

  const handleSignOut = async () => {
    try {
      await fetch("/auth/signout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      refreshSession().catch(() => undefined);
    }
  };

  const handleAddGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextGoal: Goal = {
      id: `${Date.now()}`,
      title: goalTitle || "Reduce usage",
      target: goalTarget,
      progress: goalProgress,
    };
    const next = [nextGoal, ...goals];
    setGoals(next);
    saveGoals(next);
    setGoalTitle("");
    setGoalTarget("10% over 6 months");
    setGoalProgress(10);
  };

  const handleProgressChange = (id: string, value: number) => {
    const next = goals.map((goal) => (goal.id === id ? { ...goal, progress: value } : goal));
    setGoals(next);
    saveGoals(next);
  };

  const handleAddQuickTip = () => {
    const next = addSavingsPlanItem({
      id: `dashboard-${Date.now()}`,
      title: "Weekend irrigation reset",
      description: "Skip one weekend watering cycle to offset summer spikes.",
      createdAt: new Date().toISOString(),
      source: "Dashboard quick add",
    });
    setPlan(next);
  };

  const handleTrendLookup = async () => {
    setTrendStatus(null);
    setTrendResult(null);
    if (!trendZip.trim()) {
      setTrendStatus("Enter a ZIP code to research local trends.");
      return;
    }
    setTrendStatus("Researching local trends with AI...");
    try {
      const response = await fetch("/api/local-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          city: trendCity,
          state: trendState,
          zip: trendZip,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "We couldn’t research trends yet.");
      }
      const payload = (await response.json()) as {
        summary: string;
        seasonalPatterns: Array<{ season: string; trend: string; drivers: string[] }>;
        recommendations: string[];
        utilityPrograms: Array<{ name: string; detail: string }>;
      };
      setTrendResult(payload);
      setTrendStatus("Trend report ready.");
    } catch (error) {
      setTrendStatus(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <section className="ws-page" aria-labelledby="dashboard-title">
      <div className="ws-hero">
        <p className="eyebrow">Dashboard</p>
        <h1 id="dashboard-title">Welcome{user ? `, ${user.name}` : ""}.</h1>
        <p>Track your analysis history, alerts, goals, and community tips in one place.</p>
      </div>

      {/* Portfolio leads / access requests from growth.business (wired via shared D1 leads + chatbot_conversations with app_id filter; growth exposes /api/recent-contacts normalized from the real sinks; this polls and surfaces in a quizbiz dashboard view for unified internal visibility). */}
      <div className="ws-card" style={{marginTop: 12}}>
        <h3 style={{marginBottom: 6}}>Portfolio Access Requests (from growth.business)</h3>
        <p className="ws-subtitle" style={{fontSize: '12px'}}>Form + AI-chat submissions from the hub (contact page, matcher flows, unit CTAs) appear here for ops/portfolio oversight. Data from shared D1 (leads/chatbot_conversations app_id=growth.business) via growth /api/recent-contacts.</p>
        {portfolioLeads.length ? (
          <ul style={{fontSize: '13px', marginTop: 8}}>
            {portfolioLeads.slice(0, 8).map((l: any, i: number) => (
              <li key={i} style={{padding: '4px 0', borderBottom: '1px solid #eee'}}>
                <strong>{l.name || l.email || 'lead'}</strong>
                {l.email && l.name ? ` <${l.email}>` : ''}
                {' — '}
                {l.outcome || l.company || 'access request'}
                {l.unit ? ` [${l.unit}]` : ''}
                {l.kind ? ` (${l.kind})` : ''}
                <span style={{color:'#888', fontSize:10, marginLeft: 6}}>{new Date(l.ts || Date.now()).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : <p className="ws-subtitle" style={{fontSize: '12px'}}>No recent submissions yet (or fetch blocked). Submit the form or use the AI chat on growth.business/contact (or unit CTAs) to test end-to-end.</p>}
      </div>

      {!user && (
        <div className="ws-info-card">
          <h2>Your dashboard is personal</h2>
          <p className="ws-subtitle">
            Your dashboard becomes a living history of bill insights, goals, and alerts once you
            sign in.
          </p>
          <h3>Sample preview</h3>
          <p className="ws-subtitle">
            This read-only preview mirrors the dashboard cards you&apos;ll get once you create an
            account.
          </p>
          <div className="ws-info-card" aria-label="Sample analysis history">
            <h4>Bill history</h4>
            <ul className="ws-history-list">
              {sampleHistory.map((entry) => (
                <li key={entry.id}>
                  <div>
                    <strong>{entry.billingPeriod}</strong>
                    <p className="ws-subtitle">
                      {entry.date} · {entry.usage} · {entry.cost}
                    </p>
                  </div>
                  <span className="ws-footer-link" aria-hidden="true">
                    Sample
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ws-info-card" aria-label="Sample alerts">
            <h4>Personalized insights &amp; alerts</h4>
            <ul className="ws-alert-list">
              <li>
                <strong>{sampleAlert.title}</strong>
                <p className="ws-subtitle">{sampleAlert.detail}</p>
              </li>
            </ul>
          </div>
          <div className="ws-info-card" aria-label="Sample savings plan">
            <h4>Savings plan</h4>
            <ul className="ws-plan-list">
              <li>
                <strong>{sampleTip.title}</strong>
                <p className="ws-subtitle">{sampleTip.description}</p>
                <span className="ws-tag">Saved from {sampleTip.source}</span>
              </li>
            </ul>
          </div>
          <div className="ws-info-card" aria-label="Sample goal progress">
            <h4>Water-saving goals</h4>
            <div className="ws-goal-grid">
              <div className="ws-goal-card">
                <h5>{sampleGoal.title}</h5>
                <p className="ws-subtitle">Target: {sampleGoal.target}</p>
                <label className="ws-field" htmlFor="sample-goal-progress">
                  Progress: {sampleGoal.progress}%
                  <input
                    id="sample-goal-progress"
                    className="ws-input"
                    type="range"
                    min={0}
                    max={100}
                    value={sampleGoal.progress}
                    readOnly
                    disabled
                    aria-readonly="true"
                  />
                </label>
              </div>
            </div>
          </div>
          <ul className="ws-alert-list">
            <li>Analysis history timeline with every bill you scan.</li>
            <li>Personalized conservation tips tailored to your utility.</li>
            <li>Credits tracked across devices, plus ad-free browsing.</li>
          </ul>
          <button className="ws-button" type="button" onClick={() => openModal()}>
            Create Account / Sign in
          </button>
        </div>
      )}

      {user && (
        <div className="ws-info-card">
          <h2>Account snapshot</h2>
          <p className="ws-subtitle">
            Signed in as {user.name} ({user.email}) via {user.provider}. Credits remaining:{" "}
            {credits}.
          </p>
          <div className="ws-tool-grid">
            <button className="ws-button-secondary" type="button" onClick={handleSignOut}>
              Sign out
            </button>
            <button className="ws-button" type="button" onClick={() => openModal()}>
              Manage credits
            </button>
          </div>
          {credits === 0 && (
            <div className="ws-info-card" aria-label="Top up credits">
              <h3>Out of credits?</h3>
              <p className="ws-subtitle">
                Top up {CREDIT_TOPUP_AMOUNT} credits for ${CREDIT_TOPUP_PRICE} to keep analyzing
                bills.
              </p>
              <button className="ws-button" type="button" onClick={() => startCheckout()}>
                Purchase credits
              </button>
              {notice ? <p className="ws-subtitle">{notice}</p> : null}
            </div>
          )}
        </div>
      )}

      <div className="ws-info-card" aria-label="Analysis history">
        <h2>Bill history</h2>
        {history.length === 0 ? (
          <>
            <p className="ws-subtitle">No bill history is available yet. Upload a bill to get started.</p>
            <div className="ws-info-card" aria-label="Local trend research">
              <h3>Research local water trends with AI</h3>
              <p className="ws-subtitle">
                Share your location to get a localized trend summary and conservation focus areas.
              </p>
              <div className="ws-form-grid">
                <label className="ws-field" htmlFor="trend-city">
                  City (optional)
                  <input
                    id="trend-city"
                    className="ws-input"
                    type="text"
                    value={trendCity}
                    onChange={(event) => setTrendCity(event.target.value)}
                    placeholder="e.g., Austin"
                  />
                </label>
                <label className="ws-field" htmlFor="trend-state">
                  State (optional)
                  <input
                    id="trend-state"
                    className="ws-input"
                    type="text"
                    value={trendState}
                    onChange={(event) => setTrendState(event.target.value)}
                    placeholder="e.g., TX"
                  />
                </label>
                <label className="ws-field" htmlFor="trend-zip">
                  ZIP code
                  <input
                    id="trend-zip"
                    className="ws-input"
                    type="text"
                    value={trendZip}
                    onChange={(event) => setTrendZip(event.target.value)}
                    placeholder="e.g., 78701"
                    required
                  />
                </label>
              </div>
              <button className="ws-button-secondary" type="button" onClick={handleTrendLookup}>
                Research local trends
              </button>
              {trendStatus && <p className="ws-subtitle">{trendStatus}</p>}
              {trendResult && (
                <div className="ws-trend-grid">
                  <div>
                    <h4>Summary</h4>
                    <p className="ws-subtitle">{trendResult.summary}</p>
                  </div>
                  <div>
                    <h4>Seasonal patterns</h4>
                    <ul className="ws-alert-list">
                      {trendResult.seasonalPatterns.map((pattern) => (
                        <li key={pattern.season}>
                          <strong>{pattern.season}</strong>
                          <p className="ws-subtitle">{pattern.trend}</p>
                          <p className="ws-subtitle">
                            Drivers: {pattern.drivers.join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Recommended focus areas</h4>
                    <ul className="ws-alert-list">
                      {trendResult.recommendations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Utility programs</h4>
                    <ul className="ws-alert-list">
                      {trendResult.utilityPrograms.map((program) => (
                        <li key={program.name}>
                          <strong>{program.name}</strong>
                          <p className="ws-subtitle">{program.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <ul className="ws-history-list">
            {history.map((entry) => (
              <li key={entry.id}>
                <div>
                  <strong>{entry.billingSummary.billingPeriod}</strong>
                  <p className="ws-subtitle">
                    {new Date(entry.createdAt).toLocaleDateString()} ·{" "}
                    {entry.billingSummary.totalUsage.value.toLocaleString()}{" "}
                    {entry.billingSummary.totalUsage.unit} · $
                    {entry.billingSummary.totalCost.toFixed(2)}
                  </p>
                </div>
                <RouterLink className="ws-footer-link" to={`/analysis-results/${entry.id}`}>
                  View results →
                </RouterLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ws-info-card" aria-label="Insights and alerts">
        <h2>Personalized insights &amp; alerts</h2>
        <p className="ws-subtitle">
          Based on your most recent analysis, keep an eye on these items.
        </p>
        <ul className="ws-alert-list">
          {latestAlerts.length === 0 ? (
            <li>
              <strong>No alerts yet.</strong>
              <p className="ws-subtitle">Upload a bill to unlock leak and tier insights.</p>
            </li>
          ) : (
            latestAlerts.map((alert) => (
              <li key={alert.id}>
                <strong>{alert.title}</strong>
                <p className="ws-subtitle">{alert.detail}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="ws-info-card" aria-label="Savings plan">
        <h2>Savings plan</h2>
        <p className="ws-subtitle">Store the tips you want to tackle next.</p>
        <div className="ws-tool-grid">
          <button className="ws-button-secondary" type="button" onClick={handleAddQuickTip}>
            Add quick tip
          </button>
          <RouterLink className="ws-footer-link" to="/research">
            Find more rebates →
          </RouterLink>
        </div>
        <ul className="ws-plan-list">
          {plan.length === 0 ? (
            <li className="ws-subtitle">No tips saved yet.</li>
          ) : (
            plan.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p className="ws-subtitle">{item.description}</p>
                <span className="ws-tag">Saved from {item.source}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="ws-info-card" aria-label="Goals">
        <h2>Water-saving goals</h2>
        <form className="ws-form" onSubmit={handleAddGoal}>
          <label className="ws-field" htmlFor="goal-name">
            Goal name
            <input
              id="goal-name"
              className="ws-input"
              type="text"
              value={goalTitle}
              onChange={(event) => setGoalTitle(event.target.value)}
              placeholder="Reduce usage by 10%"
            />
          </label>
          <label className="ws-field" htmlFor="goal-target">
            Target
            <input
              id="goal-target"
              className="ws-input"
              type="text"
              value={goalTarget}
              onChange={(event) => setGoalTarget(event.target.value)}
            />
          </label>
          <label className="ws-field" htmlFor="goal-progress">
            Current progress: {goalProgress}%
            <input
              id="goal-progress"
              className="ws-input"
              type="range"
              min={0}
              max={100}
              value={goalProgress}
              onChange={(event) => setGoalProgress(Number(event.target.value))}
            />
          </label>
          <button className="ws-button" type="submit">
            Add goal
          </button>
        </form>
        <div className="ws-goal-grid">
          {goals.map((goal) => (
            <div key={goal.id} className="ws-goal-card">
              <h3>{goal.title}</h3>
              <p className="ws-subtitle">Target: {goal.target}</p>
              <label className="ws-field" htmlFor={`goal-progress-${goal.id}`}>
                Progress: {goal.progress}%
                <input
                  id={`goal-progress-${goal.id}`}
                  className="ws-input"
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(event) => handleProgressChange(goal.id, Number(event.target.value))}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="ws-info-card" aria-label="Badges">
        <h2>Badges</h2>
        <div className="ws-badge-grid">
          {badges.map((badge) => (
            <div key={badge.id} className={`ws-badge ${badge.earned ? "is-earned" : ""}`}>
              <h3>{badge.title}</h3>
              <p className="ws-subtitle">{badge.description}</p>
              <span className="ws-tag">{badge.earned ? "Earned" : "In progress"}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Dashboard;
