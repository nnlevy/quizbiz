import ExploreTools from "../components/ExploreTools";
import FeatureGrid from "../components/FeatureGrid";
import Hero from "../components/Hero";
import EarnCreditsCard from "../components/EarnCreditsCard";
import QuickCheck from "../components/QuickCheck";
import TrustPrivacy from "../components/TrustPrivacy";
import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";

const Home = () => {
  usePageMeta({
    title: "Stop guessing your water bill | WaterShortcut",
    description:
      "For homeowners and renters: get clear water-bill actions in minutes. Upload a bill, run a quick score, or start with calculators.",
    canonicalPath: "/",
  });

  return (
    <section className="ws-page ws-home" aria-labelledby="home-title">
      <Hero
        eyebrow="Water care, reimagined"
        title="Stop Overpaying for Water."
        description="Upload your bill, get AI-powered insights, and start saving in under 60 seconds."
        titleId="home-title"
      >
        <div className="ws-cta-card ws-home-hero-card">
          <div className="ws-home-hero-card__preview">
            <span className="ws-home-hero-card__badge">
              <span className="material-symbols-outlined" aria-hidden="true">verified</span>
              AI-powered analysis
            </span>
            <p className="ws-home-hero-card__savings">
              <span className="ws-data">Your bill</span>
              <span className="ws-home-hero-card__savings-label">, decoded in plain English</span>
            </p>
          </div>
          <div className="ws-hero-actions">
            <RouterLink className="ws-button" to="/analyze-water-bill">
              <span className="material-symbols-outlined" aria-hidden="true">document_scanner</span>
              Scan my bill now
            </RouterLink>
            <RouterLink className="ws-button-secondary" to="/calculators">
              Explore calculators
            </RouterLink>
          </div>
          <p className="ws-home-hero-card__subtitle">3 free credits, no card required.</p>
        </div>
      </Hero>

      {/* EPA Facts Ticker */}
      <div className="ws-social-proof-ticker" aria-label="Water facts from the EPA">
        <div className="ws-social-proof-ticker__track">
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">water_drop</span>
            EPA: Average U.S. household uses 300 gallons/day
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">plumbing</span>
            EPA: Household leaks waste 1 trillion gallons nationally per year
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">savings</span>
            EPA WaterSense: Efficient fixtures cut use by up to 30%
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">warning</span>
            EPA: 10%+ of homes have leaks wasting 90+ gallons/day
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">water_drop</span>
            EPA: Average U.S. household uses 300 gallons/day
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">plumbing</span>
            EPA: Household leaks waste 1 trillion gallons nationally per year
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">savings</span>
            EPA WaterSense: Efficient fixtures cut use by up to 30%
          </span>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">warning</span>
            EPA: 10%+ of homes have leaks wasting 90+ gallons/day
          </span>
        </div>
      </div>

      {/* How It Works */}
      <section className="ws-section" aria-labelledby="how-title">
        <div className="ws-section-header">
          <p className="eyebrow">Savings in 3 simple steps</p>
          <h2 id="how-title" className="ws-section-title">How Water Shortcut Works</h2>
        </div>
        <div className="ws-how-grid" role="list">
          <article className="ws-how-card" role="listitem">
            <div className="ws-how-card__icon ws-how-card__icon--primary">
              <span className="material-symbols-outlined" aria-hidden="true">upload_file</span>
            </div>
            <h3>1. Upload Your Bill</h3>
            <p>Snap a photo or upload a PDF. Our AI reads it instantly.</p>
          </article>
          <article className="ws-how-card" role="listitem">
            <div className="ws-how-card__icon ws-how-card__icon--secondary">
              <span className="material-symbols-outlined" aria-hidden="true">analytics</span>
            </div>
            <h3>2. AI Analyzes It</h3>
            <p>We decode tiers, spot leaks, and find hidden overcharges.</p>
          </article>
          <article className="ws-how-card" role="listitem">
            <div className="ws-how-card__icon ws-how-card__icon--tertiary">
              <span className="material-symbols-outlined" aria-hidden="true">savings</span>
            </div>
            <h3>3. Claim Savings</h3>
            <p>Get a personalized plan with dollar amounts and next steps.</p>
          </article>
        </div>
      </section>

      {/* Why Save Water — IMB motivation layer */}
      <section className="ws-section ws-why-section" aria-labelledby="why-title">
        <div className="ws-section-header">
          <p className="eyebrow">Information + motivation</p>
          <h2 id="why-title" className="ws-section-title">Why save water?</h2>
        </div>
        <div className="ws-why-grid" role="list">
          <article className="ws-why-card" role="listitem">
            <span className="material-symbols-outlined ws-why-card__icon" aria-hidden="true">
              savings
            </span>
            <div>
              <h3>Save money and protect resources</h3>
              <p>
                On average, U.S. households waste hundreds of gallons of water each month. Cutting
                waste reduces your bill and helps conserve a precious resource.
              </p>
            </div>
          </article>
          <article className="ws-why-card" role="listitem">
            <span className="material-symbols-outlined ws-why-card__icon" aria-hidden="true">
              plumbing
            </span>
            <div>
              <h3>Identify leaks early</h3>
              <p>
                Hidden leaks can waste thousands of gallons per year. Early detection prevents costly
                repairs and water damage before they start.
              </p>
            </div>
          </article>
          <article className="ws-why-card" role="listitem">
            <span className="material-symbols-outlined ws-why-card__icon" aria-hidden="true">
              groups
            </span>
            <div>
              <h3>Be part of the solution</h3>
              <p>
                Households that track and act on their usage reduce water use by 509 gallons per
                month on average. Join the movement.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="ws-section" aria-labelledby="feature-grid-title">
        <div className="ws-section-header">
          <p className="eyebrow">Powered by AI &amp; EPA Data</p>
          <h2 id="feature-grid-title" className="ws-section-title">Your water savings toolkit</h2>
        </div>
        <FeatureGrid />
      </section>

      <QuickCheck />
      <EarnCreditsCard />
      <TrustPrivacy />
      <ExploreTools />

      {/* Final CTA */}
      <section className="ws-section ws-final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title" className="ws-section-title">Ready to stop guessing?</h2>
        <p className="ws-section-lede">Start free, save faster, keep full control. No credit card required.</p>
        <RouterLink className="ws-button ws-button--full" to="/analyze-water-bill">
          <span className="material-symbols-outlined" aria-hidden="true">document_scanner</span>
          Analyze my bill free
        </RouterLink>
      </section>
    </section>
  );
};

export default Home;
