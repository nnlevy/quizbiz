import { useEffect, useState } from "react";

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

const SiteNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="app-header">
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
