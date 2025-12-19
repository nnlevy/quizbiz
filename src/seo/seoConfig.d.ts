export type PageSeo = {
  title: string;
  description: string;
  canonicalPath: string;
  h1?: string;
  intro?: string;
  bodyHtml?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  robots?: "index,follow" | "noindex,nofollow";
  structuredData?: Record<string, unknown>[];
};

export type SeoSiteConfig = {
  brandName: string;
  canonicalHost: string;
  defaultOgImage: string;
  twitterHandle?: string;
  locale: string;
};

export const site: SeoSiteConfig;
export const pages: Record<string, PageSeo>;
export function buildTitle(pageTitle: string): string;
export function clampDescription(description: string): string;
export function canonicalUrl(pathname: string): string;
