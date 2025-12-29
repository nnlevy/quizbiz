import type { AnalysisMove } from "../types";

type ResultsCardProps = {
  move: AnalysisMove;
};

const ResultsCard = ({ move }: ResultsCardProps) => (
  <div className="results-card">
    <h3>{move.title}</h3>
    <p className="muted">{move.why}</p>
    <div className="results-card__meta">
      <span>Effort: {move.effort}</span>
      <span>Impact: {move.impact}</span>
    </div>
    <ul>
      {move.steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
    <a className="secondary-button" href={move.ctaHref}>
      {move.ctaLabel}
    </a>
  </div>
);

export default ResultsCard;
