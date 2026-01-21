import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink, useNavigate } from "./router";
import { saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult, toAnalysisRecord } from "../utils/analysisTransform";
import { useCredits } from "../context/CreditsContext";

const LOCATIONS = [
  "Austin, TX",
  "Los Angeles, CA",
  "Miami, FL",
  "Phoenix, AZ",
  "Portland, OR",
  "Seattle, WA",
  "San Diego, CA",
  "San Jose, CA",
  "Tampa, FL",
];

const BillLookup = () => {
  usePageMeta({
    title: "Find your water provider | AI water bill analysis",
    description:
      "Find your water provider and portal fast, then upload a bill for AI water bill analysis to save water.",
    canonicalPath: "/find-water-provider",
  });
  const navigate = useNavigate();
  const { setCredits } = useCredits();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"upload" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const transitionDelayMs = 320;

  const suggestions = useMemo(
    () => LOCATIONS.filter((location) => location.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSelected(query.trim());
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setActiveAction(null);
      return;
    }
    setFileName(file.name);
    setActiveAction("upload");
    setIsUploading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/analyze-bill", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; credits?: number }
          | null;
        if (typeof payload?.credits === "number") {
          setCredits(payload.credits);
        }
        throw new Error(payload?.error || "We couldn’t analyze that file yet.");
      }
      const payload = (await response.json()) as {
        analysis?: AnalysisResult | null;
        credits?: number;
      };
      if (typeof payload.credits === "number") {
        setCredits(payload.credits);
      }
      if (!payload.analysis || !isAnalysisResult(payload.analysis)) {
        throw new Error("The AI response was incomplete. Please try again.");
      }
      const record = toAnalysisRecord(payload.analysis, "upload");
      saveAnalysisRecord(record);
      window.setTimeout(
        () => navigate(`/analysis-results/${record.id}`, { state: { record, mode: "upload" } }),
        transitionDelayMs,
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      setActiveAction(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    setActiveAction("upload");
    fileInputRef.current?.click();
  };

  const municipalSearchUrl = selected
    ? `https://www.google.com/search?q=${encodeURIComponent(`${selected} water utility bill`)}`
    : "https://www.usa.gov/local-governments";

  return (
    <section className="ws-page" aria-labelledby="bill-lookup-title">
      <div className="ws-hero">
        <p className="eyebrow">AI-powered lookup</p>
        <h1 id="bill-lookup-title">Find your local water bill portal fast.</h1>
        <p>
          Share your city or utility district and we&apos;ll guide you to the right bill portal,
          then generate AI tips once you upload your statement.
        </p>
      </div>

      <form className="ws-form" onSubmit={handleSubmit}>
        <label htmlFor="bill-lookup-input">U.S. city or utility district</label>
        <input
          id="bill-lookup-input"
          className="ws-input"
          type="text"
          list="bill-lookup-suggestions"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g., Austin, TX"
          autoComplete="off"
          aria-autocomplete="list"
        />
        <datalist id="bill-lookup-suggestions">
          {suggestions.map((location) => (
            <option key={location} value={location} />
          ))}
        </datalist>
        <button className="ws-button" type="submit">
          Show my local portal
        </button>
      </form>

      <div className="ws-info-card" aria-live="polite">
        <h2>{selected ? `Next steps for ${selected}` : "Next steps once you pick a location"}</h2>
        <p>
          {selected
            ? "Open your municipal billing portal in a new tab, then upload your bill for AI-powered insights."
            : "Enter a location to open your municipal billing portal and upload your bill for AI-powered insights."}
        </p>
        <div className="ws-tool-grid">
          <a
            className="ws-button-secondary"
            href={municipalSearchUrl}
            target="_blank"
            rel="noreferrer"
          >
            Visit my municipal billing site
          </a>
          <button
            className={`ws-button${activeAction === "upload" ? " is-loading" : ""}`}
            type="button"
            onClick={handleUploadClick}
            aria-busy={activeAction === "upload"}
            disabled={isUploading}
          >
            <span className="ws-button__label">Upload my water bill</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <input
            id="bill-lookup-upload"
            name="bill-lookup-upload"
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            ref={fileInputRef}
            className="sr-only"
            aria-label="Upload a water bill PDF"
          />
        </div>
        {fileName && <p aria-live="polite">Selected: {fileName}</p>}
        {errorMessage && (
          <p className="ws-form-error" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="ws-tool-grid">
          <RouterLink className="ws-footer-link" to="/manual-entry">
            Manual entry →
          </RouterLink>
          <RouterLink className="ws-footer-link" to="/">
            Return home →
          </RouterLink>
        </div>
      </div>
    </section>
  );
};

export default BillLookup;
