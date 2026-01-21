(() => {
  const REFERRER_KEY = "ws_referrer_token";
  const REFERRAL_TTL_MS = 1000 * 60 * 60 * 24 * 30;
  const WHITELIST = new Set([]);

  const now = () => Date.now();

  const parseStoredToken = (raw) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") {
        return { token: parsed, issuedAt: 0 };
      }
      if (parsed && typeof parsed.token === "string" && typeof parsed.issuedAt === "number") {
        return parsed;
      }
    } catch {
      return { token: raw, issuedAt: 0 };
    }
    return null;
  };

  const isExpired = (issuedAt) => issuedAt > 0 && now() - issuedAt > REFERRAL_TTL_MS;

  const readToken = (storage) => {
    if (!storage) return null;
    try {
      const parsed = parseStoredToken(storage.getItem(REFERRER_KEY));
      if (!parsed) return null;
      if (isExpired(parsed.issuedAt)) {
        storage.removeItem(REFERRER_KEY);
        return null;
      }
      return parsed.token;
    } catch {
      return null;
    }
  };

  const writeToken = (storage, token) => {
    if (!storage || !token) return;
    try {
      storage.setItem(REFERRER_KEY, JSON.stringify({ token, issuedAt: now() }));
    } catch {
      // ignore
    }
  };

  const captureFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref) return null;
    writeToken(window.sessionStorage, ref);
    writeToken(window.localStorage, ref);
    return ref;
  };

  const getToken = () => readToken(window.sessionStorage) || readToken(window.localStorage);

  const shouldAppend = (href) => {
    if (!href) return false;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    const origin = window.location.origin;
    try {
      const parsed = new URL(href, origin);
      if (parsed.origin === origin) return true;
      return WHITELIST.has(parsed.origin);
    } catch {
      return href.startsWith("/");
    }
  };

  const appendRef = (href, token) => {
    try {
      const parsed = new URL(href, window.location.origin);
      if (parsed.searchParams.has("ref")) return parsed.toString();
      parsed.searchParams.set("ref", token);
      return parsed.toString();
    } catch {
      if (href.includes("ref=")) return href;
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}ref=${encodeURIComponent(token)}`;
    }
  };

  const decorate = (root = document) => {
    const token = getToken();
    if (!token) return;
    root.querySelectorAll("a[href]").forEach((anchor) => {
      if (anchor.dataset.referralIgnore === "true") return;
      const href = anchor.getAttribute("href");
      if (!shouldAppend(href)) return;
      const next = appendRef(href, token);
      if (next && next !== anchor.href) {
        anchor.setAttribute("href", next);
      }
    });
  };

  captureFromUrl();
  decorate();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.matches("a[href]")) {
            decorate(node.parentNode || document);
          } else {
            decorate(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
