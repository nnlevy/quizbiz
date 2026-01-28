import InfoCard from "./InfoCard";
import { RouterLink } from "../routes/router";

const TrustPrivacy = () => (
  <InfoCard aria-label="Privacy reassurance" className="ws-section">
    <div className="ws-section-header">
      <p className="eyebrow">Private by design</p>
      <h2 className="ws-section-title">Your data stays yours</h2>
      <p className="ws-section-lede">
        No logins, no sales, and no surprises. We keep your information short-lived and secure.
      </p>
    </div>
    <ul className="ws-pill-list">
      <li>No login required.</li>
      <li>Uploads are deleted after analysis.</li>
      <li>We don’t sell personal data.</li>
    </ul>
    <RouterLink className="ws-footer-link" to="/privacy">
      Read the privacy policy →
    </RouterLink>
  </InfoCard>
);

export default TrustPrivacy;
