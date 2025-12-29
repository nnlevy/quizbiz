import { useEffect, useState } from "react";

import { getEffectiveConsent, saveConsent } from "../consent";

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

  return (
    <div className="privacy-controls">
      <h3>Privacy controls</h3>
      <label>
        <input type="checkbox" checked disabled /> Functional (required)
      </label>
      <label>
        <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> Analytics
      </label>
      <label>
        <input type="checkbox" checked={ads} onChange={(event) => setAds(event.target.checked)} /> Ads
      </label>
      <button type="button" className="secondary-button" onClick={handleSave}>
        Save choices
      </button>
    </div>
  );
};

export default PrivacyControls;
