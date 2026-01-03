export type SearchProvider = "duckduckgo" | "google" | "facebook" | "maps";

export type SearchPreference = "online" | "in-person";

export type SearchQueryInput = {
  baseKeywords: string[];
  moveTitles?: string[];
  location?: string | null;
  preference?: SearchPreference;
};

const normalizeKeyword = (keyword: string) => keyword.trim().replace(/\s+/g, " ");

export const buildSearchKeywords = ({
  baseKeywords,
  moveTitles = [],
  location,
  preference = "online",
}: SearchQueryInput): string[] => {
  const locationKeyword = location ? [normalizeKeyword(location)] : [];
  const preferenceKeywords =
    preference === "in-person" ? ["near me", "local installer"] : ["online", "shipping"];

  const combined = [
    ...baseKeywords,
    ...moveTitles,
    ...preferenceKeywords,
    ...locationKeyword,
  ]
    .map(normalizeKeyword)
    .filter(Boolean);

  return Array.from(new Set(combined)).slice(0, 10);
};

export const buildSearchQuery = (input: SearchQueryInput): string =>
  buildSearchKeywords(input).join(" ");

export const buildSearchUrl = (provider: SearchProvider, query: string): string => {
  const encoded = encodeURIComponent(query);
  switch (provider) {
    case "duckduckgo":
      return `https://duckduckgo.com/?q=${encoded}`;
    case "google":
      return `https://www.google.com/search?q=${encoded}`;
    case "facebook":
      return `https://www.facebook.com/marketplace/search/?query=${encoded}`;
    case "maps":
      return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    default:
      return `https://duckduckgo.com/?q=${encoded}`;
  }
};
