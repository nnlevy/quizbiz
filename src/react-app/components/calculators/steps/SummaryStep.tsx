import { RouterLink } from "../../../routes/router";

const SummaryStep = ({
  gallonsPerDay,
  gallonsPerMonth,
  gallonsPerYear,
  showerGallons,
  bathGallons,
  showerCost,
  bathCost,
  savingsEstimate,
  savingsRate,
  tips,
}: {
  gallonsPerDay: number;
  gallonsPerMonth: number;
  gallonsPerYear: number;
  showerGallons: number;
  bathGallons: number;
  showerCost: number;
  bathCost: number;
  savingsEstimate: number;
  savingsRate: number;
  tips: string[];
}) => (
  <div className="ws-calculators__summary-grid">
    <div className="ws-calculators__summary-card">
      <p className="ws-calculators__summary-card-title">Leak impact</p>
      <div className="ws-calculators__summary-metric">
        <span>Daily waste</span>
        <strong>{gallonsPerDay.toFixed(1)} gal</strong>
      </div>
      <div className="ws-calculators__summary-metric">
        <span>Monthly waste</span>
        <strong>{gallonsPerMonth.toFixed(0)} gal</strong>
      </div>
      <div className="ws-calculators__summary-metric">
        <span>Yearly waste</span>
        <strong>{gallonsPerYear.toFixed(0)} gal</strong>
      </div>
    </div>

    <div className="ws-calculators__summary-card">
      <p className="ws-calculators__summary-card-title">Shower vs. bath</p>
      <div className="ws-calculators__summary-metric">
        <span>Shower session</span>
        <strong>
          {showerGallons.toFixed(1)} gal · ${showerCost.toFixed(2)}
        </strong>
      </div>
      <div className="ws-calculators__summary-metric">
        <span>Bath session</span>
        <strong>
          {bathGallons.toFixed(1)} gal · ${bathCost.toFixed(2)}
        </strong>
      </div>
    </div>

    <div className="ws-calculators__summary-card">
      <p className="ws-calculators__summary-card-title">Savings projection</p>
      <div className="ws-calculators__summary-metric">
        <span>Estimated monthly savings</span>
        <strong>${savingsEstimate.toFixed(0)}</strong>
      </div>
      <div className="ws-calculators__summary-metric">
        <span>Target reduction</span>
        <strong>{(savingsRate * 100).toFixed(0)}%</strong>
      </div>
      <RouterLink className="ws-calculators__link-button" to="/dashboard">
        Start Savings Plan
      </RouterLink>
    </div>

    <div className="ws-calculators__summary-card ws-calculators__summary-card--tips">
      <p className="ws-calculators__summary-card-title">Next best moves</p>
      <ul className="ws-calculators__tips">
        {tips.map((tip) => (
          <li key={tip} className="ws-calculators__tip">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default SummaryStep;
