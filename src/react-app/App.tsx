import { FormEvent, createElement, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

declare global {
  interface Window {
    disqus_config?: () => void;
  }
}

const SHOWER_FLOW_RATE = 2.5;
const SINK_FLOW_RATE = 1.5;
const COST_PER_GALLON_MIN = 0.0058;
const COST_PER_GALLON_MAX = 0.009;

const WATERING_GALLONS_PER_MINUTE = 4;

function formatCurrency(value: number): string {
  return value.toFixed(2);
}

function formatCurrencyRange(min: number, max: number): string {
  return `$${formatCurrency(min)} - $${formatCurrency(max)}`;
}

type ApplianceSavings = {
  shower: { minutes: number; gallons: number; minCost: number; maxCost: number };
  sink: { minutes: number; gallons: number; minCost: number; maxCost: number };
  watering: { minutes: number; gallons: number; minCost: number; maxCost: number };
};

type Droplet = {
  x: number;
  y: number;
  radius: number;
  height: number;
  speed: number;
  splash: boolean;
  color: string;
  vx: number;
  vy: number;
};

const SLIDE_COUNT = 3;

const StripeBuyButton = ({
  buyButtonId,
  publishableKey,
}: {
  buyButtonId: string;
  publishableKey?: string;
}) =>
  createElement(
    "stripe-buy-button",
    {
      "buy-button-id": buyButtonId,
      ...(publishableKey ? { "publishable-key": publishableKey } : {}),
    } as Record<string, unknown>,
  );

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slidesWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showerReduction, setShowerReduction] = useState(5);
  const [showerLength, setShowerLength] = useState(10);
  const [sinkUsage, setSinkUsage] = useState(10);
  const [wateringMinutes, setWateringMinutes] = useState(7);

  const [locationInput, setLocationInput] = useState("");
  const [locationStatus, setLocationStatus] = useState(
    "Enter your city or region to begin.",
  );
  const [locationHtml, setLocationHtml] = useState("");
  const [locationCountdown, setLocationCountdown] = useState<number | null>(null);

  const [responseMessage, setResponseMessage] = useState("");
  const [countdownLabel, setCountdownLabel] = useState("Awaiting file upload...");
  const [analysisHtml, setAnalysisHtml] = useState("");
  const [analysisCountdown, setAnalysisCountdown] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    const wrapper = slidesWrapperRef.current;
    if (!wrapper) {
      return;
    }
    wrapper.style.transform = `translateX(-${100 * currentSlide}%)`;
  }, [currentSlide]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let droplets: Droplet[] = [];
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const startTime = Date.now();
    const duration = 60 * 1000;

    const updateDroplet = (droplet: Droplet) => {
      const repelRadius = 100;
      const dx = droplet.x - mouseX;
      const dy = droplet.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius) {
        const forceFactor = 1 - dist / repelRadius;
        const repelStrength = 2.0;
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);
        droplet.vx += nx * repelStrength * forceFactor;
        droplet.vy += (ny + 0.5) * repelStrength * forceFactor;
      }
      droplet.vx *= 0.95;
      droplet.vy *= 0.95;
      droplet.x += droplet.vx;
      droplet.y += droplet.vy;
      if (droplet.y < canvas.height - droplet.height) {
        droplet.y += droplet.speed;
      } else {
        droplet.splash = true;
      }
    };

    const drawDroplet = (droplet: Droplet) => {
      if (!droplet.splash) {
        ctx.beginPath();
        ctx.moveTo(droplet.x, droplet.y);
        ctx.quadraticCurveTo(
          droplet.x - droplet.radius,
          droplet.y + droplet.height / 2,
          droplet.x,
          droplet.y + droplet.height,
        );
        ctx.quadraticCurveTo(
          droplet.x + droplet.radius,
          droplet.y + droplet.height / 2,
          droplet.x,
          droplet.y,
        );
        ctx.closePath();
        ctx.fillStyle = droplet.color;
        ctx.fill();
      } else {
        const splashParticles = 7;
        for (let i = 0; i < splashParticles; i++) {
          const angle = (Math.PI * 2 * i) / splashParticles;
          const splashX =
            droplet.x + Math.cos(angle) * (5 + Math.random() * 5);
          const splashY =
            canvas.height - droplet.height + Math.sin(angle) * (5 + Math.random() * 5);
          const splashSize = 1 + Math.random() * 2;
          ctx.beginPath();
          ctx.arc(splashX, splashY, splashSize, 0, Math.PI * 2);
          ctx.fillStyle = droplet.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    };

    const spawnDroplet = () => {
      const elapsedTime = Date.now() - startTime;
      const spawnRate = Math.max(0.02, 1 - elapsedTime / duration);
      if (Math.random() < spawnRate) {
        droplets.push({
          x: Math.random() * canvas.width,
          y: 0,
          radius: 3 + Math.random() * 3,
          height: (3 + Math.random() * 3) * 2,
          speed: 1.5 + Math.random() * 2.5,
          splash: false,
          color: "rgba(70, 140, 200, 0.3)",
          vx: 0,
          vy: 0,
        });
      }
    };

    let animationFrame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnDroplet();
      droplets = droplets
        .map((droplet) => {
          updateDroplet(droplet);
          drawDroplet(droplet);
          return droplet;
        })
        .filter((droplet) => !droplet.splash);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (locationCountdown === null) {
      return;
    }
    if (locationCountdown <= 0) {
      setLocationCountdown(null);
      setLocationStatus("Still searching...");
      return;
    }
    setLocationStatus(`Searching... (${locationCountdown} seconds left)`);
    const timer = window.setTimeout(() => {
      setLocationCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [locationCountdown]);

  useEffect(() => {
    if (analysisCountdown === null) {
      return;
    }
    if (analysisCountdown < 0) {
      setCountdownLabel("Analysis should be complete shortly.");
      setAnalysisCountdown(null);
      return;
    }
    const minutes = Math.floor(analysisCountdown / 60);
    const seconds = analysisCountdown % 60;
    setCountdownLabel(`Estimated time remaining: ${minutes}m ${seconds}s`);
    const timer = window.setTimeout(() => {
      setAnalysisCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [analysisCountdown]);

  useEffect(() => {
    const scriptUrl = "https://js.stripe.com/v3/buy-button.js";
    if (document.querySelector(`script[src='${scriptUrl}']`)) {
      return;
    }
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const scriptUrl =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1860356577073395";
    if (document.querySelector(`script[src='${scriptUrl}']`)) {
      return;
    }
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const gtagUrl = "https://www.googletagmanager.com/gtag/js?id=G-98170RDCDD";
    if (!document.querySelector(`script[src='${gtagUrl}']`)) {
      const script = document.createElement("script");
      script.src = gtagUrl;
      script.async = true;
      document.body.appendChild(script);
    }
    const inlineScriptId = "gtag-inline";
    if (!document.getElementById(inlineScriptId)) {
      const script = document.createElement("script");
      script.id = inlineScriptId;
      script.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-98170RDCDD');`;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    window.disqus_config = (function disqusConfig(this: {
      page: { url: string; identifier: string };
    }) {
      this.page = this.page || { url: "", identifier: "" };
      this.page.url = "https://www.watershortcut.com";
      this.page.identifier = "water-shortcut-home";
    }) as () => void;
    if (!document.getElementById("disqus-script")) {
      const script = document.createElement("script");
      script.src = "https://watershortcut.disqus.com/embed.js";
      script.setAttribute("data-timestamp", Date.now().toString());
      script.id = "disqus-script";
      document.body.appendChild(script);
    }
    return () => {
      window.disqus_config = undefined;
    };
  }, []);

  const reductionSummary = useMemo(() => {
    const dailyGallonsSaved = showerReduction * SHOWER_FLOW_RATE;
    const annualGallonsSaved = dailyGallonsSaved * 365;
    const annualCostSavedMin = annualGallonsSaved * COST_PER_GALLON_MIN;
    const annualCostSavedMax = annualGallonsSaved * COST_PER_GALLON_MAX;
    return `Reducing shower length by ${showerReduction} minutes saves ${formatCurrencyRange(
      annualCostSavedMin,
      annualCostSavedMax,
    )} annually (approx. ${annualGallonsSaved.toFixed(0)} gallons).`;
  }, [showerReduction]);

  const applianceSavings = useMemo<ApplianceSavings>(() => {
    const showerGallons = showerLength * SHOWER_FLOW_RATE * 365;
    const showerMinCost = showerGallons * COST_PER_GALLON_MIN;
    const showerMaxCost = showerGallons * COST_PER_GALLON_MAX;

    const sinkGallons = sinkUsage * SINK_FLOW_RATE * 365;
    const sinkMinCost = sinkGallons * COST_PER_GALLON_MIN;
    const sinkMaxCost = sinkGallons * COST_PER_GALLON_MAX;

    const wateringGallons = wateringMinutes * WATERING_GALLONS_PER_MINUTE * 52;
    const wateringMinCost = wateringGallons * COST_PER_GALLON_MIN;
    const wateringMaxCost = wateringGallons * COST_PER_GALLON_MAX;

    return {
      shower: {
        minutes: showerLength,
        gallons: showerGallons,
        minCost: showerMinCost,
        maxCost: showerMaxCost,
      },
      sink: {
        minutes: sinkUsage,
        gallons: sinkGallons,
        minCost: sinkMinCost,
        maxCost: sinkMaxCost,
      },
      watering: {
        minutes: wateringMinutes,
        gallons: wateringGallons,
        minCost: wateringMinCost,
        maxCost: wateringMaxCost,
      },
    };
  }, [showerLength, sinkUsage, wateringMinutes]);

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) {
      setLocationStatus("Please enter a location.");
      return;
    }
    setLocationHtml("");
    setLocationStatus("Searching...");
    setLocationCountdown(5);
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: locationInput.trim() }),
      });
      setLocationCountdown(null);
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setLocationStatus(
          `Error: ${
            typeof error?.error === "string"
              ? error.error
              : "An unexpected error occurred."
          }`,
        );
        return;
      }
      const htmlResponse = await response.text();
      setLocationHtml(htmlResponse);
      setLocationStatus("Results ready.");
    } catch (error) {
      console.error("Location lookup failed:", error);
      setLocationCountdown(null);
      setLocationStatus(
        "An error occurred while locating your water bill provider. Please try again.",
      );
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setResponseMessage("Please select a file before submitting.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResponseMessage("File size exceeds 10MB. Please upload a smaller file.");
      return;
    }
    setIsUploading(true);
    setResponseMessage("Uploading file...");
    setAnalysisHtml("");
    setCountdownLabel("Estimated time remaining: 2m 0s");
    setAnalysisCountdown(120);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setAnalysisCountdown(null);
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setResponseMessage(
          `Error: ${
            typeof error?.error === "string"
              ? error.error
              : "An unexpected error occurred."
          }`,
        );
        setCountdownLabel("Analysis should be complete shortly.");
        return;
      }
      const result = await response.text();
      setResponseMessage("Success!");
      setAnalysisHtml(result);
      setCountdownLabel("Analysis complete.");
    } catch (error) {
      console.error("Upload failed:", error);
      setAnalysisCountdown(null);
      setCountdownLabel("Analysis should be complete shortly.");
      setResponseMessage(
        "An error occurred during the upload. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app">
      <canvas id="canvas" ref={canvasRef} aria-hidden />
      <header className="fixed-navbar">
        <nav>
          <a href="#upload">Upload Bill</a>
          <a href="#dynamic-sliders">Usage Calculator</a>
          <a href="#top-ways">Top Tips</a>
          <a href="#news">News</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main className="main-wrapper">
        <div className="heading-wrapper">
          <h1>Conserve Water &amp; Save Money</h1>
          <h2>Reduce Your Water Bill With AI</h2>
        </div>

        <section className="container carousel-container">
          <div className="carousel-and-card">
            <div className="sliders-col">
              <div className="dual-slider">
                <div
                  className="slides-wrapper"
                  ref={slidesWrapperRef}
                  style={{ width: `${SLIDE_COUNT * 100}%` }}
                >
                  <div className="slide" id="slide1">
                    <h3>Water Flow &amp; Cost Basics</h3>
                    <ul>
                      <li>
                        Shower flow rate: <strong>2.5 gallons/min</strong>
                      </li>
                      <li>
                        Sink flow rate: <strong>1.5 gallons/min</strong>
                      </li>
                      <li>
                        USA average water cost: ~$0.0058 – $0.009 per gallon
                      </li>
                    </ul>
                    <p>Local rates may vary. Small adjustments save real money!</p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => setCurrentSlide(1)}
                    >
                      Estimate My Savings &raquo;
                    </button>
                  </div>

                  <div className="slide" id="slide2">
                    <h3>The Full Cost of Water Waste</h3>
                    <p>
                      &bull; Sewage Cost: ~$84/year for typical shower &amp; sink
                      usage.
                      <br />
                      &bull; Saving: Save ~$94/yr. by upgrading shower and faucets.
                      <br />
                      &bull; Example: WaterSense brand products save ~40% less usage.
                    </p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => setCurrentSlide(2)}
                    >
                      Look Up My Water Bill &raquo;
                    </button>
                  </div>

                  <div className="slide" id="slide3">
                    <h3>Find Your Water Bill</h3>
                    <p>Enter your city or region below:</p>
                    <input
                      type="text"
                      id="location-input"
                      placeholder="Atlanta, GA or Berlin"
                      value={locationInput}
                      onChange={(event) => setLocationInput(event.target.value)}
                    />
                    <button
                      type="button"
                      id="location-button"
                      onClick={handleLocationSearch}
                    >
                      Search
                    </button>
                    <div
                      id="location-result"
                      aria-live="polite"
                      dangerouslySetInnerHTML={{ __html: locationHtml }}
                    />
                    <p className="location-status" aria-live="polite">
                      {locationStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-col">
              <div className="nav-card">
                <h3>Quick Navigation</h3>
                <ul>
                  <li>
                    <a href="#dynamic-sliders">Instant Usage Calculator</a>
                  </li>
                  <li>
                    <a href="#upload">Upload &amp; Analyze Bill</a>
                  </li>
                  <li>
                    <a href="#top-ways">Top Savings Tips</a>
                  </li>
                  <li>
                    <a href="#news">Water News</a>
                  </li>
                  <li>
                    <a href="#disqus_thread">Community Discussion</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="container" id="dynamic-sliders">
          <h2>Instant Water Usage Calculator</h2>
          <p>
            Experiment with these sliders to see approximate annual usage and cost
            for typical shower, sink, and weekly watering habits.
          </p>

          <h3>Reduce Shower Usage</h3>
          <p>
            Move this slider to see how cutting down your daily shower by certain
            minutes can impact annual water usage—and approximate cost savings.
          </p>
          <div className="slider-container">
            <label htmlFor="shower-reduction-slider">
              Reduce Shower Length (minutes)
            </label>
            <input
              type="range"
              id="shower-reduction-slider"
              min={1}
              max={10}
              value={showerReduction}
              onChange={(event) =>
                setShowerReduction(Number(event.target.value))
              }
            />
            <p id="shower-reduction-output">{reductionSummary}</p>
          </div>

          <section className="calculator-section">
            <h3>Upgrade Appliances and Fixtures</h3>
            <p>
              Adjust the sliders below to estimate annual usage and cost across the
              cost range. <em>(We multiply gallons used by our cost-per-gallon range.)</em>
            </p>

            <div className="slider-container">
              <label htmlFor="shower-slider">Daily Shower Length (minutes)</label>
              <input
                type="range"
                id="shower-slider"
                min={1}
                max={30}
                value={showerLength}
                onChange={(event) =>
                  setShowerLength(Number(event.target.value))
                }
              />
              <p id="shower-output">
                Shower length: <strong>{applianceSavings.shower.minutes} minutes</strong>,
                Estimated annual cost: <strong>{formatCurrencyRange(
                  applianceSavings.shower.minCost,
                  applianceSavings.shower.maxCost,
                )}</strong>.
                <a
                  href="https://www.amazon.com/gp/product/B01MFGGH8A"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upgrade to a Low-Flow Showerhead
                </a>
              </p>
            </div>

            <div className="slider-container">
              <label htmlFor="sink-slider">Daily Sink Usage (minutes)</label>
              <input
                type="range"
                id="sink-slider"
                min={1}
                max={60}
                value={sinkUsage}
                onChange={(event) => setSinkUsage(Number(event.target.value))}
              />
              <p id="sink-output">
                Sink usage: <strong>{applianceSavings.sink.minutes} minutes</strong>,
                Estimated annual cost: <strong>{formatCurrencyRange(
                  applianceSavings.sink.minCost,
                  applianceSavings.sink.maxCost,
                )}</strong>.
                <a
                  href="https://www.amazon.com/gp/product/B01EVXAWP0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upgrade with Faucet Aerators
                </a>
              </p>
            </div>

            <div className="slider-container">
              <label htmlFor="watering-slider">Weekly Plants Watered (minutes)</label>
              <input
                type="range"
                id="watering-slider"
                min={1}
                max={20}
                value={wateringMinutes}
                onChange={(event) =>
                  setWateringMinutes(Number(event.target.value))
                }
              />
              <p id="dishwasher-output">
                Weekly watering: <strong>{applianceSavings.watering.minutes}</strong>,
                Estimated annual cost: <strong>{formatCurrencyRange(
                  applianceSavings.watering.minCost,
                  applianceSavings.watering.maxCost,
                )}</strong>.
                <a
                  href="https://www.amazon.com/gp/product/B01MG8F3ST"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Efficient Detergents
                </a>
              </p>
            </div>
          </section>
        </section>

        <section className="container analyzer-col" id="upload">
          <div className="image-container">
            <img
              src="https://res.cloudinary.com/dlxzgqi9g/image/upload/v1733631746/quizbiz_husband_wife_and_golden_doodle_tighten_an_outdoor_tap_42a5be20-23eb-4352-9493-e39d2bcd8e81_3_kjswaw.png"
              alt="Family tightening an outdoor tap to conserve water"
            />
          </div>
          <h1>Free Water Usage Optimizer</h1>
          <h2>Upload Your Water Bill</h2>
          <form id="upload-form" onSubmit={handleUpload} encType="multipart/form-data">
            <input
              type="file"
              name="file"
              id="file"
              accept=".pdf"
              ref={fileInputRef}
              required
              aria-label="Upload water bill PDF"
            />
            <button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload and Analyze"}
            </button>
            <div id="countdown-timer" aria-live="polite">
              {countdownLabel}
            </div>
          </form>
          <div id="response-message" aria-live="polite">
            {responseMessage}
          </div>
          {analysisHtml && (
            <div
              className="analysis-html"
              dangerouslySetInnerHTML={{ __html: analysisHtml }}
            />
          )}
          <h2>How It Works</h2>
          <p>
            Upload your recent water bill to our secure platform, and our advanced
            AI system will generate specific action recommendations. Google
            Document AI extracts the details, and the OpenAI o1-mini model outlines
            targeted conservation steps tailored to your usage.
          </p>
          <div className="stripe-wrapper">
            <StripeBuyButton
              buyButtonId="buy_btn_1QLXcFIzTeKgjbPr1afKz0xu"
              publishableKey="pk_live_dummy"
            />
          </div>
        </section>
      </main>

      <div className="container-about">
        <section id="about">
          <h2>About Us</h2>
          <p>
            At WaterShortcut.com, we help you conserve water and save money. First,
            Google Vision analyzes your water bill and then the most advanced AI
            model offered by OpenAI provides recommendations. Our mission is to
            make water efficiency simple, impactful, and accessible to everyone.
            Whether you're a homeowner or a business, our tools provide actionable
            insights to optimize your water usage.
          </p>
        </section>

        <section id="top-ways">
          <h1>Top 5 Ways to Reduce Your Water Bill</h1>
          <p>
            Cutting back on water usage isn't just good for the planet—it’s great
            for your wallet! Here are five actionable tips to reduce your water
            bill and related product recommendations.
          </p>

          <h2>1. Install Low-Flow Showerheads</h2>
          <p>
            Low-flow showerheads reduce water usage without sacrificing pressure,
            saving gallons per minute during showers.
          </p>
          <a href="https://www.amazon.com/gp/product/B01MFGGH8A" target="_blank" rel="noopener noreferrer">
            High-Pressure Low-Flow Showerhead by WASSA
          </a>
          <p>
            <em>
              “If there’s magic on this planet, it’s contained in water. If there’s
              a way to save money, it’s in not wasting it!”
            </em>
            – A penny-wise homeowner
          </p>
          <p>
            <strong>Insightful Fact:</strong> Showering accounts for nearly 17% of
            residential indoor water use, with the average American household
            spending up to 40 gallons per day just for showers!
            <a href="https://www.epa.gov/watersense/showerheads" target="_blank" rel="noopener noreferrer">
              [Source]
            </a>
          </p>

          <h2>2. Use Faucet Aerators</h2>
          <p>
            Faucet aerators limit water flow while maintaining a steady stream,
            making them a simple and inexpensive fix.
          </p>
          <a href="https://www.amazon.com/gp/product/B01EVXAWP0" target="_blank" rel="noopener noreferrer">
            Neoperl Faucet Aerator Set
          </a>
          <p>
            <em>
              “I put a faucet aerator on my sink, and now even my kitchen applauds
              me for saving water.”
            </em>
            – Your next dinner guest
          </p>
          <p>
            <strong>Insightful Fact:</strong> Installing faucet aerators can save
            households up to 700 gallons of water annually.
            <a href="https://www.energy.gov/energysaver/faucet-aerators" target="_blank" rel="noopener noreferrer">
              [Source]
            </a>
          </p>

          <h2>3. Fix Leaky Toilets and Faucets</h2>
          <p>
            Leaking faucets and running toilets waste hundreds of gallons monthly.
            Replace worn parts like flappers or washers to save water.
          </p>
          <ul>
            <li>
              <a href="https://amzn.to/40GCCMb" target="_blank" rel="noopener noreferrer">
                Fluidmaster K-400H-039 High Performance Fill Valve &amp; Flapper Kit
              </a>
            </li>
            <li>
              <a href="https://amzn.to/42xQY4j" target="_blank" rel="noopener noreferrer">
                DANCO Assorted Flat Washer PRO Set (100-Piece)
              </a>
            </li>
          </ul>
          <p>
            <em>
              “Drip, drip, drip—there goes your savings. Fix it, and the sound of
              silence will also bring you peace!”
            </em>
          </p>
          <p>
            <strong>Insightful Fact:</strong> A leaky faucet dripping at one drip
            per second can waste more than 3,000 gallons per year.
            <a href="https://www.epa.gov/watersense/fix-leak-week" target="_blank" rel="noopener noreferrer">
              [Source]
            </a>
          </p>

          <h2>4. Install Dual-Flush or Water-Saving Toilets</h2>
          <p>
            Dual-flush systems let you use less water for liquid waste, cutting
            usage significantly.
          </p>
          <a href="https://amzn.to/42DGEIa" target="_blank" rel="noopener noreferrer">
            Fluidmaster 550DFRK-3 DuoFlush Conversion System
          </a>
          <p>
            <em>“Flush wisely—because your wallet prefers fewer waterworks.”</em> –
            Sage advice from your plumber
          </p>
          <p>
            <strong>Insightful Fact:</strong> Replacing an older toilet with a
            WaterSense-labeled model can save up to 13,000 gallons of water per
            year.
            <a href="https://www.epa.gov/watersense/toilets" target="_blank" rel="noopener noreferrer">
              [Source]
            </a>
          </p>

          <h2>5. Switch to Water-Efficient Appliances</h2>
          <p>
            ENERGY STAR-certified washing machines and dishwashers use less water
            and energy, maximizing efficiency.
          </p>
          <ul>
            <li>
              <a href="https://www.amazon.com/gp/product/B01MG8F3ST" target="_blank" rel="noopener noreferrer">
                Finish Quantum Dishwasher Detergent Tabs
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com/gp/product/B00C91Q86I" target="_blank" rel="noopener noreferrer">
                Affresh Washing Machine Cleaner Tablets
              </a>
            </li>
          </ul>
          <p>
            <em>“Dishwashers don’t just do dishes—they do savings, too!”</em>
          </p>
          <p>
            <strong>Insightful Fact:</strong> Modern ENERGY STAR washing machines
            use about 40% less water than conventional models.
            <a href="https://www.energystar.gov/products/products-list" target="_blank" rel="noopener noreferrer">
              [Source]
            </a>
          </p>
          <p>
            Start saving water and money today with these simple upgrades and
            solutions. Your wallet—and the planet—will thank you!
          </p>
          <div id="disqus_thread" />
        </section>

        <section id="news">
          <h2>From the News - January 2025</h2>
          <p>
            <strong>Major Cities Plan New Water Restrictions Amid Dry Spells</strong>
            <br />
            <em>Insider Insight:</em> Many metropolitan areas are enacting stricter
            guidelines on lawn watering, car washing, and commercial water usage.
            This directly impacts local water costs, further emphasizing the
            importance of conservation strategies. Applying the tips above can help
            offset rising costs—some experts predict water rates could see a 5–10%
            increase in the coming year due to drought conditions and
            infrastructure upgrades.
          </p>
          <p>
            <strong>Smart Metering Gains Popularity</strong>
            <br />
            <em>Insider Insight:</em> Utilities are rolling out advanced meters that
            track hourly usage, helping households spot leaks and waste early.
            Consider checking with your local water authority for programs that
            offer free or subsidized smart meter installations.
          </p>
        </section>

        <footer>
          <p>
            &copy; 2025 WaterShortcut. All Rights Reserved.{' '}
            <a href="#" id="footerSiteMapLink">
              Site Map
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
