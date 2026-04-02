import { useEffect, useMemo, useState } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { RouterLink } from "./router";

type Mode = "emergency" | "proactive";

type LocationData = {
  lat: number;
  lng: number;
  accuracy: number;
  label: string;
};

type WeatherData = {
  currentTempF: number | null;
  past24HrLowF: number | null;
  summary: string;
  freezeRisk: boolean;
};

type TriagePlan = {
  immediate_action: string;
  secondary_action: string;
  context_note: string;
  warning: string;
};

const TRIAGE_SYSTEM_PROMPT = `You are a calm emergency water leak triage assistant.
Collect the minimum information needed to guide immediate safety actions.
Always prioritize:
1) shutting off water if safe,
2) electrical safety if water is near outlets,
3) contacting a licensed professional for severe leaks.
Provide clear, step-by-step instructions in short sentences.
Avoid medical or legal claims.`;

const EMERGENCY_ANALYSIS_PSEUDOCODE = `input: leak_description, photo(optional), location(optional), weather(optional)
if leak_description indicates flooding or burst:
  advise shutoff valve, power safety, call emergency plumber
else:
  advise shutoff, contain water, identify fixture
if weather.freezeRisk:
  add frozen pipe precautions
return: immediate_action, secondary_action, context_note, warning`;

const defaultChecklist = [
  { id: "toilet-dye", label: "Toilet dye test (check flapper leaks).", icon: "science" },
  { id: "meter-movement", label: "Meter movement check with all fixtures off.", icon: "speed" },
  { id: "irrigation", label: "Irrigation walk-through (look for pooling or misting).", icon: "grass" },
  { id: "faucet-drip", label: "Faucet & under-sink drip scan.", icon: "faucet" },
  { id: "showerhead", label: "Showerhead drip and cartridge check.", icon: "shower" },
];

const fetchWeatherSnapshot = async (lat: number, lng: number): Promise<WeatherData> => {
  const fallback: WeatherData = {
    currentTempF: null,
    past24HrLowF: null,
    summary: "Weather snapshot unavailable. Continue with manual inspection.",
    freezeRisk: false,
  };
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lng));
    url.searchParams.set("current", "temperature_2m");
    url.searchParams.set("daily", "temperature_2m_min");
    url.searchParams.set("timezone", "auto");
    const response = await fetch(url.toString());
    if (!response.ok) {
      return fallback;
    }
    const payload = (await response.json()) as {
      current?: { temperature_2m?: number };
      daily?: { temperature_2m_min?: number[] };
    };
    const currentTempC = payload.current?.temperature_2m;
    const lowTempC = payload.daily?.temperature_2m_min?.[0];
    const currentTempF = typeof currentTempC === "number" ? currentTempC * 1.8 + 32 : null;
    const past24HrLowF = typeof lowTempC === "number" ? lowTempC * 1.8 + 32 : null;
    const freezeRisk =
      (currentTempF !== null && currentTempF <= 32) || (past24HrLowF !== null && past24HrLowF <= 32);
    return {
      currentTempF,
      past24HrLowF,
      summary: "Weather snapshot loaded from Open-Meteo.",
      freezeRisk,
    };
  } catch (error) {
    console.error("Weather lookup failed:", error);
    return fallback;
  }
};

const LeakCheckHub = () => {
  usePageMeta({
    title: "Leak check | WaterShortcut",
    description: "A fast, guided checklist to find common household leaks and what to do next.",
    canonicalPath: "/leak-check",
  });

  const [mode, setMode] = useState<Mode>("proactive");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [triagePlan, setTriagePlan] = useState<TriagePlan | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [showPostCrisis, setShowPostCrisis] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const prefersEmergency = window.matchMedia("(max-width: 640px)").matches;
    if (prefersEmergency) {
      setMode("emergency");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const freezeBadge = useMemo(() => {
    if (!weather) {
      return "Awaiting weather snapshot";
    }
    if (weather.currentTempF == null || weather.past24HrLowF == null) {
      return "Freeze risk: Unknown";
    }
    return weather.freezeRisk ? "Freeze risk: HIGH" : "Freeze risk: Low";
  }, [weather]);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    setTriageError(null);
    const onSuccess = async (position: GeolocationPosition) => {
      const coords = position.coords;
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        label: "GPS location captured",
      });
      const weatherPayload = await fetchWeatherSnapshot(coords.latitude, coords.longitude);
      setWeather(weatherPayload);
      setIsLocating(false);
    };
    const onError = async () => {
      setLocation({
        lat: 0,
        lng: 0,
        accuracy: 0,
        label: "Location unavailable (manual triage mode)",
      });
      setWeather({
        currentTempF: null,
        past24HrLowF: null,
        summary: "Weather snapshot unavailable. Continue with manual inspection.",
        freezeRisk: false,
      });
      setIsLocating(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 8000,
      });
      return;
    }
    await onError();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setPhotoFile(file);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  const handleEmergencyAnalysis = async () => {
    if (!location || !weather) {
      setTriageError("Capture your location first to personalize the checklist.");
      return;
    }
    setTriageError(null);
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/leak-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          mode,
          coordinates: { lat: location.lat, lng: location.lng, accuracy: location.accuracy },
          freezeRisk: weather.freezeRisk,
          photoProvided: Boolean(photoFile),
          photoLabel: photoFile?.name ?? null,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "We couldn't run the triage yet.");
      }
      const payload = (await response.json()) as TriagePlan;
      setTriagePlan(payload);
    } catch (error) {
      setTriageError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="ws-page" aria-labelledby="leak-check-title">
      <div className="ws-hero">
        <p className="eyebrow">Leak check hub</p>
        <h1 id="leak-check-title">Stop water damage fast with a guided checklist.</h1>
        <p className="ws-hero-lede">
          Two modes, one mission: get you safe during a leak and help you prevent the next one.
        </p>
        <div className="ws-hero-actions" role="group" aria-label="Leak check mode">
          <button
            type="button"
            onClick={() => setMode("emergency")}
            className={mode === "emergency" ? "ws-button" : "ws-button-secondary"}
            aria-pressed={mode === "emergency"}
          >
            Emergency triage
          </button>
          <button
            type="button"
            onClick={() => setMode("proactive")}
            className={mode === "proactive" ? "ws-button" : "ws-button-secondary"}
            aria-pressed={mode === "proactive"}
          >
            Proactive guide
          </button>
        </div>
      </div>

      {mode === "emergency" ? (
        <>
          <section className="ws-info-card" aria-labelledby="triage-title">
            <h2 id="triage-title">Emergency triage flow</h2>
            <p className="ws-subtitle">Follow each step. The AI will prioritize safety before repairs.</p>

            <div className="ws-result-grid" role="list">
              <article className="ws-result-card" role="listitem" aria-labelledby="triage-step1">
                <h3 id="triage-step1">1) Capture context (optional)</h3>
                <p className="ws-subtitle">Request GPS and check the last 24 hours of local weather.</p>
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  className={`ws-button-secondary ws-button--full${isLocating ? " is-loading" : ""}`}
                  disabled={isLocating}
                >
                  <span className="ws-button__label">
                    <span className="ws-button__spinner" aria-hidden="true" />
                    {isLocating ? "Locating..." : "Request location"}
                  </span>
                </button>
                <p className="ws-subtitle" style={{ marginTop: "0.75rem" }}>
                  <strong>Location:</strong> {location ? location.label : "Not captured yet"}
                </p>
              </article>

              <article className="ws-result-card" role="listitem" aria-labelledby="triage-freeze">
                <h3 id="triage-freeze">Freeze risk</h3>
                <p className="ws-subtitle">{freezeBadge}</p>
                {weather ? (
                  <p className="ws-subtitle">
                    {weather.summary}
                    {weather.currentTempF != null && weather.past24HrLowF != null
                      ? ` (${weather.currentTempF.toFixed(0)}°F now, ${weather.past24HrLowF.toFixed(0)}°F low)`
                      : ""}
                  </p>
                ) : (
                  <p className="ws-subtitle">Run location capture to attach a weather snapshot.</p>
                )}
              </article>
            </div>
          </section>

          <section className="ws-info-card" aria-labelledby="triage-photo-title">
            <h2 id="triage-photo-title">2) Add a photo (optional)</h2>
            <p className="ws-subtitle">Useful for documenting the source while you work the checklist.</p>
            <label className="ws-field">
              <span>Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="ws-input" />
            </label>
            {photoPreview ? (
              <div className="ws-result-card">
                <h3>Preview</h3>
                <img
                  src={photoPreview}
                  alt="Leak photo preview"
                  style={{
                    width: "100%",
                    borderRadius: "0.9rem",
                    border: "1px solid var(--ws-color-slate-300)",
                  }}
                />
              </div>
            ) : null}
          </section>

          <section className="ws-info-card" aria-labelledby="triage-run-title">
            <h2 id="triage-run-title">3) Run AI triage</h2>
            <p className="ws-subtitle">
              You'll get an immediate action list, a secondary action, and a safety warning.
            </p>
            {triageError ? <p className="ws-form-error">{triageError}</p> : null}
            <button
              type="button"
              onClick={handleEmergencyAnalysis}
              className={`ws-button ws-button--full${isAnalyzing ? " is-loading" : ""}`}
              disabled={isAnalyzing}
            >
              <span className="ws-button__label">
                <span className="ws-button__spinner" aria-hidden="true" />
                {isAnalyzing ? "Running triage..." : "Run triage"}
              </span>
            </button>
          </section>

          <section className="ws-info-card" aria-labelledby="triage-output-title">
            <h2 id="triage-output-title">Immediate action checklist</h2>
            <p className="ws-subtitle">
              AI guidance is advisory. If the leak is severe, or water is near electrical outlets, stop and call a licensed professional.
            </p>

            {triagePlan ? (
              <div className="ws-result-grid" role="list">
                <article className="ws-result-card" role="listitem">
                  <h3>Immediate action</h3>
                  <p>{triagePlan.immediate_action}</p>
                </article>
                <article className="ws-result-card" role="listitem">
                  <h3>Secondary action</h3>
                  <p>{triagePlan.secondary_action}</p>
                </article>
                <article className="ws-result-card" role="listitem">
                  <h3>Context note</h3>
                  <p>{triagePlan.context_note}</p>
                </article>
                <article
                  className="ws-result-card"
                  role="listitem"
                  style={{
                    borderColor: "var(--ws-color-rose-500)",
                    background: "rgba(185, 28, 28, 0.06)",
                  }}
                >
	                  <h3>Safety warning</h3>
	                  <p>
	                    <span aria-hidden="true">{"\u26A0\uFE0F"}</span> {triagePlan.warning}
	                  </p>
	                </article>
	              </div>
            ) : (
              <p className="ws-subtitle">Run the AI triage to receive your emergency instructions.</p>
            )}

            <button
              type="button"
              onClick={() => setShowPostCrisis(true)}
              className="ws-button-secondary ws-button--full"
              style={{ marginTop: "0.75rem" }}
            >
              Leak stopped? Mark resolved
            </button>
          </section>

          <details className="ws-info-card">
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>
              AI transparency (system prompt + async flow)
            </summary>
            <div style={{ marginTop: "0.75rem" }}>
              <p className="eyebrow">System prompt</p>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{TRIAGE_SYSTEM_PROMPT}</pre>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <p className="eyebrow">Async pseudo-code</p>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{EMERGENCY_ANALYSIS_PSEUDOCODE}</pre>
            </div>
          </details>
        </>
      ) : (
        <section className="ws-info-card" aria-labelledby="proactive-title">
          <h2 id="proactive-title">Standard leak audit</h2>
          <p className="ws-subtitle">Not in crisis? Follow the checklist and log your checks.</p>
          <ul className="ws-checklist">
            {defaultChecklist.map((item) => (
              <li key={item.id}>
                <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <input
                    id={item.id}
                    type="checkbox"
                    checked={Boolean(checklistState[item.id])}
                    onChange={() => toggleChecklist(item.id)}
                    style={{ marginTop: "0.15rem", accentColor: "var(--ws-color-teal-600)" }}
                  />
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: "1.25rem", marginTop: "0.1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="ws-subtitle">
            Tip: log your findings now so the AI bill analysis can compare before/after usage.
          </p>
        </section>
      )}

      <section className="ws-section" aria-labelledby="readiness-title">
        <div className="ws-section-header">
          <p className="eyebrow">What to expect</p>
          <h2 id="readiness-title" className="ws-section-title">Triage readiness</h2>
          <p className="ws-section-lede">Emergency mode focuses only on what you need right now.</p>
        </div>
        <div className="ws-rails-grid" role="list">
          <article className="ws-rail-card" role="listitem">
            <h3>1) Safety first</h3>
            <p>We emphasize shutoff valves and electrical hazards before repairs.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>2) AI with context</h3>
            <p>Weather history helps flag frozen pipe burst patterns.</p>
          </article>
          <article className="ws-rail-card" role="listitem">
            <h3>3) Calm follow-through</h3>
            <p>Mark resolved to unlock post-crisis savings guidance.</p>
          </article>
        </div>
      </section>

      <section className="ws-info-card" aria-labelledby="post-crisis-title">
        <h2 id="post-crisis-title">Post-crisis value</h2>
        <p className="ws-subtitle">After the leak stops, quantify the impact and prevent the next one.</p>
        <RouterLink className="ws-button-secondary ws-button--full" to="/analyze-water-bill">
          Analyze my bill
        </RouterLink>
      </section>

      {showPostCrisis ? (
        <div className="credits-modal-overlay" role="dialog" aria-modal="true" aria-label="Leak resolved">
          <div className="credits-modal" style={{ maxWidth: 560 }}>
            <div className="credits-modal__header">
              <div>
                <h2 style={{ marginTop: 0 }}>Leak stopped? Nice work.</h2>
                <p className="ws-subtitle">Let's estimate the impact and prevent the next spike.</p>
              </div>
              <button
                type="button"
                className="credits-modal__close"
                onClick={() => setShowPostCrisis(false)}
                aria-label="Close"
	              >
	                {"\u00D7"}
	              </button>
	            </div>
            <div className="ws-hero-actions" style={{ marginTop: "1.25rem" }}>
              <RouterLink to="/analyze-water-bill" className="ws-button" onClick={() => setShowPostCrisis(false)}>
                Analyze my bill
              </RouterLink>
              <button type="button" onClick={() => setShowPostCrisis(false)} className="ws-button-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default LeakCheckHub;
