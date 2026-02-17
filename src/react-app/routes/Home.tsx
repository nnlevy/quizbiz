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
    title: "AI water bill analysis to save water | WaterShortcut",
    description:
      "Use AI water bill analysis to save water and money. Upload a bill, try a demo bill, or use manual entry.",
    canonicalPath: "/",
  });

  return (
    <section className="ws-page" aria-labelledby="home-title">
      <Hero
        eyebrow="Save Money & Conserve Water"
        title="Build your plan in one place."
        description="Get your Water Savings Score, upload a bill, and start action steps in minutes."
        titleId="home-title"
      >
        <div className="ws-cta-card">
          <h2>Start with the right entry point</h2>
          <div className="ws-hero-actions">
            <RouterLink className="ws-button" to="/water-iq">
              Get your Water Savings Score
            </RouterLink>
            <RouterLink className="ws-button-secondary" to="/analyze-water-bill">
              Upload a bill
            </RouterLink>
          </div>
        </div>
      </Hero>

      <section className="ws-section" aria-labelledby="rail-title">
        <div className="ws-section-header">
          <p className="eyebrow">Three rails</p>
          <h2 id="rail-title" className="ws-section-title">Choose your rail</h2>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>Save Money</h3>
            <p>Use bill analysis and a savings checklist to cut monthly waste.</p>
            <RouterLink to="/analyze-water-bill" className="ws-hero-link">Start saving</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>DIY</h3>
            <p>Try calculators, practical guides, and local rebates for home upgrades.</p>
            <RouterLink to="/tools" className="ws-hero-link">Explore DIY tools</RouterLink>
          </article>
          <article className="ws-rail-card" role="listitem">
            <DropletCheckIcon className="ws-rail-card__icon" />
            <h3>Social</h3>
            <p>Take the score challenge, share your badge, and track leaderboard progress.</p>
            <RouterLink to="/water-iq" className="ws-hero-link">Get your score</RouterLink>
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
      <TrustPrivacy />
      <ExploreTools />
    </section>
  );
};

export default Home;
