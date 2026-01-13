import { ChangeEvent, useRef, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink, useNavigate } from "./router";
import { saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult, toAnalysisRecord } from "../utils/analysisTransform";
import { useCredits } from "../context/CreditsContext";

const Home = () => {
  useDocumentTitle("WaterShortcut | Analyze your water bill");
  const navigate = useNavigate();
  const { setCredits } = useCredits();
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"upload" | "demo" | "manual" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const transitionDelayMs = 320;

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

  const handleDemoClick = () => {
    setActiveAction("demo");
    window.setTimeout(
      () => navigate("/analyze-water-bill", { state: { mode: "demo" } }),
      transitionDelayMs,
    );
  };

  const handleManualClick = () => {
    setActiveAction("manual");
    window.setTimeout(() => navigate("/manual-entry"), transitionDelayMs);
  };

  return (
    <section className="ws-page" aria-labelledby="home-title">
      <div className="ws-hero">
        <p className="eyebrow">Save Money &amp; Conserve Water</p>
        <h1 id="home-title">Understand your water bill in minutes.</h1>
        <p>
          Upload a PDF, try a demo bill, or enter numbers by hand. We translate the bill into clear
          savings steps.
        </p>
      </div>

      <div className="ws-cta-card" aria-label="Analyze a water bill">
        <div>
          <h2>Analyze my water bill</h2>
          <p className="ws-subtitle">Pick the mode that fits your time right now.</p>
          <RouterLink className="ws-footer-link" to="/find-water-provider">
            Click here to look up your water bill
          </RouterLink>
        </div>
        <div className="ws-mode-grid" role="group" aria-label="Choose a starting mode">
          <button
            className={`ws-button${activeAction === "upload" ? " is-loading" : ""}`}
            type="button"
            onClick={handleUploadClick}
            aria-busy={activeAction === "upload"}
            disabled={isUploading}
          >
            <span className="ws-button__label">Upload a PDF</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <button
            className={`ws-button-secondary${activeAction === "demo" ? " is-loading" : ""}`}
            type="button"
            onClick={handleDemoClick}
            aria-busy={activeAction === "demo"}
          >
            <span className="ws-button__label">Try a demo bill</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <button
            className={`ws-button-secondary${activeAction === "manual" ? " is-loading" : ""}`}
            type="button"
            onClick={handleManualClick}
            aria-busy={activeAction === "manual"}
          >
            <span className="ws-button__label">Enter numbers manually</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <input
            id="bill-upload"
            name="bill-upload"
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
      </div>

      <div className="ws-info-card" aria-label="Privacy reassurance">
        <h2>Private by design</h2>
        <ul className="ws-pill-list">
          <li>No login required.</li>
          <li>Uploads are deleted after analysis.</li>
          <li>We don’t sell personal data.</li>
        </ul>
      </div>

      <div id="more-tools" className="ws-info-card" aria-label="Explore more tools">
        <h2>More tools to explore</h2>
        <p className="ws-subtitle">
          Want to browse before uploading? Try a quick quiz or build a research plan.
        </p>
        <div className="ws-tool-grid">
          <RouterLink to="/water-iq">Take the Water IQ Challenge</RouterLink>
          <RouterLink to="/guides" reloadDocument>
            Explore water-saving guides
          </RouterLink>
          <RouterLink to="/research">Build a research plan</RouterLink>
          <RouterLink to="/guides/water-bill" reloadDocument>
            Learn how to read your bill
          </RouterLink>
          <RouterLink to="/calculators" reloadDocument>
            Try the calculators
          </RouterLink>
          <RouterLink to="/leak-check" reloadDocument>
            Run the leak check
          </RouterLink>
          <RouterLink to="/rebates" reloadDocument>
            Find rebates
          </RouterLink>
        </div>
      </div>
    </section>
  );
};

export default Home;
