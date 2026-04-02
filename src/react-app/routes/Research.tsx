import { FormEvent, useEffect, useMemo, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
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

type ResearchLinks = {
  conservationOffice: string;
  rebates: string;
  outageAlerts: string;
  leakAdjustmentPolicy: string;
};

type EnrichedResearchLinks = Partial<ResearchLinks>;

const parseLocation = (input: string) => {
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return { city: input.trim(), state: "" };
  }

  return {
    city: parts[0],
    state: parts[1],
  };
};

const buildFallbackResearchLinks = (input: string): ResearchLinks => {
  const { city, state } = parseLocation(input);
  const locationQuery = [city, state].filter(Boolean).join(" ");
  const utilityQuery = [city, state, "water utility"].filter(Boolean).join(" ");

  return {
    conservationOffice: `https://www.google.com/search?q=${encodeURIComponent(
      `${utilityQuery} conservation office`,
    )}`,
    rebates: `https://www.google.com/search?q=${encodeURIComponent(
      `${utilityQuery} rebates`,
    )}`,
    outageAlerts: `https://www.google.com/search?q=${encodeURIComponent(
      `${utilityQuery} outage alerts sign up`,
    )}`,
    leakAdjustmentPolicy: `https://www.google.com/search?q=${encodeURIComponent(
      `${locationQuery} leak adjustment policy`,
    )}`,
  };
};

const resolveResearchLinks = (
  fallbackLinks: ResearchLinks,
  enrichedLinks: EnrichedResearchLinks | null,
): ResearchLinks => ({
  ...fallbackLinks,
  ...enrichedLinks,
});

const Research = () => {
  usePageMeta({
    title: "Water research plan | Save water",
    description:
      "Build a research plan with AI water bill analysis insights to save water and reduce costs.",
    canonicalPath: "/research",
  });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [enrichedLinks, setEnrichedLinks] = useState<EnrichedResearchLinks | null>(null);

  const suggestions = useMemo(
    () => LOCATIONS.filter((location) => location.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSelected(query.trim());
  };

  useEffect(() => {
    if (!selected) {
      setEnrichedLinks(null);
      return;
    }

    // Placeholder for future API-backed enrichment.
    // We intentionally keep fallback link generation separate so the checklist
    // remains fully usable even when enrichment is unavailable.
    setEnrichedLinks(null);
  }, [selected]);

  const resolvedLinks = useMemo(() => {
    if (!selected) return null;

    const fallbackLinks = buildFallbackResearchLinks(selected);
    return resolveResearchLinks(fallbackLinks, enrichedLinks);
  }, [selected, enrichedLinks]);

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

      {selected && resolvedLinks && (
        <div className="ws-info-card" aria-live="polite">
          <h2>Recommended checklist for {selected}</h2>
          <ul className="ws-checklist">
            <li>
              <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>{" "}
              Find your local <a href={resolvedLinks.conservationOffice}>water conservation office</a>{" "}
              and ask about appliance rebates.
            </li>
            <li>
              <span className="material-symbols-outlined" aria-hidden="true">payments</span>{" "}
              Review available <a href={resolvedLinks.rebates}>water-saving rebates</a> for {selected}.
            </li>
            <li>
              <span className="material-symbols-outlined" aria-hidden="true">notifications_active</span>{" "}
              Sign up for <a href={resolvedLinks.outageAlerts}>outage alerts</a> from your provider.
            </li>
            <li>
              <span className="material-symbols-outlined" aria-hidden="true">description</span>{" "}
              Read the <a href={resolvedLinks.leakAdjustmentPolicy}>leak adjustment policy</a> and
              record any required documentation.
            </li>
          </ul>
          <div className="ws-tool-grid">
            <RouterLink className="ws-footer-link" to="/analyze-water-bill">
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
