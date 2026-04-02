import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";

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
    name: "EPA WaterSense",
    description: "Verified benchmarks for U.S. household usage",
    icon: "verified",
  },
];

const About = () => {
  usePageMeta({
    title: "About WaterShortcut | Save water with AI",
    description:
      "Learn how WaterShortcut uses AI water bill analysis to help households save water and money.",
    canonicalPath: "/about",
  });

  return (
    <section className="ws-page" aria-labelledby="about-title">
      <div className="ws-hero">
        <p className="eyebrow">About WaterShortcut</p>
        <h1 id="about-title">A calm way to save water.</h1>
        <p>
          We built WaterShortcut because water bills shouldn't need a decoder ring. Our goal is
          to help you spot leaks early, avoid tier jumps, and keep conservation stress-free.
        </p>
        <p>
          Have feedback or need support? Email us at{" "}
          <a href="mailto:admin@watershortcut.com">admin@watershortcut.com</a>.
        </p>
      </div>

      <div className="ws-info-card">
        <h2>What we deliver</h2>
        <ul className="ws-checklist">
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
            Clear summaries, not spreadsheets.
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
            Actionable next steps for your household.
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
            Tools for rebates, alerts, and smart follow-ups.
          </li>
        </ul>
      </div>

      <section className="ws-section" aria-labelledby="about-powered-by">
        <div className="ws-section-header">
          <p className="eyebrow">Built on infrastructure you can trust</p>
          <h2 id="about-powered-by" className="ws-section-title">Powered by</h2>
          <p className="ws-section-lede">
            Real AI. Real data. Here's exactly what's under the hood.
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
      </section>

      <div className="ws-tool-grid">
        <RouterLink className="ws-button" to="/analyze-water-bill">
          Start analysis
        </RouterLink>
        <RouterLink className="ws-button-secondary" to="/research">
          Explore research
        </RouterLink>
      </div>
    </section>
  );
};

export default About;
