declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

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
}

export function logEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") {
    return;
  }
  const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtagFn === "function") {
    gtagFn("event", eventName, params);
  }
}
