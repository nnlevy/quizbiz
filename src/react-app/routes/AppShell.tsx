import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import AdSenseSlot from "../components/AdSenseSlot";
import BottomNav from "../components/BottomNav";
import ConsentBanner from "../components/ConsentBanner";
import SiteFooter from "../components/SiteFooter";
import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { isAdTypeEnabled } from "../ads/adPolicy";
import { useCredits } from "../context/CreditsContext";
import { useCreditsModal } from "../context/CreditsModalContext";
import { getPageExperience } from "../experience/pageExperience";
import { useScrollUnlock } from "../hooks/useScrollUnlock";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { RouterLink, useLocation } from "./router";
import { ADS_FREE_FLAG } from "../utils/credits";
import DropletCheckIcon from "../components/DropletCheckIcon";

import "./AppShell.css";

type AppShellProps = {
  children: ReactNode;
};

const primaryNavItems = [
  { to: "/", label: "Home" },
  { to: "/analyze-water-bill", label: "Analyze Bill" },
  { to: "/water-iq", label: "Water Savings Score" },
  { to: "/tools", label: "Tools" },
];

const AppShell = ({ children }: AppShellProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const logoTextRef = useRef<HTMLSpanElement | null>(null);
  const location = useLocation();
  const { credits, pulse } = useCredits();
  const { openModal } = useCreditsModal();
  const { scrollUnlocked } = useScrollUnlock();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const pageExperience = useMemo(
    () => getPageExperience(location.pathname),
    [location.pathname],
  );
  const adsEnabled = useMemo(
    () => Object.values(pageExperience.ads).some(Boolean),
    [pageExperience.ads],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isHome = location.pathname === "/";
    document.body.classList.toggle("ws-home", isHome);
    document.body.dataset.adsDisabled = adsEnabled ? "false" : "true";
    document.body.dataset.page = pageExperience.id;
    document.body.dataset.flow = pageExperience.flow;
    if (pageExperience.bodyClass) {
      document.body.classList.add(pageExperience.bodyClass);
    }
    return () => {
      document.body.classList.remove("ws-home");
      if (pageExperience.bodyClass) {
        document.body.classList.remove(pageExperience.bodyClass);
      }
      delete document.body.dataset.adsDisabled;
      delete document.body.dataset.page;
      delete document.body.dataset.flow;
    };
  }, [location.pathname, adsEnabled, pageExperience]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const readAdsSetting = () => {
      try {
        setAdsRemoved(window.localStorage.getItem(ADS_FREE_FLAG) === "true");
      } catch {
        setAdsRemoved(false);
      }
    };
    readAdsSetting();
    const handleAdsUpdate = () => readAdsSetting();
    window.addEventListener("ws-ads-updated", handleAdsUpdate);
    window.addEventListener("storage", handleAdsUpdate);
    return () => {
      window.removeEventListener("ws-ads-updated", handleAdsUpdate);
      window.removeEventListener("storage", handleAdsUpdate);
    };
  }, []);


  useEffect(() => {
    const logo = logoTextRef.current;
    if (!logo) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = logo.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      logo.style.setProperty("--ws-logo-x", `${Math.max(0, Math.min(1, x))}`);
      logo.style.setProperty("--ws-logo-y", `${Math.max(0, Math.min(1, y))}`);
    };

    const handlePointerLeave = () => {
      logo.style.removeProperty("--ws-logo-x");
      logo.style.removeProperty("--ws-logo-y");
    };

    logo.addEventListener("pointermove", handlePointerMove);
    logo.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      logo.removeEventListener("pointermove", handlePointerMove);
      logo.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const showDeferred = scrollUnlocked;
  const isHome = location.pathname === "/";
  const pageAllowsAds = isAdTypeEnabled(location.pathname, "footer");
  const showAds = showDeferred && !adsRemoved && pageAllowsAds;

  useFocusTrap({
    active: menuOpen,
    containerRef: drawerRef,
    onClose: () => setMenuOpen(false),
  });

  return (
    <div className={`ws-shell${isHome ? " ws-shell--home" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="ws-header">
        <div className="ws-header__brand">
          <RouterLink className="ws-logo" to="/">
            <DropletCheckIcon className="ws-logo__icon" aria-hidden="true" />
            <span className="ws-logo__text" ref={logoTextRef}>WaterShortcut.com</span>
          </RouterLink>
          {showDeferred && (
            <button
              className={`ws-header__credits ${pulse ? "is-animating" : ""}`}
              type="button"
              role="status"
              aria-live="polite"
              aria-label={`Credits available: ${credits}. View credits options.`}
              aria-haspopup="dialog"
              onClick={() => openModal()}
            >
              Credits {credits}
            </button>
          )}
        </div>
        <nav className="ws-header-nav" aria-label="Primary">
          <ul>
            {primaryNavItems.map((item) => (
              <li key={item.to}>
                <RouterLink to={item.to} reloadDocument={item.reloadDocument}>{item.label}</RouterLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="ws-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="ws-navigation-drawer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <DropletCheckIcon className="ws-menu-button__icon" />
          <span className="sr-only">Toggle navigation</span>
        </button>
      </header>

      <div
        className={`ws-drawer${menuOpen ? " is-open" : ""}`}
        id="ws-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        ref={drawerRef}
        tabIndex={-1}
      >
        <nav className="ws-drawer-nav" aria-label="Primary">
          <button
            className="ws-close-button"
            type="button"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <ul>
            {primaryNavItems.map((item) => (
              <li key={item.to}>
                <RouterLink to={item.to} reloadDocument={item.reloadDocument}>{item.label}</RouterLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="ws-main" id="main-content" tabIndex={-1}>
        {children}
      </main>

      <BottomNav items={primaryNavItems} currentPath={location.pathname} />

      {showAds && (
        <section className="ws-ads" aria-label="Sponsored">
          <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="auto" adType="footer" />
        </section>
      )}

      <SiteFooter hideAds={adsRemoved || showAds || !pageAllowsAds} />
      <ConsentBanner />
    </div>
  );
};

export default AppShell;
