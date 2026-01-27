import { ChangeEvent, useMemo, useRef, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink, useNavigate } from "./router";
import { saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult, toAnalysisRecord } from "../utils/analysisTransform";
import { useCredits } from "../context/CreditsContext";
import InfoCard from "../components/InfoCard";

const CalculatorTeaser = () => {
  const [billAmount, setBillAmount] = useState(100);
  const yearlySavings = useMemo(() => billAmount * 0.2 * 12, [billAmount]);
  const calculatorHref = `/calculators?bill_amount=${encodeURIComponent(String(billAmount))}`;
  const toolCards = [
    {
      title: "Leak Detector",
      description: "Spot hidden drips fast.",
      href: "/calculators#leak-estimator",
      tone: "sky",
      icon: (
        <>
          <path
            fill="currentColor"
            d="M12 2.5c2.9 2.7 4.5 5.6 4.5 8.3 0 2.6-2 4.7-4.5 4.7S7.5 13.4 7.5 10.8c0-2.7 1.6-5.6 4.5-8.3Z"
          />
          <path fill="currentColor" d="M6 17h12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" />
        </>
      ),
    },
    {
      title: "Shower vs Bath",
      description: "See where you stand.",
      href: "/calculators#shower-bath",
      tone: "emerald",
      icon: (
        <>
          <path
            fill="currentColor"
            d="M6 3h12a1 1 0 0 1 1 1v2H5V4a1 1 0 0 1 1-1Z"
          />
          <path
            fill="currentColor"
            d="M4 8h16v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"
          />
          <path fill="currentColor" d="M9 11h6v2H9z" />
        </>
      ),
    },
    {
      title: "Bill Audit",
      description: "Project your savings.",
      href: "/calculators#bill-savings",
      tone: "slate",
      icon: (
        <>
          <path
            fill="currentColor"
            d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12H4V6Z"
          />
          <path fill="currentColor" d="M7 9h10v2H7zm0 4h6v2H7z" />
        </>
      ),
    },
  ];

  return (
    <section
      className="mt-10 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white px-6 py-10 shadow-sm sm:px-10"
      aria-label="Calculators teaser"
      id="quick-check"
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
            Powered by AI &amp; EPA Data
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Do the Math. See the Savings.
          </h2>
          <p className="text-base text-slate-600">
            Get a quick estimate in seconds, then dig deeper when you&apos;re ready.
          </p>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="text-sm font-semibold text-slate-900">A quick peek at what you&apos;ll get:</p>
            <div className="ws-tool-card-grid" role="list">
              {toolCards.map((tool) => (
                <RouterLink
                  key={tool.title}
                  to={tool.href}
                  className={`ws-tool-card ws-tool-card--${tool.tone}`}
                  role="listitem"
                  aria-label={`${tool.title}: ${tool.description}`}
                >
                  <span className="ws-tool-card__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" className="ws-tool-card__svg">
                      {tool.icon}
                    </svg>
                  </span>
                  <span className="ws-tool-card__body">
                    <span className="ws-tool-card__title">{tool.title}</span>
                    <span className="ws-tool-card__description">{tool.description}</span>
                  </span>
                  <span className="ws-tool-card__cta">
                    Open <span aria-hidden>→</span>
                  </span>
                </RouterLink>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              Start with a quick check, then unlock the deeper breakdowns.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                Quick Check
              </p>
              <h3 className="text-xl font-semibold text-slate-900">Monthly Water Bill ($)</h3>
            </div>
            <input
              className="h-12 w-full accent-sky-600"
              type="range"
              min={0}
              max={500}
              value={billAmount}
              onChange={(event) => setBillAmount(Number(event.target.value))}
            />
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>$0</span>
              <span>$500+</span>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Potential Savings</p>
              <p className="text-2xl font-semibold text-emerald-600">
                ~${yearlySavings.toFixed(0)}/year
              </p>
            </div>
            <RouterLink
              className="ws-button w-full justify-center"
              to={calculatorHref}
              aria-label="Unlock AI analysis and details"
            >
              Unlock AI Analysis &amp; Details
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  usePageMeta({
    title: "AI water bill analysis to save water | WaterShortcut",
    description:
      "Use AI water bill analysis to save water and money. Upload a bill, try a demo bill, or use manual entry.",
    canonicalPath: "/",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "AI water bill analysis",
        areaServed: "US",
        description:
          "AI water bill analysis with upload, demo, and manual entry options to help households save water.",
        provider: {
          "@type": "Organization",
          name: "WaterShortcut",
          url: "https://www.watershortcut.com",
        },
      },
    ],
  });
  const navigate = useNavigate();
  const { setCredits } = useCredits();
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"upload" | "demo" | "manual" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const transitionDelayMs = 320;

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    scrollToSection("analysis-start");
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
          Upload a bill, try a demo bill, or use manual entry. We translate the bill into clear
          savings steps.
        </p>
        <div className="ws-hero-actions" role="group" aria-label="Start a water bill analysis">
          <button type="button" className="ws-button" onClick={handleUploadClick}>
            Analyze my water bill
          </button>
          <button type="button" className="ws-button-secondary" onClick={handleDemoClick}>
            Try a demo bill
          </button>
          <button type="button" className="ws-button-secondary" onClick={handleManualClick}>
            Manual entry
          </button>
        </div>
        <RouterLink className="ws-hero-link" to="#quick-check">
          Stop Flushing Money →
        </RouterLink>
      </div>

      <InfoCard id="analysis-start" variant="cta" aria-label="Analyze a water bill">
        <div>
          <h2>Analyze my water bill</h2>
          <p className="ws-subtitle">Pick the mode that fits your time right now.</p>
          <RouterLink className="ws-footer-link" to="/find-water-provider">
            Look up my water bill portal
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
            <span className="ws-button__label">Upload a bill</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <button
            className={`ws-button-secondary${activeAction === "demo" ? " is-loading" : ""}`}
            type="button"
            onClick={handleDemoClick}
            aria-busy={activeAction === "demo"}
          >
            <span className="ws-button__label">Demo bill</span>
            <span className="ws-button__spinner" aria-hidden />
          </button>
          <button
            className={`ws-button-secondary${activeAction === "manual" ? " is-loading" : ""}`}
            type="button"
            onClick={handleManualClick}
            aria-busy={activeAction === "manual"}
          >
            <span className="ws-button__label">Manual entry</span>
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
        <p className="ws-subtitle">
          Uploads and manual entries are deleted after analysis.{" "}
          <RouterLink to="/privacy">Learn how we handle data</RouterLink>.
        </p>
      </InfoCard>

      <CalculatorTeaser />

      <InfoCard aria-label="Privacy reassurance">
        <h2>Private by design</h2>
        <ul className="ws-pill-list">
          <li>No login required.</li>
          <li>Uploads are deleted after analysis.</li>
          <li>We don’t sell personal data.</li>
        </ul>
        <RouterLink className="ws-footer-link" to="/privacy">
          Read the privacy policy →
        </RouterLink>
      </InfoCard>

      <InfoCard as="nav" id="more-tools" aria-label="Explore more tools">
        <h2>More tools to explore</h2>
        <p className="ws-subtitle">
          Want to browse before uploading? Try a quick quiz or build a research plan.
        </p>
        <div className="ws-tool-grid" role="list">
          <RouterLink to="/water-iq">Take the Water IQ Challenge</RouterLink>
          <RouterLink to="/guides" reloadDocument>
            Explore water-saving guides
          </RouterLink>
          <RouterLink to="/research">Build a research plan</RouterLink>
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
      </InfoCard>
    </section>
  );
};

export default Home;
