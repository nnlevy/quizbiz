import {
  FocusEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  type KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/leak-patrol", label: "Game" },
];

const learnLinks = [
  { href: "/learn/read-water-bill", label: "Read Your Bill" },
  { href: "/learn/leak-detection", label: "Leak Detection" },
  { href: "/learn/water-saving-tips", label: "Water-Saving Tips" },
  { href: "/learn/water-bill-spikes", label: "Bill Spikes" },
  { href: "/learn/hidden-leaks", label: "Hidden Leaks" },
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDraggingNav, setIsDraggingNav] = useState(false);
  const [navDragStartY, setNavDragStartY] = useState<number | null>(null);
  const [navDragOffset, setNavDragOffset] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const navTouchStart = useRef<{ x: number; y: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    setIsDropdownOpen(false);
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const closeDropdown = () => setIsDropdownOpen(false);
  const openDropdown = () => setIsDropdownOpen(true);

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node | null)) {
      closeDropdown();
    }
  };

  const mobileLinks = [...links, ...learnLinks];

  const handleHeaderTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    if (!isMobileViewport()) {
      return;
    }
    const touch = event.touches[0];
    navTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleHeaderTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    if (!isMobileViewport()) {
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
    if (deltaY < 0) {
      setNavDragOffset(deltaY);
    }
  };

  const handleNavPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingNav) {
      return;
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (navDragOffset < -NAV_SWIPE_THRESHOLD) {
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
        transform: isDraggingNav ? `translateY(${Math.min(navDragOffset, 0)}px)` : undefined,
        transition: isDraggingNav ? "none" : undefined,
      }
    : undefined;

  return (
    <header
      className={`app-header ${isNavVisible ? "nav-visible" : "nav-hidden"}`}
      onTouchStart={handleHeaderTouchStart}
      onTouchEnd={handleHeaderTouchEnd}
    >
      <div className="nav-container">
        <a className="brand" href="/">
          WaterShortcut
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
        </div>
        <nav className="global-nav" aria-label="Primary navigation">
          <div className="nav-links">
            {links.map((link) => (
              <a key={link.href} className="nav-link" href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <div
              ref={dropdownRef}
              className={`nav-dropdown ${isDropdownOpen ? "open" : ""}`}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              onFocusCapture={openDropdown}
              onBlurCapture={handleDropdownBlur}
            >
              <button
                type="button"
                className="nav-link dropdown-toggle"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                Learn
                <span aria-hidden className="dropdown-caret">
                  {isDropdownOpen ? "▴" : "▾"}
                </span>
              </button>
              <div className="dropdown-panel" role="menu">
                {learnLinks.map((link) => (
                  <a
                    key={link.href}
                    className="dropdown-link"
                    href={link.href}
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    {link.label}
                  </a>
                ))}
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
      <button
        type="button"
        className={`nav-scrim ${isMobileMenuOpen ? "open" : ""}`}
        aria-label="Close menu"
        onClick={closeMenu}
      />
      <div
        id="mobile-nav-panel"
        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        style={navDragStyle}
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
    </header>
  );
};

export default SiteNav;
