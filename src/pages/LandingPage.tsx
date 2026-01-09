import { useMemo, useState } from "react";
import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import "../react-app/App.css";

type Feature = {
  title: string;
  description: string;
  outcome: string;
  href: string;
  cta: string;
};

const features: Feature[] = [
  {
    title: "Scan your bill in minutes",
    description: "Upload a statement and get instant pattern flags.",
    outcome: "Know exactly where your spend spiked.",
    href: "/analyze-water-bill",
    cta: "Analyze now",
  },
  {
    title: "Build a savings plan",
    description: "Pick the fastest fixes that match your home.",
    outcome: "Turn 3 quick wins into monthly savings.",
    href: "/savings-plan",
    cta: "See my plan",
  },
  {
    title: "Spot leaks fast",
    description: "Run a lightweight check to catch quiet waste.",
    outcome: "Stop hidden drips before they grow.",
    href: "/leak-check",
    cta: "Run leak check",
  },
];

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeFeature = useMemo(() => features[activeIndex], [activeIndex]);

  return (
    <div className="app landing-page">
      <SiteNav />
      <main className="landing-main">
        <section className="landing-hero">
          <p className="landing-eyebrow">WaterShortcut mobile</p>
          <h1>Cut your water bill in minutes.</h1>
          <p className="landing-subtitle">
            Snap to the savings. Find leaks, track spikes, and build a plan that pays you
            back every month.
          </p>
          <div className="landing-cta">
            <a className="primary-button" href="/analyze-water-bill">
              Start with my bill
            </a>
            <a className="secondary-button" href="/calculators">
              Try a calculator
            </a>
          </div>
          <div className="landing-proof">
            <span>2-minute setup</span>
            <span>•</span>
            <span>Mobile-first</span>
            <span>•</span>
            <span>Actionable next steps</span>
          </div>
        </section>

        <section className="landing-interactive" aria-label="Interactive highlights">
          <div className="landing-section-heading">
            <h2>Tap to choose your fastest win.</h2>
            <p>Each card animates with the outcome you will see first.</p>
          </div>
          <div className="landing-feature-grid" role="list">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                className={`landing-feature-card ${index === activeIndex ? "active" : ""}`}
                type="button"
                role="listitem"
                onClick={() => setActiveIndex(index)}
              >
                <span className="feature-title">{feature.title}</span>
                <span className="feature-description">{feature.description}</span>
              </button>
            ))}
          </div>
          <div className="landing-feature-detail" aria-live="polite">
            <p className="feature-outcome">{activeFeature.outcome}</p>
            <a className="primary-button" href={activeFeature.href}>
              {activeFeature.cta}
            </a>
          </div>
        </section>

        <section className="landing-quick-actions">
          <h2>Only the essentials, all in one place.</h2>
          <div className="landing-action-grid">
            <div className="landing-action-tile">
              <h3>Bill clarity</h3>
              <p>See where your usage jumps with a quick scan.</p>
            </div>
            <div className="landing-action-tile">
              <h3>Leak confidence</h3>
              <p>Catch silent leaks before they become expensive.</p>
            </div>
            <div className="landing-action-tile">
              <h3>Instant tools</h3>
              <p>Use fast calculators to estimate savings now.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LandingPage;
