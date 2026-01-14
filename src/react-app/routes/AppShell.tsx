import { ReactNode, useEffect, useMemo, useState } from "react";

import AdSenseSlot from "../components/AdSenseSlot";
import SiteFooter from "../components/SiteFooter";
import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { isAdTypeEnabled } from "../ads/adPolicy";
import { useCredits } from "../context/CreditsContext";
import { useCreditsModal } from "../context/CreditsModalContext";
import { getPageExperience } from "../experience/pageExperience";
import { useScrollUnlock } from "../hooks/useScrollUnlock";
import { RouterLink, useLocation } from "./router";
import { ADS_FREE_FLAG } from "../utils/credits";

import "./AppShell.css";

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
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

  const showDeferred = scrollUnlocked;
  const isHome = location.pathname === "/";
  const pageAllowsAds = isAdTypeEnabled(location.pathname, "footer");
  const showAds = showDeferred && !adsRemoved && pageAllowsAds;

  return (
    <div className={`ws-shell${isHome ? " ws-shell--home" : ""}`}>
      <header className="ws-header">
        <div className="ws-header__brand">
          <RouterLink className="ws-logo" to="/">
            <img
              className="ws-logo__image"
              src="https://res.cloudinary.com/dlxzgqi9g/image/upload/w_80/v1735510676/watershortcut-favicon.png"
              srcSet="https://res.cloudinary.com/dlxzgqi9g/image/upload/w_80/v1735510676/watershortcut-favicon.png 1x, https://res.cloudinary.com/dlxzgqi9g/image/upload/w_160/v1735510676/watershortcut-favicon.png 2x"
              sizes="40px"
              alt="WaterShortcut logo"
              loading="eager"
              decoding="async"
            />
            <span className="ws-logo__text">WaterShortcut</span>
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
        <button
          className="ws-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="ws-navigation-drawer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span>
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
      >
        <nav className="ws-drawer-nav">
          <button
            className="ws-close-button"
            type="button"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <ul>
            <li>
              <RouterLink to="/analyze-water-bill">Analyze Bill</RouterLink>
            </li>
            <li>
              <RouterLink to="/manual-entry">Manual Entry</RouterLink>
            </li>
            <li>
              <RouterLink to="/find-water-provider">Find Provider</RouterLink>
            </li>
            <li>
              <RouterLink to="/dashboard">Dashboard</RouterLink>
            </li>
            <li>
              <RouterLink to="/research">Research Plan</RouterLink>
            </li>
            <li>
              <span className="ws-nav-section">Tools</span>
              <ul className="ws-subnav">
                <li>
                  <RouterLink to="/calculators" reloadDocument>
                    Calculators
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/savings-plan" reloadDocument>
                    Savings Plan
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/leak-check" reloadDocument>
                    Leak Check
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/rebates" reloadDocument>
                    Rebates
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/guides" reloadDocument>
                    Guides
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/water-iq">Water IQ Challenge</RouterLink>
                </li>
              </ul>
            </li>
            <li>
              <span className="ws-nav-section">Learn</span>
              <ul className="ws-subnav">
                <li>
                  <RouterLink to="/guides/water-bill" reloadDocument>
                    Read Your Bill
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/guides/find-fix-leaks" reloadDocument>
                    Leak Detection
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/guides" reloadDocument>
                    Water-Saving Tips
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li>
              <RouterLink to="/about">About</RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <main className="ws-main">
        {children}
      </main>

      {showAds && (
        <section className="ws-ads" aria-label="Sponsored">
          <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="auto" adType="footer" />
        </section>
      )}

      <SiteFooter hideAds={adsRemoved || showAds || !pageAllowsAds} />
    </div>
  );
};

export default AppShell;
