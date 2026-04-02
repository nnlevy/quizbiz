import { RouterLink } from "../routes/router";

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  tone: "sky" | "emerald" | "slate";
  icon: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "Leak Detector",
    description:
      "Enter meter readings to estimate hidden leaks. We'll alert you if your usage suggests a possible leak so you can fix it quickly.",
    href: "/calculators#leak-estimator",
    tone: "sky",
    icon: "water_damage",
  },
  {
    title: "Shower vs Bath",
    description:
      "Compare the water and cost of showers versus baths based on your habits.",
    href: "/calculators#shower-bath",
    tone: "emerald",
    icon: "shower",
  },
  {
    title: "Bill Audit",
    description:
      "Estimate how much you should be paying based on local rates, so you can check for billing errors.",
    href: "/calculators#bill-savings",
    tone: "slate",
    icon: "receipt_long",
  },
];

const FeatureGrid = () => (
  <div className="ws-tool-card-grid" role="list">
    {featureCards.map((tool) => (
      <RouterLink
        key={tool.title}
        to={tool.href}
        className={`ws-tool-card ws-tool-card--${tool.tone}`}
        role="listitem"
        aria-label={`${tool.title}: ${tool.description}`}
      >
        <span className="ws-tool-card__icon" aria-hidden="true">
          <span className="material-symbols-outlined">{tool.icon}</span>
        </span>
        <span className="ws-tool-card__body">
          <span className="ws-tool-card__title">{tool.title}</span>
          <span className="ws-tool-card__description">{tool.description}</span>
        </span>
        <span className="ws-tool-card__cta">
          Open <span aria-hidden="true">&rarr;</span>
        </span>
      </RouterLink>
    ))}
  </div>
);

export default FeatureGrid;
