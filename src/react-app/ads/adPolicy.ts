export type AdType = "footer" | "inline" | "sticky";

export type AdVisibility = Record<AdType, boolean>;

type AdPageRule = {
  description: string;
  match: (pathname: string) => boolean;
  visibility: Partial<AdVisibility>;
};

const DEFAULT_AD_VISIBILITY: AdVisibility = {
  footer: true,
  inline: true,
  sticky: true,
};

const AD_PAGE_RULES: AdPageRule[] = [
  {
    description: "Homepage is ad-free",
    match: (pathname) => pathname === "/",
    visibility: {
      footer: false,
      inline: false,
      sticky: false,
    },
  },
];

export const getAdVisibilityForPath = (pathname: string): AdVisibility => {
  let visibility = { ...DEFAULT_AD_VISIBILITY };
  AD_PAGE_RULES.forEach((rule) => {
    if (rule.match(pathname)) {
      visibility = { ...visibility, ...rule.visibility };
    }
  });
  return visibility;
};

export const isAdTypeEnabled = (pathname: string, adType: AdType): boolean =>
  getAdVisibilityForPath(pathname)[adType];

export const hasAnyAdsEnabled = (pathname: string): boolean =>
  Object.values(getAdVisibilityForPath(pathname)).some(Boolean);
