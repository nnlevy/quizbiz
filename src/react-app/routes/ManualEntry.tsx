import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink, useNavigate } from "./router";
import { saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult, toAnalysisRecord } from "../utils/analysisTransform";
import { useCredits } from "../context/CreditsContext";

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
  usePageMeta({
    title: "Manual water bill entry | AI water bill analysis",
    description:
      "Enter water bill numbers manually to get AI water bill analysis, savings tips, and ways to save water.",
    canonicalPath: "/manual-entry",
  });
  const navigate = useNavigate();
  const { setCredits } = useCredits();
  const [formState, setFormState] = useState<ManualFormState>({
    period: "",
    usage: "",
    unit: UNIT_OPTIONS[0],
    cost: "",
    rate: "",
    household: "",
    notes: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsageHelp, setShowUsageHelp] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ManualFormState, string>>>({});

  const fieldIds = useMemo(
    () => ({
      period: "manual-entry-period",
      usage: "manual-entry-usage",
      unit: "manual-entry-unit",
      cost: "manual-entry-cost",
      rate: "manual-entry-rate",
      household: "manual-entry-household",
      notes: "manual-entry-notes",
    }),
    [],
  );

  const handleChange =
    (field: keyof ManualFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ManualFormState, string>> = {};
    const usage = Number(formState.usage);
    const cost = Number(formState.cost);
    if (!formState.usage || !Number.isFinite(usage) || usage <= 0) {
      nextErrors.usage = "Enter a total usage amount above 0.";
    }
    if (!formState.cost || !Number.isFinite(cost) || cost <= 0) {
      nextErrors.cost = "Enter a total cost above $0.";
    }
    const household = Number(formState.household);
    if (formState.household && (!Number.isFinite(household) || household < 1)) {
      nextErrors.household = "Household size should be 1 or more.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus(null);
      setError("Please fix the highlighted fields to continue.");
      return;
    }
    setStatus("Sending your details to the AI...");
    setIsSubmitting(true);
    try {
      const parseAnalysisResponse = <T,>(text: string): T => {
        try {
          return JSON.parse(text) as T;
        } catch {
          throw new Error("We couldn’t read the analysis response. Please try again.");
        }
      };

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

      const responseText = await response.text();

      if (!response.ok) {
        const payload = parseAnalysisResponse<{ error?: string; credits?: number }>(responseText);
        if (typeof payload?.credits === "number") {
          setCredits(payload.credits);
        }
        throw new Error(payload?.error || "We couldn’t analyze the manual entry yet.");
      }

      const payload = parseAnalysisResponse<{
        analysis?: AnalysisResult | null;
        credits?: number;
      }>(responseText);
      if (typeof payload.credits === "number") {
        setCredits(payload.credits);
      }
      if (!payload.analysis || !isAnalysisResult(payload.analysis)) {
        throw new Error("The AI response was incomplete. Please try again.");
      }

      setStatus("Your manual insights are ready.");
      const record = toAnalysisRecord(payload.analysis, "manual");
      saveAnalysisRecord(record);
      navigate(`/analysis-results/${record.id}`, { state: { record, mode: "manual" } });
    } catch (submitError) {
      const normalizedError = submitError instanceof Error ? submitError.message : "Something went wrong.";
      setError(normalizedError || "Something went wrong.");
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

      <form className="ws-info-card ws-form" onSubmit={handleSubmit} noValidate>
        <div className="ws-form-grid">
          <label className="ws-field" htmlFor={fieldIds.period}>
            Billing period
            <input
              id={fieldIds.period}
              className="ws-input"
              type="text"
              value={formState.period}
              onChange={handleChange("period")}
              placeholder="e.g., Aug 1–31"
            />
          </label>
          <label className="ws-field" htmlFor={fieldIds.usage}>
            <span className="ws-field-label" id="usage-help-label">
              Total usage
              <button
                type="button"
                className="ws-tooltip-button"
                aria-expanded={showUsageHelp}
                aria-controls="usage-help-panel"
                onClick={() => setShowUsageHelp((prev) => !prev)}
              >
                i
              </button>
            </span>
            <input
              id={fieldIds.usage}
              className="ws-input"
              type="number"
              min="0"
              step="0.1"
              value={formState.usage}
              onChange={handleChange("usage")}
              placeholder="e.g., 8"
              required
              aria-invalid={Boolean(fieldErrors.usage)}
              aria-describedby={fieldErrors.usage ? "usage-error" : undefined}
            />
            {fieldErrors.usage && (
              <p className="ws-field-error" id="usage-error" role="alert">
                {fieldErrors.usage}
              </p>
            )}
            {showUsageHelp && (
              <div className="ws-tooltip-panel" id="usage-help-panel" role="note">
                <p>
                  <strong>Where to find this:</strong> Total usage is often labeled “consumption”
                  or “usage” in CCF or gallons. It’s usually found in the meter reading section.
                </p>
                <div className="ws-bill-sample" aria-hidden="true">
                  <div className="ws-bill-header">Sample Bill</div>
                  <div className="ws-bill-row">Account number · 123456</div>
                  <div className="ws-bill-row ws-bill-highlight">Total usage · 8.2 CCF</div>
                  <div className="ws-bill-row">Service charges · $28.00</div>
                </div>
              </div>
            )}
          </label>
          <label className="ws-field" htmlFor={fieldIds.unit}>
            Unit
            <select
              id={fieldIds.unit}
              className="ws-input"
              value={formState.unit}
              onChange={handleChange("unit")}
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label className="ws-field" htmlFor={fieldIds.cost}>
            Total cost
            <input
              id={fieldIds.cost}
              className="ws-input"
              type="number"
              min="0"
              step="0.01"
              value={formState.cost}
              onChange={handleChange("cost")}
              placeholder="e.g., 86"
              required
              aria-invalid={Boolean(fieldErrors.cost)}
              aria-describedby={fieldErrors.cost ? "cost-error" : undefined}
            />
            {fieldErrors.cost && (
              <p className="ws-field-error" id="cost-error" role="alert">
                {fieldErrors.cost}
              </p>
            )}
          </label>
          <label className="ws-field" htmlFor={fieldIds.rate}>
            Water rate (optional)
            <input
              id={fieldIds.rate}
              className="ws-input"
              type="number"
              min="0"
              step="0.01"
              value={formState.rate}
              onChange={handleChange("rate")}
              placeholder="e.g., 6.00"
            />
          </label>
          <label className="ws-field" htmlFor={fieldIds.household}>
            Household size (optional)
            <input
              id={fieldIds.household}
              className="ws-input"
              type="number"
              min="1"
              max="12"
              step="1"
              value={formState.household}
              onChange={handleChange("household")}
              placeholder="e.g., 3"
              aria-invalid={Boolean(fieldErrors.household)}
              aria-describedby={fieldErrors.household ? "household-error" : undefined}
            />
            {fieldErrors.household && (
              <p className="ws-field-error" id="household-error" role="alert">
                {fieldErrors.household}
              </p>
            )}
          </label>
        </div>
        <label className="ws-field" htmlFor={fieldIds.notes}>
          Notes (optional)
          <textarea
            id={fieldIds.notes}
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

      <div className="ws-info-card" aria-label="Data handling summary">
        <h2>How we handle your manual entry</h2>
        <p className="ws-subtitle">
          We use your inputs to generate AI water bill analysis and delete them after the analysis
          completes. <RouterLink to="/privacy">Read the privacy policy</RouterLink>.
        </p>
      </div>

      <div className="ws-progress" aria-live="polite">
        <h2>Next steps</h2>
        <p className="ws-subtitle">
          You&apos;ll be redirected to your results page after analysis completes.
        </p>
        <div className="ws-tool-grid">
          <RouterLink to="/">Upload a full PDF</RouterLink>
          <RouterLink to="/research">Build a research plan</RouterLink>
        </div>
      </div>
    </section>
  );
};

export default ManualEntry;
