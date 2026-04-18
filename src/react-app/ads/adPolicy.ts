import { normalizePathname } from "../utils/pathname";

export type AdType = "footer" | "inline" | "sticky";

export type AdVisibility = Record<AdType, boolean>;

const DEFAULT_AD_VISIBILITY: AdVisibility = {
  footer: true,
  inline: true,
  sticky: false,
};

export const getAdVisibilityForPath = (pathname: string): AdVisibility => {
  const normalizedPath = normalizePathname(pathname);
  if (normalizedPath === "/privacy" || normalizedPath === "/terms") {
    return {
      footer: true,
      inline: false,
      sticky: false,
    };
  }
  return DEFAULT_AD_VISIBILITY;
};

export const isAdTypeEnabled = (pathname: string, adType: AdType): boolean =>
  getAdVisibilityForPath(pathname)[adType];

export const hasAnyAdsEnabled = (pathname: string): boolean =>
  Object.values(getAdVisibilityForPath(pathname)).some(Boolean);
