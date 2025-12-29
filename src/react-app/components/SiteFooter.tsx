import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import AdSenseSlot from "./AdSenseSlot";

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="footer-ad">
      <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="autorelaxed" className="ad-slot" />
    </div>
    <div className="footer-links">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="/learn/water-saving-tips">Water-Saving Tips</a>
      <a href="/learn/leak-detection">Leak Detection</a>
    </div>
    <p>
      Built to help households spot leaks, decode charges, and stay in control of every drop.
    </p>
  </footer>
);

export default SiteFooter;
