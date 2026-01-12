import { ReactNode, useEffect, useState } from "react";

import AdSenseSlot from "../components/AdSenseSlot";
import SiteFooter from "../components/SiteFooter";
import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { useCredits } from "../context/CreditsContext";
import { useCreditsModal } from "../context/CreditsModalContext";
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
  const showAds = showDeferred && !adsRemoved;

  return (
    <div className="ws-shell">
      <header className="ws-header">
        <div className="ws-header__brand">
          <RouterLink className="ws-logo" to="/">
            <img
              className="ws-logo__image"
              src="https://res.cloudinary.com/dlxzgqi9g/image/upload/f_png,q_auto,w_80/f9eb544bed7ab31e0ebda502440cd813.png"
              srcSet="https://res.cloudinary.com/dlxzgqi9g/image/upload/f_png,q_auto,w_80/f9eb544bed7ab31e0ebda502440cd813.png 1x, https://res.cloudinary.com/dlxzgqi9g/image/upload/f_png,q_auto,w_160/f9eb544bed7ab31e0ebda502440cd813.png 2x"
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
              <RouterLink to="/analyze">Analyze Bill</RouterLink>
            </li>
            <li>
              <RouterLink to="/manual-entry">Manual Entry</RouterLink>
            </li>
            <li>
              <RouterLink to="/dashboard">Dashboard</RouterLink>
            </li>
            <li>
              <RouterLink to="/research">Research Plan</RouterLink>
            </li>
            <li>
              <span className="ws-nav-section">Experiences</span>
              <ul className="ws-subnav">
                <li>
                  <RouterLink to="/game">Leak Patrol Game</RouterLink>
                </li>
                <li>
                  <RouterLink to="/water-iq">Water IQ Challenge</RouterLink>
                </li>
                <li>
                  <RouterLink to="/learn/read-water-bill">Read Your Bill</RouterLink>
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
          <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="auto" />
        </section>
      )}

      <SiteFooter hideAds={adsRemoved || showAds} />
    </div>
  );
};

export default AppShell;
