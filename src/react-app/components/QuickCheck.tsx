import { useMemo, useState } from "react";

import { RouterLink } from "../routes/router";

const QuickCheck = () => {
  const [billAmount, setBillAmount] = useState(100);
  const yearlySavings = useMemo(() => billAmount * 0.2 * 12, [billAmount]);
  const calculatorHref = `/calculators?bill_amount=${encodeURIComponent(String(billAmount))}`;
  const clampAmount = (value: number) => Math.min(500, Math.max(0, value));
  const handleAmountChange = (value: number) => {
    if (!Number.isFinite(value)) {
      setBillAmount(0);
      return;
    }
    setBillAmount(clampAmount(value));
  };

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
          <div className="ws-quick-check__controls">
            <div className="ws-quick-check__slider">
              <input
                className="ws-quick-check__range"
                id="bill-range"
                type="range"
                min={0}
                max={500}
                value={billAmount}
                onChange={(event) => handleAmountChange(Number(event.target.value))}
              />
              <div className="ws-quick-check__range-labels">
                <span>$0</span>
                <span className="ws-quick-check__range-hint">Typical: $80–$120</span>
                <span>$500+</span>
              </div>
            </div>
            <div className="ws-quick-check__numeric">
              <label className="ws-field" htmlFor="bill-input">
                Or type a value
              </label>
              <div className="ws-quick-check__input">
                <span aria-hidden="true">$</span>
                <input
                  className="ws-input ws-quick-check__number"
                  id="bill-input"
                  type="number"
                  min={0}
                  max={500}
                  inputMode="numeric"
                  value={billAmount}
                  onChange={(event) => handleAmountChange(Number(event.target.value))}
                  aria-label="Monthly water bill amount in dollars"
                />
              </div>
            </div>
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
