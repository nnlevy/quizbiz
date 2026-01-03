import type { AnalysisMove } from "../types";

type ResultsCardProps = {
  move: AnalysisMove;
  calculatorHref?: string | null;
};

const ResultsCard = ({ move, calculatorHref }: ResultsCardProps) => (
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
    <div className="results-card__actions">
      <a className="secondary-button" href={move.ctaHref}>
        {move.ctaLabel}
      </a>
      {calculatorHref && calculatorHref !== move.ctaHref && (
        <a className="secondary-button ghost" href={calculatorHref}>
          Calculate savings
        </a>
      )}
    </div>
  </div>
);

export default ResultsCard;
