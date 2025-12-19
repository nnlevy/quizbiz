
import {
  FormEvent,
  ReactNode,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  TouchEvent,
} from "react";
import "./App.css";
import AdUnit from "./components/AdUnit";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import { logEvent } from "./analytics";

declare global {
  interface Window {
    disqus_config?: () => void;
    webkitAudioContext?: typeof AudioContext;
  }
}

const SHOWER_FLOW_RATE = 2.5;
const SINK_FLOW_RATE = 1.5;
const COST_PER_GALLON_MIN = 0.0058;
const COST_PER_GALLON_MAX = 0.009;

const WATERING_GALLONS_PER_MINUTE = 4;

type SavingTip = {
  id: string;
  title: string;
  summary: string;
  fact: string;
  source: string;
  sourceHref: string;
  products?: Array<{ label: string; href: string }>;
  quote?: string;
};

const SAVING_TIPS: SavingTip[] = [
  {
    id: "showerheads",
    title: "Install Low-Flow Showerheads",
    summary:
      "Drop water use without losing pressure—swap your showerhead and reclaim gallons every session.",
    fact:
      "Showering accounts for nearly 17% of residential indoor water use—about 40 gallons per day for many homes.",
    source: "EPA WaterSense",
    sourceHref: "https://www.epa.gov/watersense/showerheads",
    products: [
      {
        label: "High-Pressure Low-Flow Showerhead by WASSA",
        href: "https://www.amazon.com/gp/product/B01MFGGH8A",
      },
    ],
    quote:
      "If there's magic on this planet, it lives in water. If there's savings in your budget, it comes from not wasting it!",
  },
  {
    id: "aerators",
    title: "Use Faucet Aerators",
    summary:
      "Screw-on aerators tame flow while keeping a steady stream, so you rinse and wash with less.",
    fact: "Aerators can save households up to 700 gallons of water annually.",
    source: "ENERGY STAR / DOE",
    sourceHref: "https://www.energy.gov/energysaver/faucet-aerators",
    products: [
      {
        label: "Faucet Aerators (multi-pack)",
        href: "https://www.amazon.com/gp/product/B01EVXAWP0",
      },
    ],
  },
  {
    id: "leaks",
    title: "Fix Leaky Toilets and Faucets",
    summary:
      "A silent trickle wastes hundreds of gallons per month—replace flappers and washers before the drip adds up.",
    fact: "A faucet dripping once per second can waste more than 3,000 gallons per year.",
    source: "EPA Fix a Leak Week",
    sourceHref: "https://www.epa.gov/watersense/fix-leak-week",
    products: [
      {
        label: "Fluidmaster K-400H-039 Fill Valve & Flapper Kit",
        href: "https://amzn.to/40GCCMb",
      },
      {
        label: "DANCO Assorted Flat Washer PRO Set",
        href: "https://amzn.to/42xQY4j",
      },
    ],
  },
  {
    id: "dual-flush",
    title: "Install Dual-Flush or Water-Saving Toilets",
    summary:
      "Dual-flush systems match the flush to the job, trimming gallons every trip to the bathroom.",
    fact: "Replacing an older toilet with a WaterSense model can save up to 13,000 gallons per year.",
    source: "EPA WaterSense",
    sourceHref: "https://www.epa.gov/watersense/toilets",
    products: [
      {
        label: "Fluidmaster 550DFRK-3 DuoFlush Conversion System",
        href: "https://amzn.to/42DGEIa",
      },
    ],
    quote: "Flush wisely—your wallet prefers fewer waterworks.",
  },
  {
    id: "appliances",
    title: "Switch to Water-Efficient Appliances",
    summary:
      "ENERGY STAR dishwashers and washers sip water and energy, slashing utility costs without extra effort.",
    fact: "Modern ENERGY STAR washing machines use about 40% less water than conventional models.",
    source: "ENERGY STAR",
    sourceHref: "https://www.energystar.gov/products/products-list",
    products: [
      {
        label: "Finish Quantum Dishwasher Detergent Tabs",
        href: "https://www.amazon.com/gp/product/B01MG8F3ST",
      },
      {
        label: "Affresh Washing Machine Cleaner Tablets",
        href: "https://www.amazon.com/gp/product/B00C91Q86I",
      },
    ],
  },
];

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  insight: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "restrictions",
    title: "Major Cities Plan New Water Restrictions",
    summary:
      "Dry spells are pushing metros to tighten lawn watering, car washing, and commercial usage rules.",
    insight:
      "Experts anticipate 5–10% rate increases to cover drought responses and infrastructure upgrades—plan conservation now to soften the impact.",
  },
  {
    id: "smart-metering",
    title: "Smart Metering Gains Popularity",
    summary:
      "Utilities are rolling out advanced meters that surface hourly usage and leaks early.",
    insight:
      "Check if your utility offers free or subsidized meter upgrades; pairing them with our leak checklist makes small drips obvious before bills spike.",
  },
];

const WATER_EJECT_SHORTCUT_URL =
  "https://www.icloud.com/shortcuts/18d4cf361b0f458f9f72d77b6a4b2f1f";
const WATER_EJECT_RUN_URL = "shortcuts://run-shortcut?name=Water%20Eject";

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
const MOBILE_BREAKPOINT = 768;
const OVERFLOW_TOLERANCE = 1;
const SLIDE_SWIPE_THRESHOLD = 48;

type CollapsibleSectionProps = {
  id: string;
  title: string;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const CollapsibleSection = ({
  children,
  id,
  isMobile,
  isOpen,
  onToggle,
  title,
}: CollapsibleSectionProps) => {
  return (
    <section className={`collapsible-shell ${isOpen ? "open" : ""}`} id={id}>
      {isMobile && (
        <div className="collapsible-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="collapsible-toggle"
            aria-expanded={isOpen}
            aria-controls={`${id}-panel`}
            onClick={onToggle}
          >
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>
      )}
      <div
        id={`${id}-panel`}
        className={`collapsible-panel ${isOpen ? "open" : ""}`}
        aria-hidden={isMobile && !isOpen}
      >
        {!isMobile && <h2 className="collapsible-inline-title">{title}</h2>}
        {isOpen || !isMobile ? children : null}
      </div>
    </section>
  );
};

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

type AppProps = {
  adsEnabled?: boolean;
  focusUpload?: boolean;
};

function App({ adsEnabled = false, focusUpload = false }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slidesWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slideTouchStartX = useRef<number | null>(null);
  const slideTouchStartY = useRef<number | null>(null);

  const initialIsMobile =
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

  const [isMobile, setIsMobile] = useState(initialIsMobile);
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

  const [isMobileFlowOpen, setIsMobileFlowOpen] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [sectionOpenState, setSectionOpenState] = useState({
    guides: !initialIsMobile,
    tools: !initialIsMobile,
    upload: !initialIsMobile,
  });
  const [openTips, setOpenTips] = useState<Record<string, boolean>>(() =>
    SAVING_TIPS.reduce((acc, tip, index) => {
      acc[tip.id] = !initialIsMobile && index === 0;
      return acc;
    }, {} as Record<string, boolean>),
  );
  const [openNews, setOpenNews] = useState<Record<string, boolean>>(() =>
    NEWS_ITEMS.reduce((acc, article, index) => {
      acc[article.id] = !initialIsMobile && index === 0;
      return acc;
    }, {} as Record<string, boolean>),
  );

  const [credits, setCredits] = useState(5);
  const [creditPulse, setCreditPulse] = useState(false);
  const [creditNotice, setCreditNotice] = useState(
    "You start with 5 credits to trigger an instant iPhone water eject.",
  );

  const showBillInsights = useMemo(() => locationHtml.trim().length > 0, [locationHtml]);

  const toggleTip = (id: string) =>
    setOpenTips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  const toggleNews = (id: string) =>
    setOpenNews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMobileStart = () => {
    if (isMobile) {
      setIsMobileFlowOpen(true);
      setFlowStep(0);
    } else {
      handleScrollTo("location-intel");
    }
  };

  const handleFlowBack = () => setFlowStep((prev) => Math.max(prev - 1, 0));
  const handleFlowNext = () => setFlowStep((prev) => Math.min(prev + 1, 3));
  const handleFlowClose = () => {
    setIsMobileFlowOpen(false);
    setFlowStep(0);
  };

  const triggerCreditPulse = () => {
    setCreditPulse(true);
    setTimeout(() => setCreditPulse(false), 750);
  };

  const spendCredit = () => {
    if (credits <= 0) {
      setCreditNotice("No credits left. Check back soon for a refresh.");
      triggerCreditPulse();
      return false;
    }
    const updatedCredits = Math.max(credits - 1, 0);
    setCredits(updatedCredits);
    setCreditNotice(`Water eject triggered. ${updatedCredits} credits left.`);
    triggerCreditPulse();
    return true;
  };

  const triggerDeviceHaptics = () => {
    const vibrationPattern = [30, 40, 30];
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(vibrationPattern);
    }

    const AudioContextClass =
      typeof window !== "undefined" &&
      (window.AudioContext || window.webkitAudioContext || undefined);

    if (AudioContextClass) {
      try {
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 180;
        gainNode.gain.value = 0.0008;

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.35);

        oscillator.onended = () => {
          oscillator.disconnect();
          gainNode.disconnect();
          context.close().catch(() => undefined);
        };
      } catch (error) {
        console.error("Haptic trigger failed", error);
      }
    }
  };

  const handleWaterEjectClick = () => {
    const spent = spendCredit();
    if (!spent) {
      logEvent("water_eject", {
        action: "blocked_no_credit",
        credits_remaining: credits,
      });
      return;
    }

    triggerDeviceHaptics();

    logEvent("water_eject", {
      action: "click",
      credits_remaining: Math.max(credits - (spent ? 1 : 0), 0),
    });

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const targetUrl = isIOS ? WATER_EJECT_RUN_URL : WATER_EJECT_SHORTCUT_URL;
    const openedWindow = window.open(targetUrl, "_blank");
    if (!openedWindow) {
      window.location.href = targetUrl;
    }
  };

  const handleOpenUploadStep = () => {
    handleScrollTo("upload");
    setIsMobileFlowOpen(false);
  };

  const handleOpenLocationStep = () => {
    handleScrollTo("location-intel");
    setIsMobileFlowOpen(false);
  };

  const handleSlideTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    slideTouchStartX.current = touch.clientX;
    slideTouchStartY.current = touch.clientY;
  };

  const handleSlideTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = slideTouchStartX.current;
    const startY = slideTouchStartY.current;
    slideTouchStartX.current = null;
    slideTouchStartY.current = null;
    if (startX === null || startY === null) {
      return;
    }
    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < SLIDE_SWIPE_THRESHOLD) {
      return;
    }
    if (dx < 0) {
      setCurrentSlide((prev) => Math.min(prev + 1, SLIDE_COUNT - 1));
    } else {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSectionOpenState({ guides: false, tools: false, upload: false });
      return;
    }
    setSectionOpenState({ guides: true, tools: true, upload: true });
  }, [isMobile]);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`,
      );
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight, { passive: true });
    window.addEventListener("orientationchange", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    if (focusUpload) {
      handleScrollTo("upload");
    }
  }, [focusUpload]);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileFlowOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobileFlowOpen) {
      document.body.classList.add("is-sheet-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("is-sheet-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("is-sheet-open");
      document.body.style.overflow = "";
    };
  }, [isMobileFlowOpen]);

  useEffect(() => {
    const wrapper = slidesWrapperRef.current;
    if (!wrapper) {
      return;
    }
    const slides = Array.from(wrapper.querySelectorAll<HTMLElement>(".slide"));
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = [...entries]
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) {
          return;
        }
        const index = slides.findIndex((slide) => slide === mostVisible.target);
        if (index >= 0) {
          setCurrentSlide(index);
        }
      },
      { root: wrapper, threshold: 0.55 },
    );

    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = slidesWrapperRef.current;
    if (!wrapper) {
      return;
    }
    const slides = wrapper.querySelectorAll<HTMLElement>(".slide");
    const activeSlide = slides[currentSlide];
    if (activeSlide) {
      wrapper.scrollTo({ left: activeSlide.offsetLeft, behavior: "smooth" });
    }
  }, [currentSlide]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReducedMotion.matches) {
      canvas.style.display = "none";
      return undefined;
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
    const duration = 30 * 1000;

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
      if (Date.now() - startTime < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
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

  useEffect(() => {
    const runOverflowCheck = (label: string) => {
      const doc = document.documentElement;
      const scrollWidth = doc.scrollWidth;
      const viewportWidth = doc.clientWidth + OVERFLOW_TOLERANCE;
      if (scrollWidth > viewportWidth) {
        console.warn(`layout overflow (${label}):`, scrollWidth, viewportWidth);
      }

      ["hero", "location-intel", "dynamic-sliders", "upload"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (!el) {
            return;
          }
          const rect = el.getBoundingClientRect();
          if (rect.right - viewportWidth > OVERFLOW_TOLERANCE) {
            el.classList.add("layout-warning");
            console.warn("overflow element", id, rect.right, viewportWidth);
          } else {
            el.classList.remove("layout-warning");
          }
        },
      );
    };

    const handleLoad = () => {
      runOverflowCheck("initial");
      window.setTimeout(() => runOverflowCheck("post-ads"), 4000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }
    const highlightOverflow = () => {
      const viewportWidth = document.documentElement.clientWidth + OVERFLOW_TOLERANCE;
      const elements = document.querySelectorAll<HTMLElement>("body *");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const overflowing = rect.right - viewportWidth > OVERFLOW_TOLERANCE;
        if (overflowing) {
          el.dataset.overflowDebug = "true";
          console.debug("[overflow-debug]", el.tagName, el.className || el.id);
        } else {
          delete el.dataset.overflowDebug;
        }
      });
    };
    const debugTimer = window.setTimeout(highlightOverflow, 800);
    window.addEventListener("resize", highlightOverflow);
    return () => {
      window.clearTimeout(debugTimer);
      window.removeEventListener("resize", highlightOverflow);
      document
        .querySelectorAll<HTMLElement>("[data-overflow-debug]")
        .forEach((node) => node.removeAttribute("data-overflow-debug"));
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
    logEvent("location_search", { query_length: locationInput.trim().length });
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
      logEvent("location_results_ready");
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
    logEvent("upload_started", { file_size: file.size, file_type: file.type });
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
      logEvent("upload_completed", { file_size: file.size, status: "success" });
    } catch (error) {
      console.error("Upload failed:", error);
      setAnalysisCountdown(null);
      setCountdownLabel("Analysis should be complete shortly.");
      setResponseMessage(
        "An error occurred during the upload. Please try again.",
      );
      logEvent("upload_failed", { message: String(error) });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app">
      <SiteNav credits={credits} pulse={creditPulse} />
      <canvas id="canvas" ref={canvasRef} aria-hidden />

      <main className="main-wrapper">
        <section className="water-eject-banner" aria-labelledby="water-eject">
          <div className="banner-grid">
            <div className="banner-copy">
              <p className="eyebrow">Not the other shortcut</p>
              <h2 id="water-eject">Instant iPhone Water Eject</h2>
              <p>
                Lots of visitors land here looking for the popular "iPhone
                Water Eject" shortcut. We&apos;ve got you covered—tap once and the
                Shortcuts app will play a speaker-clearing tone (with a quick
                haptic buzz) while we keep your conservation journey on track.
              </p>
              <ul className="banner-list">
                <li>Runs via Apple Shortcuts with the classic 165 Hz pulse.</li>
                <li>Credits keep the experience calm and spam-free (you start with 5).</li>
                <li>Feel a confirmation buzz on iPhone when you fire the eject.</li>
                <li>Stay on this page—no mystery links or confusing detours.</li>
              </ul>
              <div className="banner-actions">
                <button
                  type="button"
                  className="primary-button eject-button"
                  onClick={handleWaterEjectClick}
                >
                  Eject water now
                  <span className="credit-chip">-1 credit</span>
                </button>
                <p className="credit-note" aria-live="polite">
                  {creditNotice}
                </p>
              </div>
            </div>
            <div className="banner-card" aria-hidden="true">
              <div className="card-glow" />
              <div className="card-body">
                <p className="eyebrow">Shortcut preview</p>
                <h3>Water Eject Launcher</h3>
                <p>
                  Taps the iOS Shortcuts URL:
                  <br />
                  <code>shortcuts://run-shortcut?name=Water%20Eject</code>
                </p>
                <p className="subdued">
                  If you don&apos;t have Shortcuts installed, we&apos;ll open the
                  iCloud share link so you can add it in seconds.
                </p>
                <div className="tone-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <p className="mini-hint">Uses the classic 165 Hz water-eject pulse.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="hero" id="top">
          <div className="hero-content">
            <p className="eyebrow">Smarter conservation for every household</p>
            <h1>Conserve Water &amp; Save Money</h1>
            <h2>Reduce Your Water Bill With AI</h2>
            <p className="hero-copy">
              Pinpoint hidden leaks, compare local utility rates, and let our AI
              coach guide you toward a water-wise lifestyle. Every feature is
              crafted to feel fluid, interactive, and actionable.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleMobileStart}
              >
                Start
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={handleOpenLocationStep}
              >
                Explore tools
              </button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <svg viewBox="0 0 400 320" role="presentation">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#61d5ff" />
                  <stop offset="50%" stopColor="#4f9bff" />
                  <stop offset="100%" stopColor="#8a6dff" />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(79,155,255,0)" />
                </radialGradient>
              </defs>
              <circle className="hero-glow" cx="200" cy="160" r="120" fill="url(#glow)" />
              <path
                className="wave wave-1"
                d="M0,200 C70,140 130,260 200,200 C270,140 330,260 400,200 L400,320 L0,320 Z"
                fill="url(#waveGradient)"
              />
              <path
                className="wave wave-2"
                d="M0,180 C80,120 120,240 200,190 C280,140 320,240 400,180 L400,320 L0,320 Z"
                fill="url(#waveGradient)"
              />
              <path
                className="wave wave-3"
                d="M0,210 C60,150 140,250 200,210 C260,170 340,250 400,210 L400,320 L0,320 Z"
                fill="url(#waveGradient)"
              />
              <g className="droplet-cluster">
                <path
                  d="M200 60 C230 110 240 150 200 180 C160 150 170 110 200 60 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <circle cx="160" cy="120" r="14" fill="#ffffff" opacity="0.5" />
                <circle cx="240" cy="120" r="10" fill="#ffffff" opacity="0.65" />
              </g>
            </svg>
          </div>
        </section>

        {isMobile && (
          <div
            className={`mobile-flow ${isMobileFlowOpen ? "open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Guided savings flow"
          >
            <button
              type="button"
              className="mobile-flow__scrim"
              aria-label="Close guided flow"
              onClick={handleFlowClose}
            />
            <div className="mobile-flow__sheet">
              <div className="mobile-flow__handle" aria-hidden />
              <div className="mobile-flow__header">
                <div>
                  <p className="eyebrow">Guided mode</p>
                  <h3>Step {flowStep + 1} of 4</h3>
                </div>
                <div className="flow-actions">
                  {flowStep > 0 && (
                    <button
                      type="button"
                      className="secondary-button ghost"
                      onClick={handleFlowBack}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    className="ghost-close"
                    aria-label="Close guided experience"
                    onClick={handleFlowClose}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="mobile-flow__body">
                {flowStep === 0 && (
                  <div className="flow-step">
                    <h4>Quick estimate</h4>
                    <p>
                      Drag to see how a shorter shower affects your yearly bill.
                    </p>
                    <label className="flow-label" htmlFor="flow-shower-reduction">
                      Reduce Shower Length
                    </label>
                    <input
                      type="range"
                      id="flow-shower-reduction"
                      min={1}
                      max={10}
                      value={showerReduction}
                      onChange={(event) =>
                        setShowerReduction(Number(event.target.value))
                      }
                    />
                    <p className="flow-output">{reductionSummary}</p>
                  </div>
                )}
                {flowStep === 1 && (
                  <div className="flow-step">
                    <h4>Find my utility</h4>
                    <p>Search for your city or water district.</p>
                    <input
                      type="text"
                      inputMode="search"
                      id="flow-location"
                      placeholder="Austin, TX or Barcelona"
                      value={locationInput}
                      onChange={(event) => setLocationInput(event.target.value)}
                    />
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleLocationSearch}
                    >
                      Search
                    </button>
                    <p className="location-status" aria-live="polite">
                      {locationStatus}
                    </p>
                  </div>
                )}
                {flowStep === 2 && (
                  <div className="flow-step">
                    <h4>Upload your bill</h4>
                    <p>
                      We&apos;ll analyze a PDF copy for surcharges, leaks, and
                      rebate opportunities.
                    </p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleOpenUploadStep}
                    >
                      Open upload form
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleOpenLocationStep}
                    >
                      Back to finder
                    </button>
                  </div>
                )}
                {flowStep === 3 && (
                  <div className="flow-step">
                    <h4>Next actions</h4>
                    <ul className="flow-list">
                      <li>Save your slider settings and send yourself a reminder.</li>
                      <li>Compare local rebates after upload.</li>
                      <li>Share results with your household.</li>
                    </ul>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleOpenLocationStep}
                    >
                      View my utility results
                    </button>
                  </div>
                )}
              </div>
              <div className="mobile-flow__footer">
                <button
                  type="button"
                  className="primary-button full"
                  onClick={flowStep === 3 ? handleFlowClose : handleFlowNext}
                >
                  {flowStep === 3 ? "Finish" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}

        <CollapsibleSection
          id="interactive"
          title="Step 1 · Explore savings tools"
          isMobile={isMobile}
          isOpen={!isMobile || sectionOpenState.tools}
          onToggle={() =>
            setSectionOpenState((prev) => ({
              ...prev,
              tools: !prev.tools,
            }))
          }
        >
          {adsEnabled && (
            <div className="ad-wrapper" aria-label="Top ad unit">
              <AdUnit slot="1234567890" />
            </div>
          )}

          <section className="feature-grid" aria-label="Feature highlights">
            <article className="feature-card">
              <h3>AI Usage Insights</h3>
              <p>
                Translate household routines into gallons, dollars, and smarter
                habits with interactive controls that react instantly.
              </p>
            </article>
            <article className="feature-card">
              <h3>Bill Abnormality Alerts</h3>
              <p>
                Surface unusual spikes, fee changes, and service adjustments before
                they drain your budget.
              </p>
            </article>
            <article className="feature-card">
              <h3>Community-Backed Tips</h3>
              <p>
                Blend expert recommendations with peer-tested upgrades to maximize
                conservation results.
              </p>
            </article>
          </section>

          <section className="container discovery-section" id="location-intel">
            <div className="section-intro">
              <h2>Find Your Utility &amp; Reveal Savings Pathways</h2>
              <p>
                Move through the slides to grasp water cost fundamentals, explore
                the full burden of waste, and pinpoint your local billing portal.
              </p>
            </div>
            <div className="dual-slider">
              <div
                className="slides-wrapper"
                ref={slidesWrapperRef}
                onTouchStart={handleSlideTouchStart}
                onTouchEnd={handleSlideTouchEnd}
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
                    &bull; Sewage Cost: ~$84/year for typical shower &amp; sink usage.
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
                    className="primary-button"
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
                  {showBillInsights && (
                    <div className="location-follow-up">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleScrollTo("upload")}
                      >
                        Upload your bill for an AI abnormality check
                      </button>
                      <div className="bill-checklist">
                        <h4>Bill Health Checklist</h4>
                        <ul>
                          <li>
                            Compare base service charges month-to-month for hidden
                            hikes.
                          </li>
                          <li>Spot seasonal surges that don&apos;t match your usage.</li>
                          <li>
                            Verify tier pricing thresholds and confirm you&apos;re in the
                            optimal bracket.
                          </li>
                          <li>
                            Highlight leak alerts, drought surcharges, or
                            unexpected fines.
                          </li>
                          <li>
                            Capture conservation credits or rebates you&apos;re missing
                            out on.
                          </li>
                        </ul>
                        <p>
                          Tip: Pair the findings with low-flow fixtures, mindful
                          watering schedules, and appliance upgrades to conserve
                          water and reduce charges.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="slider-dots" role="tablist" aria-label="Water insight slides">
                {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    className={index === currentSlide ? "dot active" : "dot"}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={index === currentSlide}
                  />
                ))}
              </div>
            </div>
          </section>

          {adsEnabled && (
            <div className="ad-wrapper tight" aria-label="Mid-page ad unit">
              <AdUnit slot="0987654321" />
            </div>
          )}

          <section className="container" id="dynamic-sliders">
            <h2>Instant Water Usage Calculator</h2>
            <p>
              Experiment with these sliders to see approximate annual usage and cost
              for typical shower, sink, and weekly watering habits.
            </p>

            <div className="slider-panel">
              <div className="slider-group">
                <h3>Reduce Shower Usage</h3>
                <p>
                  Move this slider to see how cutting down your daily shower by
                  certain minutes can impact annual water usage—and approximate cost
                  savings.
                </p>
                <div className="slider-control">
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
              </div>

              <div className="slider-group">
                <h3>Upgrade Appliances and Fixtures</h3>
                <p>
                  Adjust the sliders below to estimate annual usage and cost across
                  the cost range. <em>(We multiply gallons used by our cost-per-gallon range.)</em>
                </p>

                <div className="slider-control">
                  <label htmlFor="shower-slider">Daily Shower Length (minutes)</label>
                  <input
                    type="range"
                    id="shower-slider"
                    min={5}
                    max={30}
                    value={showerLength}
                    onChange={(event) =>
                      setShowerLength(Number(event.target.value))
                    }
                  />
                  <p id="shower-output">
                    Daily shower time: <strong>{applianceSavings.shower.minutes}</strong>,
                    Estimated annual cost: <strong>{formatCurrencyRange(
                      applianceSavings.shower.minCost,
                      applianceSavings.shower.maxCost,
                    )}</strong>.
                    <a
                      href="https://www.amazon.com/gp/product/B01MFGGH8A"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Upgrade with WaterSense Showerheads
                    </a>
                  </p>
                </div>

                <div className="slider-control">
                  <label htmlFor="sink-slider">Daily Sink Use (minutes)</label>
                  <input
                    type="range"
                    id="sink-slider"
                    min={5}
                    max={30}
                    value={sinkUsage}
                    onChange={(event) => setSinkUsage(Number(event.target.value))}
                  />
                  <p id="sink-output">
                    Daily sink use: <strong>{applianceSavings.sink.minutes}</strong>,
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

                <div className="slider-control">
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
              </div>
            </div>
          </section>
        </CollapsibleSection>

        <CollapsibleSection
          id="upload-flow"
          title="Step 2 · Upload &amp; analyze"
          isMobile={isMobile}
          isOpen={!isMobile || sectionOpenState.upload}
          onToggle={() =>
            setSectionOpenState((prev) => ({
              ...prev,
              upload: !prev.upload,
            }))
          }
        >
          <section className="container analyzer-col" id="upload">
            <div className="upload-grid">
              <div className="image-container">
                <img
                  src="https://res.cloudinary.com/dlxzgqi9g/image/upload/v1733631746/quizbiz_husband_wife_and_golden_doodle_tighten_an_outdoor_tap_42a5be20-23eb-4352-9493-e39d2bcd8e81_3_kjswaw.png"
                  alt="Family tightening an outdoor tap to conserve water"
                  loading="lazy"
                />
              </div>
              <div className="upload-panel">
                <h1>Free Water Usage Optimizer</h1>
                <h2>Upload Your Water Bill</h2>
                <form id="upload-form" onSubmit={handleUpload} encType="multipart/form-data">
                  <label className="file-label" htmlFor="file">
                    Attach a PDF statement (max 10MB)
                  </label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    required
                    aria-label="Upload water bill PDF"
                  />
                  <button type="submit" disabled={isUploading} className="primary-button">
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
                <div className="upload-how-it-works">
                  <h3>How It Works</h3>
                  <p>
                    Upload your recent water bill to our secure platform, and our
                    advanced AI system will generate specific action
                    recommendations. Google Document AI extracts the details, and the
                    OpenAI o1-mini model outlines targeted conservation steps
                    tailored to your usage.
                  </p>
                </div>
                <div className="stripe-wrapper">
                  <StripeBuyButton
                    buyButtonId="buy_btn_1QLXcFIzTeKgjbPr1afKz0xu"
                    publishableKey="pk_live_dummy"
                  />
                </div>
              </div>
            </div>
          </section>
        </CollapsibleSection>
      </main>
      <CollapsibleSection
        id="guides"
        title="Step 3 · Guides &amp; resources"
        isMobile={isMobile}
        isOpen={!isMobile || sectionOpenState.guides}
        onToggle={() =>
          setSectionOpenState((prev) => ({
            ...prev,
            guides: !prev.guides,
          }))
        }
      >
        <div className="container-about">
          <section id="about" className="story-block">
            <h2>About Us</h2>
            <p>
              At WaterShortcut.com, we help you conserve water and save money. First,
              Google Vision analyzes your water bill and then the most advanced AI
              model offered by OpenAI provides recommendations. Our mission is to
              make water efficiency simple, impactful, and accessible to everyone.
              Whether you&apos;re a homeowner or a business, our tools provide actionable
              insights to optimize your water usage.
            </p>
          </section>

          <section id="top-ways" className="story-block">
            <h1>Top 5 Ways to Reduce Your Water Bill</h1>
            <p>
              Cutting back on water usage isn&apos;t just good for the planet—it’s great
              for your wallet! Here are five actionable tips to reduce your water
              bill and related product recommendations.
            </p>
            <div className="accordion" role="list">
              {SAVING_TIPS.map((tip, index) => (
                <article
                  key={tip.id}
                  className={`accordion-item ${openTips[tip.id] ? "open" : ""}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="accordion-trigger"
                    aria-expanded={!!openTips[tip.id]}
                    onClick={() => toggleTip(tip.id)}
                  >
                    <div className="accordion-header">
                      <p className="eyebrow">Move {index + 1}</p>
                      <h3>{tip.title}</h3>
                      <p className="accordion-summary">{tip.summary}</p>
                    </div>
                    <span aria-hidden>{openTips[tip.id] ? "–" : "+"}</span>
                  </button>
                  <div className="accordion-content" hidden={!openTips[tip.id]}>
                    <p className="accordion-detail">{tip.summary}</p>
                    <p>
                      <strong>Fact:</strong> {tip.fact}{" "}
                      <a href={tip.sourceHref} target="_blank" rel="noopener noreferrer">
                        ({tip.source})
                      </a>
                    </p>
                    {tip.quote && <blockquote>{tip.quote}</blockquote>}
                    {tip.products && tip.products.length > 0 && (
                      <ul className="product-links">
                        {tip.products.map((product) => (
                          <li key={product.href}>
                            <a href={product.href} target="_blank" rel="noopener noreferrer">
                              {product.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="accordion-footer">
              Start saving water and money today with these simple upgrades and
              solutions. Your wallet—and the planet—will thank you!
            </p>
            <div id="disqus_thread" />
          </section>

          <section id="news" className="story-block news-block">
            <h2>From the News - January 2025</h2>
            <div className="news-grid" role="list">
              {NEWS_ITEMS.map((item, index) => (
                <article
                  key={item.id}
                  className={`news-card ${openNews[item.id] ? "open" : ""}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="accordion-trigger compact"
                    aria-expanded={!!openNews[item.id]}
                    onClick={() => toggleNews(item.id)}
                  >
                    <div className="accordion-header">
                      <p className="eyebrow">Brief {index + 1}</p>
                      <h3>{item.title}</h3>
                      <p className="accordion-summary">{item.summary}</p>
                    </div>
                    <span aria-hidden>{openNews[item.id] ? "–" : "+"}</span>
                  </button>
                  <div className="accordion-content" hidden={!openNews[item.id]}>
                    <p className="accordion-detail">{item.insight}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

        <SiteFooter />
      </div>
      </CollapsibleSection>
    </div>
  );
}

export default App;
