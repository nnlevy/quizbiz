import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDocumentTitle } from "../hooks/useDocumentTitle";

const Home = () => {
  useDocumentTitle("WaterShortcut | Analyze your water bill");
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    navigate("/analyze", { state: { mode: "upload", fileName: file.name } });
  };

  return (
    <section className="ws-page" aria-labelledby="home-title">
      <div className="ws-hero">
        <p className="eyebrow">Mobile-first WaterShortcut</p>
        <h1 id="home-title">Understand your water bill in minutes.</h1>
        <p>
          Upload a PDF, try a demo bill, or enter numbers by hand. We translate the bill into clear
          savings steps.
        </p>
      </div>

      <div className="ws-cta-card" aria-label="Analyze a water bill">
        <h2>Analyze my water bill</h2>
        <label className="ws-button" htmlFor="bill-upload">
          Upload a PDF
          <input
            id="bill-upload"
            name="bill-upload"
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="sr-only"
          />
        </label>
        {fileName && <p aria-live="polite">Selected: {fileName}</p>}
        <button
          className="ws-button-secondary"
          type="button"
          onClick={() => navigate("/analyze", { state: { mode: "demo" } })}
        >
          Try a demo bill
        </button>
        <button
          className="ws-button-secondary"
          type="button"
          onClick={() => navigate("/analyze", { state: { mode: "manual" } })}
        >
          Enter numbers manually
        </button>
      </div>

      <div aria-label="Privacy reassurance">
        <h2>Private by design</h2>
        <ul className="ws-pill-list">
          <li>No login required.</li>
          <li>Uploads are deleted after analysis.</li>
          <li>We don’t sell personal data.</li>
        </ul>
      </div>
    </section>
  );
};

export default Home;
