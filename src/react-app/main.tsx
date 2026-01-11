import { StrictMode, Suspense, lazy, useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
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
import { RouterProvider, useLocation } from "./routes/router";

const Home = lazy(() => import("./routes/Home"));
const Analyze = lazy(() => import("./routes/Analyze"));
const ManualEntry = lazy(() => import("./routes/ManualEntry"));
const Research = lazy(() => import("./routes/Research"));
const About = lazy(() => import("./routes/About"));
const EjectWater = lazy(() => import("./routes/EjectWater"));
const Credits = lazy(() => import("./routes/Credits"));

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

const RouterView = () => {
  const location = useLocation();

  const routeComponent = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === "/") {
      return (
        <AppShell>
          <Home />
        </AppShell>
      );
    }
    if (pathname.startsWith("/analyze")) {
      return (
        <AppShell>
          <Analyze />
        </AppShell>
      );
    }
    if (pathname.startsWith("/manual-entry")) {
      return (
        <AppShell>
          <ManualEntry />
        </AppShell>
      );
    }
    if (pathname.startsWith("/research")) {
      return (
        <AppShell>
          <Research />
        </AppShell>
      );
    }
    if (pathname.startsWith("/about")) {
      return (
        <AppShell>
          <About />
        </AppShell>
      );
    }
    if (pathname.startsWith("/credits")) {
      return (
        <AppShell>
          <Credits />
        </AppShell>
      );
    }
    if (pathname.startsWith("/eject-water")) {
      return (
        <AppShell>
          <EjectWater />
        </AppShell>
      );
    }
    if (pathname.startsWith("/game") || pathname.startsWith("/leak-patrol")) {
      return <LeakPatrol />;
    }
    if (pathname.startsWith("/legacy")) {
      return <LegacyApp />;
    }
    if (pathname.startsWith("/upload")) {
      return <LegacyApp focusUpload />;
    }
    if (pathname.startsWith("/landing")) {
      return <LandingPage />;
    }
    if (pathname.startsWith("/site-map")) {
      return <SiteMapPage />;
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
    if (pathname.startsWith("/water-iq")) {
      return (
        <AppShell>
          <WaterIqPage />
        </AppShell>
      );
    }
    return (
      <AppShell>
        <Home />
      </AppShell>
    );
  }, [location.pathname]);

  return <Suspense fallback={<div className="ws-progress">Loading…</div>}>{routeComponent}</Suspense>;
};

const RootRouter = () => (
  <StrictMode>
    <CreditsProvider>
      <RouterProvider>
        <SeoHiddenNav />
        <RouteEffects />
        <RouterView />
      </RouterProvider>
    </CreditsProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<RootRouter />);

export default RootRouter;
