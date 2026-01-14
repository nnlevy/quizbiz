import { getAdVisibilityForPath, type AdVisibility } from "../ads/adPolicy";
import { normalizePathname } from "../utils/pathname";

export type PageFlow = "marketing" | "analysis" | "tools" | "account";

export type PageExperience = {
  id: string;
  flow: PageFlow;
  bodyClass?: string;
  ads: AdVisibility;
};

type PageExperienceRule = {
  id: string;
  match: (pathname: string) => boolean;
  flow: PageFlow;
  bodyClass?: string;
};

const PAGE_EXPERIENCE_RULES: PageExperienceRule[] = [
  {
    id: "home",
    match: (pathname) => pathname === "/",
    flow: "marketing",
    bodyClass: "page-home",
  },
  {
    id: "analysis",
    match: (pathname) =>
      pathname.startsWith("/analysis-results") ||
      pathname === "/analyze-water-bill" ||
      pathname === "/manual-entry" ||
      pathname === "/find-water-provider",
    flow: "analysis",
    bodyClass: "page-analysis",
  },
  {
    id: "tools",
    match: (pathname) =>
      pathname.startsWith("/calculators") ||
      pathname.startsWith("/savings-plan") ||
      pathname.startsWith("/leak-check") ||
      pathname.startsWith("/rebates") ||
      pathname.startsWith("/guides") ||
      pathname.startsWith("/water-iq"),
    flow: "tools",
    bodyClass: "page-tools",
  },
  {
    id: "account",
    match: (pathname) =>
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up"),
    flow: "account",
    bodyClass: "page-account",
  },
];

export const getPageExperience = (pathname: string): PageExperience => {
  const normalizedPath = normalizePathname(pathname);
  const matchedRule =
    PAGE_EXPERIENCE_RULES.find((rule) => rule.match(normalizedPath)) ??
    ({
      id: "default",
      flow: "marketing",
    } satisfies PageExperienceRule);

  return {
    id: matchedRule.id,
    flow: matchedRule.flow,
    bodyClass: matchedRule.bodyClass,
    ads: getAdVisibilityForPath(normalizedPath),
  };
};
