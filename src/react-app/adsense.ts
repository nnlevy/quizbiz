import { ADSENSE_CLIENT as DEFAULT_ADSENSE_CLIENT } from "../config/adsense";
import { hasAdsConsent } from "./consent";
import { hasAnyAdsEnabled } from "./ads/adPolicy";

const ADSENSE_CLIENT =
  (typeof window !== "undefined" &&
    (window as typeof window & { __WS_ADSENSE_CLIENT__?: string }).__WS_ADSENSE_CLIENT__) ||
  DEFAULT_ADSENSE_CLIENT;
const ADSENSE_SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
const ADSENSE_SCRIPT_SELECTOR =
  'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';
const ROUTE_CHANGE_EVENT = "adsense:route-change";

let historyPatched = false;
let scriptLoadPromise: Promise<void> | null = null;
let autoAdsQueued = false;
let dimensionPatchApplied = false;
let marginAdsObserver: MutationObserver | null = null;
let marginAdsRaf = 0;
let marginAdsRouteListenerAttached = false;

const MARGIN_AD_CLASS = "ws-margin-ad";
const MARGIN_AD_VISIBLE_CLASS = "ws-margin-ad--visible";
const MARGIN_AD_HIDDEN_CLASS = "ws-margin-ad--hidden";
const MARGIN_AD_VISIBILITY_MS = 10_000;

type MarginAdState = {
  shownAt: number;
  baselineScrollY: number;
};

const marginAdStates = new WeakMap<HTMLElement, MarginAdState>();
const MARGIN_AD_HOME_PATH = "/";

const isHomePage = () => window.location.pathname === MARGIN_AD_HOME_PATH;

const isMarginAdOverlappingContent = (slot: HTMLElement) => {
  const main = document.querySelector<HTMLElement>(".ws-main");
  if (!main) return false;
  const slotRect = slot.getBoundingClientRect();
  const mainRect = main.getBoundingClientRect();
  const horizontalOverlap = slotRect.right > mainRect.left && slotRect.left < mainRect.right;
  const verticalOverlap = slotRect.bottom > mainRect.top && slotRect.top < mainRect.bottom;
  return horizontalOverlap && verticalOverlap;
};

const normalizeCalcDimension = (value: string): string | null => {
  const match = value.match(/calc\(([-\d.]+)px\s*-\s*([-\d.]+)px\)/i);
  if (!match) return null;
  const base = parseFloat(match[1]);
  const subtract = parseFloat(match[2]);
  if (!Number.isFinite(base) || !Number.isFinite(subtract)) return null;
  const adjusted = Math.max(base - subtract, 0);
  return `${adjusted}px`;
};

const patchDimensionProperty = (proto: object, prop: "width" | "height") => {
  const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
  if (!descriptor?.set || !descriptor?.get || descriptor.configurable === false) return;
  Object.defineProperty(proto, prop, {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value: string | number) {
      if (typeof value === "string" && value.includes("calc")) {
        const normalized = normalizeCalcDimension(value);
        descriptor.set?.call(this, normalized ?? "");
        return;
      }
      descriptor.set?.call(this, value);
    },
  });
};

const patchAdDimensionSetters = () => {
  if (dimensionPatchApplied) return;
  const patchSetAttribute = (proto: Element) => {
    const nativeSetAttribute = proto.setAttribute;
    proto.setAttribute = function patchedSetAttribute(name: string, value: string) {
      if ((name === "width" || name === "height") && typeof value === "string" && value.includes("calc")) {
        const normalized = normalizeCalcDimension(value);
        return nativeSetAttribute.call(this, name, normalized ?? "");
      }
      return nativeSetAttribute.call(this, name, value);
    };
  };

  const patchSetAttributeNS = (proto: Element) => {
    const nativeSetAttributeNS = proto.setAttributeNS;
    proto.setAttributeNS = function patchedSetAttributeNS(
      namespace: string | null,
      name: string,
      value: string,
    ) {
      if ((name === "width" || name === "height") && typeof value === "string" && value.includes("calc")) {
        const normalized = normalizeCalcDimension(value);
        return nativeSetAttributeNS.call(this, namespace, name, normalized ?? "");
      }
      return nativeSetAttributeNS.call(this, namespace, name, value);
    };
  };

  patchSetAttribute(Element.prototype);
  patchSetAttributeNS(Element.prototype);
  patchSetAttribute(SVGElement.prototype);
  patchSetAttribute(HTMLElement.prototype);

  patchDimensionProperty(HTMLIFrameElement.prototype, "width");
  patchDimensionProperty(HTMLIFrameElement.prototype, "height");
  patchDimensionProperty(HTMLImageElement.prototype, "width");
  patchDimensionProperty(HTMLImageElement.prototype, "height");
  patchDimensionProperty(HTMLObjectElement.prototype, "width");
  patchDimensionProperty(HTMLObjectElement.prototype, "height");
  patchDimensionProperty(HTMLVideoElement.prototype, "width");
  patchDimensionProperty(HTMLVideoElement.prototype, "height");
  dimensionPatchApplied = true;
};

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
    if (!isSlotEligible(slot)) return true;
    return false;
  });

  return {
    totalSlots: slots.length,
    initializedSlots: initialized.length,
    hasScript: Boolean(findAdSenseScript()),
  };
};

const isSlotEligible = (slot: HTMLElement) => {
  if (slot.dataset.adsInitialized === "true") return false;
  const status = slot.getAttribute("data-adsbygoogle-status");
  if (status === "done" || status === "filled") return false;
  if (slot.innerHTML.trim() !== "" || slot.childElementCount > 0) return false;
  return true;
};

const hasEligibleSlots = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".adsbygoogle[data-ad-slot]")).some((slot) =>
    isSlotEligible(slot),
  );

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
  document.head.appendChild(script);
  debugLog("Injected AdSense script", { src: script.src });
  return script;
};

const ensureAutoAds = () => {
  if (autoAdsQueued) return;
  if (isHomePage()) {
    debugLog("Skipped auto ads init: homepage");
    return;
  }
  if (!hasEligibleSlots()) {
    debugLog("Skipped auto ads init: no eligible slots found");
    return;
  }
  const adsQueue =
    (window as typeof window & { adsbygoogle?: Array<Record<string, unknown>> }).adsbygoogle || [];
  (window as typeof window & { adsbygoogle: Array<Record<string, unknown>> }).adsbygoogle = adsQueue;
  adsQueue.push({});
  autoAdsQueued = true;
  debugLog("Queued auto ads init");
};

const initializeSlot = (slot: HTMLElement) => {
  if (!isSlotEligible(slot)) {
    slot.dataset.adsInitialized = "true";
    return;
  }

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

const isMarginAdCandidate = (slot: HTMLElement) => {
  if (!slot.classList.contains("adsbygoogle")) return false;
  const style = window.getComputedStyle(slot);
  if (style.position !== "fixed") return false;
  if (style.display === "none" || style.visibility === "hidden") return false;
  return style.left !== "auto" || style.right !== "auto";
};

const ensureMarginAdBase = (slot: HTMLElement) => {
  slot.classList.add(MARGIN_AD_CLASS);
  if (!slot.classList.contains(MARGIN_AD_VISIBLE_CLASS)) {
    slot.classList.add(MARGIN_AD_HIDDEN_CLASS);
  }
};

const showMarginAd = (slot: HTMLElement) => {
  ensureMarginAdBase(slot);
  slot.classList.add(MARGIN_AD_VISIBLE_CLASS);
  slot.classList.remove(MARGIN_AD_HIDDEN_CLASS);
  marginAdStates.set(slot, { shownAt: Date.now(), baselineScrollY: window.scrollY });
};

const hideMarginAd = (slot: HTMLElement) => {
  ensureMarginAdBase(slot);
  slot.classList.add(MARGIN_AD_HIDDEN_CLASS);
  slot.classList.remove(MARGIN_AD_VISIBLE_CLASS);
};

const updateMarginAds = () => {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>("ins.adsbygoogle"));
  candidates.forEach((slot) => {
    if (!isMarginAdCandidate(slot)) return;
    ensureMarginAdBase(slot);
    if (isHomePage() || isMarginAdOverlappingContent(slot)) {
      hideMarginAd(slot);
      marginAdStates.delete(slot);
      return;
    }
    const state = marginAdStates.get(slot);
    if (!state || !slot.classList.contains(MARGIN_AD_VISIBLE_CLASS)) {
      showMarginAd(slot);
      return;
    }
    const elapsed = Date.now() - state.shownAt;
    const scrolled = Math.abs(window.scrollY - state.baselineScrollY);
    if (elapsed >= MARGIN_AD_VISIBILITY_MS || scrolled >= window.innerHeight) {
      hideMarginAd(slot);
    }
  });
};

const scheduleMarginAdsUpdate = () => {
  if (marginAdsRaf) return;
  marginAdsRaf = window.requestAnimationFrame(() => {
    marginAdsRaf = 0;
    updateMarginAds();
  });
};

const observeMarginAds = () => {
  if (marginAdsObserver) return;
  marginAdsObserver = new MutationObserver(() => scheduleMarginAdsUpdate());
  marginAdsObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", scheduleMarginAdsUpdate, { passive: true });
  window.addEventListener("resize", scheduleMarginAdsUpdate);
  if (!marginAdsRouteListenerAttached) {
    subscribeToRouteChanges(scheduleMarginAdsUpdate);
    marginAdsRouteListenerAttached = true;
  }
  scheduleMarginAdsUpdate();
};

export const initializeAllAdSlots = () => {
  if (!hasAdsConsent()) return;
  if (!hasEligibleSlots()) {
    logAdStatus("AdSense slot status (skipped: no eligible slots)");
    return;
  }
  document
    .querySelectorAll<HTMLElement>(".adsbygoogle[data-ad-slot]")
    .forEach((slot) => initializeSlot(slot));
  logAdStatus("AdSense slot status");
};

export const ensureAdSenseLoaded = () => {
  if (!hasAdsConsent()) {
    debugLog("AdSense blocked until consent is granted");
    return;
  }
  if (!hasAnyAdsEnabled(window.location.pathname)) {
    debugLog("AdSense blocked by page-level ad policy");
    return;
  }
  patchAdDimensionSetters();
  observeMarginAds();
  (window as typeof window & { __WS_ADSENSE_MANAGED__?: string }).__WS_ADSENSE_MANAGED__ = "react";
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
  if (!hasAdsConsent()) return;
  ensureAdSenseLoaded();
  initializeSlot(slot);
};
