import { StrictMode, Suspense, lazy, useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
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
import { SessionProvider } from "./context/SessionContext";
import { CreditsModalProvider } from "./context/CreditsModalContext";
import { ensureAdSenseLoaded, initializeAllAdSlots } from "./adsense";
import { getEffectiveConsent, subscribeToConsentChanges } from "./consent";
import { useScrollUnlock } from "./hooks/useScrollUnlock";
import { captureReferralFromUrl } from "./utils/referral";
import { decorateReferralLinks, startReferralLinkObserver } from "./utils/referralLinks";
import AppShell from "./routes/AppShell";
import { RouterProvider, useLocation } from "./routes/router";

const Home = lazy(() => import("./routes/Home"));
const Analyze = lazy(() => import("./routes/Analyze"));
const ManualEntry = lazy(() => import("./routes/ManualEntry"));
const BillLookup = lazy(() => import("./routes/BillLookup"));
const Research = lazy(() => import("./routes/Research"));
const About = lazy(() => import("./routes/About"));
const EjectWater = lazy(() => import("./routes/EjectWater"));
const Credits = lazy(() => import("./routes/Credits"));
const AnalysisResults = lazy(() => import("./routes/AnalysisResults"));
const SignIn = lazy(() => import("./routes/SignIn"));
const SignUp = lazy(() => import("./routes/SignUp"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Calculators = lazy(() => import("./routes/Calculators"));
const LeakCheckHub = lazy(() => import("./routes/LeakCheckHub"));
const ToolsHub = lazy(() => import("./routes/ToolsHub"));

if (typeof window !== "undefined") {
  const globalWindow = window as typeof window & {
    __WS_CONSENT_REQUIRED__?: boolean;
    __WS_ADSENSE_MANAGED__?: string;
    __WS_OAUTH_ENABLED__?: boolean;
    __WS_GOOGLE_CLIENT_ID__?: string;
  };
  if (globalWindow.__WS_CONSENT_REQUIRED__ == null) {
    globalWindow.__WS_CONSENT_REQUIRED__ = false;
  }
  if (!globalWindow.__WS_ADSENSE_MANAGED__) {
    globalWindow.__WS_ADSENSE_MANAGED__ = "react";
  }
  if (globalWindow.__WS_OAUTH_ENABLED__ == null) {
    globalWindow.__WS_OAUTH_ENABLED__ = false;
  }
  if (globalWindow.__WS_GOOGLE_CLIENT_ID__ == null) {
    globalWindow.__WS_GOOGLE_CLIENT_ID__ = "";
  }
}

const SeoHiddenNav = () => (
  <nav className="sr-only" aria-hidden="true">
    <a href="/">Home</a>
    <a href="/analyze-water-bill">Analyze my bill</a>
    <a href="/manual-entry">Manual entry</a>
    <a href="/find-water-provider">Look up my water bill</a>
    <a href="/research">Research</a>
    <a href="/tools">Tools Hub</a>
    <a href="/tools/device-water-eject">Device water eject utility</a>
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
    const captured = captureReferralFromUrl();
    if (captured) {
      decorateReferralLinks();
    }
  }, [location.pathname, location.search]);

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

  useEffect(() => {
    return startReferralLinkObserver();
  }, []);

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
    if (pathname.startsWith("/analysis-results")) {
      return (
        <AppShell>
          <AnalysisResults />
        </AppShell>
      );
    }
    if (pathname.startsWith("/analyze-water-bill") || pathname.startsWith("/analyze")) {
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
    if (pathname.startsWith("/leak-check")) {
      return (
        <AppShell>
          <LeakCheckHub />
        </AppShell>
      );
    }
    if (pathname.startsWith("/find-water-provider") || pathname.startsWith("/bill-lookup")) {
      return (
        <AppShell>
          <BillLookup />
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
    if (pathname.startsWith("/dashboard")) {
      return (
        <AppShell>
          <Dashboard />
        </AppShell>
      );
    }
    if (pathname.startsWith("/sign-in")) {
      return (
        <AppShell>
          <SignIn />
        </AppShell>
      );
    }
    if (pathname.startsWith("/sign-up")) {
      return (
        <AppShell>
          <SignUp />
        </AppShell>
      );
    }
    if (pathname.startsWith("/tools/device-water-eject") || pathname.startsWith("/eject-water")) {
      return (
        <AppShell>
          <EjectWater />
        </AppShell>
      );
    }
    if (pathname.startsWith("/tools")) {
      return (
        <AppShell>
          <ToolsHub />
        </AppShell>
      );
    }
    if (pathname.startsWith("/calculators")) {
      return (
        <AppShell>
          <Calculators />
        </AppShell>
      );
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
    if (pathname.startsWith("/sitemap") || pathname.startsWith("/site-map")) {
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
      return (
        <AppShell>
          <PrivacyPage />
        </AppShell>
      );
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
      <SessionProvider>
        <CreditsModalProvider>
          <RouterProvider>
            <SeoHiddenNav />
            <RouteEffects />
            <RouterView />
          </RouterProvider>
        </CreditsModalProvider>
      </SessionProvider>
    </CreditsProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<RootRouter />);

export default RootRouter;
