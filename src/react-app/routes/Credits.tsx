import { useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCredits } from "../context/CreditsContext";
import { useCreditsCheckout } from "../hooks/useCreditsCheckout";
import { CREDIT_TOPUP_AMOUNT, CREDIT_TOPUP_PRICE } from "../utils/credits";
import { RouterLink } from "./router";

const Credits = () => {
  useDocumentTitle("WaterShortcut | Credits");
  const { credits } = useCredits();
  const [notice, setNotice] = useState<string | null>(null);
  const { startCheckout } = useCreditsCheckout({ onNotice: setNotice });

  return (
    <section className="ws-page" aria-labelledby="credits-title">
      <div className="ws-hero">
        <p className="eyebrow">Credits center</p>
        <h1 id="credits-title">Credits power your WaterShortcut experience.</h1>
        <p>
          Use credits to unlock bill analysis, create an account, and keep the experience ad-free.
        </p>
        <div className="ws-subtitle">Credits available: {credits}</div>
        <div className="ws-subtitle">Cost per analysis: 1 credit</div>
      </div>

      <div className="ws-cta-card" aria-label="Buy more credits">
        <div>
          <h2>Top up credits</h2>
          <p className="ws-subtitle">
            Buy {CREDIT_TOPUP_AMOUNT} credits for ${CREDIT_TOPUP_PRICE} to keep your insights
            flowing.
          </p>
        </div>
        <button className="ws-button" type="button" onClick={startCheckout}>
          Buy {CREDIT_TOPUP_AMOUNT} credits
        </button>
      </div>

      <div className="ws-cta-card" aria-label="Manage credits">
        <div>
          <h2>How credits work</h2>
          <p className="ws-subtitle">
            Each bill analysis uses 1 credit. Buy more credits any time to keep results flowing.
          </p>
        </div>
        <div className="ws-tool-grid" style={{ marginTop: "0.75rem" }}>
          <RouterLink className="ws-button-secondary" to="/dashboard">
            View my dashboard
          </RouterLink>
          <RouterLink className="ws-button-secondary" to="/analyze">
            Start a new analysis
          </RouterLink>
        </div>
        {notice ? <p className="ws-subtitle">{notice}</p> : null}
      </div>
    </section>
  );
};

export default Credits;
