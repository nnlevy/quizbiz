import { useEffect, useMemo, useState } from "react";

type Mode = "emergency" | "proactive";

type LocationData = {
  lat: number;
  lng: number;
  accuracy: number;
  label: string;
};

type WeatherData = {
  currentTempF: number;
  past24HrLowF: number;
  summary: string;
  freezeRisk: boolean;
};

type TriagePlan = {
  immediate_action: string;
  secondary_action: string;
  context_note: string;
  warning: string;
};

const TRIAGE_SYSTEM_PROMPT = `You are WaterShortcut's emergency leak triage assistant.
Return ONLY valid JSON matching this schema (no markdown, no prose):
{
  "immediate_action": string,
  "secondary_action": string,
  "context_note": string,
  "warning": string
}
Rules:
- Prioritize life safety, stop-the-bleed actions, and electrical hazards first.
- Reference freeze risk when relevant.
- Keep instructions short, imperative, and easy to read on mobile.
- Assume the photo is of a residential leak area.
- If unsure, give the safest next action.
Inputs:
- coordinates (lat/lng)
- freezeRisk boolean
- image (binary).`;

const EMERGENCY_ANALYSIS_PSEUDOCODE = `async function handleEmergencyAnalysis(location, weather, photo) {
  setStatus("analyzing");
  const payload = {
    coordinates: { lat: location.lat, lng: location.lng },
    freezeRisk: weather.freezeRisk,
    image: photo,
  };
  const response = await fetch("/api/leak-triage", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const triageJson = await response.json();
  setActionPlan(triageJson);
  setStatus("complete");
}`;

const defaultChecklist = [
  { id: "toilet-dye", label: "Toilet dye test (check flapper leaks)." },
  { id: "meter-movement", label: "Meter movement check with all fixtures off." },
  { id: "irrigation", label: "Irrigation walk-through (look for pooling or misting)." },
  { id: "faucet-drip", label: "Faucet & under-sink drip scan." },
  { id: "showerhead", label: "Showerhead drip and cartridge check." },
];

const mockFetchWeather = async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const currentTempF = 29;
  const past24HrLowF = 27;
  const summary = "Cold snap in the last 24 hours.";
  return {
    currentTempF,
    past24HrLowF,
    summary,
    freezeRisk: currentTempF <= 32 || past24HrLowF <= 32,
  } satisfies WeatherData;
};

const mockAIResponse: TriagePlan = {
  immediate_action:
    "Locate the main shut-off valve. Based on the photo, it is likely under the kitchen sink. Turn the silver oval handle clockwise.",
  secondary_action: "Open the lowest faucet in the home to drain pressure.",
  context_note: "Weather indicates high likelihood of a frozen pipe burst near an exterior wall.",
  warning: "Do not touch electrical outlets or extension cords near pooled water.",
};

const LeakCheckHub = () => {
  const [mode, setMode] = useState<Mode>("proactive");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [triagePlan, setTriagePlan] = useState<TriagePlan | null>(null);
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
    return weather.freezeRisk ? "Freeze risk: HIGH" : "Freeze risk: Low";
  }, [weather]);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    const onSuccess = async (position: GeolocationPosition) => {
      const coords = position.coords;
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        label: "GPS location captured",
      });
      const weatherPayload = await mockFetchWeather();
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
      const weatherPayload = await mockFetchWeather();
      setWeather(weatherPayload);
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
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  const handleEmergencyAnalysis = async () => {
    if (!location || !weather || !photoFile) {
      return;
    }
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setTriagePlan({
      ...mockAIResponse,
      context_note: weather.freezeRisk
        ? mockAIResponse.context_note
        : "Weather does not indicate freezing; inspect fixtures and supply lines for pressurized leaks.",
    });
    setIsAnalyzing(false);
  };

  const toggleChecklist = (id: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-red-300">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold">Leak Check</span>
            <span className="hidden text-xs text-slate-300 sm:inline">AI-Powered Triage</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("emergency")}
              className={`rounded-full border px-4 py-2 transition ${
                mode === "emergency"
                  ? "border-red-400 bg-red-500 text-white"
                  : "border-white/20 bg-transparent text-white/70"
              }`}
            >
              Emergency Triage
            </button>
            <button
              type="button"
              onClick={() => setMode("proactive")}
              className={`rounded-full border px-4 py-2 transition ${
                mode === "proactive"
                  ? "border-orange-200 bg-white text-slate-900"
                  : "border-white/20 bg-transparent text-white/70"
              }`}
            >
              Proactive Guide
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-red-300">AI Leak Check Hub</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Stop water damage fast with an AI-guided response.
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                Two modes, one mission: get you safe during a leak and help you prevent the next one.
              </p>
            </div>

            {mode === "emergency" ? (
              <div className="space-y-6">
                <div className="rounded-3xl border border-red-400/60 bg-gradient-to-br from-red-600 via-red-700 to-orange-700 p-6 text-white shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-100">
                        Active leak?
                      </p>
                      <h2 className="text-3xl font-bold sm:text-4xl">Start Emergency Mode</h2>
                      <p className="mt-2 text-base text-red-100">
                        High-contrast, rapid triage with a live AI checklist.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode("emergency")}
                      className="animate-pulse rounded-full bg-white px-6 py-4 text-base font-bold text-red-700 shadow-xl"
                    >
                      ACTIVE LEAK? START EMERGENCY MODE
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-red-400/30 bg-slate-900/80 p-6 shadow-xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold">Emergency Triage Flow</h3>
                      <p className="text-sm text-slate-300">
                        Follow each step. The AI will prioritize safety before repairs.
                      </p>
                    </div>
                    <span className="rounded-full border border-orange-300/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
                      Secure AI analysis in progress
                    </span>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Step 1</p>
                          <h4 className="text-xl font-semibold">Contextual intelligence gather</h4>
                          <p className="text-sm text-slate-300">
                            Request GPS and check the last 24 hours of local weather.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRequestLocation}
                          className="rounded-full border border-red-300 bg-red-500/20 px-5 py-3 text-sm font-semibold text-white"
                        >
                          {isLocating ? "Locating..." : "Request location"}
                        </button>
                      </div>
                      <div className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</p>
                          <p>{location ? location.label : "Not captured yet"}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Freeze risk</p>
                          <p>{freezeBadge}</p>
                          {weather && (
                            <p className="mt-1 text-xs text-slate-400">
                              {weather.summary} ({weather.currentTempF}°F now, {weather.past24HrLowF}°F low)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Step 2</p>
                          <h4 className="text-xl font-semibold">Visual assessment</h4>
                          <p className="text-sm text-slate-300">
                            Use your camera for a quick AI scan of the leak area.
                          </p>
                        </div>
                        <label className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg">
                          Take/Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="sr-only"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      </div>
                      {photoPreview ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                          <img src={photoPreview} alt="Leak preview" className="h-52 w-full object-cover" />
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-400">
                          No photo captured yet. Use your phone camera for best results.
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Step 3</p>
                          <h4 className="text-xl font-semibold">Smart synthesis AI call</h4>
                          <p className="text-sm text-slate-300">
                            We combine coordinates, freeze risk, and the image to generate a response plan.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleEmergencyAnalysis}
                          disabled={!location || !weather || !photoFile || isAnalyzing}
                          className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isAnalyzing ? "Analyzing..." : "Run AI triage"}
                        </button>
                      </div>
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                        Payload includes GPS coordinates, freeze risk flag, and the image blob.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Step 4</p>
                        <h4 className="text-2xl font-semibold">Immediate action checklist</h4>
                        <p className="text-sm text-slate-300">
                          Large, high-contrast instructions you can follow in real time.
                        </p>
                      </div>
                      {triagePlan ? (
                        <div className="mt-4 space-y-4 text-lg font-semibold">
                          <div className="rounded-2xl bg-red-500/20 p-4">{triagePlan.immediate_action}</div>
                          <div className="rounded-2xl bg-orange-500/20 p-4">{triagePlan.secondary_action}</div>
                          <div className="rounded-2xl bg-white/10 p-4 text-base font-normal text-slate-200">
                            {triagePlan.context_note}
                          </div>
                          <div className="rounded-2xl border border-red-400/60 bg-red-600/30 p-4 text-base text-red-100">
                            ⚠️ {triagePlan.warning}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-400">
                          Run the AI triage to receive your emergency instructions.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setShowPostCrisis(true)}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                    >
                      Leak stopped? Mark resolved
                    </button>
                    <span className="text-xs text-slate-400">
                      AI guidance is advisory. For severe leaks, contact emergency services.
                    </span>
                  </div>
                </div>

                <details className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
                  <summary className="cursor-pointer text-sm font-semibold text-orange-200">
                    AI transparency (system prompt + async flow)
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">System prompt</p>
                      <pre className="whitespace-pre-wrap rounded-xl bg-black/50 p-4 text-xs text-slate-200">
                        {TRIAGE_SYSTEM_PROMPT}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Async pseudo-code</p>
                      <pre className="whitespace-pre-wrap rounded-xl bg-black/50 p-4 text-xs text-slate-200">
                        {EMERGENCY_ANALYSIS_PSEUDOCODE}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-3xl border border-orange-200/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                  <h2 className="text-3xl font-semibold">Standard Leak Audit</h2>
                  <p className="mt-2 text-base text-slate-300">
                    Not in crisis? Follow the proactive checklist and log your checks.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <h3 className="text-xl font-semibold">Interactive checklist</h3>
                  <ul className="mt-4 space-y-3">
                    {defaultChecklist.map((item) => (
                      <li key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <input
                          id={item.id}
                          type="checkbox"
                          checked={Boolean(checklistState[item.id])}
                          onChange={() => toggleChecklist(item.id)}
                          className="mt-1 h-5 w-5 rounded border-white/20 bg-transparent text-orange-400"
                        />
                        <label htmlFor={item.id} className="text-base text-slate-200">
                          {item.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    Tip: log your findings now so the AI bill analysis can compare before/after usage.
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">Triage readiness</h3>
              <p className="mt-2 text-sm text-slate-300">
                Emergency mode focuses only on what you need right now.
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="font-semibold">1. Safety first</p>
                  <p className="text-xs text-slate-400">
                    We emphasize shutoff valves and electrical hazards before repairs.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="font-semibold">2. AI with context</p>
                  <p className="text-xs text-slate-400">
                    Weather history helps flag frozen pipe bursts automatically.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="font-semibold">3. Calm follow-through</p>
                  <p className="text-xs text-slate-400">
                    Mark resolved to unlock post-crisis savings guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">Post-crisis value</h3>
              <p className="mt-2 text-sm text-slate-300">
                After the leak stops, we help you quantify the impact and prevent the next one.
              </p>
              <a
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                href="/analyze-water-bill"
              >
                Analyze my bill
              </a>
            </div>
          </aside>
        </div>
      </main>

      {showPostCrisis ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <h2 className="text-2xl font-semibold">Leak stopped? Nice work.</h2>
            <p className="mt-2 text-sm text-slate-300">
              Let&apos;s see how much that water cost you and prevent the next one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/analyze-water-bill"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                Analyze My Bill
              </a>
              <button
                type="button"
                onClick={() => setShowPostCrisis(false)}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LeakCheckHub;
