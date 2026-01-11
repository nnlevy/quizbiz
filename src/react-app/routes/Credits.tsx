import { useCallback, useEffect, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCredits } from "../context/CreditsContext";
import { useCreditsCheckout } from "../hooks/useCreditsCheckout";
import {
  ADS_FREE_FLAG,
  CREDIT_ACCOUNT_FLAG,
  CREDIT_TOPUP_AMOUNT,
  CREDIT_TOPUP_PRICE,
} from "../utils/credits";

const ACCOUNT_CREDIT_COST = 1;
const ADS_REMOVAL_CREDIT_COST = 3;

const Credits = () => {
  useDocumentTitle("WaterShortcut | Credits");
  const { credits, deduct } = useCredits();
  const [notice, setNotice] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const { startCheckout } = useCreditsCheckout({ onNotice: setNotice });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setAccountCreated(window.localStorage.getItem(CREDIT_ACCOUNT_FLAG) === "true");
      setAdsRemoved(window.localStorage.getItem(ADS_FREE_FLAG) === "true");
    } catch {
      setAccountCreated(false);
      setAdsRemoved(false);
    }
  }, []);

  const handleCreateAccount = useCallback(() => {
    if (accountCreated) {
      setNotice("Your account is already active.");
      return;
    }
    const nextCredits = deduct(ACCOUNT_CREDIT_COST);
    if (nextCredits === null) {
      setNotice("You need more credits to create an account.");
      return;
    }
    try {
      window.localStorage.setItem(CREDIT_ACCOUNT_FLAG, "true");
    } catch {
      // Ignore storage errors.
    }
    setAccountCreated(true);
    setNotice("Account created! Your credits now sync across devices.");
  }, [accountCreated, deduct]);

  const handleRemoveAds = useCallback(() => {
    if (adsRemoved) {
      setNotice("Ads are already removed on this device.");
      return;
    }
    const nextCredits = deduct(ADS_REMOVAL_CREDIT_COST);
    if (nextCredits === null) {
      setNotice("You need more credits to remove ads.");
      return;
    }
    try {
      window.localStorage.setItem(ADS_FREE_FLAG, "true");
      window.dispatchEvent(new Event("ws-ads-updated"));
    } catch {
      // Ignore storage errors.
    }
    setAdsRemoved(true);
    setNotice("Ads removed. Enjoy a cleaner WaterShortcut experience.");
  }, [adsRemoved, deduct]);

  return (
    <section className="ws-page" aria-labelledby="credits-title">
      <div className="ws-hero">
        <p className="eyebrow">Credits center</p>
        <h1 id="credits-title">Credits power your WaterShortcut experience.</h1>
        <p>
          Use credits to unlock bill analysis, create an account, and keep the experience ad-free.
        </p>
        <div className="ws-subtitle">Credits available: {credits}</div>
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

      <div className="ws-cta-card" aria-label="Account and ad-free upgrades">
        <div>
          <h2>Account &amp; ad-free upgrades</h2>
          <p className="ws-subtitle">
            Credits unlock your account and remove ads across the WaterShortcut experience.
          </p>
        </div>
        <div className="ws-tool-grid" style={{ marginTop: "0.75rem" }}>
          <div>
            <h3>Create an account</h3>
            <p className="ws-subtitle">
              Spend {ACCOUNT_CREDIT_COST} credit to sync your progress and keep your credit balance
              safe.
            </p>
            <button className="ws-button-secondary" type="button" onClick={handleCreateAccount}>
              {accountCreated ? "Account ready" : "Create account"}
            </button>
          </div>
          <div>
            <h3>Remove ads</h3>
            <p className="ws-subtitle">
              Spend {ADS_REMOVAL_CREDIT_COST} credits to remove sponsored placements.
            </p>
            <button className="ws-button-secondary" type="button" onClick={handleRemoveAds}>
              {adsRemoved ? "Ads removed" : "Go ad-free"}
            </button>
          </div>
        </div>
        {notice ? <p className="ws-subtitle">{notice}</p> : null}
      </div>
    </section>
  );
};

export default Credits;
