import { useMemo, useState } from "react";

import { RouterLink } from "../routes/router";

const QuickCheck = () => {
  const [billAmount, setBillAmount] = useState(100);
  const yearlySavings = useMemo(() => billAmount * 0.2 * 12, [billAmount]);
  const calculatorHref = `/calculators?bill_amount=${encodeURIComponent(String(billAmount))}`;

  return (
    <section className="ws-quick-check" aria-labelledby="quick-check-title" id="quick-check">
      <div className="ws-section-header">
        <p className="eyebrow">Quick Check</p>
        <h2 id="quick-check-title" className="ws-section-title">
          Estimate your savings in seconds
        </h2>
        <p className="ws-section-lede">
          Slide to match your monthly bill and get an instant estimate, then unlock the full AI
          breakdown.
        </p>
      </div>
      <div className="ws-quick-check__grid">
        <div className="ws-quick-check__copy">
          <p className="ws-section-lede">
            We use EPA benchmarks and local rate data to highlight the savings hiding in your bill.
          </p>
          <ul className="ws-pill-list">
            <li>Estimate hidden leak costs.</li>
            <li>Compare showers vs baths.</li>
            <li>Project annual savings.</li>
          </ul>
        </div>
        <div className="ws-quick-check__card">
          <label className="ws-field" htmlFor="bill-range">
            Monthly Water Bill ($)
          </label>
          <input
            className="ws-quick-check__range"
            id="bill-range"
            type="range"
            min={0}
            max={500}
            value={billAmount}
            onChange={(event) => setBillAmount(Number(event.target.value))}
          />
          <div className="ws-quick-check__range-labels">
            <span>$0</span>
            <span>$500+</span>
          </div>
          <div className="ws-quick-check__estimate">
            <p className="ws-quick-check__estimate-label">Potential Savings</p>
            <p className="ws-quick-check__estimate-value">~${yearlySavings.toFixed(0)}/year</p>
          </div>
          <RouterLink
            className="ws-button ws-button--full"
            to={calculatorHref}
            aria-label="Unlock AI analysis and details"
          >
            Unlock AI Analysis &amp; Details
          </RouterLink>
        </div>
      </div>
    </section>
  );
};

export default QuickCheck;
