import { ChangeEvent, useRef, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink, useNavigate } from "./router";

const Home = () => {
  useDocumentTitle("WaterShortcut | Analyze your water bill");
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"upload" | "demo" | "manual" | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const transitionDelayMs = 320;

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setActiveAction(null);
      return;
    }
    setFileName(file.name);
    setActiveAction("upload");
    window.setTimeout(
      () => navigate("/analyze", { state: { mode: "upload", fileName: file.name } }),
      transitionDelayMs,
    );
  };

  const handleUploadClick = () => {
    setActiveAction("upload");
    fileInputRef.current?.click();
  };

  const handleDemoClick = () => {
    setActiveAction("demo");
    window.setTimeout(() => navigate("/analyze", { state: { mode: "demo" } }), transitionDelayMs);
  };

  const handleManualClick = () => {
    setActiveAction("manual");
    window.setTimeout(() => navigate("/legacy#manual-entry"), transitionDelayMs);
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
        </div>
        <div className="ws-mode-grid" role="group" aria-label="Choose a starting mode">
          <button
            className={`ws-button${activeAction === "upload" ? " is-loading" : ""}`}
            type="button"
            onClick={handleUploadClick}
            aria-busy={activeAction === "upload"}
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
          Want to browse before uploading? Try a quick quiz, play a game, or build a research plan.
        </p>
        <div className="ws-tool-grid">
          <RouterLink to="/water-iq">Take the Water IQ Challenge</RouterLink>
          <RouterLink to="/game">Play Leak Patrol</RouterLink>
          <RouterLink to="/research">Build a research plan</RouterLink>
          <RouterLink to="/learn/read-water-bill">Learn how to read your bill</RouterLink>
        </div>
      </div>
    </section>
  );
};

export default Home;
