import { GA_MEASUREMENT_ID } from "../config/analytics";
import { getEffectiveConsent, getStoredConsent, isConsentRequired } from "./consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

const GTAG_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const GTAG_SCRIPT_SELECTOR = 'script[src*="www.googletagmanager.com/gtag/js"]';

export function ensureAnalyticsLoaded() {
  if (typeof window === "undefined") {
    return;
  }
  if (!getEffectiveConsent().analytics) {
    return;
  }
  if (!document.querySelector(GTAG_SCRIPT_SELECTOR)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = GTAG_SCRIPT_SRC;
    document.head.appendChild(script);
  }
}

export function initializeAnalytics() {
  if (typeof window === "undefined") {
    return;
  }
  // Ensure GA4 is initialized once for the app lifecycle
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function gtag(...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.dataLayer.push(args);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.gtag = window.gtag || gtag;

  const consentRequired = isConsentRequired();
  const stored = getStoredConsent();
  window.gtag("consent", "default", {
    ad_storage: consentRequired ? "denied" : "granted",
    analytics_storage: consentRequired ? "denied" : "granted",
    ad_user_data: consentRequired ? "denied" : "granted",
    ad_personalization: consentRequired ? "denied" : "granted",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  if (stored) {
    window.gtag("consent", "update", {
      ad_storage: stored.ads ? "granted" : "denied",
      analytics_storage: stored.analytics ? "granted" : "denied",
      ad_user_data: stored.ads ? "granted" : "denied",
      ad_personalization: stored.ads ? "granted" : "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  }

  ensureAnalyticsLoaded();

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true, send_page_view: false });
}

export function logEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") {
    return;
  }
  if (!getEffectiveConsent().analytics) {
    return;
  }
  const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtagFn === "function") {
    gtagFn("event", eventName, params);
  }
}
