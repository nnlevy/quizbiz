import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink } from "./router";

const About = () => {
  useDocumentTitle("WaterShortcut | About");

  return (
    <section className="ws-page" aria-labelledby="about-title">
      <div className="ws-hero">
        <p className="eyebrow">About WaterShortcut</p>
        <h1 id="about-title">A calm way to save water.</h1>
        <p>
          WaterShortcut turns confusing bills into easy-to-follow steps. Our goal is to help you
          spot leaks early, avoid tier jumps, and keep conservation stress-free.
        </p>
        <p>
          Have feedback or need support? Email us at{" "}
          <a href="mailto:admin@watershortcut.com">admin@watershortcut.com</a>.
        </p>
      </div>

      <div className="ws-progress">
        <h2>What we deliver</h2>
        <ul className="ws-checklist">
          <li>Clear summaries, not spreadsheets.</li>
          <li>Actionable next steps for your household.</li>
          <li>Tools for rebates, alerts, and smart follow-ups.</li>
        </ul>
      </div>

      <div className="ws-tool-grid">
        <RouterLink className="ws-footer-link" to="/analyze-water-bill">
          Start analysis →
        </RouterLink>
        <RouterLink className="ws-footer-link" to="/research">
          Explore research →
        </RouterLink>
      </div>
    </section>
  );
};

export default About;
