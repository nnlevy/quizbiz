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

  return (
    <header className="app-header">
      <div className="nav-container">
        <a className="brand" href="/">
          WaterShortcut
        </a>
        <nav className="global-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-nav" role="dialog" aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default SiteNav;
