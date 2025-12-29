import { useEffect, useState } from "react";

import { applyConsentMode, getEffectiveConsent, getStoredConsent, isConsentRequired, saveConsent } from "../consent";

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    const effective = getEffectiveConsent();
    applyConsentMode(effective);
    setAnalytics(effective.analytics);
    setAds(effective.ads);
    setVisible(!stored);
  }, []);

  const acceptAll = () => {
    saveConsent({ functional: true, analytics: true, ads: true });
    setAnalytics(true);
    setAds(true);
    setVisible(false);
  };

  const reject = () => {
    saveConsent({ functional: true, analytics: false, ads: false });
    setAnalytics(false);
    setAds(false);
    setVisible(false);
  };

  const save = () => {
    saveConsent({ functional: true, analytics, ads });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <div>
        <strong>Your privacy controls</strong>
        <p>
          We use cookies for analytics and ads to keep WaterShortcut free. Choose what to allow.{" "}
          <a href="/privacy">Privacy details</a>.
        </p>
      </div>
      <div className="cookie-options">
        <label>
          <input type="checkbox" checked disabled /> Functional (required)
        </label>
        <label>
          <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> Analytics
        </label>
        <label>
          <input type="checkbox" checked={ads} onChange={(event) => setAds(event.target.checked)} /> Ads
        </label>
      </div>
      <div className="cookie-actions">
        <button className="secondary-button" type="button" onClick={reject}>
          Reject non-essential
        </button>
        <button className="secondary-button" type="button" onClick={save}>
          Save choices
        </button>
        <button className="primary-button" type="button" onClick={acceptAll}>
          Accept all
        </button>
      </div>
      {isConsentRequired() ? null : <p className="muted">You can update preferences at any time.</p>}
    </div>
  );
};

export default ConsentBanner;
