import { useMemo, useState } from "react";

import { logEvent } from "../analytics";
import type { AnalysisResult } from "../types";

type ShareExportBarProps = {
  result: AnalysisResult;
};

const buildSummary = (result: AnalysisResult) =>
  [
    "WaterShortcut plan summary:",
    ...result.topMoves.map((move, index) => `${index + 1}. ${move.title} (${move.effort})`),
    `What you’re paying for: ${result.payingFor}`,
    `Next step: ${result.nextStep}`,
  ].join("\n");

const encodeShare = (result: AnalysisResult) =>
  btoa(encodeURIComponent(JSON.stringify(result)));

const ShareExportBar = ({ result }: ShareExportBarProps) => {
  const summary = useMemo(() => buildSummary(result), [result]);
  const [copyLabel, setCopyLabel] = useState("Copy summary");
  const [shareLabel, setShareLabel] = useState("Share link");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      logEvent("export_copy");
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy summary"), 1500);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy summary"), 1500);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/analyze-water-bill#plan=${encodeShare(result)}`;
    try {
      await navigator.clipboard.writeText(url);
      logEvent("share_link");
      setShareLabel("Link copied");
      setTimeout(() => setShareLabel("Share link"), 1500);
    } catch {
      setShareLabel("Copy failed");
      setTimeout(() => setShareLabel("Share link"), 1500);
    }
  };

  return (
    <div className="share-export-bar">
      <button type="button" className="secondary-button" onClick={handleCopy}>
        {copyLabel}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          logEvent("export_pdf");
          window.print();
        }}
      >
        Download as PDF
      </button>
      <button type="button" className="secondary-button" onClick={handleShare}>
        {shareLabel}
      </button>
    </div>
  );
};

export default ShareExportBar;
