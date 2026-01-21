import { appendReferralToUrl, getActiveReferralToken } from "./referral";

const REFERRAL_EXTERNAL_WHITELIST = new Set<string>([]);

const isWhitelistedExternal = (url: string, origin: string) => {
  try {
    const parsed = new URL(url, origin);
    if (parsed.origin === origin) return false;
    return REFERRAL_EXTERNAL_WHITELIST.has(parsed.origin);
  } catch {
    return false;
  }
};

const isInternalUrl = (url: string, origin: string) => {
  if (url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) return false;
  try {
    const parsed = new URL(url, origin);
    return parsed.origin === origin;
  } catch {
    return url.startsWith("/");
  }
};

export const buildReferralHref = (href: string) => {
  if (typeof window === "undefined") return href;
  if (!href || href.startsWith("javascript:")) return href;
  const token = getActiveReferralToken();
  if (!token) return href;
  const origin = window.location.origin;
  if (!isInternalUrl(href, origin) && !isWhitelistedExternal(href, origin)) {
    return href;
  }
  return appendReferralToUrl(href, token);
};

export const decorateReferralLinks = (root: ParentNode = document) => {
  const anchors = root.querySelectorAll<HTMLAnchorElement>("a[href]");
  anchors.forEach((anchor) => {
    if (anchor.dataset.referralIgnore === "true") return;
    const nextHref = buildReferralHref(anchor.getAttribute("href") ?? "");
    if (nextHref && nextHref !== anchor.href) {
      anchor.setAttribute("href", nextHref);
    }
  });
};

export const startReferralLinkObserver = () => {
  if (typeof window === "undefined") return () => undefined;
  decorateReferralLinks();
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.matches("a[href]")) {
            decorateReferralLinks(node.parentNode ?? document);
          } else {
            decorateReferralLinks(node);
          }
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
};
