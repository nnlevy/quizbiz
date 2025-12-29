import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { copy } from "../../copy";
import AdSenseSlot from "./AdSenseSlot";

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="footer-ad">
      <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="autorelaxed" className="ad-slot" />
    </div>
    <div className="footer-links">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <button
        type="button"
        className="link-button"
        onClick={() => window.dispatchEvent(new Event("ws-consent-open"))}
      >
        {copy.footer.privacySettings}
      </button>
      <a href="/blog-how-to-eject.html">{copy.nav.ejectLabel}</a>
      <a href="/learn/water-saving-tips">Water-Saving Tips</a>
      <a href="/learn/leak-detection">Leak Detection</a>
    </div>
    <p>
      {copy.footer.estimates} {copy.footer.sources} {copy.footer.help}
    </p>
  </footer>
);

export default SiteFooter;
