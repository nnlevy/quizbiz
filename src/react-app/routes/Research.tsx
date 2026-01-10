import { FormEvent, useMemo, useState } from "react";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RouterLink } from "./router";

const LOCATIONS = [
  "Austin, TX",
  "Los Angeles, CA",
  "Miami, FL",
  "Phoenix, AZ",
  "Portland, OR",
  "Seattle, WA",
  "San Diego, CA",
  "San Jose, CA",
  "Tampa, FL",
];

const Research = () => {
  useDocumentTitle("WaterShortcut | Research");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const suggestions = useMemo(
    () => LOCATIONS.filter((location) => location.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSelected(query.trim());
  };

  return (
    <section className="ws-page" aria-labelledby="research-title">
      <div className="ws-hero">
        <p className="eyebrow">Local research</p>
        <h1 id="research-title">Find rebates, alerts, and outage news.</h1>
        <p>Enter your city or utility district to build a personal action plan.</p>
      </div>

      <form className="ws-form" onSubmit={handleSubmit}>
        <label htmlFor="location-input">U.S. city or utility district</label>
        <input
          id="location-input"
          className="ws-input"
          type="text"
          list="location-suggestions"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g., Austin, TX"
          autoComplete="off"
          aria-autocomplete="list"
        />
        <datalist id="location-suggestions">
          {suggestions.map((location) => (
            <option key={location} value={location} />
          ))}
        </datalist>
        <button className="ws-button" type="submit">
          Build my research plan
        </button>
      </form>

      {selected && (
        <div className="ws-progress" aria-live="polite">
          <h2>Recommended checklist for {selected}</h2>
          <ul className="ws-checklist">
            <li>Call the water conservation office and ask about appliance rebates.</li>
            <li>Request the latest outage alert sign-up link for {selected}.</li>
            <li>Search for “{selected} leak adjustment policy” and record requirements.</li>
          </ul>
          <div className="ws-tool-grid">
            <RouterLink className="ws-footer-link" to="/analyze">
              Back to analysis →
            </RouterLink>
            <RouterLink className="ws-footer-link" to="/">
              Return home →
            </RouterLink>
          </div>
        </div>
      )}
    </section>
  );
};

export default Research;
