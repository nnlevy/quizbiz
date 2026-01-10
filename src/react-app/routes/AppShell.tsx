import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import AdSenseSlot from "../components/AdSenseSlot";
import { DEFAULT_ADSENSE_SLOTS } from "../../config/adsense";
import { useCredits } from "../context/CreditsContext";
import { useScrollUnlock } from "../hooks/useScrollUnlock";

import "./AppShell.css";

const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { credits } = useCredits();
  const { scrollUnlocked } = useScrollUnlock();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const hideDeferredElements = location.pathname === "/";
  const showDeferred = scrollUnlocked && !hideDeferredElements;

  return (
    <div className="ws-shell">
      <header className="ws-header">
        <Link className="ws-logo" to="/">
          WaterShortcut
        </Link>
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
              <Link to="/analyze">Analyze my bill</Link>
            </li>
            <li>
              <Link to="/research">Research</Link>
            </li>
            <li>
              <span className="ws-nav-section">Experiences</span>
              <ul className="ws-subnav">
                <li>
                  <Link to="/game">Leak Patrol</Link>
                </li>
                <li>
                  <a href="/analyze#more-tools">More tools</a>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>

      <main className="ws-main">
        <Outlet />
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
