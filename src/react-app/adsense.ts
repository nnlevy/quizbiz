const ADSENSE_CLIENT = "ca-pub-1860356577073395";
const ADSENSE_SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
const ADSENSE_SCRIPT_SELECTOR =
  'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';
const ROUTE_CHANGE_EVENT = "adsense:route-change";

let historyPatched = false;
let scriptLoadPromise: Promise<void> | null = null;
let autoAdsQueued = false;

const isDebugEnabled = () => import.meta.env.VITE_ADSENSE_DEBUG === "true";

const debugLog = (message: string, details?: Record<string, unknown>) => {
  if (!isDebugEnabled()) return;
  if (details) {
    console.info("[adsense]", message, details);
  } else {
    console.info("[adsense]", message);
  }
};

const findAdSenseScript = () =>
  document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);

const waitForScriptLoad = (script: HTMLScriptElement) => {
  if (script.dataset.adsenseLoaded === "true") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const handleLoad = () => {
      script.dataset.adsenseLoaded = "true";
      debugLog("AdSense script loaded", { src: script.src });
      resolve();
    };

    const readyState = (script as HTMLScriptElement & { readyState?: string }).readyState;
    if (readyState === "complete" || readyState === "loaded") {
      handleLoad();
      return;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener(
      "error",
      () => {
        debugLog("AdSense script failed to load", { src: script.src });
        resolve();
      },
      { once: true },
    );
  });
};

const collectAdStatus = () => {
  const slots = Array.from(document.querySelectorAll<HTMLElement>(".adsbygoogle"));
  const initialized = slots.filter((slot) => {
    if (slot.dataset.adsInitialized === "true") return true;
    const status = slot.getAttribute("data-adsbygoogle-status");
    return status === "done" || status === "filled";
  });

  return {
    totalSlots: slots.length,
    initializedSlots: initialized.length,
    hasScript: Boolean(findAdSenseScript()),
  };
};

const logAdStatus = (label: string) => {
  if (!isDebugEnabled()) return;
  debugLog(label, collectAdStatus());
};

const ensureScriptPresent = () => {
  const existing = findAdSenseScript();
  if (existing) {
    debugLog("AdSense script already present", { src: existing.src });
    return existing;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = ADSENSE_SCRIPT_SRC;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-cfasync", "false");
  document.head.appendChild(script);
  debugLog("Injected AdSense script", { src: script.src });
  return script;
};

const ensureAutoAds = () => {
  if (autoAdsQueued) return;
  const adsQueue =
    (window as typeof window & { adsbygoogle?: Array<Record<string, unknown>> }).adsbygoogle || [];
  (window as typeof window & { adsbygoogle: Array<Record<string, unknown>> }).adsbygoogle = adsQueue;
  adsQueue.push({});
  autoAdsQueued = true;
  debugLog("Queued auto ads init");
};

const initializeSlot = (slot: HTMLElement) => {
  if (slot.dataset.adsInitialized === "true") return;
  const status = slot.getAttribute("data-adsbygoogle-status");
  if (status === "done" || status === "filled") return;

  const adsQueue =
    (window as typeof window & { adsbygoogle?: Array<Record<string, unknown>> }).adsbygoogle || [];
  (window as typeof window & { adsbygoogle: Array<Record<string, unknown>> }).adsbygoogle = adsQueue;

  try {
    adsQueue.push({});
    slot.dataset.adsInitialized = "true";
    debugLog("Initialized AdSense slot", {
      slotId: slot.dataset.adSlot,
    });
  } catch (error) {
    debugLog("AdSense slot initialization failed", {
      slotId: slot.dataset.adSlot,
      error,
    });
  }
};

export const initializeAllAdSlots = () => {
  document
    .querySelectorAll<HTMLElement>(".adsbygoogle[data-ad-slot]")
    .forEach((slot) => initializeSlot(slot));
  logAdStatus("AdSense slot status");
};

export const ensureAdSenseLoaded = () => {
  if (!scriptLoadPromise) {
    const script = ensureScriptPresent();
    scriptLoadPromise = waitForScriptLoad(script);
  }

  scriptLoadPromise.then(() => {
    ensureAutoAds();
    initializeAllAdSlots();
    logAdStatus("AdSense ready");
  });
};

const patchHistory = () => {
  if (historyPatched) return;
  historyPatched = true;

  const originalPushState = history.pushState;
  history.pushState = function pushState(...args) {
    const result = originalPushState.apply(this, args as Parameters<History["pushState"]>);
    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function replaceState(...args) {
    const result = originalReplaceState.apply(this, args as Parameters<History["replaceState"]>);
    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
    return result;
  };
};

export const subscribeToRouteChanges = (listener: () => void) => {
  patchHistory();
  window.addEventListener("popstate", listener);
  window.addEventListener(ROUTE_CHANGE_EVENT, listener as EventListener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(ROUTE_CHANGE_EVENT, listener as EventListener);
  };
};

export const requestAdForSlot = (slot: HTMLElement) => {
  ensureAdSenseLoaded();
  initializeSlot(slot);
};
