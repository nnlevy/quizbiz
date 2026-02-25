import ExploreTools from "../components/ExploreTools";
import FeatureGrid from "../components/FeatureGrid";
import Hero from "../components/Hero";
import EarnCreditsCard from "../components/EarnCreditsCard";
import QuickCheck from "../components/QuickCheck";
import TrustPrivacy from "../components/TrustPrivacy";
import DropletCheckIcon from "../components/DropletCheckIcon";
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
    <section className="ws-page" aria-labelledby="home-title">
      <Hero
        eyebrow="For homeowners and renters"
        title="Stop guessing what's driving your water bill."
        description="See what changed, what to do first, and where to start based on your situation."
        titleId="home-title"
      >
        <div className="ws-cta-card">
          <h2>Take Our Water IQ Challenge.</h2>
          <div className="ws-hero-actions">
            <RouterLink className="ws-button" to="/water-iq">
              Homeowner or renter? Get my quick score
            </RouterLink>
            <RouterLink className="ws-button-secondary" to="/analyze-water-bill">
              Upload my latest bill
            </RouterLink>
          </div>
        </div>
      </Hero>

      <section className="ws-section" aria-labelledby="rail-title">
        <div className="ws-section-header">
          <p className="eyebrow">Shortcuts to save money and conserve water</p>
          <h2 id="rail-title" className="ws-section-title">Does this sound familiar?</h2>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>My usage looks random month to month</h3>
            <p>You are not sure if this is seasonal, a leak, or a billing mismatch.</p>
            <RouterLink to="/analyze-water-bill" className="ws-hero-link">Check my bill</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>I want simple steps, not utility jargon</h3>
            <p>You want plain-English actions you can do this week.</p>
            <RouterLink to="/water-iq" className="ws-hero-link">Get my action plan</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>I rent, so I need tenant-safe options</h3>
            <p>You need low-friction moves you can use without major home changes.</p>
            <RouterLink to="/tools" className="ws-hero-link">See renter-safe options</RouterLink>
          </article>
        </div>
      </section>

      <section className="ws-section" aria-labelledby="contract-title">
        <div className="ws-section-header">
          <p className="eyebrow">About Us</p>
          <h2 id="contract-title" className="ws-section-title">What you'll get in minutes</h2>
          <p className="ws-section-lede">
            Our mission is to make it fast and easy to understand changes in your water consumption. Water conservation should be a fun way to save money. Our goal is to provide you with:
          </p>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <h3>1) Bill clarity</h3>
            <p>Where your cost changed and which line items matter most.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>2) Practical actions</h3>
            <p>Priority actions ranked by likely savings and effort.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>3) Pure joy</h3>
            <p>Earn credits and compete with friends for the highest water savings score.</p>
          </article>
        </div>
      </section>

      <section className="ws-section" aria-labelledby="start-options-title">
        <div className="ws-section-header">
          <p className="eyebrow">Easy start options</p>
          <h2 id="start-options-title" className="ws-section-title">Choose the easiest first step</h2>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <h3>Upload a bill</h3>
            <p>Best when you want bill-specific guidance now.</p>
            <RouterLink to="/analyze-water-bill" className="ws-hero-link">Analyze my bill</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>Quick score</h3>
            <p>Best when you need direction before digging into line items.</p>
            <RouterLink to="/water-iq" className="ws-hero-link">Get my score</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>Calculators</h3>
            <p>Best when you want fast estimates on leaks, showers, and outdoor water.</p>
            <RouterLink to="/calculators" className="ws-hero-link">Open calculators</RouterLink>
          </article>
        </div>
      </section>

      <EarnCreditsCard />

      <section className="ws-section" aria-labelledby="feature-grid-title">
        <div className="ws-section-header">
          <p className="eyebrow">Powered by AI &amp; EPA Data</p>
          <h2 id="feature-grid-title" className="ws-section-title">The fastest way to spot savings</h2>
          <p className="ws-section-lede">
            Start with a quick check or jump straight into the calculators most customers use.
          </p>
        </div>
        <FeatureGrid />
      </section>

      <QuickCheck />
      <section className="ws-section" aria-labelledby="reassurance-title">
        <div className="ws-section-header">
          <p className="eyebrow">Reassurance</p>
          <h2 id="reassurance-title" className="ws-section-title">What are you waiting for?</h2>
          <p className="ws-section-lede">
            No login required. <a href="/tools">Click here to explore our tools</a>
          </p>
        </div>
      </section>
      <section className="ws-section" aria-labelledby="off-ramp-title">
        <div className="ws-section-header">
          <p className="eyebrow">Off-ramp</p>
          <h2 id="off-ramp-title" className="ws-section-title">Try our AI calculators to compare your water usage to average consumption</h2>
          <p className="ws-section-lede">
            Start with one calculator and come back when you have your bill handy.
          </p>
          <RouterLink className="ws-button-secondary" to="/calculators">
            Start with calculators only
          </RouterLink>
        </div>
      </section>
      <TrustPrivacy />
      <ExploreTools />
    </section>
  );
};

export default Home;
