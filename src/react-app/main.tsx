import { StrictMode, Suspense, lazy, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LeakPatrol from "./LeakPatrol";
import HiddenLeaksPage from "../pages/HiddenLeaksPage";
import LeakDetectionPage from "../pages/LeakDetectionPage";
import LandingPage from "../pages/LandingPage";
import PrivacyPage from "../pages/PrivacyPage";
import ReadWaterBillPage from "../pages/ReadWaterBillPage";
import SiteMapPage from "../pages/SiteMapPage";
import TermsPage from "../pages/TermsPage";
import WaterBillSpikesPage from "../pages/WaterBillSpikesPage";
import WaterSavingTipsPage from "../pages/WaterSavingTipsPage";
import WaterIqPage from "../pages/WaterIqPage";
import { ensureAnalyticsLoaded, initializeAnalytics, logPageView } from "./analytics";
import { CreditsProvider } from "./context/CreditsContext";
import { ensureAdSenseLoaded, initializeAllAdSlots } from "./adsense";
import { getEffectiveConsent, subscribeToConsentChanges } from "./consent";
import { useScrollUnlock } from "./hooks/useScrollUnlock";
import AppShell from "./routes/AppShell";

const Home = lazy(() => import("./routes/Home"));
const Analyze = lazy(() => import("./routes/Analyze"));
const Research = lazy(() => import("./routes/Research"));
const About = lazy(() => import("./routes/About"));
const EjectWater = lazy(() => import("./routes/EjectWater"));

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

const SeoHiddenNav = () => (
  <nav className="sr-only" aria-hidden="true">
    <a href="/">Home</a>
    <a href="/analyze">Analyze my bill</a>
    <a href="/research">Research</a>
    <a href="/game">Leak Patrol</a>
    <a href="/eject-water">Eject Water</a>
    <a href="/about">About</a>
    {/* Legacy SPA link kept for SEO discovery without exposing in primary navigation. */}
    <a href="/legacy">Legacy WaterShortcut</a>
  </nav>
);

const LegacyApp = ({ focusUpload = false }: { focusUpload?: boolean }) => {
  // Legacy SPA mounted as-is for /legacy to preserve existing functionality.
  return <App focusUpload={focusUpload} />;
};

const RouteEffects = () => {
  const location = useLocation();
  const { scrollUnlocked } = useScrollUnlock();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const consent = getEffectiveConsent();
    if (consent.analytics) {
      ensureAnalyticsLoaded();
      if (lastTrackedPath.current !== location.pathname) {
        logPageView();
        lastTrackedPath.current = location.pathname;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!scrollUnlocked) return;
    const consent = getEffectiveConsent();
    if (consent.ads) {
      ensureAdSenseLoaded();
      initializeAllAdSlots();
    }
  }, [location.pathname, scrollUnlocked]);

  useEffect(() => {
    const unsubscribeConsent = subscribeToConsentChanges((consent) => {
      if (consent.analytics) {
        ensureAnalyticsLoaded();
        if (lastTrackedPath.current !== location.pathname) {
          logPageView();
          lastTrackedPath.current = location.pathname;
        }
      }
      if (consent.ads && scrollUnlocked) {
        ensureAdSenseLoaded();
        initializeAllAdSlots();
      }
    });
    return () => {
      unsubscribeConsent();
    };
  }, [location.pathname, scrollUnlocked]);

  return null;
};

const RootRouter = () => (
  <StrictMode>
    <CreditsProvider>
      <BrowserRouter>
        <SeoHiddenNav />
        <RouteEffects />
        <Suspense fallback={<div className="ws-progress">Loading…</div>}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="analyze" element={<Analyze />} />
              <Route path="research" element={<Research />} />
              <Route path="about" element={<About />} />
              <Route path="eject-water" element={<EjectWater />} />
            </Route>
            <Route path="game" element={<LeakPatrol />} />
            <Route path="leak-patrol" element={<LeakPatrol />} />
            <Route path="legacy/*" element={<LegacyApp />} />
            <Route path="upload" element={<LegacyApp focusUpload />} />
            <Route path="landing" element={<LandingPage />} />
            <Route path="site-map" element={<SiteMapPage />} />
            <Route path="learn/read-water-bill" element={<ReadWaterBillPage />} />
            <Route path="learn/leak-detection" element={<LeakDetectionPage />} />
            <Route path="learn/water-saving-tips" element={<WaterSavingTipsPage />} />
            <Route path="learn/water-bill-spikes" element={<WaterBillSpikesPage />} />
            <Route path="learn/hidden-leaks" element={<HiddenLeaksPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="water-iq" element={<WaterIqPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CreditsProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<RootRouter />);

export default RootRouter;
