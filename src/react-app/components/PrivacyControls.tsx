import { useEffect, useState } from "react";

import { getEffectiveConsent, saveConsent, shouldShowPrivacyControls } from "../consent";

const PrivacyControls = () => {
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const consent = getEffectiveConsent();
    setAnalytics(consent.analytics);
    setAds(consent.ads);
  }, []);

  const handleSave = () => {
    saveConsent({ functional: true, analytics, ads });
  };

  if (!shouldShowPrivacyControls()) return null;

  return (
    <div className="ws-privacy-controls">
      <h3>Privacy controls</h3>
      <label htmlFor="privacy-functional">
        <input id="privacy-functional" type="checkbox" checked disabled /> Functional (required)
      </label>
      <label htmlFor="privacy-analytics">
        <input
          id="privacy-analytics"
          type="checkbox"
          checked={analytics}
          onChange={(event) => setAnalytics(event.target.checked)}
        />{" "}
        Analytics
      </label>
      <label htmlFor="privacy-ads">
        <input
          id="privacy-ads"
          type="checkbox"
          checked={ads}
          onChange={(event) => setAds(event.target.checked)}
        />{" "}
        Ads
      </label>
      <button type="button" className="ws-button-secondary" onClick={handleSave}>
        Save choices
      </button>
    </div>
  );
};

export default PrivacyControls;
