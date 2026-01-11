import { useEffect, useState } from "react";

import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { copy } from "../../copy";
import { shouldShowPrivacyControls } from "../consent";
import { ADS_FREE_FLAG } from "../utils/credits";
import AdSenseSlot from "./AdSenseSlot";

type SiteFooterProps = {
  hideAds?: boolean;
};

const SiteFooter = ({ hideAds = false }: SiteFooterProps) => {
  const showPrivacyControls = shouldShowPrivacyControls();
  const [adsRemoved, setAdsRemoved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const readAdsSetting = () => {
      try {
        setAdsRemoved(window.localStorage.getItem(ADS_FREE_FLAG) === "true");
      } catch {
        setAdsRemoved(false);
      }
    };
    readAdsSetting();
    const handleAdsUpdate = () => readAdsSetting();
    window.addEventListener("ws-ads-updated", handleAdsUpdate);
    window.addEventListener("storage", handleAdsUpdate);
    return () => {
      window.removeEventListener("ws-ads-updated", handleAdsUpdate);
      window.removeEventListener("storage", handleAdsUpdate);
    };
  }, []);

  return (
    <footer className="site-footer">
      {!hideAds && !adsRemoved && (
        <div className="footer-ad">
          <AdSenseSlot
            slotId={DEFAULT_ADSENSE_SLOTS.footer}
            format="autorelaxed"
            className="ad-slot"
          />
        </div>
      )}
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/site-map">Site Map</a>
        <a href="/terms">Terms</a>
        {showPrivacyControls ? (
          <button
            type="button"
            className="link-button"
            onClick={() => window.dispatchEvent(new Event("ws-consent-open"))}
          >
            {copy.footer.privacySettings}
          </button>
        ) : null}
        <a href="/blog-how-to-eject.html">{copy.nav.ejectLabel}</a>
        <a href="/water-iq">Water IQ Challenge</a>
        <a href="/learn/water-saving-tips">Water-Saving Tips</a>
        <a href="/learn/leak-detection">Leak Detection</a>
      </div>
      <div className="footer-trust">
        <p>
          Uploads are deleted after analysis. We do not sell personal data. Our systems are SOC2
          compliant. <a href="/privacy">Read the privacy policy</a>.
        </p>
        <div className="footer-badges" aria-label="Security badges">
          <span className="footer-badge">SOC2</span>
          <span className="footer-badge">TLS 1.3</span>
          <span className="footer-badge">GDPR Ready</span>
        </div>
      </div>
      <p>
        {copy.footer.estimates} {copy.footer.sources} {copy.footer.help}
      </p>
    </footer>
  );
};

export default SiteFooter;
