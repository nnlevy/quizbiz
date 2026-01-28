import { ChangeEvent, RefObject } from "react";

import InfoCard from "./InfoCard";
import { RouterLink } from "../routes/router";

export type StartCardProps = {
  id?: string;
  activeAction: "upload" | "demo" | "manual" | null;
  isUploading: boolean;
  fileName: string | null;
  errorMessage: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onDemoClick: () => void;
  onManualClick: () => void;
  onUploadChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const StartCard = ({
  id,
  activeAction,
  isUploading,
  fileName,
  errorMessage,
  fileInputRef,
  onUploadClick,
  onDemoClick,
  onManualClick,
  onUploadChange,
}: StartCardProps) => (
  <InfoCard id={id} variant="cta" aria-label="Analyze a water bill" className="ws-start-card">
    <div>
      <h2>Analyze my water bill</h2>
      <p className="ws-subtitle">Pick the mode that fits your time right now.</p>
      <RouterLink className="ws-footer-link" to="/find-water-provider">
        Look up my water bill portal
      </RouterLink>
    </div>
    <div className="ws-mode-grid" role="group" aria-label="Choose a starting mode">
      <label
        className={`ws-button${activeAction === "upload" ? " is-loading" : ""}${
          isUploading ? " is-disabled" : ""
        }`}
        htmlFor="bill-upload"
        role="button"
        tabIndex={0}
        aria-busy={activeAction === "upload"}
        aria-disabled={isUploading}
        onClick={() => {
          if (isUploading) {
            return;
          }
          onUploadClick();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!isUploading) {
              onUploadClick();
              fileInputRef.current?.click();
            }
          }
        }}
      >
        <span className="ws-button__label">Upload a bill</span>
        <span className="ws-button__spinner" aria-hidden />
      </label>
      <button
        className={`ws-button-secondary${activeAction === "demo" ? " is-loading" : ""}`}
        type="button"
        onClick={onDemoClick}
        aria-busy={activeAction === "demo"}
      >
        <span className="ws-button__label">Try a demo bill</span>
        <span className="ws-button__spinner" aria-hidden />
      </button>
      <button
        className={`ws-button-secondary${activeAction === "manual" ? " is-loading" : ""}`}
        type="button"
        onClick={onManualClick}
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
        onChange={onUploadChange}
        ref={fileInputRef}
        className="sr-only"
        aria-label="Upload a water bill PDF"
        disabled={isUploading}
      />
    </div>
    {fileName && <p aria-live="polite">Selected: {fileName}</p>}
    {errorMessage && (
      <p className="ws-form-error" role="alert">
        {errorMessage}
      </p>
    )}
    <p className="ws-subtitle ws-start-card__privacy">
      Uploads and manual entries are deleted after analysis.{" "}
      <RouterLink to="/privacy">Learn how we handle data</RouterLink>.
    </p>
  </InfoCard>
);

export default StartCard;
