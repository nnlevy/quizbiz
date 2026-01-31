import { ReactNode } from "react";

import { RouterLink } from "../routes/router";

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  tone: "sky" | "emerald" | "slate";
  icon: ReactNode;
};

const featureCards: FeatureCard[] = [
  {
    title: "Leak Detector",
    description: "Spot hidden drips fast.",
    href: "/calculators#leak-estimator",
    tone: "sky",
    icon: (
      <>
        <path
          fill="currentColor"
          d="M12 2.5c2.9 2.7 4.5 5.6 4.5 8.3 0 2.6-2 4.7-4.5 4.7S7.5 13.4 7.5 10.8c0-2.7 1.6-5.6 4.5-8.3Z"
        />
        <path fill="currentColor" d="M6 17h12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" />
      </>
    ),
  },
  {
    title: "Shower vs Bath",
    description: "See where you stand.",
    href: "/calculators#shower-bath",
    tone: "emerald",
    icon: (
      <>
        <path
          fill="currentColor"
          d="M6 3h12a1 1 0 0 1 1 1v2H5V4a1 1 0 0 1 1-1Z"
        />
        <path
          fill="currentColor"
          d="M4 8h16v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"
        />
        <path fill="currentColor" d="M9 11h6v2H9z" />
      </>
    ),
  },
  {
    title: "Bill Audit",
    description: "Project your savings.",
    href: "/calculators#bill-savings",
    tone: "slate",
    icon: (
      <>
        <path
          fill="currentColor"
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12H4V6Z"
        />
        <path fill="currentColor" d="M7 9h10v2H7zm0 4h6v2H7z" />
      </>
    ),
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
        <span className="ws-tool-card__icon" aria-hidden>
          <svg viewBox="0 0 24 24" className="ws-tool-card__svg">
            {tool.icon}
          </svg>
        </span>
        <span className="ws-tool-card__body">
          <span className="ws-tool-card__title">{tool.title}</span>
          <span className="ws-tool-card__description">{tool.description}</span>
        </span>
        <span className="ws-tool-card__cta">
          Open <span aria-hidden>→</span>
        </span>
      </RouterLink>
    ))}
  </div>
);

export default FeatureGrid;
