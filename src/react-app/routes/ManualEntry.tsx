import { ChangeEvent, FormEvent, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { AnalysisResult } from "../types";
import { RouterLink } from "./router";

type ManualFormState = {
  period: string;
  usage: string;
  unit: string;
  cost: string;
  rate: string;
  household: string;
  notes: string;
};

const UNIT_OPTIONS = ["Gallons", "CCF", "HCF"];

const ManualEntry = () => {
  useDocumentTitle("WaterShortcut | Manual entry");
  const [formState, setFormState] = useState<ManualFormState>({
    period: "",
    usage: "",
    unit: UNIT_OPTIONS[0],
    cost: "",
    rate: "",
    household: "",
    notes: "",
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof ManualFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("Sending your details to the AI...");
    setIsSubmitting(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          period: formState.period,
          usage: formState.usage,
          unit: formState.unit,
          cost: formState.cost,
          rate: formState.rate,
          household: formState.household,
          notes: formState.notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "We couldn’t analyze the manual entry yet.");
      }

      const payload = (await response.json()) as { analysis?: AnalysisResult | null };
      if (!payload.analysis) {
        throw new Error("The AI response was incomplete. Please try again.");
      }

      setAnalysis(payload.analysis);
      setStatus("Your manual insights are ready.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="ws-page" aria-labelledby="manual-entry-title">
      <div className="ws-hero">
        <p className="eyebrow">Manual entry</p>
        <h1 id="manual-entry-title">Enter your bill numbers for instant AI insights.</h1>
        <p>
          Share the basics from your latest bill and we&apos;ll generate a custom plan without
          uploading a PDF.
        </p>
      </div>

      <form className="ws-info-card ws-form" onSubmit={handleSubmit}>
        <div className="ws-form-grid">
          <label className="ws-field">
            Billing period (optional)
            <input
              className="ws-input"
              type="text"
              value={formState.period}
              onChange={handleChange("period")}
              placeholder="e.g., Aug 1–31"
            />
          </label>
          <label className="ws-field">
            Total usage
            <input
              className="ws-input"
              type="number"
              min="0"
              step="0.1"
              value={formState.usage}
              onChange={handleChange("usage")}
              placeholder="e.g., 8"
              required
            />
          </label>
          <label className="ws-field">
            Unit
            <select className="ws-input" value={formState.unit} onChange={handleChange("unit")}>
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label className="ws-field">
            Total cost
            <input
              className="ws-input"
              type="number"
              min="0"
              step="0.01"
              value={formState.cost}
              onChange={handleChange("cost")}
              placeholder="e.g., 86"
              required
            />
          </label>
          <label className="ws-field">
            Water rate (optional)
            <input
              className="ws-input"
              type="number"
              min="0"
              step="0.01"
              value={formState.rate}
              onChange={handleChange("rate")}
              placeholder="e.g., 6.00"
            />
          </label>
          <label className="ws-field">
            Household size (optional)
            <input
              className="ws-input"
              type="number"
              min="1"
              max="12"
              step="1"
              value={formState.household}
              onChange={handleChange("household")}
              placeholder="e.g., 3"
            />
          </label>
        </div>
        <label className="ws-field">
          Notes (optional)
          <textarea
            className="ws-input ws-textarea"
            rows={3}
            value={formState.notes}
            onChange={handleChange("notes")}
            placeholder="Add anything else you want the AI to consider."
          />
        </label>
        <button className="ws-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Analyzing..." : "Build my plan"}
        </button>
        <div className="ws-form-meta">
          {status && <p aria-live="polite">{status}</p>}
          {error && (
            <p className="ws-form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>

      {analysis && (
        <div className="ws-progress" aria-live="polite">
          <h2>Your tailored results</h2>
          <div className="ws-result-grid">
            {analysis.topMoves.map((move) => (
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
              <p>{analysis.payingFor}</p>
            </div>
            <div>
              <h3>Your next best step</h3>
              <p>{analysis.nextStep}</p>
            </div>
            {analysis.confidenceNote && <p className="ws-subtitle">{analysis.confidenceNote}</p>}
          </div>
          <div className="ws-tool-grid">
            <RouterLink to="/">Upload a full PDF</RouterLink>
            <RouterLink to="/research">Build a research plan</RouterLink>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManualEntry;
