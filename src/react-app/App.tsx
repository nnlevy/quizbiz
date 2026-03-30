
import React, {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  ReactNode,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import ConsentBanner from "./components/ConsentBanner";
import InlineHelpAccordion from "./components/InlineHelpAccordion";
import ResultsCard from "./components/ResultsCard";
import ShareExportBar from "./components/ShareExportBar";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import Stepper from "./components/Stepper";
import TrustCapsule from "./components/TrustCapsule";
import ViralWaterIqCard from "./components/ViralWaterIqCard";
import {
  calculateAnnualGallons,
  calculateAnnualGallonsFromWeekly,
  calculateCostRange,
  calculateReductionSavings,
} from "./utils/calculators";
import { detectIphone } from "./utils/device";
import { buildSearchKeywords, buildSearchQuery, buildSearchUrl } from "./utils/searchLinks";
import { logEvent } from "./analytics";
import { useCredits } from "./context/CreditsContext";
import { useCreditsModal } from "./context/CreditsModalContext";
import { useSession } from "./context/SessionContext";
import { useCreditsCheckout } from "./hooks/useCreditsCheckout";
import UtilityResultCard, { type UtilityPayload } from "./components/UtilityResultCard";
import { copy } from "../copy";
import demoResult from "./data/demo.json";
import type { AnalysisMove, AnalysisResult } from "./types";
import { CREDIT_TOPUP_AMOUNT, CREDIT_TOPUP_FLAG, CREDIT_TOPUP_PRICE } from "./utils/credits";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const SHOWER_FLOW_RATE = 2.5;
const SINK_FLOW_RATE = 1.5;
const COST_PER_GALLON_MIN = 0.0058;
const COST_PER_GALLON_MAX = 0.009;

const WATERING_GALLONS_PER_MINUTE = 4;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => isNonEmptyString(entry));

const isAnalysisMove = (value: unknown): value is AnalysisMove => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.why) &&
    isNonEmptyString(value.effort) &&
    isNonEmptyString(value.impact) &&
    isStringArray(value.steps) &&
    isNonEmptyString(value.ctaLabel) &&
    isNonEmptyString(value.ctaHref)
  );
};

const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!isRecord(value)) return false;
  const billingSummary = value.billingSummary as Record<string, unknown> | undefined;
  const totalUsage = billingSummary?.totalUsage as Record<string, unknown> | undefined;
  return (
    isNonEmptyString(value.analysisId) &&
    isRecord(billingSummary) &&
    isNonEmptyString(billingSummary?.billingPeriod) &&
    isRecord(totalUsage) &&
    typeof totalUsage?.value === "number" &&
    isNonEmptyString(totalUsage?.unit) &&
    typeof billingSummary?.totalCost === "number" &&
    Array.isArray(billingSummary?.rateTiers) &&
    Array.isArray(value.usageHistory) &&
    Array.isArray(value.alerts) &&
    isNonEmptyString(value.savingsSummary) &&
    Array.isArray(value.topMoves) &&
    value.topMoves.length === 3 &&
    value.topMoves.every((move) => isAnalysisMove(move)) &&
    isNonEmptyString(value.payingFor) &&
    isNonEmptyString(value.nextStep) &&
    (value.confidenceNote === undefined || isNonEmptyString(value.confidenceNote))
  );
};

const getCalculatorLinkForMove = (move: AnalysisMove): string | null => {
  if (move.ctaHref.startsWith("/calculators/")) {
    return move.ctaHref;
  }
  const combined = `${move.title} ${move.ctaLabel} ${move.ctaHref}`.toLowerCase();
  if (combined.includes("shower")) return "/calculators/shower";
  if (combined.includes("faucet") || combined.includes("aerator")) {
    return "/calculators/faucet";
  }
  if (combined.includes("toilet") || combined.includes("flapper")) {
    return "/calculators/toilet";
  }
  if (combined.includes("laundry") || combined.includes("washer")) {
    return "/calculators/laundry";
  }
  if (
    combined.includes("outdoor") ||
    combined.includes("irrigation") ||
    combined.includes("sprinkler") ||
    combined.includes("lawn")
  ) {
    return "/calculators/outdoor";
  }
  return null;
};

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

const UPGRADE_MODAL_CONTENT: Record<UpgradeModalTopic, { title: string; description: string; keywords: string; }> = {
  showerheads: {
    title: "WaterSense Showerhead Upgrade Lab",
    description:
      "Preview how a high-efficiency WaterSense showerhead trims gallons while keeping spa-like pressure. Pair the longer-form calculator with our water bill insights to get ahead of rate hikes.",
    keywords:
      "water-saving showerhead upgrade, low-flow WaterSense shower, spa pressure shower savings, conserve hot water, sustainable bathroom remodel",
  },
  aerators: {
    title: "Faucet Aerator Efficiency Studio",
    description:
      "Dial in your daily sink use and see how aerators tame flow for dishwashing, toothbrushing, and quick rinses without losing comfort.",
    keywords:
      "faucet aerator savings, kitchen sink water efficiency, bathroom aerator install, conserve water at the sink, ENERGY STAR appliance pairing",
  },
  detergents: {
    title: "High-Efficiency Detergent Hub",
    description:
      "Model your weekly watering and cleaning routines, then pair with plant-friendly nozzles and HE detergents to lighten both bills and runoff.",
    keywords:
      "high efficiency detergent, eco-friendly dishwasher tabs, lawn watering conservation, sustainable cleaning supplies, buy efficient appliances",
  },
};

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
  "https://www.icloud.com/shortcuts/0ccfc30b13184f9b9540b25285765d31";
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

type UpgradeModalTopic = "showerheads" | "aerators" | "detergents";
type PurchasePreference = "online" | "in-person";

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

type AppProps = {
  focusUpload?: boolean;
};

function App({ focusUpload = false }: AppProps) {
  const { credits, deduct, setCredits: setGlobalCredits, pulse, setPulse } =
    useCredits();
  const { openModal } = useCreditsModal();
  const { refreshSession } = useSession();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slidesWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadStepTimers = useRef<number[]>([]);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const topMovesRef = useRef<HTMLDivElement | null>(null);
  const slideTouchStartX = useRef<number | null>(null);
  const slideTouchStartY = useRef<number | null>(null);

  const initialIsMobile =
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

  const isSelfCheckMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("selfcheck") === "1";

  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showerReduction, setShowerReduction] = useState(5);
  const [showerLength, setShowerLength] = useState(10);
  const [sinkUsage, setSinkUsage] = useState(10);
  const [wateringMinutes, setWateringMinutes] = useState(7);
  const [qrExpanded, setQrExpanded] = useState(initialIsMobile);
  const [hasLeakInteraction, setHasLeakInteraction] = useState(false);
  const [hasBillUpload, setHasBillUpload] = useState(false);
  const [hasLocationInteraction, setHasLocationInteraction] = useState(false);

  const [locationInput, setLocationInput] = useState("");
  const [locationStatus, setLocationStatus] = useState(
    "Enter your city or region to begin.",
  );
  const [locationHtml, setLocationHtml] = React.useState("");
  const [locationCountdown, setLocationCountdown] = React.useState<number | null>(null);
  const [localResearchPlan, setLocalResearchPlan] = React.useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [utilityResults, setUtilityResults] = useState<UtilityPayload[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  const locationSuggestionPool = useMemo(
    () =>
      [
        "Austin, TX",
        "Los Angeles, CA",
        "New York, NY",
        "Chicago, IL",
        "Seattle, WA",
        "San Francisco, CA",
        "Phoenix, AZ",
        "Denver, CO",
        "Dallas, TX",
        "Miami, FL",
        "Portland, OR",
      ],
    [],
  );

  const [responseMessage, setResponseMessage] = React.useState("");
  const [uploadError, setUploadError] = React.useState<"parse" | "ai" | null>(null);
  const [analysisHtml, setAnalysisHtml] = React.useState("");
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [uploadStep, setUploadStep] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [manualForm, setManualForm] = useState({
    period: "",
    usage: "",
    unit: "Gallons",
    cost: "",
    rate: "",
    household: "",
    notes: "",
  });
  const [manualStatus, setManualStatus] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);

  const [isMobileFlowOpen, setIsMobileFlowOpen] = React.useState(false);
  const [flowStep, setFlowStep] = React.useState(0);
  const [sectionOpenState, setSectionOpenState] = React.useState({
    guides: !initialIsMobile,
    tools: !initialIsMobile,
    upload: !initialIsMobile,
  });
  const [isWaterEjectCollapsed, setIsWaterEjectCollapsed] = useState(true);

  const [openTips, setOpenTips] = useState<Record<string, boolean>>(() =>
    SAVING_TIPS.reduce((acc, tip, index) => {
      acc[tip.id] = !initialIsMobile && index === 0;
      return acc;
    }, {} as Record<string, boolean>),
  );

  useEffect(() => {
    const normalized = locationInput.trim().toLowerCase();
    if (!normalized) {
      setLocationSuggestions(locationSuggestionPool.slice(0, 6));
      return;
    }

    const matches = locationSuggestionPool.filter((entry) =>
      entry.toLowerCase().includes(normalized),
    );

    const nextSuggestions = (matches.length ? matches : locationSuggestionPool).slice(
      0,
      6,
    );
    setLocationSuggestions(nextSuggestions);
  }, [locationInput, locationSuggestionPool]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#plan=")) {
      try {
        const encoded = hash.replace("#plan=", "");
        const decoded = decodeURIComponent(atob(encoded));
        const parsed = JSON.parse(decoded) as AnalysisResult;
        if (isAnalysisResult(parsed)) {
          setAnalysisResult(parsed);
          return;
        }
        console.warn("Shared plan is missing required fields.");
        return;
      } catch (error) {
        console.warn("Failed to parse shared plan", error);
      }
    }
    const stored = window.localStorage.getItem("ws-latest-plan");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalysisResult;
        if (isAnalysisResult(parsed)) {
          setAnalysisResult(parsed);
        } else {
          console.warn("Stored plan is missing required fields.");
        }
      } catch (error) {
        console.warn("Failed to parse stored plan", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsWaterEjectCollapsed(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (analysisResult) {
      setHasBillUpload(true);
    }
  }, [analysisResult]);

  useEffect(() => {
    if (!isSelfCheckMode) return;
    console.info("WS_SELF_CHECK_ON", {
      path: typeof window !== "undefined" ? window.location.pathname : "",
      hash: typeof window !== "undefined" ? window.location.hash : "",
    });

    const handleHashChange = () => {
      console.info("WS_NAV_HASH", { hash: window.location.hash });
    };

    const handlePopState = () => {
      console.info("WS_NAV_POP", { path: window.location.pathname, search: window.location.search });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest<HTMLElement>("a,button");
      if (!clickable) return;

      if (clickable.tagName.toLowerCase() === "a") {
        const anchor = clickable as HTMLAnchorElement;
        console.info("WS_CLICK", {
          kind: "link",
          text: anchor.textContent?.trim() || "",
          href: anchor.getAttribute("href") || "",
        });
        return;
      }

      console.info("WS_CLICK", {
        kind: "button",
        text: clickable.textContent?.trim() || "",
        id: clickable.id || "",
        className: clickable.className || "",
      });
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isSelfCheckMode]);

  useEffect(() => {
    if (!isSelfCheckMode) return;
    if (!analysisResult) return;
    console.info("WS_ANALYSIS_READY", {
      analysisId: analysisResult.analysisId,
      topMoves: analysisResult.topMoves.map((move) => ({
        title: move.title,
        ctaLabel: move.ctaLabel,
        ctaHref: move.ctaHref,
      })),
    });
  }, [isSelfCheckMode, analysisResult]);

  useEffect(() => {
    if (!isSelfCheckMode) return;
    console.info("WS_UPLOAD_STEP", { step: uploadStep, isUploading, hasPreview: Boolean(uploadPreview) });
  }, [isSelfCheckMode, uploadStep, isUploading, uploadPreview]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.location.hash === "#manual-entry") {
      window.setTimeout(() => {
        document.getElementById("manual-entry")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setIsWaterEjectMode(
      window.location.pathname.startsWith("/blog-how-to-eject") ||
        window.location.pathname.startsWith("/water-eject"),
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setDeviceInfo({
      isIphone: detectIphone(window.navigator),
      ready: true,
    });
  }, []);

  const [openNews, setOpenNews] = useState<Record<string, boolean>>(() =>
    NEWS_ITEMS.reduce((acc, article, index) => {
      acc[article.id] = !initialIsMobile && index === 0;
      return acc;
    }, {} as Record<string, boolean>),
  );

  const creditsRef = useRef(credits);
  const [creditNotice, setCreditNotice] = useState(
    "You start with 5 credits to trigger an instant iPhone water eject.",
  );
  const [deviceInfo, setDeviceInfo] = useState({ isIphone: false, ready: false });
  const [isWaterEjectMode, setIsWaterEjectMode] = useState(false);
  const [showCreditCelebration, setShowCreditCelebration] = useState(false);
  const [creditCelebrationMessage, setCreditCelebrationMessage] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTopic, setUpgradeTopic] = useState<UpgradeModalTopic | null>(
    null,
  );
  const upgradeModalRef = useRef<HTMLDivElement | null>(null);
  const upgradeModalTriggerRef = useRef<HTMLElement | null>(null);
  const wasUpgradeModalOpen = useRef(false);
  const [ctaPreference, setCtaPreference] = useState<PurchasePreference | null>(
    null,
  );
  const [ctaRecommendation, setCtaRecommendation] = useState("");
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);
  const getFocusableElements = useCallback((container: HTMLElement | null) => {
    if (!container) {
      return [];
    }
    const selectors = [
      "a[href]",
      "button",
      "input",
      "select",
      "textarea",
      "[tabindex]:not([tabindex=\"-1\"])",
    ];
    return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(","))).filter(
      (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
    );
  }, []);

  useEffect(() => {
    if (locationInput.trim().length < 3) {
      setLocationSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput.trim())}&countrycodes=us&limit=5`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const data = (await response.json()) as Array<{ display_name?: string }>;
        const suggestions = data
          .map((entry) => entry.display_name)
          .filter((name): name is string => Boolean(name))
          .slice(0, 5);
        setLocationSuggestions(suggestions);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.warn("Autocomplete lookup failed", error);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [locationInput]);

    useEffect(() => {
      creditsRef.current = credits;
    }, [credits]);

    const qrShortcutUrl = useMemo(
      () =>
        `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
          WATER_EJECT_SHORTCUT_URL,
        )}&format=svg`,
      [],
    );

  const toggleTip = (id: string) => {
    if (id === "leaks") {
      setHasLeakInteraction(true);
    }
    setOpenTips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
    if (isSelfCheckMode) {
      console.info("WS_FLOW", { action: "mobile_start", isMobile });
    }
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

  const handleWaterEjectToggle = () => {
    if (!isMobile) {
      return;
    }

    setIsWaterEjectCollapsed((prev) => !prev);
  };

  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);

  const { startCheckout } = useCreditsCheckout({
    onNotice: setCreditNotice,
    onPulse: triggerCreditPulse,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const redirectStatus = params.get("redirect_status");
    const pendingTopUp = window.localStorage.getItem(CREDIT_TOPUP_FLAG);

    if (sessionId && pendingTopUp && redirectStatus === "succeeded") {
      const finalizeTopUp = async () => {
        let updatedCredits = creditsRef.current + CREDIT_TOPUP_AMOUNT;
        try {
          const response = await fetch("/api/credits/topup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: CREDIT_TOPUP_AMOUNT }),
          });
          if (response.ok) {
            const payload = (await response.json()) as { credits?: number };
            if (typeof payload.credits === "number") {
              updatedCredits = payload.credits;
            }
          }
        } catch (error) {
          console.warn("Unable to sync top up credits", error);
        }

        creditsRef.current = updatedCredits;
        setGlobalCredits(updatedCredits);
        setCreditNotice(`Purchase confirmed. ${CREDIT_TOPUP_AMOUNT} credits added.`);
        setCreditCelebrationMessage(
          `Thanks for topping up—${CREDIT_TOPUP_AMOUNT} credits added. You now have ${updatedCredits}.`,
        );
        setShowCreditCelebration(true);
        triggerCreditPulse();
        logEvent("credit_purchase_completed", { credits_total: updatedCredits });
        window.localStorage.removeItem(CREDIT_TOPUP_FLAG);
        refreshSession().catch(() => undefined);

        params.delete("session_id");
        params.delete("redirect_status");
        const trimmedSearch = params.toString();
        const updatedUrl =
          window.location.pathname +
          (trimmedSearch ? `?${trimmedSearch}` : "") +
          window.location.hash;
        window.history.replaceState({}, document.title, updatedUrl);
      };

      void finalizeTopUp();
      return;
    }

    if (pendingTopUp && redirectStatus === "canceled") {
      setCreditNotice("Checkout canceled. No credits were charged.");
      triggerCreditPulse();
      window.localStorage.removeItem(CREDIT_TOPUP_FLAG);
    }

    if (pendingTopUp && redirectStatus && redirectStatus !== "succeeded") {
      setCreditNotice("Checkout did not complete. Please try again.");
      triggerCreditPulse();
      window.localStorage.removeItem(CREDIT_TOPUP_FLAG);
    }

    if (pendingTopUp && (sessionId || redirectStatus)) {
      params.delete("session_id");
      params.delete("redirect_status");
      const trimmedSearch = params.toString();
      const updatedUrl =
        window.location.pathname +
        (trimmedSearch ? `?${trimmedSearch}` : "") +
        window.location.hash;
      window.history.replaceState({}, document.title, updatedUrl);
    }
  }, [refreshSession, setGlobalCredits, triggerCreditPulse]);

  const handleCreditsClick = useCallback(async () => {
    await startCheckout();
  }, [startCheckout]);

  const handleCreditsLink = useCallback(() => {
    openModal();
  }, [openModal]);

  const spendCredit = (successPrefix?: string) => {
    const nextCredits = deduct(1);
    if (nextCredits === null) {
      setCreditNotice("No credits remain. Check back soon for a refresh.");
      triggerCreditPulse();
      return null;
    }

    creditsRef.current = nextCredits;

    setCreditNotice(
      successPrefix
        ? `${successPrefix} ${nextCredits} credits remain.`
        : `Water eject triggered. ${nextCredits} credits remain.`,
    );
    triggerCreditPulse();
    return nextCredits;
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
    if (isSelfCheckMode) {
      console.info("WS_FLOW", {
        action: "water_eject_click",
        credits,
        isIphone: deviceInfo.isIphone,
      });
    }

    const updatedCredits = spendCredit("Water eject triggered.");
    if (updatedCredits === null) {
      logEvent("water_eject", {
        action: "blocked_no_credit",
        credits_remaining: credits,
      });
      return;
    }

    triggerDeviceHaptics();

    logEvent("water_eject", {
      action: "click",
      credits_remaining: updatedCredits,
    });

    const targetUrl = deviceInfo.isIphone ? WATER_EJECT_RUN_URL : WATER_EJECT_SHORTCUT_URL;
    const openedWindow = window.open(targetUrl, "_blank");
    if (!openedWindow) {
      window.location.href = targetUrl;
    }
  };

  const handleVibrateAgain = () => {
    const updatedCredits = spendCredit("Haptic confirmation replayed.");
    if (updatedCredits === null) {
      logEvent("water_eject", {
        action: "vibrate_again_blocked",
        credits_remaining: credits,
      });
      return;
    }

    triggerDeviceHaptics();
    logEvent("water_eject", {
      action: "vibrate_again",
      credits_remaining: updatedCredits,
    });
  };

  const syncCredits = (nextCredits: number | undefined) => {
    if (typeof nextCredits !== "number") return;
    setGlobalCredits(nextCredits);
    creditsRef.current = nextCredits;
  };

  const parseErrorResponse = async (response: Response, fallback: string) => {
    try {
      const responseClone = response.clone();
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const payload = await responseClone.json();
        if (typeof payload?.credits === "number") {
          syncCredits(payload.credits);
        }
        const message =
          (typeof payload?.error === "string" && payload.error.trim()) ||
          (typeof payload?.message === "string" && payload.message.trim());
        if (message) {
          return message;
        }
      }

      const text = await response.text();
      if (text.trim()) {
        return text.trim();
      }
    } catch (parseError) {
      console.warn("Unable to parse error response", parseError);
    }

    return fallback;
  };

  const [pendingFileFocus, setPendingFileFocus] = React.useState(false);

  const triggerFilePicker = (fileInput: HTMLInputElement) => {
    fileInput.focus();
    if (typeof fileInput.showPicker === "function") {
      try {
        fileInput.showPicker();
        return;
      } catch (error) {
        console.warn("showPicker failed; falling back to click", error);
      }
    }
    fileInput.click();
  };

  const openUploadSection = (focusFile = false) => {
    if (isSelfCheckMode) {
      console.info("WS_FLOW", { action: "open_upload_section", focusFile });
    }

    setSectionOpenState((prev) => ({
      ...prev,
      upload: true,
    }));
    handleScrollTo("upload");
    setIsMobileFlowOpen(false);

    if (focusFile) {
      const fileInput = fileInputRef.current;
      if (fileInput) {
        triggerFilePicker(fileInput);
      } else {
        setPendingFileFocus(true);
      }
    }
  };

  useEffect(() => {
    if (!pendingFileFocus || !sectionOpenState.upload) {
      return;
    }

    const fileInput = fileInputRef.current;
    if (!fileInput) {
      return;
    }

    setPendingFileFocus(false);
    triggerFilePicker(fileInput);
  }, [pendingFileFocus, sectionOpenState.upload]);

  const handleOpenUploadStep = () => {
    openUploadSection();
  };

  const handleUploadCta = () => {
    openUploadSection(true);
  };

  const handleOpenLocationStep = () => {
    handleScrollTo("location-intel");
    setIsMobileFlowOpen(false);
  };

  const buildLocalResearchPlan = (query: string) => {
    const region = query || "your area";
    return [
      `Search for "${region} water utility customer portal" and bookmark the official site.`,
      "Look for drought updates, watering schedules, or outage maps in the news or alerts section.",
      `Scan for rebate or conservation pages—keywords like "rebate", "efficiency", or "WaterSense" flag incentives near ${region}.`,
      "Add one local non-profit or city sustainability office to your contacts so you can call for help when bills spike.",
      "Note the customer support number and hours, then set a reminder to request a rate review if your use drops but bills don't.",
    ];
  };

  const handleLocalResearch = () => {
    const trimmed = locationInput.trim();
    setLocalResearchPlan(buildLocalResearchPlan(trimmed));
    setLocationStatus(
      trimmed
        ? `Research checklist tailored for ${trimmed}.`
        : "Research checklist ready—add your city to personalize it.",
    );
  };

  const handleSlideTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
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
      openUploadSection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusUpload]);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileFlowOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setQrExpanded(true);
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

    let resizeAttached = false;
    const attachResize = () => {
      if (resizeAttached) return;
      resizeAttached = true;
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    };

    const handleLoad = () => attachResize();
    if (document.readyState === "complete") {
      attachResize();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

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
      window.removeEventListener("load", handleLoad);
      if (resizeAttached) {
        window.removeEventListener("resize", resizeCanvas);
      }
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
    const runOverflowCheck = (label: string) => {
      const doc = document.documentElement;
      const scrollWidth = doc.scrollWidth;
      const viewportWidth = doc.clientWidth + OVERFLOW_TOLERANCE;
      const withinBounds = scrollWidth <= viewportWidth;
      console.assert(withinBounds, `layout overflow (${label})`);
      if (!withinBounds) {
        doc.dataset.overflowDetected = "true";
        console.warn(`layout overflow (${label}):`, scrollWidth, viewportWidth);
      } else {
        delete doc.dataset.overflowDetected;
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

    const scheduleOverflowCheck = (label: string) => {
      const run = () => window.requestAnimationFrame(() => runOverflowCheck(label));
      if ("fonts" in document) {
        (document.fonts.ready as Promise<unknown>)
          .then(run)
          .catch(run);
      } else {
        run();
      }
    };

    const handleLoad = () => {
      scheduleOverflowCheck("initial");
      window.setTimeout(() => scheduleOverflowCheck("post-ads"), 4500);
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
    const reductionSavings = calculateReductionSavings(
      showerReduction,
      SHOWER_FLOW_RATE,
      COST_PER_GALLON_MIN,
      COST_PER_GALLON_MAX,
    );
    return `Reducing shower length by ${showerReduction} minutes saves ${formatCurrencyRange(
      reductionSavings.min,
      reductionSavings.max,
    )} annually (approx. ${reductionSavings.annualGallonsSaved.toFixed(0)} gallons).`;
  }, [showerReduction]);

  const applianceSavings = useMemo<ApplianceSavings>(() => {
    const showerGallons = calculateAnnualGallons(showerLength, SHOWER_FLOW_RATE, 365);
    const showerCosts = calculateCostRange(
      showerGallons,
      COST_PER_GALLON_MIN,
      COST_PER_GALLON_MAX,
    );

    const sinkGallons = calculateAnnualGallons(sinkUsage, SINK_FLOW_RATE, 365);
    const sinkCosts = calculateCostRange(
      sinkGallons,
      COST_PER_GALLON_MIN,
      COST_PER_GALLON_MAX,
    );

    const wateringGallons = calculateAnnualGallonsFromWeekly(
      wateringMinutes,
      WATERING_GALLONS_PER_MINUTE,
      52,
    );
    const wateringCosts = calculateCostRange(
      wateringGallons,
      COST_PER_GALLON_MIN,
      COST_PER_GALLON_MAX,
    );

    return {
      shower: {
        minutes: showerLength,
        gallons: showerGallons,
        minCost: showerCosts.min,
        maxCost: showerCosts.max,
      },
      sink: {
        minutes: sinkUsage,
        gallons: sinkGallons,
        minCost: sinkCosts.min,
        maxCost: sinkCosts.max,
      },
      watering: {
        minutes: wateringMinutes,
        gallons: wateringGallons,
        minCost: wateringCosts.min,
        maxCost: wateringCosts.max,
      },
    };
  }, [showerLength, sinkUsage, wateringMinutes]);

  const hasSliderInteraction =
    Math.abs(showerLength - 10) >= 2 ||
    Math.abs(sinkUsage - 10) >= 2 ||
    Math.abs(wateringMinutes - 7) >= 2;

  const hasMeaningfulInteraction =
    hasSliderInteraction ||
    hasLocationInteraction ||
    hasBillUpload ||
    hasLeakInteraction;

  const viralInputs = useMemo(
    () => ({
      showerMinutes: showerLength,
      sinkMinutes: sinkUsage,
      irrigationMinutes: wateringMinutes,
      hasBillUpload,
      hasLeakInteraction,
    }),
    [hasBillUpload, hasLeakInteraction, showerLength, sinkUsage, wateringMinutes],
  );

  const billShareContext = useMemo(() => {
    if (!analysisResult) return "";
    const topMove = analysisResult.topMoves[0]?.title;
    return topMove
      ? `Your top move is ${topMove}. Share it so friends can compare their next step.`
      : "Share your results so friends can compare their next step.";
  }, [analysisResult]);

  const buildCtaContextSummary = (topic: UpgradeModalTopic) => {
    const showerNote = `${applianceSavings.shower.minutes} min showers`;
    const sinkNote = `${applianceSavings.sink.minutes} min sink use`;
    const wateringNote = `${applianceSavings.watering.minutes} min watering`;

    switch (topic) {
      case "showerheads":
        return `${showerNote} with ${formatCurrencyRange(
          applianceSavings.shower.minCost,
          applianceSavings.shower.maxCost,
        )} in yearly water costs.`;
      case "aerators":
        return `${sinkNote} paired to ${formatCurrencyRange(
          applianceSavings.sink.minCost,
          applianceSavings.sink.maxCost,
        )} in annual water spend.`;
      case "detergents":
      default:
        return `${wateringNote} supported by ${formatCurrencyRange(
          applianceSavings.watering.minCost,
          applianceSavings.watering.maxCost,
        )} in yearly usage.`;
    }
  };

  const buildUpgradeKeywords = (topic: UpgradeModalTopic) =>
    UPGRADE_MODAL_CONTENT[topic].keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

  const searchPreference = ctaPreference ?? "online";

  const searchKeywords = useMemo(() => {
    if (!upgradeTopic) return [];
    return buildSearchKeywords({
      baseKeywords: buildUpgradeKeywords(upgradeTopic),
      moveTitles: analysisResult?.topMoves.map((move) => move.title) ?? [],
      location: locationInput.trim() || null,
      preference: searchPreference,
    });
  }, [upgradeTopic, analysisResult, locationInput, searchPreference]);

  const searchQuery = useMemo(() => {
    if (!upgradeTopic) return "";
    return buildSearchQuery({
      baseKeywords: buildUpgradeKeywords(upgradeTopic),
      moveTitles: analysisResult?.topMoves.map((move) => move.title) ?? [],
      location: locationInput.trim() || null,
      preference: searchPreference,
    });
  }, [upgradeTopic, analysisResult, locationInput, searchPreference]);

  const synthesizeRecommendation = (
    preference: PurchasePreference,
    topic: UpgradeModalTopic,
  ) => {
    const contextSummary = buildCtaContextSummary(topic);
    const shoppingPath =
      preference === "online"
        ? "online bundles and curbside pickup"
        : "local plumbing showrooms and in-stock hardware aisles";
    const productKeyword = {
      showerheads: "WaterSense showerhead with massage spray",
      aerators: "dual-thread faucet aerator kit",
      detergents: "high-efficiency detergent tabs",
    }[topic];

    return `Based on ${contextSummary} We recommend a ${productKeyword} optimized for ${shoppingPath}. Expect fast payback with lower hot-water use.`;
  };

  const fetchCtaRecommendation = async (
    preference: PurchasePreference,
    topic: UpgradeModalTopic,
  ) => {
    setCtaLoading(true);
    setCtaError(null);
    setCtaPreference(preference);
    setCtaRecommendation("");
    const payload = {
      preference,
      topic,
      showerLength,
      sinkUsage,
      wateringMinutes,
    };

    try {
      const response = await fetch("/api/cta-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`CTA API error: ${response.status}`);
      }

      const data = await response
        .json()
        .catch(() => ({ recommendation: "" as string }));

      if (typeof data?.recommendation === "string" && data.recommendation.trim()) {
        setCtaRecommendation(data.recommendation.trim());
      } else {
        setCtaRecommendation(synthesizeRecommendation(preference, topic));
      }
    } catch (error) {
      console.warn("CTA recommendation fallback", error);
      setCtaRecommendation(synthesizeRecommendation(preference, topic));
      setCtaError("Using on-device assistant while the call-to-action service warms up.");
    } finally {
      setCtaLoading(false);
    }
  };

  const openUpgradeModal = useCallback((topic: UpgradeModalTopic) => {
    upgradeModalTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setUpgradeTopic(topic);
    setIsUpgradeModalOpen(true);
    setCtaRecommendation("");
    setCtaPreference(null);
    setCtaError(null);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
    setUpgradeTopic(null);
    setCtaRecommendation("");
    setCtaPreference(null);
    setCtaError(null);
  }, []);

  useEffect(() => {
    if (!isUpgradeModalOpen) {
      return undefined;
    }
    const modal = upgradeModalRef.current;
    const focusTimer = requestAnimationFrame(() => {
      const focusable = getFocusableElements(modal);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeUpgradeModal();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusable = getFocusableElements(modal);
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !modal?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeUpgradeModal, getFocusableElements, isUpgradeModalOpen]);

  useEffect(() => {
    if (isUpgradeModalOpen) {
      wasUpgradeModalOpen.current = true;
      return;
    }
    if (wasUpgradeModalOpen.current) {
      wasUpgradeModalOpen.current = false;
      upgradeModalTriggerRef.current?.focus();
    }
  }, [isUpgradeModalOpen]);

  const handleLocationSearch = async () => {
    const trimmedLocation = locationInput.trim();
    if (!trimmedLocation) {
      setLocationError("Please enter a location.");
      return;
    }
    setLocationError(null);
    logEvent("location_search", {
      query_length: locationInput.trim().length,
      credits_remaining: credits,
    });
    setLocationHtml("");
    setUtilityResults([]);
    setLocationStatus("Searching...");
    setIsLocationLoading(true);
    try {
      const searchUrl = `/api/location?format=json&location=${encodeURIComponent(trimmedLocation)}`;
      const response = await fetch(searchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          location: trimmedLocation,
          locationInput: trimmedLocation,
        }),
      });
      setLocationCountdown(null);
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(
          response,
          "An unexpected error occurred.",
        );
        setLocationStatus(`Error: ${errorMessage}`);
        setLocationError(errorMessage);
        return;
      }
      const jsonResponse = (await response.json()) as {
        payload?: UtilityPayload | UtilityPayload[];
        html?: string;
        credits?: number;
      };
      syncCredits(jsonResponse.credits);
      const normalizedPayloads = Array.isArray(jsonResponse.payload)
        ? jsonResponse.payload
        : jsonResponse.payload
          ? [jsonResponse.payload]
          : [];
      if (normalizedPayloads.length === 0) {
        const notFoundMessage = `No utility found for ${trimmedLocation}.`;
        setLocationStatus(notFoundMessage);
        setLocationError(notFoundMessage);
        return;
      }
      setUtilityResults(normalizedPayloads);
      setLocationHtml(jsonResponse.html || "");
      setLocationStatus("Results ready — scroll down or jump to the cards.");
      setHasLocationInteraction(true);
      logEvent("location_results_ready");
    } catch (error) {
      console.error("Location lookup failed:", error);
      setLocationCountdown(null);
      setLocationStatus(
        "An error occurred while locating your water bill provider. Please try again.",
      );
      setLocationError(
        "An error occurred while locating your water bill provider. Please try again.",
      );
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleManualChange = (field: keyof typeof manualForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setManualError(null);
      setManualStatus(null);
      setManualForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setManualError(null);
    const usage = Number(manualForm.usage);
    const cost = Number(manualForm.cost);
    const household = Number(manualForm.household);
    if (!manualForm.usage || !Number.isFinite(usage) || usage <= 0) {
      setManualError("Enter a total usage amount above 0.");
      return;
    }
    if (!manualForm.cost || !Number.isFinite(cost) || cost <= 0) {
      setManualError("Enter a total cost above $0.");
      return;
    }
    if (manualForm.household && (!Number.isFinite(household) || household < 1)) {
      setManualError("Household size should be 1 or more.");
      return;
    }
    setManualStatus("Sending your details to the AI...");
    setAnalysisResult(null);
    setAnalysisHtml("");
    try {
      const response = await fetch("/api/analyze-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(manualForm),
      });
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(
          response,
          "We couldn’t analyze the manual entry yet.",
        );
        setManualStatus(null);
        setManualError(errorMessage);
        logEvent("analysis_error");
        return;
      }
      const result = (await response.json()) as {
        analysis?: AnalysisResult | null;
        html?: string;
        credits?: number;
      };
      syncCredits(result.credits);
      setManualStatus("Success!");
      if (result.analysis && isAnalysisResult(result.analysis)) {
        setAnalysisResult(result.analysis);
        window.localStorage.setItem("ws-latest-plan", JSON.stringify(result.analysis));
      } else if (result.html) {
        setAnalysisHtml(result.html);
      }
      logEvent("cta_click", { type: "manual_entry" });
      logEvent("plan_generated", { type: "manual" });
      topMovesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Manual entry failed:", error);
      setManualStatus(null);
      setManualError(copy.analyze.errors.aiFail);
      logEvent("analysis_error");
    }
  };

  const handleDemoRun = () => {
    setAnalysisResult(demoResult as AnalysisResult);
    setAnalysisHtml("");
    window.localStorage.setItem("ws-latest-plan", JSON.stringify(demoResult));
    logEvent("cta_click", { type: "demo" });
    logEvent("plan_generated", { type: "demo" });
    topMovesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isPdfFile = (file: File): boolean => {
    const normalizedType = (file.type || "").toLowerCase();
    const normalizedName = (file.name || "").toLowerCase();
    return normalizedType === "application/pdf" || normalizedName.endsWith(".pdf");
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      setUploadPreview(null);
      return;
    }
    setUploadError(null);
    if (!isPdfFile(file)) {
      setResponseMessage(copy.analyze.errors.wrongType);
      setSelectedFile(null);
      setUploadPreview(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResponseMessage(copy.analyze.errors.tooLarge);
      setSelectedFile(null);
      setUploadPreview(null);
      return;
    }
    setResponseMessage("");
    setSelectedFile(file);
    setUploadPreview(file.name);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0] || selectedFile;
    if (!file) {
      setResponseMessage(copy.analyze.errors.wrongType);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResponseMessage(copy.analyze.errors.tooLarge);
      return;
    }
    if (!isPdfFile(file)) {
      setResponseMessage(copy.analyze.errors.wrongType);
      return;
    }
    logEvent("cta_click", { type: "analyze" });
    logEvent("upload_start", {
      file_size: file.size,
      file_type: file.type,
      credits_remaining: creditsRef.current,
    });
    setIsUploading(true);
    setResponseMessage(copy.analyze.progressSteps[0]);
    setUploadError(null);
    setAnalysisHtml("");
    setAnalysisResult(null);
    setUploadStep(0);
    uploadStepTimers.current.forEach((timer) => window.clearTimeout(timer));
    uploadStepTimers.current = [
      window.setTimeout(() => setUploadStep(1), 1500),
      window.setTimeout(() => setUploadStep(2), 3500),
    ];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(
          response,
          copy.analyze.errors.parseFail,
        );
        setResponseMessage(errorMessage);
        setUploadError("parse");
        logEvent("analysis_error");
        return;
      }
      const result = (await response.json()) as {
        analysis?: AnalysisResult | null;
        html?: string;
        credits?: number;
      };
      syncCredits(result.credits);
      setResponseMessage("Success!");
      if (result.analysis && isAnalysisResult(result.analysis)) {
        setAnalysisResult(result.analysis);
        window.localStorage.setItem("ws-latest-plan", JSON.stringify(result.analysis));
      } else if (result.html) {
        setAnalysisHtml(result.html);
      } else if (result.analysis) {
        console.warn("Analysis response missing required fields.");
      }
      logEvent("upload_success", { file_size: file.size });
      logEvent("analysis_success");
      logEvent("plan_generated");
    } catch (error) {
      console.error("Upload failed:", error);
      setResponseMessage(copy.analyze.errors.aiFail);
      setUploadError("ai");
      logEvent("upload_error", { message: String(error) });
      logEvent("analysis_error");
    } finally {
      setIsUploading(false);
      uploadStepTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
      setUploadPreview(null);
    }
  };

  const isWaterEjectHidden = isWaterEjectCollapsed;
  const isHomeMode = !isWaterEjectMode;
  const shouldHideWaterEject = isHomeMode && (!deviceInfo.ready || !deviceInfo.isIphone);

  return (
    <div className="app">
      <SiteNav credits={credits} pulse={pulse} onCreditsClick={handleCreditsLink} />
      <canvas id="canvas" ref={canvasRef} aria-hidden />

      {showCreditCelebration && (
        <div
          className="credit-celebration"
          role="dialog"
          aria-modal="true"
          aria-label="Credits added"
        >
          <div className="credit-celebration__card">
            <div className="credit-confetti" aria-hidden>
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={`confetti-${index}`}
                  style={{ ["--i" as string]: index } as CSSProperties}
                />
              ))}
            </div>
            <p className="eyebrow">Bonus unlocked</p>
            <h3>{CREDIT_TOPUP_AMOUNT} extra credits added!</h3>
            <p className="credit-note">{creditCelebrationMessage}</p>
            <p className="subdued">
              Your credits refresh instantly after checkout so you can keep
              ejecting water and running AI tools without waiting.
            </p>
            <div className="celebration-actions">
              <button
                type="button"
                className="tertiary-button"
                onClick={handleCreditsClick}
              >
                Start another secure checkout
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowCreditCelebration(false)}
              >
                Keep exploring
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main-wrapper">
        {!shouldHideWaterEject && (
          <>
            <button
              type="button"
              className={`water-eject-header ${isWaterEjectHidden ? "collapsed" : ""}`}
              aria-expanded={!isWaterEjectHidden}
              aria-controls="water-eject-section"
              onClick={handleWaterEjectToggle}
            >
              <span className="water-eject-header__label">Other tool: Water eject (iPhone)</span>
              <span className="water-eject-header__icon" aria-hidden>
                {isWaterEjectHidden ? "+" : "–"}
              </span>
            </button>

            <section
              id="water-eject-section"
              className={`water-eject-banner ${isWaterEjectHidden ? "collapsed" : ""}`}
              aria-labelledby="water-eject"
              aria-hidden={isWaterEjectHidden}
            >
              {deviceInfo.isIphone ? (
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
                      <button
                        type="button"
                        className="secondary-button eject-button"
                        onClick={handleVibrateAgain}
                      >
                        Feel the vibration again
                        <span className="credit-chip">-1 credit</span>
                      </button>
                      <button
                        type="button"
                        className="tertiary-button eject-button"
                        onClick={handleCreditsClick}
                      >
                        Buy {CREDIT_TOPUP_AMOUNT} credits for ${CREDIT_TOPUP_PRICE}
                        <span className="credit-chip">+{CREDIT_TOPUP_AMOUNT} credits</span>
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
              ) : isWaterEjectMode ? (
                <div className="water-eject-fallback">
                  <p className="eyebrow">iPhone-only tool</p>
                  <h2 id="water-eject">Eject Water runs on iPhone</h2>
                  <p>
                    This shortcut uses iOS Shortcuts and the iPhone speaker. Open it on your
                    iPhone to clear water from the device safely.
                  </p>
                  <div className="banner-details">
                    <p><strong>Why:</strong> The tone and haptic confirmation are iOS-only.</p>
                    <p>Want to keep saving water here? Jump back to the savings mode.</p>
                  </div>
                  <div className="banner-actions">
                    <a className="primary-button" href="/analyze-water-bill">
                      Go to Home Water Savings
                    </a>
                    <a className="secondary-button" href={WATER_EJECT_SHORTCUT_URL} target="_blank" rel="noreferrer">
                      Open shortcut link
                    </a>
                  </div>
                </div>
              ) : (
                <div className={`qr-banner-wrapper ${qrExpanded ? "open" : "collapsed"}`}>
                  <button
                    type="button"
                    className="qr-toggle"
                    aria-expanded={qrExpanded}
                    onClick={() => setQrExpanded((prev) => !prev)}
                  >
                    <span className="eyebrow">Expand to Eject Water From Your Device</span>
                    <span aria-hidden className="toggle-icon">{qrExpanded ? "–" : "+"}</span>
                  </button>
                  {qrExpanded && (
                    <div className="banner-grid qr-banner">
                      <div className="banner-copy">
                        <p className="eyebrow">Instant tools for your iPhone</p>
                        <h2 id="water-eject">Instant iPhone Water Eject</h2>
                        <p>
                          Aim your camera at the QR code to open the water-eject shortcut on your phone and clear
                          your speakers instantly via Apple Shortcuts.
                        </p>
                        <div className="banner-details">
                          <p>One scan opens the Water Eject shortcut with the classic 165 Hz tone.</p>
                          <p>Feel a quick confirmation buzz—no random redirects or surprises.</p>
                        </div>
                        <p className="credit-note" aria-live="polite">
                          Viewing from a non-iPhone device—scan to eject water from your iPhone.
                        </p>
                      </div>
                      <div className="qr-card" aria-label="QR code to open the Water Eject shortcut on iPhone">
                        <svg className="qr-frame" viewBox="0 0 300 360" role="img" aria-hidden="true">
                          <rect x="0" y="0" width="300" height="360" rx="16" fill="var(--surface-strong)" />
                          <rect
                            x="12"
                            y="12"
                            width="276"
                            height="276"
                            rx="12"
                            fill="#ffffff"
                            stroke="rgba(79, 155, 255, 0.35)"
                            strokeWidth="2"
                          />
                          <image
                            xlinkHref={qrShortcutUrl}
                            x="24"
                            y="24"
                            width="252"
                            height="252"
                            preserveAspectRatio="xMidYMid meet"
                          />
                          <text x="150" y="320" textAnchor="middle" fill="#0b1b3a" fontWeight="700" fontSize="16">
                            Scan to eject water
                          </text>
                        </svg>
                        <p className="qr-hint">
                          Open your iPhone camera, point at the QR, and launch the shortcut. Need a backup?
                          <a href={WATER_EJECT_SHORTCUT_URL} target="_blank" rel="noreferrer">
                            &nbsp;Tap to view the shortcut link.
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        <section className="hero" id="top">
          <div className="hero-content">
            <p className="eyebrow">{copy.brand.tagline}</p>
            <h1>{copy.home.title}</h1>
            <h2>{copy.home.subtitle}</h2>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleMobileStart}
              >
                {copy.home.primaryCta}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={handleDemoRun}
              >
                {copy.home.secondaryCta}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  document.getElementById("manual-entry")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {copy.home.tertiaryCta}
              </button>
            </div>
            <TrustCapsule items={copy.home.trustRow} />
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

        <section className="utility-overlay" id="location-intel">
          <div className="utility-card-grid">
            <article className="utility-card">
              <p className="eyebrow">Step 1 · Explore savings tools</p>
              <h2>Find Your Utility &amp; Reveal Savings Pathways</h2>
              <p>
                Start with your city or district to unlock the right portal, then follow a
                guided checklist for rebates, outage alerts, and water-wise habits.
              </p>
              <label htmlFor="location-input" className="input-label">
                Your Location
              </label>
              <input
                type="text"
                id="location-input"
                list="location-suggestions"
                placeholder="Enter your U.S. city or utility district (e.g., Austin, TX)"
                aria-invalid={Boolean(locationError)}
                aria-describedby="location-help"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
              />
              <datalist id="location-suggestions">
                {locationSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <p id="location-help" className="input-help">
                We support U.S. cities and utility districts for now.
              </p>
              {locationError && (
                <p className="validation-error" role="alert">
                  {locationError}
                </p>
              )}
              <div className="utility-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleLocationSearch}
                  disabled={!locationInput.trim() || isLocationLoading}
                >
                  {isLocationLoading ? "Loading..." : "Look up my utility"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleLocalResearch}
                >
                  Build a local research plan
                </button>
              </div>
              <p className="location-status" aria-live="polite">
                {locationStatus}
                {locationStatus.toLowerCase().includes("results") &&
                  utilityResults.length > 0 && (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Jump to results
                    </button>
                  )}
              </p>
            </article>

            <article className="utility-card input-card">
              <div className="dual-slider compact">
                <div
                  className="slides-wrapper"
                  ref={slidesWrapperRef}
                  onTouchStart={handleSlideTouchStart}
                  onTouchEnd={handleSlideTouchEnd}
                >
                  <div className="slide">
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
                  </div>

                  <div className="slide">
                    <h3>The Full Cost of Water Waste</h3>
                    <p>
                      &bull; Sewage Cost: ~$84/year for typical shower &amp; sink usage.
                      <br />
                      &bull; Saving: Save ~$94/yr. by upgrading shower and faucets.
                      <br />
                      &bull; Example: WaterSense brand products save ~40% less usage.
                    </p>
                  </div>

                  <div className="slide">
                    <h3>Find Your Water Bill</h3>
                    <p>
                      Use the utility lookup above to grab contact info, outage
                      links, and rebates. Then jump into the upload area to let AI
                      review your bill.
                    </p>
                    <div className="location-inline-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => handleScrollTo("location-intel")}
                      >
                        Go to utility lookup
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleUploadCta}
                      >
                        Upload my bill
                      </button>
                    </div>
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
            </article>

            <article className="utility-card research-card">
              <h3>Local research assistant</h3>
              <p>
                We&apos;ll guide you through the next calls to make, the right search terms,
                and the local offices that can unlock rebates.
              </p>
              <button type="button" className="secondary-button" onClick={handleLocalResearch}>
                Show my local research checklist
              </button>
              {localResearchPlan.length > 0 && (
                <ul className="research-plan" aria-label="Local research checklist">
                  {localResearchPlan.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        </section>

        <section className="utility-results" ref={resultsRef} aria-live="polite">
          {utilityResults.length > 0 && (
            <div className="utility-results-grid">
              {utilityResults.map((utility, index) => (
                <UtilityResultCard
                  key={`${utility.departmentName}-${index}`}
                  utility={utility}
                  cta={
                    utility.billPaymentUrl ? (
                      <a
                        className="primary-button"
                        href={utility.billPaymentUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit billing portal
                      </a>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
          {locationHtml && (
            <div
              className="location-html"
              dangerouslySetInnerHTML={{ __html: locationHtml }}
            />
          )}
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
                      placeholder="Enter your U.S. city or utility district"
                      value={locationInput}
                      onChange={(event) => setLocationInput(event.target.value)}
                    />
                    <div className="location-inline-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={handleLocationSearch}
                        disabled={!locationInput.trim()}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleUploadCta}
                      >
                        Upload my bill
                      </button>
                    </div>
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
            <article className="feature-card game-card">
              <h3>Play the Savings Game</h3>
              <p>
                Try a quick scenario game to see how small changes shave dollars off
                your bill while protecting local water supplies.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleScrollTo("location-intel")}
              >
                Try the game
              </button>
            </article>
          </section>

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
                    <button
                      type="button"
                      className="tertiary-button"
                      onClick={() => openUpgradeModal("showerheads")}
                    >
                      Upgrade with WaterSense Showerheads
                    </button>
                  </p>
                </div>
              </div>

              <div className="slider-group">
                <h3>Upgrade Appliances and Fixtures</h3>
                <p>
                  Adjust the sliders below to estimate annual usage and cost across
                  the cost range. <em>(We multiply gallons used by our cost-per-gallon range.)</em>
                </p>
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
                    <button
                      type="button"
                      className="tertiary-button"
                      onClick={() => openUpgradeModal("aerators")}
                    >
                      Upgrade with Faucet Aerators
                    </button>
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
                    <button
                      type="button"
                      className="tertiary-button"
                      onClick={() => openUpgradeModal("detergents")}
                    >
                      Get Efficient Detergents
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="viral-iq-wrap">
            <ViralWaterIqCard inputs={viralInputs} isActive={hasMeaningfulInteraction} />
          </div>
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
              <div className="upload-panel">
                <h1>{copy.analyze.title}</h1>
                <h2>{copy.analyze.subtitle}</h2>
                <form id="upload-form" onSubmit={handleUpload} encType="multipart/form-data">
                  <label className="file-label" htmlFor="file">
                    {copy.analyze.uploadLabel}
                  </label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".pdf,application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    aria-label="Upload water bill PDF"
                  />
                  <p className="muted">{copy.analyze.uploadHelper}</p>
                  <p className="muted">{copy.analyze.uploadConstraints}</p>
                  {uploadPreview && (
                    <p className="file-preview" aria-live="polite">
                      Selected file: {uploadPreview}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="primary-button"
                  >
                    {isUploading ? copy.analyze.progressSteps[0] : copy.analyze.uploadActive}
                  </button>
                  {isUploading && <div className="inline-spinner" aria-live="assertive" aria-label="Uploading" />}
                  <Stepper steps={copy.analyze.progressSteps} activeIndex={uploadStep} />
                  <p className="muted">{copy.analyze.progressNote}</p>
                  <TrustCapsule items={copy.analyze.trustCapsule} />
                  <div className="upload-alt-actions">
                    <button type="button" className="secondary-button" onClick={handleDemoRun}>
                      {copy.analyze.uploadAltDemo}
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        document.getElementById("manual-entry")?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      {copy.analyze.uploadAltManual}
                    </button>
                  </div>
                  <p className="privacy-reassurance">
                    We value your privacy. Read our <a href="/privacy">privacy policy</a>.
                  </p>
                </form>
                <div id="response-message" aria-live="polite">
                  {responseMessage}
                </div>
                {uploadError === "parse" && (
                  <div className="upload-error-actions">
                    <p className="muted">
                      Try manual entry or email your utility name (optional) at{" "}
                      <a href="mailto:hello@watershortcut.com">hello@watershortcut.com</a>.
                    </p>
                    <div className="upload-alt-actions">
                      <button type="button" className="secondary-button" onClick={handleDemoRun}>
                        {copy.analyze.uploadAltDemo}
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          document.getElementById("manual-entry")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        {copy.analyze.uploadAltManual}
                      </button>
                      <a className="secondary-button" href="/guides">
                        Open guides
                      </a>
                    </div>
                  </div>
                )}
                <div className="manual-entry" id="manual-entry">
                  <h3>Manual entry</h3>
                  <p className="muted">Manual entry is less precise, but gets you a plan without uploads.</p>
                  <form onSubmit={handleManualSubmit}>
                    <div className="manual-grid">
                      <label>
                        Billing period (optional)
                        <input type="text" value={manualForm.period} onChange={handleManualChange("period")} />
                      </label>
                      <label>
                        Total usage
                        <input
                          type="number"
                          min={0}
                          step={0.1}
                          required
                          value={manualForm.usage}
                          onChange={handleManualChange("usage")}
                          placeholder="e.g., 8"
                        />
                      </label>
                      <label>
                        Unit
                        <select value={manualForm.unit} onChange={handleManualChange("unit")}>
                          <option>Gallons</option>
                          <option>CCF</option>
                          <option>HCF</option>
                        </select>
                      </label>
                      <label>
                        Total cost
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          required
                          value={manualForm.cost}
                          onChange={handleManualChange("cost")}
                          placeholder="e.g., 86"
                        />
                      </label>
                      <label>
                        Water rate (optional)
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={manualForm.rate}
                          onChange={handleManualChange("rate")}
                          placeholder="Use $6 per 1,000 gallons if unsure"
                        />
                      </label>
                      <label>
                        Household size (optional)
                        <input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          value={manualForm.household}
                          onChange={handleManualChange("household")}
                        />
                      </label>
                    </div>
                    <label>
                      Notes (optional)
                      <textarea value={manualForm.notes} onChange={handleManualChange("notes")} />
                    </label>
                    <button type="submit" className="secondary-button">
                      Build my plan
                    </button>
                    {manualStatus && <p className="muted">{manualStatus}</p>}
                    {manualError && (
                      <p className="validation-error" role="alert">
                        {manualError}
                      </p>
                    )}
                  </form>
                  <InlineHelpAccordion label="Not sure what to enter?">
                    <p>
                      <strong>How to find your rate:</strong> Look for “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons” on your
                      bill.
                    </p>
                    <p>
                      <strong>Placeholder rate:</strong> Use $6 per 1,000 gallons and adjust later.
                    </p>
                  </InlineHelpAccordion>
                </div>
                <div className="upload-how-it-works">
                  <h3>How It Works</h3>
                  <p>
                    Upload your recent water bill to our secure platform, and our
                    AI system generates a simple plan. Google Document AI extracts
                    the details, and OpenAI summarizes targeted conservation steps
                    tailored to your usage.
                  </p>
                </div>
                <div className="stripe-wrapper">
                  <button
                    type="button"
                    className="primary-button eject-button"
                    onClick={handleCreditsClick}
                  >
                    Buy {CREDIT_TOPUP_AMOUNT} credits for ${CREDIT_TOPUP_PRICE} via Stripe
                  </button>
                  <p className="credit-note" aria-live="polite">
                    Secure checkout with Stripe. Credits refresh automatically after
                    payment.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </CollapsibleSection>

        <section className="container results-section" id="top-moves" ref={topMovesRef}>
          <div className="section-intro">
            <p className="eyebrow">Step 2 · Results</p>
            <h2>{copy.analyze.results.topMoves}</h2>
            <p className="muted">
              {analysisResult
                ? "Your personalized moves and next steps are ready."
                : "Upload your bill to generate instant priorities and calculators."}
            </p>
          </div>
          {analysisHtml && !analysisResult && (
            <div
              className="analysis-html"
              dangerouslySetInnerHTML={{ __html: analysisHtml }}
            />
          )}
          {analysisResult && (
            <div className="analysis-results">
              <div className="results-grid">
                {analysisResult.topMoves.map((move) => (
                  <ResultsCard
                    key={move.title}
                    move={move}
                    calculatorHref={getCalculatorLinkForMove(move)}
                  />
                ))}
              </div>
              <div className="analysis-summary">
                <div>
                  <h3>{copy.analyze.results.payingFor}</h3>
                  <p>{analysisResult.payingFor}</p>
                </div>
                <div>
                  <h3>{copy.analyze.results.nextStep}</h3>
                  <p>{analysisResult.nextStep}</p>
                </div>
              </div>
              {analysisResult.confidenceNote && (
                <p className="muted">{analysisResult.confidenceNote}</p>
              )}
              <ShareExportBar result={analysisResult} />
              <div className="bill-share-prompt">
                <ViralWaterIqCard
                  inputs={{ ...viralInputs, hasBillUpload: true }}
                  isActive={Boolean(analysisResult)}
                  headline="Share your bill snapshot"
                  subhead="Invite friends to compare how their homes stack up."
                  contextNote={billShareContext}
                  shareCtaLabel="Share bill result"
                  viewLabel="Compare with friends"
                  footnote="Private by default. Your link is anonymous and only includes the score and insight."
                  analyticsContext="bill_results"
                />
              </div>
            </div>
          )}
          {!analysisResult && !analysisHtml && (
            <p className="muted">{copy.analyze.results.empty}</p>
          )}
        </section>

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
              <div className="community-callout">
                <h3>Community tips</h3>
                <p>
                  We no longer load third-party comment widgets to keep your
                  browsing private. Share your own discoveries with friends or
                  neighbors and help them save too.
                </p>
              </div>
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
          </div>
        </CollapsibleSection>

      </main>

      {isUpgradeModalOpen && upgradeTopic && (
        <div
          className="upgrade-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
        >
          <div
            ref={upgradeModalRef}
            className="upgrade-modal"
            aria-label="Upgrade appliances and fixtures modal"
          >
            <div className="upgrade-modal-header">
              <div>
                <p className="eyebrow">Personalized call to action</p>
                <h3 id="upgrade-modal-title">
                  {UPGRADE_MODAL_CONTENT[upgradeTopic].title}
                </h3>
                <p className="upgrade-modal-description">
                  {UPGRADE_MODAL_CONTENT[upgradeTopic].description}
                </p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close upgrade details"
                onClick={closeUpgradeModal}
              >
                ×
              </button>
            </div>

            <div className="cta-preference-row">
              <p className="cta-label">Pick your shopping preference to tailor the recommendation:</p>
              <div className="cta-buttons">
                <button
                  type="button"
                  className={`secondary-button ${ctaPreference === "online" ? "active" : ""}`}
                  disabled={ctaLoading}
                  onClick={() => fetchCtaRecommendation("online", upgradeTopic)}
                >
                  {ctaLoading && ctaPreference === "online" ? "Loading…" : "Shop online"}
                </button>
                <button
                  type="button"
                  className={`secondary-button ${ctaPreference === "in-person" ? "active" : ""}`}
                  disabled={ctaLoading}
                  onClick={() => fetchCtaRecommendation("in-person", upgradeTopic)}
                >
                  {ctaLoading && ctaPreference === "in-person" ? "Loading…" : "Shop in person"}
                </button>
              </div>
              {ctaError && <p className="cta-error" role="status">{ctaError}</p>}
              {ctaRecommendation && (
                <p className="cta-recommendation" role="status">{ctaRecommendation}</p>
              )}
            </div>

            <div className="upgrade-modal-grid">
              <div className="modal-card">
                <h4>Expanded calculator view</h4>
                <p className="modal-metric">
                  <strong>Time input:</strong>{" "}
                  {upgradeTopic === "showerheads" && `${applianceSavings.shower.minutes} minutes per shower`}
                  {upgradeTopic === "aerators" && `${applianceSavings.sink.minutes} minutes at the sink daily`}
                  {upgradeTopic === "detergents" && `${applianceSavings.watering.minutes} minutes watering weekly`}
                </p>
                <p className="modal-metric">
                  <strong>Annual gallons:</strong>{" "}
                  {upgradeTopic === "showerheads" && applianceSavings.shower.gallons.toFixed(0)}
                  {upgradeTopic === "aerators" && applianceSavings.sink.gallons.toFixed(0)}
                  {upgradeTopic === "detergents" && applianceSavings.watering.gallons.toFixed(0)}
                </p>
                <p className="modal-metric">
                  <strong>Estimated annual cost:</strong>{" "}
                  {upgradeTopic === "showerheads" &&
                    formatCurrencyRange(
                      applianceSavings.shower.minCost,
                      applianceSavings.shower.maxCost,
                    )}
                  {upgradeTopic === "aerators" &&
                    formatCurrencyRange(
                      applianceSavings.sink.minCost,
                      applianceSavings.sink.maxCost,
                    )}
                  {upgradeTopic === "detergents" &&
                    formatCurrencyRange(
                      applianceSavings.watering.minCost,
                      applianceSavings.watering.maxCost,
                    )}
                </p>
                <p className="modal-copy">
                  Run the sliders above, then return here to compare gallons, energy savings, and the payback window for your
                  preferred upgrade path.
                </p>
              </div>
              <div className="modal-card">
                <h4>Helpful keywords to search</h4>
                <div className="keyword-chips" aria-label="Search keywords">
                  {searchKeywords.map((keyword) => (
                    <span key={keyword} className="keyword-chip">
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="modal-copy">
                  Use these phrases to find trusted recommendations without sifting through generic ads.
                </p>
                <div className="search-buttons">
                  <a
                    className="secondary-button"
                    href={buildSearchUrl("duckduckgo", searchQuery)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    DuckDuckGo search
                  </a>
                  <a
                    className="secondary-button"
                    href={buildSearchUrl("google", searchQuery)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google search
                  </a>
                  <a
                    className="secondary-button"
                    href={buildSearchUrl("facebook", searchQuery)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook Marketplace
                  </a>
                  {searchPreference === "in-person" && (
                    <a
                      className="secondary-button"
                      href={buildSearchUrl("maps", searchQuery)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
      <ConsentBanner />
    </div>
  );
}

export default App;
