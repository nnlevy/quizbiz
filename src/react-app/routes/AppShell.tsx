import { ReactNode, useEffect, useState } from "react";

import AdSenseSlot from "../components/AdSenseSlot";
import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { useCredits } from "../context/CreditsContext";
import { useScrollUnlock } from "../hooks/useScrollUnlock";
import { RouterLink, useLocation } from "./router";

import "./AppShell.css";

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { credits } = useCredits();
  const { scrollUnlocked } = useScrollUnlock();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const showDeferred = scrollUnlocked;

  return (
    <div className="ws-shell">
      <header className="ws-header">
        <RouterLink className="ws-logo" to="/">
          WaterShortcut
        </RouterLink>
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
              <RouterLink to="/analyze">Analyze my bill</RouterLink>
            </li>
            <li>
              <RouterLink to="/research">Research</RouterLink>
            </li>
            <li>
              <span className="ws-nav-section">Experiences</span>
              <ul className="ws-subnav">
                <li>
                  <RouterLink to="/game">Leak Patrol</RouterLink>
                </li>
                <li>
                  <a href="/analyze#more-tools">More tools</a>
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

      {showDeferred && (
        <div className="ws-credits-indicator" role="status" aria-live="polite">
          Credits {credits}
        </div>
      )}

      {showDeferred && (
        <section className="ws-ads" aria-label="Sponsored">
          <AdSenseSlot slotId={DEFAULT_ADSENSE_SLOTS.footer} format="auto" />
        </section>
      )}
    </div>
  );
};

export default AppShell;
