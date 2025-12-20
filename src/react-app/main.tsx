import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LeakPatrol from "./LeakPatrol";
import HiddenLeaksPage from "../pages/HiddenLeaksPage";
import LeakDetectionPage from "../pages/LeakDetectionPage";
import PrivacyPage from "../pages/PrivacyPage";
import ReadWaterBillPage from "../pages/ReadWaterBillPage";
import TermsPage from "../pages/TermsPage";
import WaterBillSpikesPage from "../pages/WaterBillSpikesPage";
import WaterSavingTipsPage from "../pages/WaterSavingTipsPage";
import { initializeAnalytics } from "./analytics";

const ADSENSE_SCRIPT_ID = "adsense-loader";
const CONSENT_KEY = "ws-ad-consent";

function isLikelyEU(): boolean {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timezone.startsWith("Europe/")) {
      return true;
    }
    const language = navigator.language || navigator.languages?.[0] || "";
    return ["be", "bg", "cz", "da", "de", "ee", "es", "fi", "fr", "el", "hr", "hu", "ga", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"].some(
      (code) => language.toLowerCase().includes(code),
    );
  } catch (error) {
    console.warn("EU detection failed", error);
    return false;
  }
}

function loadAdSenseScript() {
  const existing = document.querySelector("script[data-adsense-active='true']") as HTMLScriptElement | null;
  if (existing) {
    return;
  }
  const template = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.adsenseActive = "true";
  script.src = template?.src || "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1860356577073395";
  document.head.appendChild(script);
  if (!(window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.adsbygoogle = [];
  }
}

const RootRouter = () => {
  const pathname = window.location.pathname;
  const [euVisitor, setEuVisitor] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(() => {
    return localStorage.getItem(CONSENT_KEY) === "true";
  });
  const [initialized, setInitialized] = useState(false);
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    initializeAnalytics();
  }, []);

    useEffect(() => {
      const eu = isLikelyEU();
      setEuVisitor(eu);
      if (!eu && !consentGiven) {
        setConsentGiven(true);
      }
      setInitialized(true);
    }, [consentGiven]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (consentGiven) {
      localStorage.setItem(CONSENT_KEY, "true");
      loadAdSenseScript();
      setAdsReady(true);
    } else {
      setAdsReady(false);
    }
  }, [consentGiven, initialized]);

  const routeComponent = useMemo(() => {
    if (pathname.startsWith("/leak-patrol") || pathname.startsWith("/game")) {
      return <LeakPatrol />;
    }
    if (pathname.startsWith("/learn/read-water-bill")) {
      return <ReadWaterBillPage />;
    }
    if (pathname.startsWith("/learn/leak-detection")) {
      return <LeakDetectionPage />;
    }
    if (pathname.startsWith("/learn/water-saving-tips")) {
      return <WaterSavingTipsPage />;
    }
    if (pathname.startsWith("/learn/water-bill-spikes")) {
      return <WaterBillSpikesPage />;
    }
    if (pathname.startsWith("/learn/hidden-leaks")) {
      return <HiddenLeaksPage />;
    }
    if (pathname.startsWith("/privacy")) {
      return <PrivacyPage />;
    }
    if (pathname.startsWith("/terms")) {
      return <TermsPage />;
    }
    return <App adsEnabled={adsReady} focusUpload={pathname === "/upload"} />;
  }, [adsReady, pathname]);

  const shouldShowBanner = euVisitor && !consentGiven;

  return (
    <StrictMode>
      {shouldShowBanner && (
        <div className="cookie-banner" role="alertdialog" aria-live="polite">
          <p>
            We use cookies for analytics and to load Google AdSense ads. Please accept to enable personalized ads in line with GDPR/CCPA.
          </p>
          <div className="cookie-actions">
            <button type="button" className="primary-button" onClick={() => setConsentGiven(true)}>
              Accept
            </button>
            <button type="button" className="secondary-button" onClick={() => setConsentGiven(false)}>
              Decline
            </button>
          </div>
        </div>
      )}
      {routeComponent}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<RootRouter />);

export default RootRouter;
