import { ChangeEvent, useRef, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { useNavigate } from "./router";
import { saveAnalysisRecord } from "../utils/dashboard";
import type { AnalysisResult } from "../types";
import { isAnalysisResult, toAnalysisRecord } from "../utils/analysisTransform";
import { useCredits } from "../context/CreditsContext";
import ExploreTools from "../components/ExploreTools";
import FeatureGrid from "../components/FeatureGrid";
import Hero from "../components/Hero";
import EarnCreditsCard from "../components/EarnCreditsCard";
import QuickCheck from "../components/QuickCheck";
import StartCard from "../components/StartCard";
import TrustPrivacy from "../components/TrustPrivacy";

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
  const transitionDelayMs = 160;

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
    if (isUploading) {
      return;
    }
    setErrorMessage(null);
    setActiveAction("upload");
  };

  const handleDemoClick = () => {
    setActiveAction("demo");
    setErrorMessage(null);
    window.setTimeout(
      () => navigate("/analyze-water-bill", { state: { mode: "demo" } }),
      transitionDelayMs,
    );
  };

  const handleManualClick = () => {
    setActiveAction("manual");
    setErrorMessage(null);
    window.setTimeout(() => navigate("/manual-entry"), transitionDelayMs);
  };

  return (
    <section className="ws-page" aria-labelledby="home-title">
      <Hero
        eyebrow="Save Money & Conserve Water"
        title="Understand your water bill in minutes."
        description="Upload a bill, try a demo bill, or use manual entry. We translate the bill into clear savings steps."
        titleId="home-title"
      >
        <StartCard
          id="analysis-start"
          activeAction={activeAction}
          isUploading={isUploading}
          fileName={fileName}
          errorMessage={errorMessage}
          fileInputRef={fileInputRef}
          onUploadClick={handleUploadClick}
          onDemoClick={handleDemoClick}
          onManualClick={handleManualClick}
          onUploadChange={handleUpload}
        />
      </Hero>

      <EarnCreditsCard />

      <section className="ws-section" aria-labelledby="feature-grid-title">
        <div className="ws-section-header">
          <p className="eyebrow">Powered by AI &amp; EPA Data</p>
          <h2 id="feature-grid-title" className="ws-section-title">
            The fastest way to spot savings
          </h2>
          <p className="ws-section-lede">
            Start with a quick check or jump straight into the calculators most customers use.
          </p>
        </div>
        <FeatureGrid />
      </section>

      <QuickCheck />

      <TrustPrivacy />

      <ExploreTools />
    </section>
  );
};

export default Home;
