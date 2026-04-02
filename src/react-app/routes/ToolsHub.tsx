import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";

type ToolCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  reloadDocument?: boolean;
};

type ToolCategory = {
  title: string;
  cards: ToolCard[];
};

const mostUsed: ToolCard[] = [
  {
    title: "Leak Detector",
    description: "Find high-impact leaks before they raise your bill.",
    href: "/calculators#leak-estimator",
    icon: "water_damage",
  },
  {
    title: "Shower vs Bath",
    description: "Compare daily habits and estimate annual water use.",
    href: "/calculators#shower-bath",
    icon: "shower",
  },
  {
    title: "Bill Audit",
    description: "Check current usage and map your fastest savings.",
    href: "/analyze-water-bill",
    icon: "receipt_long",
  },
];

const categories: ToolCategory[] = [
  {
    title: "Save Money",
    cards: [
      {
        title: "Analyze Bill",
        description: "Upload a bill and get a savings plan in minutes.",
        href: "/analyze-water-bill",
        icon: "receipt_long",
      },
      {
        title: "Savings Checklist",
        description: "Follow practical steps that lower usage this week.",
        href: "/guides",
        icon: "checklist",
        reloadDocument: true,
      },
    ],
  },
  {
    title: "DIY",
    cards: [
      {
        title: "Water Calculators",
        description: "Run home scenarios for showers, leaks, and appliances.",
        href: "/calculators",
        icon: "calculate",
      },
      {
        title: "Leak Check Hub",
        description: "Troubleshoot common leak patterns room by room.",
        href: "/leak-check",
        icon: "plumbing",
      },
    ],
  },
  {
    title: "Social",
    cards: [
      {
        title: "Water Savings Score",
        description: "Take the challenge and share your score badge.",
        href: "/water-iq",
        icon: "emoji_events",
      },
      {
        title: "Leaderboard",
        description: "See how your household stacks up over time.",
        href: "/dashboard",
        icon: "leaderboard",
      },
    ],
  },
  {
    title: "Rebates & Programs",
    cards: [
      {
        title: "Find Rebates",
        description: "Locate local offers for efficient fixtures and upgrades.",
        href: "/rebates",
        icon: "redeem",
        reloadDocument: true,
      },
      {
        title: "Find Water Provider",
        description: "Look up utility contacts and account support links.",
        href: "/find-water-provider",
        icon: "location_on",
      },
    ],
  },
  {
    title: "Learn",
    cards: [
      {
        title: "Guides",
        description: "Learn billing basics, leaks, and water-saving habits.",
        href: "/guides",
        icon: "menu_book",
        reloadDocument: true,
      },
      {
        title: "Research Plan",
        description: "Build a custom plan for your next conservation project.",
        href: "/research",
        icon: "science",
      },
    ],
  },
];

const ToolsHub = () => {
  usePageMeta({
    title: "Water tools hub | WaterShortcut",
    description: "Explore WaterShortcut tools across savings, DIY, social, rebates, and learning.",
    canonicalPath: "/tools",
  });

  return (
    <section className="ws-page ws-tools" aria-labelledby="tools-title">
      <div className="ws-hero ws-tools__hero">
        <p className="eyebrow">Tools Hub</p>
        <h1 id="tools-title">Pick your next water-saving tool.</h1>
        <p className="ws-hero-lede">Start with the most used options, then explore by category.</p>
      </div>

      <section className="ws-section" aria-labelledby="most-used-title">
        <h2 id="most-used-title" className="ws-section-title">Most used</h2>
        <div className="ws-hub-grid" role="list">
          {mostUsed.map((tool) => (
            <article key={tool.title} className="ws-hub-card" role="listitem">
              <div className="ws-hub-card__header">
                <span className="material-symbols-outlined ws-hub-card__icon" aria-hidden="true">
                  {tool.icon}
                </span>
                <h3>{tool.title}</h3>
              </div>
              <p>{tool.description}</p>
              <RouterLink to={tool.href} reloadDocument={tool.reloadDocument} className="ws-button-secondary">
                {"Start \u2192"}
              </RouterLink>
            </article>
          ))}
        </div>
      </section>

      {categories.map((category, index) => (
        <section className="ws-section" aria-labelledby={`category-${index}`} key={category.title}>
          <h2 id={`category-${index}`} className="ws-section-title">{category.title}</h2>
          <div className="ws-hub-grid" role="list">
            {category.cards.map((card) => (
              <article className="ws-hub-card" key={card.title} role="listitem">
                <div className="ws-hub-card__header">
                  <span className="material-symbols-outlined ws-hub-card__icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                </div>
                <p>{card.description}</p>
                <RouterLink to={card.href} reloadDocument={card.reloadDocument} className="ws-button-secondary">
                  {"Start \u2192"}
                </RouterLink>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default ToolsHub;
