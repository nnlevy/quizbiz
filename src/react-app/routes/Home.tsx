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
    <section className="ws-page ws-home" aria-labelledby="home-title">
      <Hero
        eyebrow="Water care, reimagined"
        title="The easiest way to cut your water bill and flex your impact."
        description="Upload a bill, get instant next steps, and turn daily water habits into a game you actually want to win."
        titleId="home-title"
      >
        <div className="ws-cta-card ws-home-hero-card">
          <h2>Start in under 60 seconds</h2>
          <p className="ws-home-hero-card__subtitle">No install. No utility jargon. Just your smartest next move.</p>
          <div className="ws-hero-actions">
            <RouterLink className="ws-button" to="/water-iq">
              Take my Water IQ challenge
            </RouterLink>
            <RouterLink className="ws-button-secondary" to="/analyze-water-bill">
              Scan my latest water bill
            </RouterLink>
          </div>
          <ul className="ws-home-proof-list" aria-label="Core value points">
            <li>Personalized savings plan</li>
            <li>Leak and spike detection</li>
            <li>Renter-safe action ideas</li>
          </ul>
        </div>
      </Hero>

      <section className="ws-section ws-home-value-band" aria-labelledby="rail-title">
        <div className="ws-section-header">
          <p className="eyebrow">Why people switch to WaterShortcut</p>
          <h2 id="rail-title" className="ws-section-title">Built for real life, not perfect routines</h2>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>See what changed this month</h3>
            <p>We translate your bill into plain English so you can spot costly spikes fast.</p>
            <RouterLink to="/analyze-water-bill" className="ws-hero-link">Analyze my bill</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>Get a game-ready score</h3>
            <p>Our Water IQ challenge gives you a personalized score and your best first win.</p>
            <RouterLink to="/water-iq" className="ws-hero-link">Get my score</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>Save water wherever you live</h3>
            <p>Choose renter-safe, family-friendly, or advanced upgrades by effort level.</p>
            <RouterLink to="/tools" className="ws-hero-link">Explore all tools</RouterLink>
          </article>
        </div>
      </section>

      <section className="ws-section" aria-labelledby="contract-title">
        <div className="ws-section-header">
          <p className="eyebrow">Designed like your favorite apps</p>
          <h2 id="contract-title" className="ws-section-title">Clarity, momentum, and a little dopamine</h2>
          <p className="ws-section-lede">
            WaterShortcut blends calm clarity, playful momentum, and instant feedback.
          </p>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <h3>1) Instant understanding</h3>
            <p>Know where costs jumped, why it happened, and what to tackle first.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>2) Action in one tap</h3>
            <p>Every recommendation includes effort level, expected impact, and the next click.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>3) Progress you can feel</h3>
            <p>Earn credits, track streaks, and share your savings milestones with friends.</p>
          </article>
        </div>
      </section>

      <section className="ws-section ws-home-start-steps" aria-labelledby="start-options-title">
        <div className="ws-section-header">
          <p className="eyebrow">Easy start options</p>
          <h2 id="start-options-title" className="ws-section-title">Choose the easiest first step</h2>
        </div>
        <div className="ws-start-step-grid" role="list">
          <article className="ws-start-step-card" role="listitem">
            <p className="ws-start-step-card__eyebrow">Fastest context</p>
            <h3>Bill scan</h3>
            <p>Perfect when your latest statement looks higher than expected.</p>
            <RouterLink to="/analyze-water-bill" className="ws-button-secondary ws-start-step-card__cta">Analyze my bill</RouterLink>
          </article>
          <article className="ws-start-step-card" role="listitem">
            <p className="ws-start-step-card__eyebrow">Most popular</p>
            <h3>Quick score</h3>
            <p>Ideal when you want your fastest personalized roadmap.</p>
            <RouterLink to="/water-iq" className="ws-button ws-start-step-card__cta">Get my score</RouterLink>
          </article>
          <article className="ws-start-step-card" role="listitem">
            <p className="ws-start-step-card__eyebrow">Deep dive</p>
            <h3>Smart calculators</h3>
            <p>Great for pressure-testing ideas before you buy tools or upgrades.</p>
            <RouterLink to="/calculators" className="ws-button-secondary ws-start-step-card__cta">Open calculators</RouterLink>
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
          <p className="eyebrow">Risk-free start</p>
          <h2 id="reassurance-title" className="ws-section-title">Start free, save faster, keep full control</h2>
          <p className="ws-section-lede">
            No credit card. No setup headache. <a href="/tools">Browse the tool library</a> and begin wherever you are.
          </p>
        </div>
      </section>
      <section className="ws-section" aria-labelledby="off-ramp-title">
        <div className="ws-section-header">
          <p className="eyebrow">Need a lighter start?</p>
          <h2 id="off-ramp-title" className="ws-section-title">Try one calculator before committing to a full analysis</h2>
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
