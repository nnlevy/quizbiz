import { StrictMode, useEffect, useMemo } from "react";
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
import { ensureAnalyticsLoaded, initializeAnalytics } from "./analytics";
import { CreditsProvider } from "./context/CreditsContext";
import { ensureAdSenseLoaded, initializeAllAdSlots, subscribeToRouteChanges } from "./adsense";
import { subscribeToConsentChanges } from "./consent";

if (typeof window !== "undefined") {
  const globalWindow = window as typeof window & {
    __WS_CONSENT_REQUIRED__?: boolean;
    __WS_ADSENSE_MANAGED__?: string;
  };
  if (globalWindow.__WS_CONSENT_REQUIRED__ == null) {
    globalWindow.__WS_CONSENT_REQUIRED__ = false;
  }
  if (!globalWindow.__WS_ADSENSE_MANAGED__) {
    globalWindow.__WS_ADSENSE_MANAGED__ = "react";
  }
}
const RootRouter = () => {
  const pathname = window.location.pathname;

  useEffect(() => {
    initializeAnalytics();
    ensureAdSenseLoaded();
    const unsubscribe = subscribeToRouteChanges(() => {
      ensureAdSenseLoaded();
      initializeAllAdSlots();
    });
    const unsubscribeConsent = subscribeToConsentChanges((consent) => {
      if (consent.ads) {
        ensureAdSenseLoaded();
        initializeAllAdSlots();
      }
      if (consent.analytics) {
        ensureAnalyticsLoaded();
      }
    });
    return () => {
      unsubscribe();
      unsubscribeConsent();
    };
  }, []);

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
    return <App focusUpload={pathname === "/upload"} />;
  }, [pathname]);

  return (
    <StrictMode>
      <CreditsProvider>{routeComponent}</CreditsProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<RootRouter />);

export default RootRouter;
