import type { ReactNode } from "react";

const SummaryCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="ws-calculators__summary-card">
    <p className="ws-calculators__summary-card-title">{title}</p>
    {children}
  </div>
);
import { RouterLink } from "../../../routes/router";

const SummaryStep = ({
  gallonsPerDay,
  gallonsPerMonth,
  gallonsPerYear,
  showerGallons,
  showerCost,
  bathGallons,
  bathCost,
  maxSessionGallons,
  savingsEstimate,
  savingsRate,
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
  showerCost: number;
  bathGallons: number;
  bathCost: number;
  maxSessionGallons: number;
  savingsEstimate: number;
  savingsRate: number;
}) => (
  <div className="ws-calculators__summary-cards">
    <SummaryCard title="Leak impact">
      <div className="ws-calculators__summary-card-row">
        <span>Daily waste</span>
        <span className="ws-calculators__summary-card-value">
          {gallonsPerDay.toFixed(1)} gal
        </span>
      </div>
      <div className="ws-calculators__summary-card-row">
        <span>Monthly waste</span>
        <span className="ws-calculators__summary-card-value">
          {gallonsPerMonth.toFixed(0)} gal
        </span>
      </div>
      <div className="ws-calculators__summary-card-row">
        <span>Yearly waste</span>
        <span className="ws-calculators__summary-card-value">
          {gallonsPerYear.toFixed(0)} gal
        </span>
      </div>
    </SummaryCard>

    <SummaryCard title="Shower vs. bath">
      <div className="ws-calculators__summary-card-row">
        <span>Shower</span>
        <span className="ws-calculators__summary-card-value">
          {showerGallons.toFixed(1)} gal · ${showerCost.toFixed(2)}
        </span>
      </div>
      <div className="ws-calculators__bar-track">
        <div
          className="ws-calculators__bar-fill is-sky"
          style={{ width: `${(showerGallons / maxSessionGallons) * 100}%` }}
        />
      </div>
      <div className="ws-calculators__summary-card-row">
        <span>Bath</span>
        <span className="ws-calculators__summary-card-value">
          {bathGallons.toFixed(1)} gal · ${bathCost.toFixed(2)}
        </span>
      </div>
      <div className="ws-calculators__bar-track">
        <div
          className="ws-calculators__bar-fill is-emerald"
          style={{ width: `${(bathGallons / maxSessionGallons) * 100}%` }}
        />
      </div>
    </SummaryCard>

    <SummaryCard title="Savings snapshot">
      <p className="ws-calculators__summary-card-metric">
        ${savingsEstimate.toFixed(0)} saved per month
      </p>
      <p className="ws-calculators__summary-card-subtext">
        Estimated {(savingsRate * 100).toFixed(0)}% usage reduction.
      </p>
    </SummaryCard>

    <SummaryCard title="Tips to try next">
      <ul className="ws-calculators__summary-tip-list">
        <li>Swap to EPA WaterSense showerheads for immediate flow savings.</li>
        <li>Fixing one faucet leak can save hundreds of gallons each month.</li>
        <li>Use bill alerts to stay within your monthly savings target.</li>
      </ul>
    </SummaryCard>
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
