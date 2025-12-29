import {
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  type KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

import { copy } from "../../copy";

const primaryLinks = [
  { href: "/analyze-water-bill", label: "Analyze" },
  { href: "/savings-plan", label: "Plan" },
  { href: "/calculators", label: "Calculators" },
];

const secondaryLinks = [
  { href: "/leak-check", label: "Leak check" },
  { href: "/rebates", label: "Rebates" },
  { href: "/guides", label: "Guides" },
];

const waterEjectLinks = [
  { href: "/blog-how-to-eject.html", label: "Water Eject How-To" },
  { href: "/blog-is-it-safe.html", label: "Is it safe?" },
];

const NAV_SWIPE_THRESHOLD = 42;

type SiteNavProps = {
  credits?: number;
  pulse?: boolean;
  onCreditsClick?: () => void;
  onCreditsKeyDown?: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
};

const SiteNav = ({
  credits = 5,
  pulse = false,
  onCreditsClick,
  onCreditsKeyDown,
}: SiteNavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDraggingNav, setIsDraggingNav] = useState(false);
  const [navDragStartY, setNavDragStartY] = useState<number | null>(null);
  const [navDragOffset, setNavDragOffset] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModeBar, setShowModeBar] = useState(true);
  const navTouchStart = useRef<{ x: number; y: number } | null>(null);
  const dropdownToggleRef = useRef<HTMLButtonElement | null>(null);

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsNavVisible(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("nav-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isWaterEjectRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/blog-how-to-eject") ||
      window.location.pathname.startsWith("/blog-is-it-safe") ||
      window.location.pathname.startsWith("/water-eject"));
  const isGameRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/game") ||
      window.location.pathname.startsWith("/leak-patrol"));
  const navLinks = isWaterEjectRoute
    ? [{ href: "/blog-how-to-eject.html", label: copy.nav.ejectLabel }]
    : [];
  const dropdownLinks = isWaterEjectRoute
    ? [
        ...waterEjectLinks.filter((link) => link.href !== "/blog-how-to-eject.html"),
        { href: "/analyze-water-bill", label: copy.nav.homeLabel },
      ]
    : [...primaryLinks, ...secondaryLinks];
  const mobileLinks = isWaterEjectRoute
    ? [...waterEjectLinks, { href: "/analyze-water-bill", label: copy.nav.homeLabel }]
    : [...primaryLinks, ...secondaryLinks, { href: "/blog-how-to-eject.html", label: copy.nav.ejectLabel }];

  const handleHeaderTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    if (!isMobileViewport() || isMobileMenuOpen) {
      return;
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".mobile-nav")
    ) {
      navTouchStart.current = null;
      return;
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".mobile-nav")
    ) {
      navTouchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    navTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleHeaderTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    if (!isMobileViewport() || isMobileMenuOpen) {
      navTouchStart.current = null;
      return;
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".mobile-nav")
    ) {
      navTouchStart.current = null;
      return;
    }

    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".mobile-nav")
    ) {
      navTouchStart.current = null;
      return;
    }
    const start = navTouchStart.current;
    navTouchStart.current = null;
    if (!start) {
      return;
    }
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dy) <= Math.abs(dx) || Math.abs(dy) < NAV_SWIPE_THRESHOLD) {
      return;
    }
    if (dy > NAV_SWIPE_THRESHOLD && !isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
    }
    if (dy < -NAV_SWIPE_THRESHOLD && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isMobileMenuOpen) {
      return;
    }

    if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select")) {
      return;
    }
    setIsDraggingNav(true);
    setNavDragStartY(event.clientY);
    setNavDragOffset(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleNavPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingNav || navDragStartY === null) {
      return;
    }
    const deltaY = event.clientY - navDragStartY;
    if (deltaY > 0) {
      setNavDragOffset(deltaY);
    }
  };

  const handleNavPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingNav) {
      return;
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (navDragOffset > NAV_SWIPE_THRESHOLD) {
      setIsMobileMenuOpen(false);
    }
    setIsDraggingNav(false);
    setNavDragStartY(null);
    setNavDragOffset(0);
  };

  const handleNavPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingNav) {
      return;
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setIsDraggingNav(false);
    setNavDragStartY(null);
    setNavDragOffset(0);
  };

  const navDragStyle = isMobileMenuOpen
    ? {
        transform: isDraggingNav ? `translateY(${Math.max(navDragOffset, 0)}px)` : undefined,
      }
    : undefined;

  const mobileNavStyle = {
    ...navDragStyle,
    transform:
      isMobileMenuOpen && navDragStyle?.transform !== undefined
        ? navDragStyle.transform
        : isMobileMenuOpen
          ? "translateY(0)"
          : "translateY(105%)",
    visibility: (isMobileMenuOpen ? "visible" : "hidden") as CSSProperties["visibility"],
    pointerEvents: (isMobileMenuOpen ? "auto" : "none") as CSSProperties["pointerEvents"],
    transition: isDraggingNav
      ? "none"
      : isMobileMenuOpen
        ? "transform 0.25s ease, visibility 0s"
        : "transform 0.25s ease, visibility 0s linear 0.25s",
  };

  const navScrimStyle = {
    opacity: isMobileMenuOpen ? 1 : 0,
    pointerEvents: (isMobileMenuOpen ? "auto" : "none") as CSSProperties["pointerEvents"],
    transition: "opacity 0.2s ease",
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  const handleDropdownToggle = () => setIsDropdownOpen((prev) => !prev);

  const handleDropdownBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setIsDropdownOpen(false);
  };

  const handleDropdownKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") {
      return;
    }
    event.stopPropagation();
    setIsDropdownOpen(false);
    dropdownToggleRef.current?.focus();
  };

  return (
    <header
      className={`app-header ${isNavVisible ? "nav-visible" : "nav-hidden"}`}
      onTouchStart={handleHeaderTouchStart}
      onTouchEnd={handleHeaderTouchEnd}
    >
      <div className="nav-container">
        <a className="brand" href="/">
          <span className="brand-title">
            <span className="brand-name">WaterShortcut</span>
            <span className="brand-dotcom">.com</span>
          </span>
          <span className="tagline">{copy.brand.tagline}</span>
        </a>
        <div
          className={`credit-meter ${pulse ? "is-animating" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={`Credits available: ${credits}. Add more credits.`}
          onClick={onCreditsClick}
          onKeyDown={onCreditsKeyDown}
        >
          <span className="credit-meter__label">Credits</span>
          <span className="credit-meter__value">{credits}</span>
          <button
            type="button"
            className="credit-info-button"
            aria-label="Learn about credits"
            onClick={(event) => {
              event.stopPropagation();
              setShowCreditInfo(true);
            }}
          >
            i
          </button>
        </div>
        <nav className="global-nav" aria-label="Primary navigation">
          <div className="nav-links">
            {navLinks.map((link) => (
              <a key={link.href} className="nav-link" href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <div
              className={`nav-dropdown ${isDropdownOpen ? "open" : ""}`}
              onBlur={handleDropdownBlur}
              onKeyDown={handleDropdownKeyDown}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={closeDropdown}
            >
              <button
                ref={dropdownToggleRef}
                type="button"
                className="nav-link dropdown-toggle"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-controls="secondary-links-panel"
                onClick={handleDropdownToggle}
              >
                Tools &amp; More <span className="dropdown-caret">▼</span>
              </button>
              <div id="secondary-links-panel" className="dropdown-panel">
                <div className="dropdown-section">
                  <span className="dropdown-heading">Explore</span>
                  {dropdownLinks.map((link) => (
                    <a
                      key={link.href}
                      className="dropdown-link"
                      href={link.href}
                      onClick={() => {
                        closeMenu();
                        closeDropdown();
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span aria-hidden>☰</span>
            <span className="sr-only">Toggle menu</span>
          </button>
        </nav>
      </div>
      {showModeBar && (
        <div className="mode-bar" role="region" aria-label="Mode switcher">
          <div className="mode-bar__content">
            <span className="mode-bar__label">{copy.nav.switcherLabel}</span>
            <div className="mode-bar__actions">
              <a className={!isWaterEjectRoute && !isGameRoute ? "active" : ""} href="/analyze-water-bill">
                {copy.nav.homeLabel}
              </a>
              <a className={isWaterEjectRoute ? "active" : ""} href="/blog-how-to-eject.html">
                {copy.nav.ejectLabel}
              </a>
              <a className={isGameRoute ? "active" : ""} href="/game">
                {copy.nav.gameLabel}
              </a>
            </div>
            <button
              type="button"
              className="mode-bar__close"
              aria-label="Close mode bar"
              onClick={() => setShowModeBar(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className={`nav-scrim ${isMobileMenuOpen ? "open" : ""}`}
        aria-label="Close menu"
        onClick={closeMenu}
        aria-hidden={!isMobileMenuOpen}
        hidden={!isMobileMenuOpen}
        style={navScrimStyle}
      />
      <div
        id="mobile-nav-panel"
        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
        hidden={!isMobileMenuOpen}
        style={mobileNavStyle}
        onPointerDown={handleNavPointerDown}
        onPointerMove={handleNavPointerMove}
        onPointerUp={handleNavPointerUp}
        onPointerCancel={handleNavPointerCancel}
      >
        <div className="mobile-nav__controls">
          <div className="mobile-nav__handle" aria-hidden />
          <button
            type="button"
            className="mobile-nav__close"
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>
        {mobileLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
      </div>
      {showCreditInfo && (
        <div className="credit-info-modal" role="dialog" aria-modal="true" aria-label="Credit information">
          <div className="credit-info-card">
            <div className="credit-info-header">
              <h3>How credits work</h3>
              <button
                type="button"
                className="ghost-close"
                aria-label="Close credit information"
                onClick={() => setShowCreditInfo(false)}
              >
                ✕
              </button>
            </div>
            <ul>
              <li>Utility lookups cost 1 credit once results are delivered.</li>
              <li>Bill uploads and AI reviews draw 1 credit after analysis.</li>
              <li>You can top up in packs of 5 credits.</li>
            </ul>
            <p>Need more? Tap the credit counter to purchase additional credits.</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
