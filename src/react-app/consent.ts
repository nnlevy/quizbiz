export type ConsentState = {
  functional: boolean;
  analytics: boolean;
  ads: boolean;
};

const CONSENT_STORAGE_KEY = "ws-consent-v1";

export const hasGlobalPrivacySignal = () => {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const dnt =
    nav.doNotTrack === "1" ||
    nav.doNotTrack === "yes" ||
    nav.msDoNotTrack === "1" ||
    (window as typeof window & { doNotTrack?: string }).doNotTrack === "1";
  return Boolean(nav.globalPrivacyControl) || dnt;
};

const defaultConsent = (consentRequired: boolean): ConsentState => {
  if (hasGlobalPrivacySignal()) {
    return { functional: true, analytics: false, ads: false };
  }
  return consentRequired
    ? { functional: true, analytics: false, ads: false }
    : { functional: true, analytics: true, ads: true };
};

export const isConsentRequired = () => {
  if (typeof window === "undefined") return true;
  return Boolean((window as typeof window & { __WS_CONSENT_REQUIRED__?: boolean }).__WS_CONSENT_REQUIRED__);
};

export const getStoredConsent = (): ConsentState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch (err) {
    return null;
  }
};

export const getEffectiveConsent = (): ConsentState => {
  const required = isConsentRequired();
  return getStoredConsent() ?? defaultConsent(required);
};

const clearConsentCookies = () => {
  if (typeof document === "undefined") return;
  const cookieNames = ["_ga", "_gid", "_gat", "_gcl_au", "_gads"];
  document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(Boolean)
    .forEach((name) => {
      if (
        cookieNames.includes(name) ||
        name?.startsWith("_ga_") ||
        name?.startsWith("_gcl")
      ) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    });
};

export const applyConsentMode = (consent: ConsentState) => {
  if (typeof window === "undefined") return;
  const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtagFn !== "function") return;
  gtagFn("consent", "update", {
    ad_storage: consent.ads ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: consent.ads ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
};

export const saveConsent = (consent: ConsentState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  document.cookie = `ws_consent=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=31536000; Path=/; SameSite=Lax`;
  applyConsentMode(consent);
  if (!consent.analytics || !consent.ads) {
    clearConsentCookies();
  }
  window.dispatchEvent(new CustomEvent("ws-consent-updated", { detail: consent }));
};

export const hasAdsConsent = () => getEffectiveConsent().ads;

export const subscribeToConsentChanges = (listener: (consent: ConsentState) => void) => {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ConsentState>).detail;
    if (detail) listener(detail);
  };
  window.addEventListener("ws-consent-updated", handler);
  return () => window.removeEventListener("ws-consent-updated", handler);
};
