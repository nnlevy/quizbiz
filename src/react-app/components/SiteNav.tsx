import {
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/learn/read-water-bill", label: "Read Your Bill" },
  { href: "/learn/leak-detection", label: "Leak Detection" },
  { href: "/learn/water-saving-tips", label: "Water-Saving Tips" },
  { href: "/learn/water-bill-spikes", label: "Bill Spikes" },
  { href: "/learn/hidden-leaks", label: "Hidden Leaks" },
  { href: "/leak-patrol", label: "Game" },
];

const NAV_SWIPE_THRESHOLD = 42;

const SiteNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navTouchStart = useRef<{ x: number; y: number } | null>(null);

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;

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

  const closeMenu = () => setIsMobileMenuOpen(false);

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

  return (
    <header
      className="app-header"
      onTouchStart={handleHeaderTouchStart}
      onTouchEnd={handleHeaderTouchEnd}
    >
      <div className="nav-container">
        <a className="brand" href="/">
          WaterShortcut
        </a>
        <nav className="global-nav" aria-label="Primary navigation">
          <div className="nav-links">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
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
      >
        <div className="mobile-nav__handle" aria-hidden />
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};

export default SiteNav;
