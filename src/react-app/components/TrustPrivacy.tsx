import InfoCard from "./InfoCard";
import { RouterLink } from "../routes/router";

const partners = [
  {
    name: "OpenAI",
    description: "Bill analysis & natural-language insights",
    icon: "psychology",
  },
  {
    name: "Google Document AI",
    description: "Accurate bill scanning & data extraction",
    icon: "document_scanner",
  },
  {
    name: "Cloudflare",
    description: "Edge infrastructure — fast, private, global",
    icon: "cloud",
  },
  {
    name: "EPA WaterSense Data",
    description: "Verified benchmarks for U.S. household usage",
    icon: "verified",
  },
];

const TrustPrivacy = () => (
  <section className="ws-section ws-trust-section" aria-labelledby="trust-title">
    <div className="ws-section-header">
      <p className="eyebrow">Built on infrastructure you can trust</p>
      <h2 id="trust-title" className="ws-section-title">Powered by</h2>
      <p className="ws-section-lede">
        Real AI. Real data. No smoke and mirrors — here's exactly what's under the hood.
      </p>
    </div>

    <div className="ws-partners-grid" role="list">
      {partners.map((p) => (
        <div key={p.name} className="ws-partner-card" role="listitem">
          <span className="material-symbols-outlined ws-partner-card__icon" aria-hidden="true">
            {p.icon}
          </span>
          <div className="ws-partner-card__body">
            <strong className="ws-partner-card__name">{p.name}</strong>
            <span className="ws-partner-card__desc">{p.description}</span>
          </div>
        </div>
      ))}
    </div>

    <InfoCard aria-label="Privacy reassurance" className="ws-trust-privacy-card">
      <div className="ws-section-header">
        <p className="eyebrow">Private by design</p>
        <h3 className="ws-section-title">Your data stays yours</h3>
        <p className="ws-section-lede">
          Data stays on your device — no login required. Uploads are deleted immediately after
          analysis. We never sell your information.
        </p>
      </div>
      <ul className="ws-pill-list">
        <li>No login required.</li>
        <li>Uploads deleted after analysis.</li>
        <li>We don't sell personal data.</li>
      </ul>
      <RouterLink className="ws-footer-link" to="/privacy">
        Read the privacy policy →
      </RouterLink>
    </InfoCard>
  </section>
);

export default TrustPrivacy;
