import { Hono } from "hono";
import type { Context } from "hono";
import { stylesCss, appJs } from "./assets";
import { BUILD_DATE as COPY_BUILD_DATE, copy } from "../copy";
import { buildFallbackLocationPayload, lookupLiveLocationPayload } from "./locationFallback";
import { LocationAssistantPayload } from "./locationTypes";
import { ADSENSE_CLIENT as DEFAULT_ADSENSE_CLIENT, DEFAULT_ADSENSE_SLOTS, DEFAULT_ADSENSE_STICKY_LAYOUT_KEY } from "../config/adsense";
import { GA_MEASUREMENT_ID as DEFAULT_GA_MEASUREMENT_ID } from "../config/analytics";
import { pages as seoPages, site as seoSite, canonicalUrl as seoCanonicalUrl } from "../seo/seoConfig.js";
import type { PageSeo } from "../seo/seoConfig.js";
import {
  computeWaterIq,
  decodeToken,
  hookFactById,
  moveMeta,
  personaFor,
} from "../lib/waterIq";
import type { WaterIqAnswers, WaterIqVariant } from "../lib/waterIq";
import {
  getCityAverage,
  getFollowupsDue,
  getSocialProofFor,
  getStats,
  storeCity,
  storeEvent,
  storeFollowup,
  storeReward,
  storeSubmit,
} from "../lib/waterIqStore";
import { runWaterIqAudit } from "../lib/waterIqAudit";

const SHOWER_FLOW_RATE = 2.5;
const SINK_FLOW_RATE = 1.5;
const COST_PER_GALLON_MIN = 0.0058;
const COST_PER_GALLON_MAX = 0.009;
const REBATE_CACHE_TTL_MS = 1000 * 60 * 60 * 12;

const rebateCache = new Map<string, { expiresAt: number; payload: RebateResponse }>();

const subtle = (() => {
  if (typeof crypto.subtle !== "undefined") {
    return crypto.subtle;
  }
  const maybeWebCrypto = (crypto as unknown as { webcrypto?: Crypto }).webcrypto;
  if (maybeWebCrypto?.subtle) {
    return maybeWebCrypto.subtle;
  }
  throw new Error("Web Crypto subtle API is not available in this environment.");
})();

type WorkerEnv = {
  OPEN_API_KEY_NEW: string;
  OPENAI_ORG_ID?: string;
  Google_Document_AI_Processor_Prediction_Endpoint: string;
  "Google-Service-Account-FINAL": string;
  "domains-db"?: D1Database;
  STRIPE_API_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  ADSENSE_CLIENT?: string;
  GA_MEASUREMENT_ID?: string;
  ADSENSE_SLOT_INLINE?: string;
  ADSENSE_SLOT_FOOTER?: string;
  ADSENSE_SLOT_STICKY?: string;
  WS_ADMIN_EXPORT_KEY?: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: unknown;
};

type AnalysisMove = {
  title: string;
  why: string;
  effort: string;
  impact: string;
  steps: string[];
  ctaLabel: string;
  ctaHref: string;
};

type AnalysisResult = {
  topMoves: AnalysisMove[];
  payingFor: string;
  nextStep: string;
  confidenceNote?: string;
};

type RebateResult = {
  program: string;
  provider: string;
  amount: string;
  eligibility: string[];
  howToApply: string;
  links: Array<{ label: string; url: string }>;
  estimated?: boolean;
};

type RebateResponse = {
  lastChecked: string;
  results: RebateResult[];
};

type DocumentAIResponse = {
  document?: {
    text?: string;
  };
  error?: {
    message?: string;
  };
};

type SiteRoute = {
  path: string;
  title: string;
  description: string;
  body: string;
  pageCssClass?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  extraJsonLd?: Array<Record<string, unknown>>;
};

const DOMAIN = `https://${seoSite.canonicalHost}`;
const BUILD_DATE = COPY_BUILD_DATE;
const INLINE_AD_MARKER = "<!--INLINE_AD_SLOT-->";

type AdsenseSlots = {
  inline?: string | null;
  footer?: string | null;
  sticky?: string | null;
};

const defaultAdsenseSlots: Required<AdsenseSlots> = {
  inline: DEFAULT_ADSENSE_SLOTS.inline,
  footer: DEFAULT_ADSENSE_SLOTS.footer,
  sticky: DEFAULT_ADSENSE_SLOTS.sticky,
};

const buildContentSecurityPolicy = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://static.cloudflareinsights.com https://pagead2.googlesyndication.com https://securepubads.g.doubleclick.net https://googleads.g.doubleclick.net https://adservice.google.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://www.googletagservices.com https://www.googletagmanager.com https://ep2.adtrafficquality.google`,
    `script-src-elem 'self' 'nonce-${nonce}' https://js.stripe.com https://static.cloudflareinsights.com https://pagead2.googlesyndication.com https://securepubads.g.doubleclick.net https://googleads.g.doubleclick.net https://adservice.google.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://www.googletagservices.com https://www.googletagmanager.com https://ep2.adtrafficquality.google`,
    "connect-src 'self' https://www.watershortcut.com https://watershortcut.com https://api.stripe.com https://hooks.stripe.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://geocode.maps.co https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://adservice.google.com https://www.google-analytics.com https://stats.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://fundingchoicesmessages.google.com https://www.googletagservices.com",
    "img-src 'self' data: https://res.cloudinary.com https://api.qrserver.com https://js.stripe.com https://m.stripe.network https://hooks.stripe.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google-analytics.com https://stats.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://ep2.adtrafficquality.google https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://hooks.stripe.com",
  ].join("; ");

const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
]);

const CONSENT_STORAGE_KEY = "ws-consent-v1";

function buildAdsenseSlots(env: WorkerEnv): Required<AdsenseSlots> {
  return {
    inline: env.ADSENSE_SLOT_INLINE ?? DEFAULT_ADSENSE_SLOTS.inline,
    footer: env.ADSENSE_SLOT_FOOTER ?? DEFAULT_ADSENSE_SLOTS.footer,
    sticky: env.ADSENSE_SLOT_STICKY ?? DEFAULT_ADSENSE_SLOTS.sticky,
  };
}

function resolveAdsenseClient(env: WorkerEnv): string {
  return env.ADSENSE_CLIENT ?? DEFAULT_ADSENSE_CLIENT;
}

function resolveGaMeasurementId(env: WorkerEnv): string {
  return env.GA_MEASUREMENT_ID ?? DEFAULT_GA_MEASUREMENT_ID;
}

function isConsentRequired(country?: string | null): boolean {
  if (!country) return true;
  return CONSENT_REQUIRED_COUNTRIES.has(country.toUpperCase());
}

function renderAdSlot(
  slotId: string | null,
  options: { clientId: string; slotName: string; format?: string; fullWidth?: boolean; layoutKey?: string },
): string {
  if (!slotId) {
    return `<div class="ad-slot-placeholder" aria-label="Ad placeholder">Ad space reserved</div>`;
  }

  const { format = "auto", fullWidth = true, slotName, layoutKey, clientId } = options;
  const attrs = [
    'class="adsbygoogle ad-slot"',
    `data-ad-client="${escapeHtml(clientId)}"`,
    `data-ad-slot="${escapeHtml(slotId)}"`,
    `data-ad-region="${escapeHtml(slotName)}"`,
    `data-ad-format="${format}"`,
  ];
  if (layoutKey) attrs.push(`data-ad-layout-key="${escapeHtml(layoutKey)}"`);
  if (fullWidth) attrs.push('data-full-width-responsive="true"');

  return `<ins ${attrs.join(" ")}></ins>`;
}

function injectAdSlots(
  bodyHtml: string,
  adsenseSlots: Required<AdsenseSlots>,
  adsenseClient: string,
): string {
  const inlineAd = renderAdSlot(adsenseSlots.inline, { slotName: "inline", clientId: adsenseClient });
  return bodyHtml.replaceAll(INLINE_AD_MARKER, inlineAd);
}

const homeownerDropdownLinks = [
  { label: "Analyze", href: "/analyze-water-bill" },
  { label: "Plan", href: "/savings-plan" },
  { label: "Calculators", href: "/calculators" },
  { label: "Water IQ Challenge", href: "/water-iq" },
  { label: "Leaks", href: "/leak-check" },
  { label: "Rebates", href: "/rebates" },
  { label: "Guides", href: "/guides" },
  { label: "Find provider", href: "/find-water-provider" },
];

const waterEjectNavLinks = [
  { label: "Water Eject How-To", href: "/blog-how-to-eject.html" },
  { label: "Is it safe?", href: "/blog-is-it-safe.html" },
  { label: "Get shortcut", href: "/" },
];

const footerLinks = [
  { label: "Privacy", href: "/privacy", modal: "privacy-modal" },
  { label: "Terms", href: "/terms", modal: "terms-modal" },
  { label: "Affiliate", href: "/affiliate", modal: "affiliate-modal" },
  { label: "Disclaimer", href: "/disclaimer", modal: "disclaimer-modal" },
  { label: "Change privacy settings", href: "#privacy-settings" },
  { label: "Water Eject (iPhone)", href: "/blog-how-to-eject.html" },
  { label: "Water IQ Challenge", href: "/water-iq" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap", modal: "sitemap-modal" },
];

const modalCopy: Record<string, { title: string; body: string[]; footer?: string }> = {
  "privacy-modal": {
    title: copy.trust.privacy.title,
    body: copy.trust.privacy.tldr.slice(0, 3),
    footer: `Last updated: ${BUILD_DATE}`,
  },
  "terms-modal": {
    title: copy.trust.terms.title,
    body: [
      "Use at your own risk.",
      "Estimates are not guarantees.",
      "Not legal, financial, or plumbing advice.",
    ],
  },
  "affiliate-modal": {
    title: copy.trust.affiliate.title,
    body: [
      "Some links are affiliate links.",
      "You pay the same price.",
      "We recommend products because they’re useful.",
    ],
  },
  "disclaimer-modal": {
    title: copy.trust.disclaimer.title,
    body: [
      "WaterShortcut provides educational estimates, not professional advice.",
      "For emergencies, contact a licensed professional.",
    ],
  },
  "sitemap-modal": {
    title: "Sitemap",
    body: ["Tools", "Calculators", "Guides", "Trust pages"],
  },
};

const siteRoutes: SiteRoute[] = [
  {
    path: "/",
    title: "WaterShortcut | Save water. Save money.",
    description:
      "Upload a water bill for a clear breakdown and a savings plan. Or use fast calculators for showers, toilets, leaks, laundry, and outdoor watering.",
    body: renderHome(),
    pageCssClass: "home",
  },
  {
    path: "/analyze-water-bill",
    title: "Analyze a water bill PDF | WaterShortcut",
    description:
      "Upload a water bill PDF to get a plain-English breakdown, usage clues, and prioritized savings moves.",
    body: renderBillAnalyzer(),
  },
  {
    path: "/find-water-provider",
    title: "Find your water provider | WaterShortcut",
    description:
      "Enter your city to find your water authority, bill portal, and contact details.",
    body: renderProviderFinder(),
  },
  {
    path: "/savings-plan",
    title: "Build a water savings plan | WaterShortcut",
    description:
      "Answer a few questions to get a personalized, prioritized plan to lower your water bill.",
    body: renderSavingsPlan(),
  },
  {
    path: "/water-iq",
    title: "Water IQ Challenge | WaterShortcut",
    description:
      "Take the 2–3 minute Water IQ Challenge to get your score, a shareable badge, and your next best water-saving moves.",
    body: renderWaterIq(),
  },
  {
    path: "/calculators",
    title: "Water saving calculators | WaterShortcut",
    description:
      "Fast, no-login calculators for showers, faucets, toilets, laundry, leaks, and outdoor watering.",
    body: renderCalculatorsHub(),
  },
  {
    path: "/calculators/shower",
    title: "Shower savings calculator | WaterShortcut",
    description:
      "Estimate water (and money) savings from a WaterSense showerhead and shorter showers.",
    body: renderShowerCalculator(),
  },
  {
    path: "/calculators/faucet",
    title: "Faucet savings calculator | WaterShortcut",
    description:
      "Estimate savings from WaterSense bathroom faucets/aerators and small habit changes.",
    body: renderFaucetCalculator(),
  },
  {
    path: "/calculators/toilet",
    title: "Toilet savings calculator | WaterShortcut",
    description: "Estimate savings from upgrading toilets and fixing silent leaks.",
    body: renderToiletCalculator(),
  },
  {
    path: "/calculators/laundry",
    title: "Laundry savings calculator | WaterShortcut",
    description: "Estimate savings from switching to an ENERGY STAR clothes washer.",
    body: renderLaundryCalculator(),
  },
  {
    path: "/calculators/outdoor",
    title: "Outdoor watering savings | WaterShortcut",
    description:
      "Build a smarter outdoor watering plan and estimate waste from overwatering.",
    body: renderOutdoorCalculator(),
  },
  {
    path: "/leak-check",
    title: "Leak check | WaterShortcut",
    description:
      "A fast, guided checklist to find common household leaks and what to do next.",
    body: renderLeakCheck(),
  },
  {
    path: "/rebates",
    title: "Find water rebates | WaterShortcut",
    description: "Find official rebates for WaterSense and ENERGY STAR products in minutes.",
    body: renderRebatesWizard(),
  },
  {
    path: "/guides",
    title: "Water saving guides | WaterShortcut",
    description:
      "Short guides for showerheads, leaks, toilets, outdoor watering, and reading your bill.",
    body: renderGuidesHub(),
  },
  {
    path: "/guides/showerheads",
    title: "WaterSense showerheads | WaterShortcut",
    description: "What to buy, what to expect, and how to calculate savings.",
    body: renderGuideShowerheads(),
  },
  {
    path: "/guides/find-fix-leaks",
    title: "Find and fix household leaks | WaterShortcut",
    description: "The fastest way to lower your water bill is stopping silent waste.",
    body: renderGuideLeaks(),
  },
  {
    path: "/guides/toilets",
    title: "WaterSense toilets | WaterShortcut",
    description: "How to spot a running toilet and when an upgrade is worth it.",
    body: renderGuideToilets(),
  },
  {
    path: "/guides/water-bill",
    title: "Water bill basics | WaterShortcut",
    description: "How to read your usage, units, tiers, and common fees.",
    body: renderGuideWaterBill(),
  },
  {
    path: "/guides/outdoor-watering",
    title: "Outdoor watering basics | WaterShortcut",
    description:
      "A simple checklist to reduce outdoor waste and keep plants healthy.",
    body: renderGuideOutdoor(),
  },
  {
    path: "/blog-how-to-eject.html",
    title: "How to Eject Water from Your iPhone Speakers Instantly | WaterShortcut",
    description:
      "Use the Water Eject Shortcut to clear water from iPhone speakers quickly with safe, low-frequency sound.",
    body: renderBlogHowToEject(),
    pageCssClass: "blog-page",
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'How to Eject Water from Your iPhone Speakers Instantly (The Safe Way)',
        description:
          'Water Eject Shortcut guide: play a 165Hz tone to clear trapped water and fix muffled iPhone speakers fast.',
        mainEntityOfPage: `${DOMAIN}/blog-how-to-eject.html`,
        datePublished: BUILD_DATE,
        dateModified: BUILD_DATE,
        author: { '@type': 'Organization', name: 'WaterShortcut', url: DOMAIN },
        publisher: { '@type': 'Organization', name: 'WaterShortcut', url: DOMAIN },
        keywords: [
          'Water Eject Shortcut',
          'Fix wet iPhone speaker',
          'Remove water from charging port',
        ],
      },
    ],
  },
  {
    path: "/blog-is-it-safe.html",
    title: "Is the Water Eject Shortcut Safe? | WaterShortcut",
    description:
      "Learn how the Water Eject Shortcut works, why it is safe for iPhones, and when to use professional repair.",
    body: renderBlogIsItSafe(),
    pageCssClass: "blog-page",
    extraJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'Is the Water Eject Shortcut Safe? (And Why You Should Stop Using Rice)',
        description:
          'Understand the physics behind the Water Eject Shortcut, safety considerations, and when deeper repair is needed.',
        mainEntityOfPage: `${DOMAIN}/blog-is-it-safe.html`,
        datePublished: BUILD_DATE,
        dateModified: BUILD_DATE,
        author: { '@type': 'Organization', name: 'WaterShortcut', url: DOMAIN },
        publisher: { '@type': 'Organization', name: 'WaterShortcut', url: DOMAIN },
        keywords: [
          'Water Eject Shortcut',
          'Fix wet iPhone speaker',
          'Remove water from charging port',
        ],
      },
    ],
  },
  {
    path: "/about",
    title: "About WaterShortcut",
    description:
      "WaterShortcut turns confusing bills into simple next steps—fast.",
    body: renderAbout(),
  },
  {
    path: "/contact",
    title: "Contact WaterShortcut",
    description: "Questions, feedback, or corrections? Send a note.",
    body: renderContact(),
  },
  {
    path: "/privacy",
    title: "Privacy | WaterShortcut",
    description: "How we handle analytics, uploads, and data.",
    body: renderTrustPage("privacy"),
  },
  {
    path: "/terms",
    title: "Terms | WaterShortcut",
    description: "Use at your own risk. Estimates only.",
    body: renderTrustPage("terms"),
  },
  {
    path: "/affiliate",
    title: "Affiliate disclosure | WaterShortcut",
    description: "Some links may pay a commission that keeps the site free.",
    body: renderTrustPage("affiliate"),
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | WaterShortcut",
    description: "Not legal, financial, or plumbing advice.",
    body: renderTrustPage("disclaimer"),
  },
  {
    path: "/sitemap",
    title: "Sitemap | WaterShortcut",
    description: "Browse every WaterShortcut page, tool, and guide.",
    body: "",
  },
];

const app = new Hono<{ Bindings: WorkerEnv; Variables: { cspNonce: string } }>();

app.use("*", async (c, next) => {
  const proto = c.req.header("x-forwarded-proto");
  const host = c.req.header("host") || "";

  if (
    proto &&
    proto !== "https" &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.")
  ) {
    const url = new URL(c.req.url);
    url.protocol = "https:";
    return c.redirect(url.toString(), 301);
  }

  if (
    host &&
    host !== seoSite.canonicalHost &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.")
  ) {
    const url = new URL(c.req.url);
    url.host = seoSite.canonicalHost;
    url.protocol = "https:";
    return c.redirect(url.toString(), 301);
  }

  await next();
});

app.use("*", async (c, next) => {
  const cspNonce = crypto.randomUUID().replace(/-/g, "");
  c.set("cspNonce", cspNonce);
  await next();
  c.res.headers.set("Content-Security-Policy", buildContentSecurityPolicy(cspNonce));
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  c.res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
});

const API_ALLOWED_ORIGINS = new Set([
  `https://${seoSite.canonicalHost}`,
  "https://watershortcut.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const buildCorsHeaders = (origin?: string | null): Record<string, string> => {
  const allowedOrigin = origin && API_ALLOWED_ORIGINS.has(origin) ? origin : `https://${seoSite.canonicalHost}`;
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
};

app.use("/api/*", async (c, next) => {
  const corsHeaders = buildCorsHeaders(c.req.header("Origin"));
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  await next();

  Object.entries(corsHeaders).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
});

app.get("/assets/styles.css", (c) =>
  c.text(stylesCss, 200, {
    "Content-Type": "text/css; charset=utf-8",
    "Cache-Control": "public, max-age=31536000, immutable",
  }),
);

app.get("/assets/app.js", (c) =>
  c.text(appJs, 200, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "public, max-age=31536000, immutable",
  }),
);

app.get("/ads.txt", (c) =>
  c.text("google.com, pub-1860356577073395, DIRECT, f08c47fec0942fa0"),
);

app.get("/__ads", (c) => {
  const adsenseSlots = buildAdsenseSlots(c.env);
  const adsenseClient = resolveAdsenseClient(c.env);
  const gaMeasurementId = resolveGaMeasurementId(c.env);
  const stripePublishableKey = (c.env as WorkerEnv).STRIPE_PUBLISHABLE_KEY ?? "";
  const country = (c.req.raw.cf as { country?: string } | undefined)?.country;
  const consentRequired = isConsentRequired(country);
  const showPrivacyControls = consentRequired;
  const cspNonce = c.get("cspNonce") as string;
  return c.html(
    layout({
      title: "AdSense diagnostics | WaterShortcut",
      description: "Internal ad diagnostics for verifying AdSense script loading and slot wiring.",
      canonicalPath: "/__ads",
      bodyHtml: renderAdsDiagnosticsPage(adsenseClient, adsenseSlots),
      pageCssClass: "ads-diagnostics-page",
      adsenseSlots,
      adsenseClient,
      gaMeasurementId,
      stripePublishableKey,
      consentRequired,
      showPrivacyControls,
      cspNonce,
    }),
  );
});

app.get("/water-iq/og/:token", (c) => {
  const token = c.req.param("token");
  const decoded = decodeToken(token);
  const score = decoded?.score ?? 0;
  const persona = personaFor(score);
  const badge = decoded?.badge ? decoded.badge.replace(/_/g, " ").toUpperCase() : "STARTER";
  const hook = decoded ? hookFactById(decoded.hook) : { short: "Small fixes add up fast.", sources: [] };
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff" stroke="#111111" stroke-width="16" />
  <text x="60" y="120" font-size="52" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#111111">${escapeHtml(
    `${persona.emoji} ${persona.name}`,
  )}</text>
  <text x="1140" y="120" text-anchor="end" font-size="52" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#111111">${score}/10</text>
  <text x="60" y="260" font-size="34" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#111111">${escapeHtml(
    badge,
  )}</text>
  <text x="60" y="320" font-size="32" font-family="system-ui, -apple-system, sans-serif" fill="#111111">${escapeHtml(
    hook.short,
  )}</text>
  <text x="60" y="560" font-size="26" font-family="system-ui, -apple-system, sans-serif" fill="rgba(0,0,0,0.72)">Water IQ Challenge · Tag 3 friends</text>
  <text x="1140" y="560" text-anchor="end" font-size="26" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#111111">watershortcut.com</text>
</svg>`;
  return c.body(svg, 200, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
});

app.get("/water-iq/r/:token", (c) => {
  const token = c.req.param("token");
  const decoded = decodeToken(token);
  const adsenseSlots = buildAdsenseSlots(c.env);
  const adsenseClient = resolveAdsenseClient(c.env);
  const gaMeasurementId = resolveGaMeasurementId(c.env);
  const stripePublishableKey = (c.env as WorkerEnv).STRIPE_PUBLISHABLE_KEY ?? "";
  const country = (c.req.raw.cf as { country?: string } | undefined)?.country;
  const consentRequired = isConsentRequired(country);
  const showPrivacyControls = consentRequired;
  const cspNonce = c.get("cspNonce") as string;

  if (!decoded) {
    return c.html(
      layout({
        title: "Invalid result link | WaterShortcut",
        description: "This link looks broken. Try the Water IQ Challenge again.",
        canonicalPath: `/water-iq/r/${token}`,
        bodyHtml:
          '<section class="section"><h1>Invalid result link</h1><p>This link looks broken. Try the quiz again.</p><a class="btn secondary" href="/water-iq">Go to Water IQ Challenge</a></section>',
        adsenseSlots,
        adsenseClient,
        gaMeasurementId,
        stripePublishableKey,
        consentRequired,
        showPrivacyControls,
        cspNonce,
      }),
    );
  }

  const persona = personaFor(decoded.score);
  const hook = hookFactById(decoded.hook);
  const moves = decoded.moves.map((id) => ({ id, ...moveMeta(id) })).filter((m) => m && m.href && m.title);
  const title = `${persona.emoji} ${persona.name} — ${decoded.score}/10 Water IQ`;
  const description =
    "Take the 2–3 minute Water IQ Challenge. Get a shareable badge + practical next steps to save water and lower bills.";
  return c.html(
    layout({
      title,
      description,
      canonicalPath: `/water-iq/r/${token}`,
      ogImageUrl: `/water-iq/og/${token}`,
      twitterCard: "summary_large_image",
      bodyHtml: renderWaterIqResult({
        token,
        persona,
        score: decoded.score,
        badge: decoded.badge,
        delta: decoded.delta,
        hook,
        moves,
      }),
      adsenseSlots,
      adsenseClient,
      gaMeasurementId,
      stripePublishableKey,
      consentRequired,
      showPrivacyControls,
      cspNonce,
    }),
  );
});

siteRoutes.forEach((route) => {
  app.get(route.path, (c) => {
    const adsenseSlots = buildAdsenseSlots(c.env);
    const adsenseClient = resolveAdsenseClient(c.env);
    const gaMeasurementId = resolveGaMeasurementId(c.env);
    const stripePublishableKey = (c.env as WorkerEnv).STRIPE_PUBLISHABLE_KEY ?? "";
    const country = (c.req.raw.cf as { country?: string } | undefined)?.country;
    const consentRequired = isConsentRequired(country);
    const showPrivacyControls = consentRequired;
    const cspNonce = c.get("cspNonce") as string;
    const bodyHtml = route.path === "/sitemap" ? renderHumanSitemap(siteRoutes) : route.body;
    return c.html(
      layout({
        title: route.title,
        description: route.description,
        canonicalPath: route.path,
        bodyHtml,
        pageCssClass: route.pageCssClass,
        breadcrumbs: route.breadcrumbs,
        extraJsonLd: route.extraJsonLd,
        adsenseSlots,
        adsenseClient,
        gaMeasurementId,
        stripePublishableKey,
        consentRequired,
        showPrivacyControls,
        cspNonce,
      }),
    );
  });
});

app.get("/sitemap.xml", (c) => {
  const lastmod = new Date().toISOString().split("T")[0];
  const indexable = Object.values(seoPages as Record<string, PageSeo>).filter((page) => (page.robots || "index,follow").includes("index"));
  const entries = indexable
    .map((page) => `<url><loc>${seoCanonicalUrl(page.canonicalPath)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml" });
});

app.get("/robots.txt", (c) =>
  c.text(
    `User-agent: *\nAllow: /\nSitemap: https://${seoSite.canonicalHost}/sitemap.xml`,
    200,
    { "Content-Type": "text/plain; charset=utf-8" },
  ),
);

app.get("/security.txt", (c) =>
  c.text(
    `Contact: mailto:support@watershortcut.com\nPreferred-Languages: en\nCanonical: https://${seoSite.canonicalHost}/security.txt`,
    200,
    { "Content-Type": "text/plain; charset=utf-8" },
  ),
);

app.get("/humans.txt", (c) =>
  c.text(
    `WaterShortcut\nTeam: WaterShortcut\nSite: https://${seoSite.canonicalHost}\nContact: support@watershortcut.com`,
    200,
    { "Content-Type": "text/plain; charset=utf-8" },
  ),
);

function layout(options: {
  title: string;
  description: string;
  canonicalPath: string;
  bodyHtml: string;
  pageCssClass?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  extraJsonLd?: Array<Record<string, unknown>>;
  ogImageUrl?: string;
  twitterCard?: string;
  adsenseSlots?: Required<AdsenseSlots>;
  adsenseClient: string;
  gaMeasurementId: string;
  stripePublishableKey: string;
  consentRequired: boolean;
  showPrivacyControls: boolean;
  cspNonce: string;
}): string {
  const {
    title,
    description,
    canonicalPath,
    bodyHtml,
    pageCssClass,
    breadcrumbs,
    extraJsonLd,
    ogImageUrl,
    twitterCard,
    adsenseClient,
    gaMeasurementId,
    stripePublishableKey,
    consentRequired,
    showPrivacyControls,
    cspNonce,
  } = options;
  const adsenseSlots = options.adsenseSlots || defaultAdsenseSlots;
  const processedBodyHtml = injectAdSlots(bodyHtml, adsenseSlots, adsenseClient);
  const canonicalUrl = canonicalPath.startsWith("http") ? canonicalPath : `${DOMAIN}${canonicalPath}`;
  const crumbList = breadcrumbs || (canonicalPath !== "/" ? buildBreadcrumbs(canonicalPath) : []);
  const useEjectNav = isWaterEjectRoute(canonicalPath);
  const isGameRoute = canonicalPath.startsWith("/game") || canonicalPath.startsWith("/leak-patrol");
  const resolvedTwitterCard = twitterCard ?? "summary";
  const resolvedOgImage =
    ogImageUrl && ogImageUrl.startsWith("http") ? ogImageUrl : ogImageUrl ? `${DOMAIN}${ogImageUrl}` : null;
  const renderedFooterLinks = (showPrivacyControls
    ? footerLinks
    : footerLinks.filter((link) => link.label !== "Change privacy settings")
  )
    .map((link) => {
      const modalAttr = link.modal ? ` data-modal-target="${link.modal}"` : "";
      const settingsAttr = link.label === "Change privacy settings" ? ` data-consent-open` : "";
      return `<a href="${link.href}"${modalAttr}${settingsAttr}>${link.label}</a>`;
    })
    .join("");
  const consentBanner = showPrivacyControls
    ? `
      <div class="consent-banner" data-consent-banner hidden>
        <div class="consent-copy">
          <strong>Your privacy controls</strong>
          <p class="muted">
            We use cookies for analytics and ads to keep WaterShortcut free. Choose what to allow.
            See <a href="/privacy">privacy details</a>.
          </p>
        </div>
        <div class="consent-options">
          <label><input type="checkbox" data-consent-option="functional" checked disabled /> Functional (required)</label>
          <label><input type="checkbox" data-consent-option="analytics" /> Analytics</label>
          <label><input type="checkbox" data-consent-option="ads" /> Ads</label>
        </div>
        <div class="consent-actions">
          <button class="btn secondary" type="button" data-consent-reject>Reject non-essential</button>
          <button class="btn secondary" type="button" data-consent-save>Save choices</button>
          <button class="btn primary" type="button" data-consent-accept>Accept all</button>
        </div>
      </div>
    `
    : "";
  const badgeLink = `<a class="nav-link nav-badge" href="/water-iq" data-water-iq-badge>Water IQ Challenge</a>`;
  const navLinks = useEjectNav
    ? waterEjectNavLinks
    : [
        {
          label: "Tools & More",
          href: "#tools-dropdown",
          dropdown: true,
        },
      ];
  const toolsDropdown = `
    <div class="nav-dropdown">
      <button type="button" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
        Tools &amp; More <span class="dropdown-caret">▼</span>
      </button>
      <div class="dropdown-panel" id="tools-dropdown">
        ${homeownerDropdownLinks
          .map((link) => `<a class="dropdown-link" href="${link.href}">${link.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
  const modeBar = `
    <div class="mode-bar" role="region" aria-label="Mode switcher">
      <div class="mode-bar__content">
        <span class="mode-bar__label">${escapeHtml(copy.nav.switcherLabel)}</span>
        <div class="mode-bar__actions">
          <a class="${!useEjectNav && !isGameRoute ? "active" : ""}" href="/analyze-water-bill">${escapeHtml(
            copy.nav.homeLabel,
          )}</a>
          <a class="${useEjectNav ? "active" : ""}" href="/blog-how-to-eject.html">${escapeHtml(
            copy.nav.ejectLabel,
          )}</a>
          <a class="${isGameRoute ? "active" : ""}" href="/game">${escapeHtml(
            copy.nav.gameLabel,
          )}</a>
        </div>
        <button type="button" class="mode-bar__close" data-mode-bar-close aria-label="Close mode bar">×</button>
      </div>
    </div>
  `;
  const breadcrumbJson = crumbList.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbList.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${DOMAIN}${crumb.path}`,
        })),
      }
    : null;

  const jsonLd: Array<Record<string, unknown>> = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WaterShortcut',
      url: DOMAIN,
      sameAs: [DOMAIN],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'WaterShortcut',
      url: DOMAIN,
    },
  ];

  if (breadcrumbJson) {
    jsonLd.push(breadcrumbJson);
  }

  const combinedJsonLd = extraJsonLd?.length ? [...jsonLd, ...extraJsonLd] : jsonLd;

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Security-Policy" content="${buildContentSecurityPolicy(cspNonce)}" />
      <title>${escapeHtml(title)}</title>
      <meta name="description" content="${escapeHtml(description)}" />
      <link rel="canonical" href="${canonicalUrl}" />
      <meta name="google-adsense-account" content="${adsenseClient}" />
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(description)}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="website" />
      ${resolvedOgImage ? `<meta property="og:image" content="${escapeHtml(resolvedOgImage)}" />` : ""}
      <meta name="twitter:card" content="${resolvedTwitterCard}" />
      <meta name="twitter:title" content="${escapeHtml(title)}" />
      <meta name="twitter:description" content="${escapeHtml(description)}" />
      ${resolvedOgImage ? `<meta name="twitter:image" content="${escapeHtml(resolvedOgImage)}" />` : ""}
      <link rel="preload" href="/assets/styles.css" as="style" />
      <link rel="stylesheet" href="/assets/styles.css" />
      <script nonce="${cspNonce}" type="application/ld+json">${JSON.stringify(combinedJsonLd)}</script>
      <script nonce="${cspNonce}">
        window.__WS_ADSENSE_CLIENT__ = "${adsenseClient}";
        window.__WS_CONSENT_REQUIRED__ = ${consentRequired ? "true" : "false"};
        window.__WS_SHOW_PRIVACY_CONTROLS__ = ${showPrivacyControls ? "true" : "false"};
        window.__WS_GA_MEASUREMENT_ID__ = "${gaMeasurementId}";
        window.__WS_STRIPE_PUBLISHABLE_KEY__ = "${escapeHtml(stripePublishableKey)}";
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        const privacySignal = Boolean(navigator.globalPrivacyControl) ||
          navigator.doNotTrack === "1" ||
          navigator.doNotTrack === "yes" ||
          (window.doNotTrack === "1");
        const storedConsent = (() => {
          try {
            return JSON.parse(localStorage.getItem("${CONSENT_STORAGE_KEY}") || "null");
          } catch (err) {
            return null;
          }
        })();
        const defaultConsent = (privacySignal || ${consentRequired ? "true" : "false"})
          ? {
              ad_storage: "denied",
              analytics_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
              functionality_storage: "granted",
              security_storage: "granted",
              wait_for_update: 500,
            }
          : {
              ad_storage: "granted",
              analytics_storage: "granted",
              ad_user_data: "granted",
              ad_personalization: "granted",
              functionality_storage: "granted",
              security_storage: "granted",
              wait_for_update: 500,
            };
        gtag("consent", "default", defaultConsent);
        if (storedConsent) {
          gtag("consent", "update", {
            ad_storage: storedConsent.ads ? "granted" : "denied",
            analytics_storage: storedConsent.analytics ? "granted" : "denied",
            ad_user_data: storedConsent.ads ? "granted" : "denied",
            ad_personalization: storedConsent.ads ? "granted" : "denied",
            functionality_storage: "granted",
            security_storage: "granted",
          });
        }
        gtag("js", new Date());
        gtag("config", "${gaMeasurementId}", { anonymize_ip: true, send_page_view: false });
        window.addEventListener("DOMContentLoaded", () => {
          if (!window.__WS_SHOW_PRIVACY_CONTROLS__) {
            document.querySelectorAll("[data-privacy-controls]").forEach((element) => {
              element.remove();
            });
          }
          document.querySelectorAll("[data-mode-bar-close]").forEach((button) => {
            button.addEventListener("click", () => {
              const bar = button.closest(".mode-bar");
              bar?.remove();
            });
          });
        });
      </script>
      <script defer src="/assets/app.js"></script>
    </head>
    <body class="${pageCssClass ? escapeHtml(pageCssClass) : ""}">
      <div class="app-shell">
        <header class="site-header">
          <div class="nav-bar">
            <div class="brand">
              <a href="/">
                <span class="brand-mark">WS</span>
                <span class="brand-text">
                  <span class="brand-name">WaterShortcut</span><span class="brand-dotcom">.com</span>
                  <span class="tagline">${escapeHtml(copy.brand.tagline)}</span>
                </span>
              </a>
            </div>
            <nav class="nav-links" aria-label="Main navigation">
              ${
                useEjectNav
                  ? navLinks
                      .map(
                        (link) =>
                          `<a class="nav-link" href="${link.href}"${
                            link.href === canonicalPath ? ' aria-current="page"' : ""
                          }>${link.label}</a>`,
                      )
                      .join("")
                  : toolsDropdown
              }
              ${badgeLink}
              ${
                useEjectNav
                  ? `<a class="btn primary primary-cta" href="/">Back to save on your water bill</a>`
                  : `<a class="btn primary primary-cta" href="/analyze-water-bill">Analyze</a>`
              }
            </nav>
          </div>
          ${modeBar}
        </header>
        ${crumbList.length ? renderBreadcrumbs(crumbList) : ""}
        <main>${processedBodyHtml}</main>
        <div class="section">
          ${renderAdSlot(adsenseSlots.footer ?? adsenseSlots.inline, {
            slotName: "footer",
            format: "autorelaxed",
            clientId: adsenseClient,
          })}
        </div>
        <footer class="footer">
          <div class="footer-inner">
            <div>
              <div class="footnote">${escapeHtml(copy.footer.estimates)}</div>
              <div class="footnote">${escapeHtml(copy.footer.sources)}</div>
              <div class="footnote">${escapeHtml(copy.footer.help)}</div>
            </div>
            <div class="footer-links">
              ${renderedFooterLinks}
            </div>
          </div>
        </footer>
        <div class="ad-sticky">
          ${renderAdSlot(adsenseSlots.sticky, {
            slotName: "sticky",
            format: "fluid",
            fullWidth: true,
            layoutKey: DEFAULT_ADSENSE_STICKY_LAYOUT_KEY,
            clientId: adsenseClient,
          })}
        </div>
      </div>
      ${renderModals()}
      ${consentBanner}
    </body>
  </html>`;
}

function renderBreadcrumbs(crumbs: Array<{ name: string; path: string }>): string {
  const items = crumbs
    .map((crumb, idx) => {
      const isLast = idx === crumbs.length - 1;
      return isLast
        ? `<span aria-current="page">${escapeHtml(crumb.name)}</span>`
        : `<a href="${crumb.path}">${escapeHtml(crumb.name)}</a>`;
    })
    .join("<span>/</span>");
  return `<div class="section breadcrumbs" aria-label="Breadcrumbs">${items}</div>`;
}

function renderAdsDiagnosticsPage(adsenseClient: string, adsenseSlots: Required<AdsenseSlots>): string {
  return `
    <section class="section">
      <p class="eyebrow">Hidden diagnostics</p>
      <h1>AdSense diagnostics</h1>
      <p class="muted">
        Use this page when ads aren’t showing. It reports script load state, slot dimensions, and initialization timing.
      </p>
      <div class="ads-diagnostics-panel" data-ads-diagnostics>
        <div class="ads-diagnostics-row"><span>Script loaded</span><strong data-ads-script>pending</strong></div>
        <div class="ads-diagnostics-row"><span>adsbygoogle present</span><strong data-adsbygoogle>pending</strong></div>
        <div class="ads-diagnostics-row"><span>Ad slots found</span><strong data-ads-count>0</strong></div>
        <div class="ads-diagnostics-row"><span>Last init</span><strong data-ads-last-init>—</strong></div>
      </div>
    </section>
    <section class="section">
      <h2>Inline slot</h2>
      ${renderAdSlot(adsenseSlots.inline, { slotName: "inline", clientId: adsenseClient })}
    </section>
    <section class="section">
      <h2>Footer slot</h2>
      ${renderAdSlot(adsenseSlots.footer ?? adsenseSlots.inline, {
        slotName: "footer",
        format: "autorelaxed",
        clientId: adsenseClient,
      })}
    </section>
  `;
}

function isWaterEjectRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/blog-how-to-eject") ||
    pathname.startsWith("/blog-is-it-safe") ||
    pathname.startsWith("/water-eject")
  );
}

function buildBreadcrumbs(path: string): Array<{ name: string; path: string }> {
  const parts = path.split("/").filter(Boolean);
  const crumbs: Array<{ name: string; path: string }> = [{ name: "Home", path: "/" }];
  let current = "";
  parts.forEach((part) => {
    current += `/${part}`;
    crumbs.push({
      name: part.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      path: current,
    });
  });
  return crumbs;
}

function renderModals(): string {
  return Object.entries(modalCopy)
    .map(([id, modal]) => {
      const body = modal.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
      const footer = modal.footer ? `<p class="muted">${escapeHtml(modal.footer)}</p>` : "";
      return `<dialog id="${id}" aria-labelledby="${id}-title">
        <div class="modal-inner">
          <h2 id="${id}-title">${escapeHtml(modal.title)}</h2>
          ${body}
          ${footer}
          <div class="modal-actions"><button class="btn secondary" data-close-modal>Close</button></div>
        </div>
      </dialog>`;
    })
    .join("");
}

function section(title: string, content: string): string {
  return `<section class="section"><h2>${escapeHtml(title)}</h2>${content}</section>`;
}

function sourcesList(items: string[]): string {
  const list = items
    .map((src, idx) => `<li>[${idx + 1}] <a href="${src}" rel="noopener" target="_blank">${src}</a></li>`)
    .join("");
  return `<div class="section sources"><strong>Sources</strong><ul class="bullet-list">${list}</ul></div>`;
}

function renderHome(): string {
  return `
    <section class="hero">
      <div>
        <p class="badge">${escapeHtml(copy.brand.tagline)}</p>
        <h1>${escapeHtml(copy.home.title)}</h1>
        <p>${escapeHtml(copy.home.subtitle)}</p>
        <div class="actions">
          <a class="btn primary" href="/analyze-water-bill">${escapeHtml(copy.home.primaryCta)}</a>
          <a class="btn secondary" href="/analyze-water-bill#demo">${escapeHtml(copy.home.secondaryCta)}</a>
          <a class="btn secondary" href="/analyze-water-bill#manual">${escapeHtml(copy.home.tertiaryCta)}</a>
        </div>
      </div>
      <div class="layout-slab">
        <ul class="bullet-list">
          ${copy.home.trustRow.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
    ${section(
      "Pick a shortcut.",
      `<div class="cards">
        <div class="card"><h3>Bill analyzer</h3><p>Turn line items into actions.</p><a class="btn secondary" href="/analyze-water-bill">Open</a></div>
        <div class="card"><h3>Savings plan</h3><p>Answer a few questions. Get a checklist.</p><a class="btn secondary" href="/savings-plan">Start</a></div>
        <div class="card"><h3>Quick calculators</h3><p>See gallons. Then dollars.</p><a class="btn secondary" href="/calculators">Browse</a></div>
      </div>`,
    )}
    ${section(
      "Quick wins (today).",
      `<ul class="bullet-list">
        <li><a href="/leak-check">Fix a sneaky leak</a></li>
        <li><a href="/calculators/shower">Right-size your shower flow</a></li>
        <li><a href="/calculators/outdoor">Water outdoors on purpose</a></li>
      </ul>`,
    )}
    ${section(
      "Built for trust.",
      `<ul class="bullet-list">
        <li>Sources you can click</li>
        <li>Fast on mobile</li>
        <li>No account needed</li>
      </ul>`,
    )}
    ${section(
      "Popular tools.",
      `<div class="grid">
        <a class="inline-list" href="/calculators/shower">Shower calculator</a>
        <a class="inline-list" href="/calculators/toilet">Toilet calculator</a>
        <a class="inline-list" href="/leak-check">Leak check</a>
        <a class="inline-list" href="/rebates">Rebates wizard</a>
        <a class="inline-list" href="/calculators/laundry">Laundry calculator</a>
      </div>`,
    )}
    <section class="section faq">
      <h2>FAQ</h2>
      <div class="faq-item">
        <button type="button">Do I need an account? <span aria-hidden="true">＋</span></button>
        <div class="answer">Nope. Start with a bill or a calculator.</div>
      </div>
      <div class="faq-item">
        <button type="button">Is this official advice? <span aria-hidden="true">＋</span></button>
        <div class="answer">We summarize public guidance and link sources. You decide what to do next.</div>
      </div>
      <div class="faq-item">
        <button type="button">Can you guarantee savings? <span aria-hidden="true">＋</span></button>
        <div class="answer">No. But we can help you find the biggest, easiest opportunities.</div>
      </div>
    </section>
  `;
}

function renderBillAnalyzer(): string {
  return `
    <section class="hero">
      <div>
        <h1>${escapeHtml(copy.analyze.title)}</h1>
        <p>${escapeHtml(copy.analyze.subtitle)}</p>
        <div class="actions">
          <a class="btn primary" href="#bill-form">${escapeHtml(copy.analyze.uploadActive)}</a>
          <a class="btn secondary" href="#demo">${escapeHtml(copy.analyze.uploadAltDemo)}</a>
          <a class="btn secondary" href="#manual">${escapeHtml(copy.analyze.uploadAltManual)}</a>
        </div>
      </div>
      <div class="layout-slab">
        <div class="wizard-steps">
          <div class="step-pill active">Uploading</div>
          <div class="step-pill">Reading</div>
          <div class="step-pill">Building plan</div>
        </div>
        <p class="muted">${escapeHtml(copy.analyze.progressNote)}</p>
      </div>
    </section>
    <section class="section layout-slab">
      <h2>${escapeHtml(copy.analyze.uploadLabel)}</h2>
      <p class="muted">${escapeHtml(copy.analyze.uploadHelper)}</p>
      <p class="muted">${escapeHtml(copy.analyze.uploadConstraints)}</p>
      <div class="trust-capsule">
        <ul class="bullet-list">
          ${copy.analyze.trustCapsule.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <form id="bill-form" aria-label="Upload water bill">
        <div class="form-row">
          <label for="bill-file">${escapeHtml(copy.analyze.uploadIdle)}</label>
          <input id="bill-file" type="file" name="file" accept="application/pdf" />
        </div>
        <div class="wizard-actions">
          <button class="btn primary" type="submit">${escapeHtml(copy.analyze.uploadActive)}</button>
          <a class="btn secondary" href="#manual">${escapeHtml(copy.analyze.uploadAltManual)}</a>
        </div>
      </form>
      <div id="bill-status" class="callout" aria-live="polite"></div>
      <div class="inline-list">
        <a class="btn secondary" id="demo" href="#demo">${escapeHtml(copy.analyze.uploadAltDemo)}</a>
        <a class="btn secondary" href="/guides/water-bill">See bill basics</a>
      </div>
    </section>
    <section class="section layout-slab" id="demo">
      <h2>Try a demo</h2>
      <p class="muted">See a sample plan before you upload anything.</p>
      <div class="wizard-actions">
        <button class="btn secondary" type="button" data-demo-run>Run demo</button>
      </div>
      <div class="demo-output" data-demo-output></div>
    </section>
    <section class="section layout-slab" id="manual">
      <h2>Manual entry</h2>
      <p class="muted">Manual entry is less precise, but gets you a plan without uploads.</p>
      <form id="manual-form" aria-label="Manual bill entry">
        <div class="form-inline">
          <div class="form-row"><label>Billing period (optional)</label><input name="period" type="text" placeholder="e.g., Aug 1–31" /></div>
          <div class="form-row"><label>Total usage</label><input name="usage" type="number" step="0.1" placeholder="e.g., 8" /></div>
          <div class="form-row"><label>Unit</label><select name="unit"><option>Gallons</option><option>CCF</option><option>HCF</option></select></div>
          <div class="form-row"><label>Total cost</label><input name="cost" type="number" step="0.01" placeholder="e.g., 86" /></div>
          <div class="form-row"><label>Water rate (optional)</label><input name="rate" type="number" step="0.01" placeholder="Use $6 per 1,000 gallons if unsure" /></div>
          <div class="form-row"><label>Household size (optional)</label><input name="household" type="number" min="1" max="10" /></div>
        </div>
        <div class="form-row"><label>Notes (optional)</label><textarea name="notes" rows="3"></textarea></div>
        <div class="wizard-actions"><button class="btn primary" type="submit">Build my plan</button></div>
      </form>
      <div class="manual-output" data-manual-output></div>
    </section>
    ${section(
      copy.analyze.results.topMoves,
      `<p class="muted">${escapeHtml(copy.analyze.results.empty)}</p>${INLINE_AD_MARKER}`,
    )}
    ${section(
      copy.analyze.results.payingFor,
      `<p class="muted">Usage, tiers, sewer, and fees broken down in plain language.</p>`,
    )}
    ${section(
      copy.analyze.results.nextStep,
      `<div class="inline-list"><a class="btn secondary" href="/savings-plan">Build a savings plan</a><a class="btn secondary" href="/calculators">Try a 2‑minute calculator</a></div>`,
    )}
    <section class="section">
      <p class="muted">Estimates only. Always follow local rules and manufacturer instructions.</p>
    </section>
  `;
}

function renderProviderFinder(): string {
  return `
    <section class="hero">
      <div>
        <h1>Find your water provider.</h1>
        <p>We’ll point you to the official portal.</p>
        <p class="muted">Double-check the domain before paying. We can’t verify every utility link.</p>
      </div>
    </section>
    <section class="section layout-slab">
      <form id="provider-form" aria-label="Find provider">
        <div class="form-row">
          <label for="location-input">City / area</label>
          <input id="location-input" name="location" placeholder="e.g., “Atlanta, GA” or “Berlin”" />
        </div>
        <button class="btn primary" type="submit">Find it</button>
      </form>
      <p class="muted">We can’t verify every utility link. Double-check the domain before paying.</p>
      <div id="provider-result" class="callout" aria-live="polite"></div>
    </section>
  `;
}

function renderSavingsPlan(): string {
  return `
    <section class="hero">
      <div>
        <h1>Your WaterShortcut plan.</h1>
        <p>A few answers → fewer wasted gallons.</p>
      </div>
    </section>
    <section class="section layout-slab wizard" data-wizard="savings">
      <div class="wizard-steps">
        <div class="step-pill active" data-step="1">1/4 Basics</div>
        <div class="step-pill" data-step="2">2/4 Habits</div>
        <div class="step-pill" data-step="3">3/4 Upgrades</div>
        <div class="step-pill" data-step="4">4/4 Your plan</div>
      </div>
      <div class="wizard-step active" data-step="1" data-step-index="1">
        <h3>Basics</h3>
        <p>Pick where you want the biggest wins first. You can change this later.</p>
        <div class="inline-list">
          <label class="tag"><input type="radio" name="focus-area" value="Indoor" /> Indoor</label>
          <label class="tag"><input type="radio" name="focus-area" value="Outdoor" /> Outdoor</label>
          <label class="tag"><input type="radio" name="focus-area" value="Both" checked /> Both</label>
        </div>
        <div class="form-inline">
          <div class="form-row"><label>Household size (1–10)</label><input id="household-size" type="number" min="1" max="10" value="2" /></div>
          <div class="form-row"><label>Home type</label><select id="home-type"><option>House</option><option>Apartment</option><option>Condo</option></select></div>
        </div>
        <div class="wizard-actions"><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="2" data-step-index="2">
        <h3>Habits</h3>
        <p>Best guess is perfect. Leave blanks if you’re not sure.</p>
        <div class="form-inline">
          <div class="form-row"><label>Showers per day</label><input id="showers-per-day" type="number" value="2" /></div>
          <div class="form-row"><label>Minutes per shower</label><input id="minutes-per-shower" type="number" value="8" /></div>
          <div class="form-row"><label>Laundry loads per week</label><input id="laundry-loads" type="number" value="5" /></div>
          <div class="form-row"><label>Water rate (optional)</label><input id="water-rate" type="number" step="0.01" placeholder="Use $6 per 1,000 gallons if unsure" /><p class="muted">Find it on your bill as “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons”.</p></div>
        </div>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="3" data-step-index="3">
        <h3>Upgrades</h3>
        <p>What are you open to?</p>
        <div class="bullet-list">
          <label><input type="checkbox" name="upgrade" value="showerhead" checked /> WaterSense showerhead — <span class="muted">Small swap. Daily impact.</span></label>
          <label><input type="checkbox" name="upgrade" value="faucet" checked /> Faucet aerators — <span class="muted">Cheap hardware. Fast win.</span></label>
          <label><input type="checkbox" name="upgrade" value="toilet-fix" /> Toilet fix (flapper/leak) — <span class="muted">Most common silent waste.</span></label>
          <label><input type="checkbox" name="upgrade" value="washer" /> High-efficiency washer — <span class="muted">Savings over years.</span></label>
          <label><input type="checkbox" name="upgrade" value="outdoor" /> Smarter outdoor watering — <span class="muted">Less waste. Healthier plants.</span></label>
        </div>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button><button class="btn primary" data-action="next">Build my plan</button></div>
      </div>
      <div class="wizard-step" data-step="4" data-step-index="4">
        <h3>Your plan</h3>
        <div class="plan-output"></div>
        <p class="muted">Estimates only. Your rates and usage vary.</p>
        <div class="wizard-actions">
          <button class="btn secondary" data-action="back">Back</button>
          <button class="btn secondary" data-copy-plan>Copy my plan</button>
          <button class="btn secondary" data-print-plan>Download PDF</button>
        </div>
      </div>
    </section>
  `;
}

function renderWaterIq(): string {
  return `
    <section class="section water-iq">
      <div class="water-iq-card" data-water-iq-root>
        <noscript>
          <h1 class="wsH1">Water IQ Challenge</h1>
          <p class="wsP">This quiz needs JavaScript to run. Please enable it and reload.</p>
          <a class="wsBtnPrimary" href="/water-iq">Reload</a>
        </noscript>
      </div>
    </section>
  `;
}

function renderWaterIqResult(input: {
  token: string;
  persona: { code: string; name: string; emoji: string; tagline: string };
  score: number;
  badge: string;
  delta: number;
  hook: { short: string; sources: { label: string; url: string }[] };
  moves: Array<{ id: string; title: string; href: string }>;
}): string {
  const { token, persona, score, badge, delta, hook, moves } = input;
  const movesHtml = moves
    .map(
      (m) => `
        <a class="wsResultMove" data-water-iq-cta="${escapeHtml(m.id)}" href="${escapeHtml(m.href)}">
          <strong>${escapeHtml(m.title)}</strong>
          <span>Tap to open in WaterShortcut.</span>
        </a>`,
    )
    .join("");

  const badgeLabel = badge.replace(/_/g, " ");
  return `
    <section class="section water-iq">
      <div class="water-iq-card water-iq-card--result" data-water-iq-result data-token="${escapeHtml(token)}" data-persona="${escapeHtml(
    persona.code ?? "CS",
  )}" data-score="${score}" data-badge="${escapeHtml(badge)}" data-delta="${delta}">
        <div class="water-iq-result-header">
          <h1 class="water-iq-title">Water IQ Challenge</h1>
          <span class="water-iq-ellipsis" aria-hidden="true">•••</span>
        </div>
        <div class="water-iq-divider" role="presentation"></div>
        <div class="water-iq-result-meta">
          <div class="water-iq-score-circle" aria-label="Score">
            <div class="water-iq-score-value">${score}<span>/10</span></div>
          </div>
          <div class="water-iq-result-copy">
            <div class="water-iq-badge-pill">
              <span class="water-iq-badge-icon" aria-hidden="true">💧</span>
              ${escapeHtml(badgeLabel)}
            </div>
            <div class="water-iq-fact">${escapeHtml(hook.short)}</div>
          </div>
        </div>

        <div class="wsExplain">
          <div style="font-weight:750;margin-bottom:6px;">Your learning delta</div>
          <div class="wsMuted" data-water-iq-delta>Knowledge delta: ${delta >= 0 ? "+" : ""}${delta}</div>
          <div class="wsMuted" style="margin-top:6px;font-size:12px;">
            We repeat two questions to measure whether the Impact Reveal changes intuition.
          </div>
        </div>

        <h2 class="wsH2">Your next best steps</h2>
        <div class="wsResultMoves">${movesHtml}</div>
        <div class="wsExplain">
          <div style="font-weight:750;margin-bottom:6px;">Completed a big step?</div>
          <p class="wsMuted">Claim 1 WaterShortcut credit for each top action you finish.</p>
          <div class="wsRow">
            ${moves
              .map(
                (m) =>
                  `<button class="wsBtnGhost" data-water-iq-reward="${escapeHtml(m.id)}">Mark ${escapeHtml(
                    m.title,
                  )} done (+1 credit)</button>`,
              )
              .join("")}
          </div>
          <div class="wsMuted" data-water-iq-reward-status></div>
        </div>

        <div class="wsExplain">
          <div style="font-weight:750;margin-bottom:6px;">Social proof (transparent)</div>
          <div data-water-iq-social class="wsMuted">Loading social proof…</div>
          <button class="wsBtnGhost" data-water-iq-share-proof style="margin-top:8px;">Share social proof</button>
          <div class="wsMuted" style="margin-top:8px;font-size:12px;">
            Note: In constrained contexts, social norms can land differently. See <a class="wsLink" href="https://www.sciencedirect.com/science/article/pii/S0095069623000700" target="_blank" rel="noreferrer">Brick et al. (2023)</a>.
          </div>
        </div>

        <div class="wsExplain">
          <div style="font-weight:750;margin-bottom:6px;">Beat your city average (optional)</div>
          <div class="wsRow" style="margin-top:0;">
            <input class="wsNum" data-water-iq-city placeholder="Enter your city" />
            <button class="wsBtnPrimary" data-water-iq-city-submit>Compare</button>
          </div>
          <div class="wsMuted" data-water-iq-city-result>City averages appear once enough people in your city participate.</div>
        </div>

        <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.10);">
          <h3 style="margin:0 0 8px;">Make it viral (in a good way)</h3>
          <p class="wsMuted" style="margin:0 0 10px;">Post your score. Tag 3 friends. Beat your city average.</p>
          <div class="wsRow">
            <button class="wsBtnPrimary wsBtnPrimary--pill" data-water-iq-share>Challenge 3 friends</button>
            <button class="wsBtnGhost" data-water-iq-challenge>Copy challenge link</button>
            <a class="wsBtnGhost" href="/water-iq">Take again</a>
          </div>
          <div class="wsMuted" style="margin-top:10px;font-size:12px;">Private by default — you choose if you share.</div>
        </div>

        <div class="wsExplain">
          <div style="font-weight:750;margin-bottom:6px;">Optional follow-up (7–21 days)</div>
          <div class="wsMuted" style="margin-bottom:8px;">If you opt in, we’ll send one check-in email. No spam.</div>
          <form data-water-iq-followup>
            <div class="wsRow" style="margin-top:0;">
              <input class="wsNum" name="email" placeholder="Email address" />
              <select class="wsNum" name="days">
                <option value="7">7-day check-in</option>
                <option value="21">21-day check-in</option>
              </select>
              <button class="wsBtnPrimary" type="submit">Schedule</button>
            </div>
            <label class="wsRow" style="gap:8px;">
              <input type="checkbox" name="consent" />
              <span class="wsMuted">I consent to receive one check-in email about my pledge.</span>
            </label>
          </form>
          <div class="wsMuted" data-water-iq-followup-status></div>
        </div>

        <div class="wsFoot"><span>We celebrate improvement.</span><span>Private by default.</span></div>
      </div>
    </section>
  `;
}

function renderCalculatorsHub(): string {
  return `
    <section class="hero">
      <div>
        <h1>Fast calculators.</h1>
        <p>See gallons. Then decide.</p>
      </div>
    </section>
    ${section(
      "Pick a tool",
      `<div class="cards">
        <div class="card"><h3>Shower</h3><p>Flow swaps and shorter showers.</p><a class="btn secondary" href="/calculators/shower">Open</a></div>
        <div class="card"><h3>Faucet</h3><p>Aerators and habits.</p><a class="btn secondary" href="/calculators/faucet">Open</a></div>
        <div class="card"><h3>Toilet</h3><p>Upgrades and leaks.</p><a class="btn secondary" href="/calculators/toilet">Open</a></div>
        <div class="card"><h3>Laundry</h3><p>ENERGY STAR vs standard.</p><a class="btn secondary" href="/calculators/laundry">Open</a></div>
        <div class="card"><h3>Outdoor</h3><p>Watering guidance.</p><a class="btn secondary" href="/calculators/outdoor">Open</a></div>
        <div class="card"><h3>Leak check</h3><p>Chase drips fast.</p><a class="btn secondary" href="/leak-check">Open</a></div>
      </div>`,
    )}
  `;
}

function calculatorForm(title: string, subtitle: string, formHtml: string, resultSources: string[]): string {
  return `
    <section class="hero">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
    </section>
    <section class="section layout-slab">
      <form data-calc="${title.toLowerCase().split(" ")[0]}">${formHtml}</form>
      <p class="muted">Results update instantly as you type.</p>
      <h2>Your estimate</h2>
      <div class="calc-result" aria-live="polite"></div>
    </section>
    ${sourcesList(resultSources)}
  `;
}

function renderShowerCalculator(): string {
  const form = `
    <div class="form-inline">
      <div class="form-row"><label>Current flow (gpm)</label><input name="current-flow" type="number" step="0.1" value="2.5" /></div>
      <div class="form-row"><label>New flow (gpm)</label><input name="new-flow" type="number" step="0.1" value="2.0" /></div>
      <div class="form-row"><label>Minutes per shower</label><input name="minutes" type="number" value="8" /></div>
      <div class="form-row"><label>Showers per day</label><input name="showers" type="number" value="1" /></div>
      <div class="form-row"><label>People</label><input name="people" type="number" value="2" /></div>
      <div class="form-row"><label>Rate ($ per 1,000 gallons)</label><input name="rate" type="number" step="0.01" placeholder="Use $6 if you’re unsure" /><p class="muted">Don’t know your rate? Use $6 per 1,000 gallons (rough placeholder) and adjust later.</p></div>
    </div>
    <details class="help-accordion">
      <summary>Not sure what to enter?</summary>
      <div class="muted">
        <p><strong>How to find your rate:</strong> Look for “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons” on your bill.</p>
        <p><strong>How to estimate flow:</strong> Run a 1-gallon bucket test for 30 seconds and double it to get gpm.</p>
      </div>
    </details>
    <label class="tag"><input type="checkbox" name="show-bath" /> Show bathtub equivalent</label>
    <p class="muted">WaterSense showerheads are ≤2.0 gpm [1]. Standard showerheads are 2.5 gpm [1].</p>
    <div class="wizard-actions"><button class="btn primary" type="submit">Run estimate</button></div>
  `;
  return calculatorForm("Shower savings.", "Same shower. Less flow.", form, [
    "https://www.epa.gov/watersense/showerheads",
  ]);
}

function renderFaucetCalculator(): string {
  const form = `
    <div class="form-inline">
      <div class="form-row"><label>Current flow (gpm)</label><input name="current-flow" type="number" step="0.1" value="2.2" /></div>
      <div class="form-row"><label>New flow (gpm)</label><input name="new-flow" type="number" step="0.1" value="1.5" /></div>
      <div class="form-row"><label>Minutes per person per day</label><input name="minutes" type="number" value="5" /></div>
      <div class="form-row"><label>People</label><input name="people" type="number" value="2" /></div>
      <div class="form-row"><label>Rate ($ per 1,000 gallons)</label><input name="rate" type="number" step="0.01" placeholder="Use $6 if you’re unsure" /><p class="muted">Don’t know your rate? Use $6 per 1,000 gallons (rough placeholder) and adjust later.</p></div>
    </div>
    <details class="help-accordion">
      <summary>Not sure what to enter?</summary>
      <div class="muted">
        <p><strong>How to find your rate:</strong> Look for “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons” on your bill.</p>
        <p><strong>How to estimate flow:</strong> Use a bucket test or check the aerator packaging for gpm.</p>
      </div>
    </details>
    <label class="tag"><input type="checkbox" name="show-bath" /> Show bathtub equivalent</label>
    <p class="muted">WaterSense bathroom faucets target 1.5 gpm [1].</p>
    <div class="wizard-actions"><button class="btn primary" type="submit">Run estimate</button></div>
  `;
  return calculatorForm("Faucet savings.", "Small hardware. Big habit.", form, [
    "https://www.epa.gov/watersense/bathroom-faucets",
  ]);
}

function renderToiletCalculator(): string {
  const form = `
    <div class="form-inline">
      <div class="form-row"><label>Toilets count</label><input name="toilets" type="number" value="2" /></div>
      <div class="form-row"><label>Current gallons/flush (gpf)</label><select name="current-gpf"><option value="3.5">3.5</option><option value="1.6" selected>1.6</option><option value="1.28">1.28</option></select></div>
      <div class="form-row"><label>New gpf</label><input name="new-gpf" type="number" step="0.01" value="1.28" /></div>
      <div class="form-row"><label>Flushes per person per day</label><input name="flushes" type="number" value="5" /></div>
      <div class="form-row"><label>People</label><input name="people" type="number" value="2" /></div>
      <div class="form-row"><label>Rate ($ per 1,000 gallons)</label><input name="rate" type="number" step="0.01" placeholder="Use $6 if you’re unsure" /><p class="muted">Don’t know your rate? Use $6 per 1,000 gallons (rough placeholder) and adjust later.</p></div>
      <div class="form-row"><label><input type="checkbox" name="leak" /> Also suspect a leak (running toilet)</label><p class="muted">If checked, head to the leak check.</p></div>
    </div>
    <details class="help-accordion">
      <summary>Not sure what to enter?</summary>
      <div class="muted">
        <p><strong>How to find your rate:</strong> Look for “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons” on your bill.</p>
        <p><strong>How to estimate flow:</strong> Check inside the tank lid for gpf or look up your model.</p>
      </div>
    </details>
    <label class="tag"><input type="checkbox" name="show-bath" /> Show bathtub equivalent</label>
    <p class="muted">WaterSense toilets are 1.28 gpf or less [1]. A drip per second wastes 3,000+ gallons/year [2].</p>
    <div class="wizard-actions"><button class="btn primary" type="submit">Run estimate</button><a class="btn secondary" href="/leak-check">Check for leaks</a></div>
  `;
  return calculatorForm("Toilet savings.", "One swap. Years of savings.", form, [
    "https://www.epa.gov/watersense/residential-toilets",
    "https://www.epa.gov/watersense/fix-leak-week",
  ]);
}

function renderLaundryCalculator(): string {
  const form = `
    <div class="form-inline">
      <div class="form-row"><label>Loads per week</label><input name="loads" type="number" value="5" /></div>
      <div class="form-row"><label>Washer type</label><select name="washer"><option>Standard</option><option>ENERGY STAR</option></select></div>
      <div class="form-row"><label>Rate ($ per 1,000 gallons)</label><input name="rate" type="number" step="0.01" placeholder="Use $6 if you’re unsure" /><p class="muted">Don’t know your rate? Use $6 per 1,000 gallons (rough placeholder) and adjust later.</p></div>
    </div>
    <details class="help-accordion">
      <summary>Not sure what to enter?</summary>
      <div class="muted">
        <p><strong>How to find your rate:</strong> Look for “unit cost”, “rate”, “$/CCF”, or “$/1,000 gallons” on your bill.</p>
      </div>
    </details>
    <label class="tag"><input type="checkbox" name="show-bath" /> Show bathtub equivalent</label>
    <p class="muted">ENERGY STAR washers use about 30% less water. [1]</p>
    <div class="wizard-actions"><button class="btn primary" type="submit">Run estimate</button></div>
  `;
  return calculatorForm("Laundry savings.", "Clean clothes. Less water.", form, [
    "https://www.energystar.gov/products/clothes_washers",
  ]);
}

function renderOutdoorCalculator(): string {
  return `
    <section class="hero">
      <div>
        <h1>Outdoor savings.</h1>
        <p>Water roots, not sidewalks.</p>
      </div>
    </section>
    <section class="section layout-slab wizard" data-wizard="outdoor">
      <div class="wizard-steps">
        <div class="step-pill active" data-step="1">1/3 Your setup</div>
        <div class="step-pill" data-step="2">2/3 Your schedule</div>
        <div class="step-pill" data-step="3">3/3 Tighten it</div>
      </div>
      <div class="wizard-step active" data-step="1" data-step-index="1">
        <h3>Your setup</h3>
        <div class="form-row"><label>Watering method</label><select><option>Sprinklers</option><option>Hose</option><option>Drip</option></select></div>
        <div class="form-row"><label>Zones or areas</label><input type="number" value="3" /></div>
        <div class="wizard-actions"><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="2" data-step-index="2">
        <h3>Your schedule</h3>
        <div class="form-row"><label>Days per week</label><input type="number" value="2" /></div>
        <div class="form-row"><label>Minutes per day</label><input type="number" value="10" /></div>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="3" data-step-index="3">
        <h3>Tighten it</h3>
        <p>Try: 2 days/week × 10 minutes. Watch: puddles, runoff, fungus.</p>
        <div class="callout">
          <strong>Smart upgrade</strong>
          A WaterSense labeled irrigation controller can save an average home up to 15,000 gallons/year. [1]
        </div>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button></div>
      </div>
    </section>
    ${sourcesList(["https://www.epa.gov/watersense/about-watersense"])}
  `;
}

function renderLeakCheck(): string {
  return `
    <section class="hero">
      <div>
        <h1>Find leaks fast.</h1>
        <p>Chase drips before they chase dollars.</p>
      </div>
    </section>
    <section class="section layout-slab wizard" data-wizard="leak">
      <div class="wizard-steps">
        <div class="step-pill active" data-step="1">1/3 What changed?</div>
        <div class="step-pill" data-step="2">2/3 Quick checks</div>
        <div class="step-pill" data-step="3">3/3 Your next steps</div>
      </div>
      <div class="wizard-step active" data-step="1" data-step-index="1">
        <h3>What changed?</h3>
        <div class="bullet-list">
          <label><input type="radio" name="leak-trigger" /> My bill jumped</label>
          <label><input type="radio" name="leak-trigger" /> I hear running water</label>
          <label><input type="radio" name="leak-trigger" /> I see wet spots</label>
          <label><input type="radio" name="leak-trigger" /> I’m just checking</label>
        </div>
        <div class="wizard-actions"><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="2" data-step-index="2">
        <h3>Quick checks</h3>
        <p>Start with the fastest, highest-odds checks.</p>
        <div class="faq">
          <div class="faq-item">
            <button type="button">Toilet dye test <span aria-hidden="true">＋</span></button>
            <div class="answer">
              <ol>
                <li>Add a few drops of food coloring to the tank.</li>
                <li>Wait 10 minutes without flushing.</li>
                <li>Color in the bowl = leaking flapper.</li>
              </ol>
            </div>
          </div>
          <div class="faq-item">
            <button type="button">Check faucet drips <span aria-hidden="true">＋</span></button>
            <div class="answer">
              <ol>
                <li>Dry the sink and watch for steady drips.</li>
                <li>Check under the cabinet for moisture.</li>
                <li>Tighten aerators or replace washers.</li>
              </ol>
            </div>
          </div>
          <div class="faq-item">
            <button type="button">Check showerhead drips <span aria-hidden="true">＋</span></button>
            <div class="answer">
              <ol>
                <li>Turn the shower off fully.</li>
                <li>Watch for a steady drip.</li>
                <li>Re-seat or replace the cartridge.</li>
              </ol>
            </div>
          </div>
          <div class="faq-item">
            <button type="button">Check irrigation leaks <span aria-hidden="true">＋</span></button>
            <div class="answer">
              <ol>
                <li>Run one zone for 2–3 minutes.</li>
                <li>Look for pooling or misting heads.</li>
                <li>Adjust heads or repair cracked lines.</li>
              </ol>
            </div>
          </div>
        </div>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button><button class="btn primary" data-action="next">Next</button></div>
      </div>
      <div class="wizard-step" data-step="3" data-step-index="3">
        <h3>Your next steps</h3>
        <div class="bullet-list">
          <li>Most likely: toilet flapper</li>
          <li>Next: faucet aerator / washer</li>
          <li>Also: irrigation line</li>
        </div>
        <p>A drip per second can waste 3,000+ gallons/year. [1]</p>
        <p>Household leaks can waste thousands of gallons/year. [2]</p>
        <p class="muted">If you rent: take a photo/video and notify your landlord or property manager.</p>
        <div class="wizard-actions"><button class="btn secondary" data-action="back">Back</button><a class="btn primary" href="/calculators/toilet">Run the toilet calculator</a></div>
      </div>
    </section>
    ${sourcesList([
      "https://www.epa.gov/watersense/fix-leak-week",
      "https://www.epa.gov/watersense/statistics-and-facts",
    ])}
  `;
}

function renderRebatesWizard(): string {
  return `
    <section class="hero">
      <div>
        <h1>Find rebates.</h1>
        <p>Get instant, AI-researched rebate leads for your utility.</p>
        <p class="muted">Programs change—verify details on official sites.</p>
      </div>
    </section>
    <section class="section layout-slab" id="rebate-tool">
      <form id="rebate-form">
        <div class="form-inline">
          <div class="form-row">
            <label>ZIP code</label>
            <input type="text" name="zip" placeholder="e.g., 78701" required />
          </div>
          <div class="form-row">
            <label>City (optional)</label>
            <input type="text" name="city" placeholder="Austin" />
          </div>
          <div class="form-row">
            <label>State (optional)</label>
            <input type="text" name="state" placeholder="TX" />
          </div>
          <div class="form-row">
            <label>Utility provider (optional)</label>
            <input type="text" name="utility" placeholder="Austin Water" />
          </div>
        </div>
        <div class="form-row">
          <label>Upgrades to check</label>
          <div class="chip-list">
            <label class="tag"><input type="checkbox" name="upgrade" value="WaterSense toilet" checked /> WaterSense toilet</label>
            <label class="tag"><input type="checkbox" name="upgrade" value="WaterSense showerhead" /> WaterSense showerhead</label>
            <label class="tag"><input type="checkbox" name="upgrade" value="Faucet aerators" /> Faucet aerators</label>
            <label class="tag"><input type="checkbox" name="upgrade" value="Smart irrigation controller" /> Smart irrigation controller</label>
            <label class="tag"><input type="checkbox" name="upgrade" value="Leak detector" /> Leak detector</label>
            <label class="tag"><input type="checkbox" name="upgrade" value="High-efficiency washer" /> High-efficiency washer</label>
          </div>
        </div>
        <div class="wizard-actions">
          <button class="btn primary" type="submit">Find rebates</button>
        </div>
      </form>
      <p class="muted" id="rebate-status">Enter your ZIP to see local rebate programs.</p>
      <div id="rebate-results" class="cards"></div>
      <p class="muted">Programs change—verify details on official sites before you apply.</p>
    </section>
    ${sourcesList([
      "https://lookforwatersense.epa.gov/Rebate-Finder.html",
      "https://www.energystar.gov/rebate-finder",
    ])}
  `;
}

function renderGuidesHub(): string {
  return `
    <section class="hero">
      <div>
        <h1>Guides, not guilt.</h1>
        <p>Short reads. Practical fixes.</p>
      </div>
    </section>
    ${section(
      "Topics",
      `<div class="cards">
        <div class="card"><h3>Showerheads</h3><p>What to buy and why.</p><a class="btn secondary" href="/guides/showerheads">Read</a></div>
        <div class="card"><h3>Find & fix leaks</h3><p>Stop silent waste.</p><a class="btn secondary" href="/guides/find-fix-leaks">Read</a></div>
        <div class="card"><h3>Toilets</h3><p>Fix or replace.</p><a class="btn secondary" href="/guides/toilets">Read</a></div>
        <div class="card"><h3>Water bill basics</h3><p>Know the charges.</p><a class="btn secondary" href="/guides/water-bill">Read</a></div>
        <div class="card"><h3>Outdoor watering</h3><p>Less waste outdoors.</p><a class="btn secondary" href="/guides/outdoor-watering">Read</a></div>
      </div>`,
    )}
  `;
}

function guideLayout(title: string, subtitle: string, sectionsHtml: string, sources: string[]): string {
  return `
    <section class="hero">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
    </section>
    ${sectionsHtml}
    ${sourcesList(sources)}
  `;
}

function renderGuideShowerheads(): string {
  const sections = `
    ${section("What to buy", `<p>Look for WaterSense. [1]</p><p class="muted">If you’re unsure, start with one bathroom and compare.</p>`)}
    ${section("What to expect", `<p>Standard is 2.5 gpm. WaterSense is ≤2.0 gpm. [1]</p>`)}
    ${section("Do it today", `<p>Pick a model → install → rerun the calculator.</p><a class="btn secondary" href="/calculators/shower">Open calculator</a>`)}
    <section class="section faq">
      <h2>FAQ</h2>
      <div class="faq-item"><button type="button">Will it feel weaker? <span aria-hidden="true">＋</span></button><div class="answer">WaterSense models must meet performance criteria. [1]</div></div>
      <div class="faq-item"><button type="button">How much can I save? <span aria-hidden="true">＋</span></button><div class="answer">Use the calculator. Your minutes matter most.</div></div>
    </section>
  `;
  return guideLayout("Shower better.", "A small swap that pays back.", sections, [
    "https://www.epa.gov/watersense/showerheads",
  ]);
}

function renderGuideLeaks(): string {
  const sections = `
    ${section("The 10‑minute checks", `<ul class="bullet-list"><li>Toilet dye test</li><li>Meter check (if you have access)</li><li>Irrigation walk</li></ul>`)}
    ${section("The common culprits", `<ul class="bullet-list"><li>Flappers</li><li>Washers/gaskets</li><li>Sprinkler heads</li></ul>`)}
    ${section("Why hurry?", `<div class="callout">A drip per second can waste 3,000+ gallons/year. [1]</div>`)}
    ${section("Act now", `<a class="btn secondary" href="/leak-check">Take the leak check</a>`)}
  `;
  return guideLayout("Stop silent waste.", "Leaks hide. Bills don’t.", sections, [
    "https://www.epa.gov/watersense/fix-leak-week",
  ]);
}

function renderGuideToilets(): string {
  const sections = `
    ${section("Fix first", `<p>Most running toilets are a flapper problem.</p><p class="muted">A running toilet is often the #1 silent indoor leak.</p><a class="btn secondary" href="/leak-check">Check leaks</a>`)}
    ${section("Upgrade when it’s time", `<p>Look for WaterSense. [1]</p>`)}
    ${section("Plan the swap", `<a class="btn secondary" href="/calculators/toilet">Run the toilet calculator</a>`)}
  `;
  return guideLayout("Toilets: fix or replace.", "The biggest indoor saver.", sections, [
    "https://www.epa.gov/watersense/residential-toilets",
  ]);
}

function renderGuideWaterBill(): string {
  const sections = `
    ${section("Start with usage", `<p>Bills may show gallons, CCF, or HCF. [1]</p><p class="muted">If you only learn one thing: find your usage unit + rate.</p>`)}
    ${section("Find your rate", `<p>Look for $/unit or a tier table. [1]</p>`)}
    ${section("Sewer is often tied to water", `<p>Check your bill’s sewer line item.</p>`)}
    ${section("Next", `<a class="btn secondary" href="/analyze-water-bill">Analyze a bill PDF</a>`)}
  `;
  return guideLayout("Read your bill.", "Know what you’re paying for.", sections, [
    "https://www.epa.gov/watersense/understanding-your-water-bill",
  ]);
}

function renderGuideOutdoor(): string {
  const sections = `
    ${section("Spot waste", `<ul class="bullet-list"><li>Runoff</li><li>Puddles</li><li>Water on pavement</li></ul><p class="muted">Water early, watch runoff, and adjust week to week.</p>`)}
    ${section("Try a smarter controller", `<p>A WaterSense controller can save up to 15,000 gallons/year. [1]</p>`)}
    ${section("Act now", `<a class="btn secondary" href="/calculators/outdoor">Use the outdoor tool</a>`)}
  `;
  return guideLayout("Water outdoors with intent.", "Less waste. Healthier plants.", sections, [
    "https://www.epa.gov/watersense/about-watersense",
  ]);
}

function blogLayout(title: string, intro: string, sectionsHtml: string): string {
  return `
    <div class="blog-shell">
      <article class="blog-article">
        <header class="blog-header">
          <p class="eyebrow">Water Eject Shortcut</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="lead">${escapeHtml(intro)}</p>
        </header>
        ${sectionsHtml}
        <footer class="blog-footer">
          <a class="btn primary" href="/">Download Water Eject Shortcut Now</a>
        </footer>
      </article>
    </div>
  `;
}

function renderBlogHowToEject(): string {
  const sections = `
    <section class="blog-section">
      <h2>The safe way to clear a wet speaker</h2>
      <p>Dropped your iPhone in the sink? Spilled a glass of water on your nightstand? If your audio sounds muffled or crackly, water is likely trapped in the speaker grille. Before you panic or reach for a bag of rice (don't do that!), there is a faster, smarter solution: The Water Eject Shortcut.</p>
    </section>
    <section class="blog-section">
      <h2>What is the Water Eject Shortcut?</h2>
      <p>The Water Eject shortcut is a third-party iOS automation that mimics the "Water Lock" feature found on the Apple Watch. It works by playing a specific low-frequency tone (approximately 165Hz) at high volume. This sound wave creates intense vibrations inside your phone's speaker chamber, physically pushing water droplets out through the speaker mesh.</p>
    </section>
    <section class="blog-section">
      <h2>How to use it</h2>
      <ol>
        <li><strong>Install the Shortcut:</strong> Visit the WaterShortcut.com homepage and tap "Get Shortcut" to add it to your iPhone's shortcut library.</li>
        <li><strong>Disconnect Headphones:</strong> Ensure no Bluetooth or wired headphones are connected.</li>
        <li><strong>Run the Shortcut:</strong> Open your Shortcuts app or simply say, "Hey Siri, run Water Eject."</li>
        <li><strong>Wait for the Bass:</strong> You will hear a low, buzzing sound and feel the phone vibrate. You might actually see small droplets of water spitting out of the bottom speaker.</li>
        <li><strong>Clean Up:</strong> Wipe the expelled water away with a microfiber cloth. Repeat the process 2-3 times if the audio is still muffled.</li>
      </ol>
    </section>
    <section class="blog-section">
      <h2>Why not just wait?</h2>
      <p>Water trapped in your speaker grill can sit there for hours, potentially corroding the delicate mesh or muffling your alarms and calls. Using the shortcut speeds up the drying process significantly, getting your device back to normal in minutes rather than days.</p>
    </section>
  `;

  return blogLayout(
    "How to Eject Water from Your iPhone Speakers Instantly (The Safe Way)",
    "Learn how to safely blast water out of your iPhone speakers with the Water Eject Shortcut.",
    sections,
  );
}

function renderBlogIsItSafe(): string {
  const sections = `
    <section class="blog-section">
      <h2>The myth of rice (and why to skip it)</h2>
      <p>We’ve all heard the urban legend: if your phone gets wet, bury it in a bowl of uncooked rice. But ask any repair technician, and they will tell you that rice is actually dangerous for your phone. It introduces starch dust into your charging port and speakers, creating a paste that is harder to clean than the water itself.</p>
      <p>So, is the Water Eject Shortcut a safe alternative?</p>
    </section>
    <section class="blog-section">
      <h2>The science behind the sound</h2>
      <p>Yes, the Water Eject shortcut is completely safe for modern iPhones (iPhone 7 and later). It utilizes the exact same physics Apple officially uses in the Apple Watch. By playing a tone at a specific frequency (165Hz), the speaker diaphragm moves in a rhythmic way that pushes air—and water—outward.</p>
    </section>
    <section class="blog-section">
      <h2>Will it blow out my speakers?</h2>
      <p>No. The shortcut runs for a short duration and uses volume levels that your iPhone is designed to handle. It essentially "coughs" the water out. However, you should not run it continuously for an hour; 2 or 3 cycles is usually enough to clear the grill.</p>
    </section>
    <section class="blog-section">
      <h2>When not to rely on it</h2>
      <p>The Water Eject shortcut is perfect for speaker grill moisture and fixing muffled audio. However, if your phone was fully submerged in deep water for a long time, or if you dropped it in salt water (ocean), simply ejecting the water isn't enough. In those cases, power off the device immediately and seek professional repair.</p>
    </section>
    <section class="blog-section">
      <h2>The verdict</h2>
      <p>Stop buying rice. Install the Water Eject shortcut, keep a microfiber cloth handy, and let physics do the work for you.</p>
    </section>
  `;

  return blogLayout(
    "Is the Water Eject Shortcut Safe? (And Why You Should Stop Using Rice)",
    "Understand how the Water Eject Shortcut works, why it is safe, and when to call a pro.",
    sections,
  );
}

function renderAbout(): string {
  return `
    <section class="hero">
      <div>
        <h1>About WaterShortcut.</h1>
        <p>Less guessing. More saving.</p>
      </div>
    </section>
    ${section("What we do", `<p>WaterShortcut helps you translate a water bill into actions you can take.</p><p>We link sources so you can verify claims.</p><p>We may earn from affiliate links. See Affiliate.</p>`)}
    ${section("Start", `<div class="inline-list"><a class="btn primary" href="/analyze-water-bill">Start with a bill</a><a class="btn secondary" href="/savings-plan">Build a plan</a></div>`)}
  `;
}

function renderContact(): string {
  return `
    <section class="hero">
      <div>
        <h1>Contact.</h1>
        <p>Feedback makes this better.</p>
      </div>
    </section>
    ${section(
      "Say hi",
      `<p>Have a correction, a better source, or a feature request?</p>
      <p>Email: <a href="mailto:hello@watershortcut.com">hello@watershortcut.com</a></p>
      <p>We don’t provide emergency plumbing help.</p>`,
    )}
  `;
}

function renderTrustPage(kind: "privacy" | "terms" | "affiliate" | "disclaimer"): string {
  const trustCopy = copy.trust[kind];
  const sections = trustCopy.sections
    .map(
      (sectionItem) =>
        `<section class="section"><h2>${escapeHtml(sectionItem.title)}</h2><p>${escapeHtml(sectionItem.body)}</p></section>`,
    )
    .join("");
  const tldr =
    kind === "privacy"
      ? `<section class="section layout-slab"><h2>TL;DR</h2><ul class="bullet-list">${copy.trust.privacy.tldr
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join("")}</ul>
          <p class="muted" data-privacy-controls><a href="#privacy-settings" data-consent-open>${escapeHtml(
            copy.footer.privacySettings,
          )}</a></p>
        </section>`
      : "";
  return `
    <section class="hero">
      <div>
        <h1>${escapeHtml(trustCopy.title)}</h1>
        <p>${escapeHtml(trustCopy.summary)}</p>
      </div>
    </section>
    ${tldr}
    ${sections}
    <section class="section layout-slab">
      <p class="muted">Last updated: ${escapeHtml(BUILD_DATE)}</p>
      <div class="wizard-actions">
        <a class="btn secondary" href="/">Back home</a>
      </div>
    </section>
  `;
}

function renderHumanSitemap(routes: SiteRoute[]): string {
  const links = routes
    .map((route) => `<li><a href="${route.path}">${escapeHtml(route.title)}</a></li>`)
    .join("");
  return `
    <section class="hero">
      <div>
        <h1>Sitemap</h1>
        <p>Browse every WaterShortcut page, tool, and guide.</p>
      </div>
    </section>
    <section class="section layout-slab"><ul class="bullet-list">${links}</ul></section>
  `;
}

const handleLocationQuery = async (c: Context<{ Bindings: WorkerEnv }>) => {
  try {
    const locationInput = await extractLocationInput(c);
    if (!locationInput.trim()) {
      const message =
        "Missing or invalid 'location' field. Please enter a city, region, or provider name.";
      return c.json({ error: message }, 400);
    }

    const htmlResult = await resolveLocationHtml(locationInput.trim(), c.env);

    if (!htmlResult.success) {
      return c.json(
        {
          error: htmlResult.error || "Location lookup failed.",
        },
        502,
      );
    }

    const acceptsJson =
      c.req.query("format") === "json" ||
      (c.req.header("accept") || "")
        .toLowerCase()
        .includes("application/json");

    const responseBody = {
      html: htmlResult.html,
      payload: htmlResult.payload,
    };

    if (acceptsJson) {
      return c.json(responseBody);
    }

    return c.html(htmlResult.html);
  } catch (error) {
    console.error("Error in handleLocationQuery:", error);
    return c.json(
      { error: "Failed to retrieve location-based info." },
      500,
    );
  }
};

app.get("/api/location", handleLocationQuery);
app.post("/api/location", handleLocationQuery);

app.post("/api/water-iq/submit", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid JSON" }, 400);

  const answers = (body.answers ?? {}) as WaterIqAnswers;
  const variant = (body.variant ?? { v: 1, arm: "A" }) as WaterIqVariant;
  const token = String(body.token ?? "");
  const ref = body.ref ? String(body.ref) : null;

  const decoded = decodeToken(token);
  if (!decoded) return c.json({ ok: false, error: "Invalid token" }, 400);

  const computed = computeWaterIq(variant, answers);

  const rec = storeSubmit({
    token,
    createdAt: Date.now(),
    variant,
    answers,
    computed,
    ref,
    ua: c.req.header("user-agent"),
  });

  storeEvent({ type: "quiz_complete", ref });

  return c.json({ ok: true, id: rec.id });
});

app.get("/api/water-iq/stats", (c) => c.json({ ok: true, stats: getStats() }));

app.post("/api/water-iq/event", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid JSON" }, 400);

  const type = String(body.type ?? "");
  const ref = body.ref ? String(body.ref) : null;

  const allowed = new Set([
    "ref_landing",
    "quiz_start",
    "impact_view",
    "impact_continue",
    "quiz_complete",
    "share_click",
    "cta_click",
    "city_set",
    "followup_optin",
  ]);

  if (!allowed.has(type)) return c.json({ ok: false, error: "Unknown event type" }, 400);

  storeEvent({ type: type as any, ref });

  return c.json({ ok: true });
});

app.get("/api/water-iq/social-proof", (c) => {
  const url = new URL(c.req.url);
  const token = url.searchParams.get("token") ?? "";
  const data = getSocialProofFor(token);
  return c.json({ ok: true, data });
});

app.post("/api/water-iq/city", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid JSON" }, 400);

  const token = String(body.token ?? "");
  const city = String(body.city ?? "");
  if (!token) return c.json({ ok: false, error: "Missing token" }, 400);

  const res = storeCity(token, city);
  return c.json(res);
});

app.get("/api/water-iq/city-average", (c) => {
  const url = new URL(c.req.url);
  const city = url.searchParams.get("city") ?? "";
  const data = getCityAverage(city);
  return c.json({ ok: true, data });
});

app.post("/api/water-iq/followup", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid JSON" }, 400);

  const token = String(body.token ?? "");
  const email = String(body.email ?? "").trim();
  const days = Number(body.days ?? 0) as 7 | 21;
  const consent = Boolean(body.consent);

  if (!token) return c.json({ ok: false, error: "Missing token" }, 400);
  if (!consent) return c.json({ ok: false, error: "Consent required" }, 400);
  if (!(days === 7 || days === 21)) return c.json({ ok: false, error: "Days must be 7 or 21" }, 400);
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return c.json({ ok: false, error: "Invalid email" }, 400);

  const f = storeFollowup({ token, email, days, consent: true });
  return c.json({ ok: true, followup: { id: f.id, dueAt: f.dueAt } });
});

app.post("/api/water-iq/reward", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid JSON" }, 400);

  const token = String(body.token ?? "");
  const action = String(body.action ?? "");

  if (!token) return c.json({ ok: false, error: "Missing token" }, 400);
  if (!action) return c.json({ ok: false, error: "Missing action" }, 400);

  const decoded = decodeToken(token);
  if (!decoded) return c.json({ ok: false, error: "Invalid token" }, 400);

  const allowed = new Set(decoded.moves);
  if (!allowed.has(action as typeof decoded.moves[number])) {
    return c.json({ ok: false, error: "Action not eligible for reward" }, 400);
  }

  const res = storeReward(token, action);
  if (!res.ok) return c.json({ ok: false, error: res.error }, 400);
  return c.json(res);
});

app.get("/api/water-iq/followup/due", (c) => {
  const url = new URL(c.req.url);
  const key = url.searchParams.get("key") ?? "";
  const required = c.env.WS_ADMIN_EXPORT_KEY ?? "";
  if (!required || key !== required) return c.json({ ok: false, error: "Unauthorized" }, 401);

  const now = Date.now();
  const due = getFollowupsDue(now);
  return c.json({ ok: true, now, due });
});

app.get("/api/water-iq/audit", (c) => {
  const audit = runWaterIqAudit();
  return c.json({ ok: true, audit });
});

async function extractLocationInput(
  c: Context<{ Bindings: WorkerEnv }>,
): Promise<string> {
  const queryParam = coerceToLocationInput(c.req.query("location"));
  if (queryParam.trim()) {
    return queryParam;
  }

  if (c.req.method === "GET") {
    return coerceToLocationInput(c.req.query("location"));
  }

  const contentType = c.req.header("content-type")?.toLowerCase() || "";

  try {
    if (contentType.includes("application/json")) {
      const body = await c.req.json<{ location?: unknown }>();
      return coerceToLocationInput(body.location);
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await c.req.parseBody();
      if (formData && typeof formData === "object" && "location" in formData) {
        const value = formData.location;
        const coerced = coerceToLocationInput(value);
        if (coerced) return coerced;
      }
    }

    if (contentType.includes("text/plain")) {
      const text = await c.req.text();
      return coerceToLocationInput(text);
    }

    const fallbackText = await c.req.text();
    try {
      const parsed = JSON.parse(fallbackText) as { location?: unknown };
      const fromJson = coerceToLocationInput(parsed.location);
      if (fromJson) return fromJson;
      return coerceToLocationInput(fallbackText);
    } catch {
      return coerceToLocationInput(fallbackText);
    }
  } catch (error) {
    console.warn("Failed to parse location payload, defaulting to empty:", error);
    return "";
  }
}

function coerceToLocationInput(
  value: unknown,
  seen: WeakSet<object> = new WeakSet<object>(),
): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}`;

  if (Array.isArray(value)) {
    const joined = value
      .map((entry) => coerceToLocationInput(entry, seen))
      .filter((entry) => entry.trim().length > 0);
    return Array.from(new Set(joined)).join(", ");
  }

  if (value && typeof value === "object") {
    if (seen.has(value)) return "";
    seen.add(value);
    const record = value as Record<string, unknown>;
    const prioritizedKeys = [
      "location",
      "locationInput",
      "city",
      "region",
      "state",
      "province",
      "postal_code",
      "zipcode",
      "zip",
      "country",
      "provider",
      "utility",
      "name",
    ];

    const prioritized = prioritizedKeys
      .map((key) => coerceToLocationInput(record[key], seen))
      .filter((entry) => entry.trim().length > 0);

    if (prioritized.length > 0) {
      return Array.from(new Set(prioritized)).join(", ");
    }

    const allValues = Object.values(record)
      .map((entry) => coerceToLocationInput(entry, seen))
      .filter((entry) => entry.trim().length > 0);

    if (allValues.length > 0) {
      return Array.from(new Set(allValues)).join(", ");
    }
  }

  return "";
}

async function resolveLocationHtml(
  location: string,
  env: WorkerEnv,
): Promise<ReturnType<typeof transformLocationAssistantContent>> {
  const openAiEnabled = isOpenAiConfigured(env);
  let htmlResult: ReturnType<typeof transformLocationAssistantContent> | null =
    null;

  const livePayload = await lookupLiveLocationPayload(location, env);
  if (livePayload) {
    htmlResult = renderLocationPayload(livePayload, {
      fallbackLocation: location,
    });
  }

  if (!htmlResult && openAiEnabled) {
    try {
      const prompt = buildLocationPrompt(location);
      const openAiData = await analyzeTextWithOpenAI(env, {
        content: prompt,
        includeWaterContext: false,
      });
      const locationContent = openAiData.choices?.[0]?.message?.content || "";
      htmlResult = transformLocationAssistantContent(locationContent, {
        fallbackLocation: location,
      });
      if (!htmlResult.success) {
        console.warn(
          "Location assistant returned invalid data, switching to fallback.",
          htmlResult.error,
        );
        htmlResult = null;
      }
    } catch (error) {
      console.warn("OpenAI lookup failed, using fallback:", error);
      htmlResult = null;
    }
  }

  if (!htmlResult) {
    const fallbackPayload = buildFallbackLocationPayload(location);
    htmlResult = renderLocationPayload(fallbackPayload, {
      fallbackLocation: location,
    });
  }

  return htmlResult;
}

app.post("/api/credits/checkout", async (c) => {
  const env = c.env as WorkerEnv & { STRIPE_API_KEY?: string };
  const stripeApiKey = env.STRIPE_API_KEY;

  if (!stripeApiKey) {
    return c.json({ error: "Stripe is not configured" }, 500);
  }

  const originHeader = c.req.header("origin");
  const hostHeader = c.req.header("host");
  const origin = originHeader ?? (hostHeader ? `https://${hostHeader}` : DOMAIN);

  const successUrl = `${origin}/?redirect_status=succeeded&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/?redirect_status=canceled`;

  const body = new URLSearchParams({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": "500",
    "line_items[0][price_data][product_data][name]": "WaterShortcut credits (10 pack)",
    "line_items[0][price_data][product_data][description]":
      "Add 10 credits for water eject and bill analysis tools.",
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeApiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!stripeResponse.ok) {
    const errorText = await stripeResponse.text();
    return c.json(
      { error: "Stripe checkout creation failed", details: errorText },
      502,
    );
  }

  const session = (await stripeResponse.json()) as { id?: string; url?: string };
  return c.json({ id: session.id, url: session.url ?? null });
});

// The worker runtime supplies the context; using any keeps the shared handler flexible.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAnalyzeBill = async (c: any) => {
  let fileBytes: Uint8Array | null = null;
  try {
    validateUploadEnv(c.env);
    const contentType = c.req.header("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json(
        {
          error: "Invalid Content-Type. Must be multipart/form-data.",
        },
        400,
      );
    }

    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !validateFile(file)) {
      return c.json(
        { error: "Invalid file. Upload a PDF under 10MB." },
        400,
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    fileBytes = new Uint8Array(arrayBuffer);
    const hash = await generateHash(arrayBuffer);
    console.log("Generated PDF Hash:", hash);

    const mimeType = (file.type || "application/pdf").toLowerCase();
    const token = await getOAuthToken(c.env);
    const endpoint =
      c.env.Google_Document_AI_Processor_Prediction_Endpoint;
    const visionResult = await callVisionAPI(
      arrayBuffer,
      token,
      endpoint,
      mimeType,
    );

    if (visionResult?.error) {
      console.error("Vision API Error:", visionResult.error);
      return c.json(
        {
          error:
            visionResult.error.message ||
            "Vision API OCR failed. Please try another file.",
        },
        500,
      );
    }

    const rawText = visionResult.document?.text;
    if (!rawText) {
      return c.json(
        { error: "No text extracted from the file or invalid format." },
        400,
      );
    }

    const cleanText = preprocessText(rawText);
    const redactedText = redactSensitiveData(cleanText);
    const openAiData = await analyzeTextWithOpenAI(c.env, {
      content: redactedText,
      includeWaterContext: true,
    });
    const analysis = parseAnalysisPayload(openAiData);
    const acceptsJson = (c.req.header("accept") || "")
      .toLowerCase()
      .includes("application/json");

    if (acceptsJson) {
      return c.json({
        analysis,
        html: renderAnalysisResponse(openAiData),
      });
    }

    return c.html(renderAnalysisResponse(openAiData));
  } catch (error) {
    console.error("Error handling file upload:", error);
    const configIssue =
      error instanceof Error &&
      /service account|OAuth token|Document AI/i.test(error.message);
    const errorMessage = configIssue
      ? "File processing is temporarily unavailable due to Google Document AI credentials. Please verify the service account secret and try again."
      : "An error occurred during file upload.";
    return c.json(
      { error: errorMessage },
      500,
    );
  } finally {
    if (fileBytes) {
      fileBytes.fill(0);
    }
  }
};

const handleRebateSearch = async (c: Context<{ Bindings: WorkerEnv }>) => {
  let payload: {
    zip?: string;
    city?: string;
    state?: string;
    utility?: string;
    upgrades?: string[];
  } = {};
  try {
    payload = (await c.req.json()) as typeof payload;
  } catch (error) {
    console.error("Rebate search payload error:", error);
    return c.json({ error: "Invalid rebate request body." }, 400);
  }

  const zip = typeof payload.zip === "string" ? payload.zip.trim() : "";
  if (!zip) {
    return c.json({ error: "ZIP code is required to find rebates." }, 400);
  }
  const upgrades = Array.isArray(payload.upgrades)
    ? payload.upgrades.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const locationLabel = [payload.city, payload.state]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(", ");

  const cacheKey = JSON.stringify({
    zip,
    locationLabel,
    utility: payload.utility?.trim() || "",
    upgrades: upgrades.slice().sort(),
  });
  const cached = rebateCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return c.json(cached.payload);
  }

  const prompt = buildRebatePrompt({
    zip,
    locationLabel,
    utility: payload.utility?.trim() || "",
    upgrades,
  });

  try {
    const openAiData = await analyzeRebatesWithOpenAI(c.env, prompt);
    const parsed = parseRebatePayload(openAiData);
    const lastChecked = new Date().toISOString();
    const responsePayload: RebateResponse = {
      lastChecked,
      results: parsed,
    };
    rebateCache.set(cacheKey, {
      expiresAt: Date.now() + REBATE_CACHE_TTL_MS,
      payload: responsePayload,
    });
    return c.json(responsePayload);
  } catch (error) {
    console.error("Rebate lookup failed:", error);
    return c.json(
      {
        error:
          "We hit a snag researching rebates. Please try again or check official rebate finders.",
      },
      500,
    );
  }
};

app.post("/api/analyze-bill", handleAnalyzeBill);
app.post("/api/upload", handleAnalyzeBill);
app.post("/", handleAnalyzeBill);
app.post("/api/rebates", handleRebateSearch);

app.get("/api/usage-defaults", (c) =>
  c.json({
    showerFlowRate: SHOWER_FLOW_RATE,
    sinkFlowRate: SINK_FLOW_RATE,
    costPerGallonMin: COST_PER_GALLON_MIN,
    costPerGallonMax: COST_PER_GALLON_MAX,
  }),
);

app.get("/api/", (c) => c.json({ name: "WaterShortcut" }));

export default app;

async function generateHash(buffer: ArrayBuffer): Promise<string> {
  const key = await subtle.importKey(
    "raw",
    new TextEncoder().encode("key"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await subtle.sign("HMAC", key, buffer);
  return arrayBufferToBase64(signature);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const sanitized = base64.trim().replace(/[^A-Za-z0-9+/=]/g, "");
  if (
    sanitized.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(sanitized)
  ) {
    throw new Error("Invalid base64 string.");
  }
  const binaryString = atob(sanitized);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer);
  let binary = "";
  arr.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function preprocessText(txt: unknown): string {
  if (typeof txt !== "string" || !txt.trim()) {
    console.error("Preprocessing failed. Invalid text:", txt);
    return "";
  }
  return txt.replace(/[^\x20-\x7E]+/g, " ").replace(/\s+/g, " ").trim();
}

function redactSensitiveData(text: string): string {
  if (!text) return "";

  let redacted = text;
  const emailRegex = /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g;
  const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const accountRegex = /\b\d{8,}\b/g;
  const addressRegex = /\d{1,5}\s+[A-Za-z0-9'.\-\s]+(?:Avenue|Ave|Street|St|Road|Rd|Lane|Ln|Boulevard|Blvd)\b/gi;

  redacted = redacted.replace(emailRegex, "[REDACTED_EMAIL]");
  redacted = redacted.replace(phoneRegex, "[REDACTED_PHONE]");
  redacted = redacted.replace(accountRegex, "[REDACTED_ACCOUNT]");
  redacted = redacted.replace(addressRegex, "[REDACTED_ADDRESS]");

  return redacted;
}

function normalizePrivateKey(key: unknown): string | null {
  if (!key || typeof key !== "string") return null;
  const trimmed = key.trim();
  if (!trimmed) return null;

  const hasPemMarkers =
    trimmed.includes("BEGIN PRIVATE KEY") ||
    trimmed.includes("END PRIVATE KEY");
  if (hasPemMarkers) {
    let withMarkers = trimmed;
    if (!withMarkers.startsWith("-----BEGIN PRIVATE KEY-----")) {
      withMarkers = `-----BEGIN PRIVATE KEY-----\n${withMarkers}`;
    }
    if (!withMarkers.includes("-----END PRIVATE KEY-----")) {
      withMarkers = `${withMarkers}\n-----END PRIVATE KEY-----`;
    }
    return withMarkers;
  }

  const base64ish = /^[A-Za-z0-9+/=\s]+$/.test(trimmed);
  if (base64ish) {
    return `-----BEGIN PRIVATE KEY-----\n${trimmed}\n-----END PRIVATE KEY-----`;
  }

  return null;
}

function parseServiceAccount(raw: string): {
  clientEmail: string;
  privateKey: string;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error("Invalid Google service account JSON:", error);
    throw new Error(
      "Google service account credentials are not valid JSON.",
    );
  }

  const candidate =
    (parsed as { type?: string; private_key?: string; client_email?: string }) || {};
  const source =
    candidate.type === "service_account" || candidate.private_key
      ? candidate
      : (parsed as { web?: { private_key?: string; client_email?: string } }).web ||
        {};

  const privateKey = normalizePrivateKey(source.private_key);
  const clientEmail = source.client_email;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google service account is missing client_email or private_key. Update the Google-Service-Account-FINAL secret with the full service account JSON.",
    );
  }

  return { clientEmail, privateKey };
}

async function getOAuthToken(env: WorkerEnv): Promise<string> {
  const tokenUri = "https://oauth2.googleapis.com/token";
  const creds = parseServiceAccount(env["Google-Service-Account-FINAL"]);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: creds.clientEmail,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: tokenUri,
    exp: now + 3600,
    iat: now,
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedClaim = btoa(JSON.stringify(claim));

  const privateKey = creds.privateKey;

  try {
    const keyData = privateKey.replace(/-----[^-]+-----|\n/g, "");
    const keyBytes = base64ToArrayBuffer(keyData);
    const key = await subtle.importKey(
      "pkcs8",
      keyBytes,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const toSign = `${encodedHeader}.${encodedClaim}`;
    const toSignBuf = new TextEncoder().encode(toSign);
    const sigBuf = await subtle.sign("RSASSA-PKCS1-v1_5", key, toSignBuf);
    const signature = arrayBufferToBase64(sigBuf);
    const jwt = `${encodedHeader}.${encodedClaim}.${signature}`;

    const response = await fetch(tokenUri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }).toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Failed to fetch OAuth token:", err);
      throw new Error("Failed to fetch OAuth token");
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      throw new Error("No access token returned by OAuth");
    }
    return data.access_token;
  } catch (error) {
    console.error("Error during OAuth token generation:", error);
    throw error;
  }
}

async function callVisionAPI(
  buffer: ArrayBuffer,
  token: string,
  endpoint: string,
  mimeType: string,
): Promise<DocumentAIResponse> {
  try {
    const resolvedMimeType = mimeType
      ? mimeType.includes("pdf")
        ? "application/pdf"
        : mimeType
      : "application/pdf";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rawDocument: {
          content: arrayBufferToBase64(buffer),
          mimeType: resolvedMimeType,
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Vision API call failed: ${res.statusText}`);
    }
    const json = (await res.json()) as DocumentAIResponse;
    if (!json || !json.document || !json.document.text) {
      throw new Error("Invalid Vision API response.");
    }
    return json;
  } catch (error) {
    console.error("Error in callVisionAPI:", error);
    throw error;
  }
}

async function analyzeTextWithOpenAI(
  env: WorkerEnv,
  options: { content: string; includeWaterContext?: boolean },
): Promise<ChatCompletionResponse> {
  const { content, includeWaterContext = true } = options;

  const prompt = includeWaterContext
    ? `You are a world-leading expert in water conservation and efficiency.\nReturn ONLY valid JSON matching this schema (no markdown, no prose):\n{\n  "topMoves": [\n    {\n      "title": string,\n      "why": string,\n      "effort": "Low" | "Med" | "High",\n      "impact": string,\n      "steps": string[],\n      "ctaLabel": string,\n      "ctaHref": string\n    }\n  ],\n  "payingFor": string,\n  "nextStep": string,\n  "confidenceNote": string\n}\nRules:\n- Provide exactly 3 topMoves.\n- Keep language short, plain-English, and action-first.\n- Use realistic impact ranges instead of guarantees.\n- Use internal links for ctaHref when possible (e.g., /leak-check, /calculators/shower).\n\nBill text:\n${content}`
    : content;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPEN_API_KEY_NEW}`,
  };

  if (env.OPENAI_ORG_ID) {
    headers["OpenAI-Organization"] = env.OPENAI_ORG_ID;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = (await response.json()) as ChatCompletionResponse;

  if (!response.ok) {
    console.error(
      "OpenAI API request failed:",
      JSON.stringify(data, null, 2),
    );
    throw new Error("Failed to analyze text with OpenAI");
  }

  return data;
}

function buildRebatePrompt(input: {
  zip: string;
  locationLabel: string;
  utility: string;
  upgrades: string[];
}): string {
  const upgradeList = input.upgrades.length
    ? input.upgrades.join(", ")
    : "WaterSense fixtures, leak detection, irrigation, and efficient appliances";
  const locationDescriptor = input.locationLabel
    ? `${input.locationLabel} (ZIP ${input.zip})`
    : `ZIP ${input.zip}`;
  const utilityDescriptor = input.utility ? `Utility provider: ${input.utility}.` : "";

  return `You are a water rebate researcher. Return ONLY valid JSON (no markdown) matching:
{
  "results": [
    {
      "program": string,
      "provider": string,
      "amount": string,
      "eligibility": string[],
      "howToApply": string,
      "links": [{ "label": string, "url": string }],
      "estimated": boolean
    }
  ]
}
Rules:
- Focus on water efficiency rebates for ${locationDescriptor}.
- Include ${utilityDescriptor}
- Upgrades of interest: ${upgradeList}.
- Provide at least 3 results if available; otherwise return an empty array.
- Every result must include at least one official source link (utility/state/city).
- If the amount is uncertain, set "estimated": true and describe as a range in amount.
- If no credible program is found, return an empty results array.
Return JSON only.`;
}

async function analyzeRebatesWithOpenAI(
  env: WorkerEnv,
  prompt: string,
): Promise<ChatCompletionResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPEN_API_KEY_NEW}`,
  };

  if (env.OPENAI_ORG_ID) {
    headers["OpenAI-Organization"] = env.OPENAI_ORG_ID;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1800,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = (await response.json()) as ChatCompletionResponse;
  if (!response.ok) {
    console.error("OpenAI rebate request failed:", JSON.stringify(data, null, 2));
    throw new Error("Failed to analyze rebates with OpenAI");
  }

  return data;
}

function parseRebatePayload(data: ChatCompletionResponse): RebateResult[] {
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];
  const jsonBlock = extractJsonObject(content);
  if (!jsonBlock) return [];

  let parsed: { results?: RebateResult[] } | null = null;
  try {
    parsed = JSON.parse(jsonBlock) as { results?: RebateResult[] };
  } catch (error) {
    console.error("Failed to parse rebate JSON:", error);
    return [];
  }

  if (!parsed?.results || !Array.isArray(parsed.results)) {
    return [];
  }

  const mappedResults: Array<RebateResult | null> = parsed.results.map((result) => {
      const program = sanitizeText(result.program);
      const provider = sanitizeText(result.provider);
      const amount = sanitizeText(result.amount);
      const howToApply = sanitizeText(result.howToApply);
      const eligibility = Array.isArray(result.eligibility)
        ? result.eligibility.map((item) => sanitizeText(item)).filter((item): item is string => Boolean(item))
        : [];
      const links = Array.isArray(result.links)
        ? result.links
            .map((link) => ({
              label: sanitizeText(link?.label || "Official source"),
              url: sanitizeHttpUrl(link?.url),
            }))
            .filter(
              (link): link is { label: string; url: string } =>
                Boolean(link.label) && Boolean(link.url),
            )
        : [];
      if (!program || !provider || !howToApply || links.length === 0) {
        return null;
      }
      const estimated = result.estimated === true ? true : undefined;
      return {
        program,
        provider,
        amount: amount || "Amount varies by program",
        eligibility,
        howToApply,
        links,
        ...(estimated !== undefined ? { estimated } : {}),
      };
    });

  return mappedResults.filter((result): result is RebateResult => result !== null);
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => isNonEmptyString(entry));

const isAnalysisMove = (move: unknown): move is AnalysisMove => {
  if (!isRecord(move)) return false;
  return (
    isNonEmptyString(move.title) &&
    isNonEmptyString(move.why) &&
    isNonEmptyString(move.effort) &&
    isNonEmptyString(move.impact) &&
    isStringArray(move.steps) &&
    isNonEmptyString(move.ctaLabel) &&
    isNonEmptyString(move.ctaHref)
  );
};

function getCalculatorLinkForMove(move: AnalysisMove): string | null {
  if (move.ctaHref.startsWith("/calculators/")) {
    return move.ctaHref;
  }
  const combined = `${move.title} ${move.ctaLabel} ${move.ctaHref}`.toLowerCase();
  if (combined.includes("shower")) return "/calculators/shower";
  if (combined.includes("faucet") || combined.includes("aerator")) return "/calculators/faucet";
  if (combined.includes("toilet") || combined.includes("flapper")) return "/calculators/toilet";
  if (combined.includes("laundry") || combined.includes("washer")) return "/calculators/laundry";
  if (
    combined.includes("outdoor") ||
    combined.includes("irrigation") ||
    combined.includes("sprinkler") ||
    combined.includes("lawn")
  ) {
    return "/calculators/outdoor";
  }
  return null;
}

function parseAnalysisPayload(data: ChatCompletionResponse): AnalysisResult | null {
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  const jsonBlock = extractJsonObject(content);
  if (!jsonBlock) return null;
  try {
    const parsed = JSON.parse(jsonBlock) as AnalysisResult;
    if (
      !Array.isArray(parsed?.topMoves) ||
      parsed.topMoves.length !== 3 ||
      !isNonEmptyString(parsed.payingFor) ||
      !isNonEmptyString(parsed.nextStep)
    ) {
      return null;
    }
    if (!parsed.topMoves.every((move) => isAnalysisMove(move))) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse analysis JSON:", error);
    return null;
  }
}

function renderAnalysisResponse(data: ChatCompletionResponse): string {
  const parsed = parseAnalysisPayload(data);
  if (!parsed) {
    const content =
      data.choices?.[0]?.message?.content || "No recommendations provided.";
    const formatted = content
      .replace(/\*\*\*(.*?)\*\*\*/g, "<h2>$1</h2>")
      .replace(/\n/g, "<br>");
    return `
      <div class="analysis-fallback">
        <h2>Water Efficiency Recommendations</h2>
        ${formatted}
      </div>
    `;
  }

  const cards = parsed.topMoves
    .map(
      (move) => {
        const calculatorLink = getCalculatorLinkForMove(move);
        return `
      <div class="result-card">
        <h3>${escapeHtml(move.title)}</h3>
        <p class="muted">${escapeHtml(move.why)}</p>
        <div class="result-meta">
          <span>Effort: ${escapeHtml(move.effort)}</span>
          <span>Impact: ${escapeHtml(move.impact)}</span>
        </div>
        <ul class="bullet-list">${move.steps
          .map((step) => `<li>${escapeHtml(step)}</li>`)
          .join("")}</ul>
        <div class="inline-list">
          <a class="btn secondary" href="${escapeHtml(move.ctaHref)}">${escapeHtml(move.ctaLabel)}</a>
          ${
            calculatorLink && calculatorLink !== move.ctaHref
              ? `<a class="btn secondary" href="${escapeHtml(calculatorLink)}">Calculate savings</a>`
              : ""
          }
        </div>
      </div>
    `;
      },
    )
    .join("");

  return `
    <div class="results-grid">
      <h2>Your top 3 moves</h2>
      <div class="cards">${cards}</div>
      <h2>What you’re really paying for</h2>
      <p>${escapeHtml(parsed.payingFor)}</p>
      <h2>Your next best step</h2>
      <p>${escapeHtml(parsed.nextStep)}</p>
      ${parsed.confidenceNote ? `<p class="muted">${escapeHtml(parsed.confidenceNote)}</p>` : ""}
      <div class="share-bar">
        <button class="btn secondary" type="button" data-copy-summary>Copy summary</button>
        <button class="btn secondary" type="button" data-print-plan>Download PDF</button>
      </div>
    </div>
  `;
}

function validateFile(file: File): boolean {
  if (!file || file.size === 0 || file.size > 10 * 1024 * 1024) {
    console.error("File validation failed (empty or >10MB).");
    return false;
  }

  const type = file.type.toLowerCase();
  const isAllowed = type.includes("application/pdf");

  if (!isAllowed) {
    console.error("File validation failed (unsupported type).");
    return false;
  }

  return true;
}

function validateLocationEnv(env: WorkerEnv): void {
  if (!env.OPEN_API_KEY_NEW) {
    throw new Error("Missing env var: OPEN_API_KEY_NEW");
  }
}

function isOpenAiConfigured(env: WorkerEnv): boolean {
  return Boolean(env.OPEN_API_KEY_NEW);
}

function validateUploadEnv(env: WorkerEnv): void {
  validateLocationEnv(env);
  [
    "Google_Document_AI_Processor_Prediction_Endpoint",
    "Google-Service-Account-FINAL",
  ].forEach((key) => {
    if (!env[key as keyof WorkerEnv]) {
      throw new Error(`Missing env var: ${key}`);
    }
  });
  parseServiceAccount(env["Google-Service-Account-FINAL"]);
}

function buildLocationPrompt(location: string): string {
  return `You are a municipal utilities researcher helping residents access their water bills.
For the location "${location}" return ONLY valid JSON (no prose, no markdown) that matches this schema:
{
  "departmentName": string,
  "billPaymentUrl": string,
  "phoneNumber": string,
  "departmentWebsiteUrl": string | null,
  "oversightDepartment": string | null,
  "oversightUrl": string | null,
  "grantsOrAidUrl": string | null,
  "summaryLines": string[]
}
Rules:
- Provide the department or agency residents contact for water/sewer billing questions.
- billPaymentUrl must open a working public page to view or pay the water bill (http or https).
- phoneNumber must include an area code and dialable characters only.
- Use null when you cannot confirm a value.
- summaryLines should contain up to three short (<=9 word) helpful facts about rates, assistance, or oversight.
- Mention grantsOrAidUrl only when a real aid program exists.
Return JSON only.`;
}

function transformLocationAssistantContent(
  content: string,
  options?: { fallbackLocation?: string },
): ReturnType<typeof renderLocationPayload> {
  const jsonBlock = extractJsonObject(content);
  if (!jsonBlock) {
    return {
      success: false,
      error: "No structured location details were returned.",
    };
  }

  let parsed: LocationAssistantPayload | undefined;
  try {
    parsed = JSON.parse(jsonBlock) as LocationAssistantPayload;
  } catch (error) {
    console.error("Failed to parse location JSON:", error, jsonBlock);
    return {
      success: false,
      error: "Received invalid location data from assistant.",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      success: false,
      error: "Assistant response was empty.",
    };
  }

  const mergedPayload = applyFallbackLocationPayload(parsed, options?.fallbackLocation);

  return renderLocationPayload(mergedPayload, {
    fallbackLocation: options?.fallbackLocation,
  });
}

type RenderedLocationPayload = {
  departmentName: string;
  billPaymentUrl: string | null;
  phoneNumber: string | null;
  departmentWebsiteUrl: string | null;
  oversightDepartment: string | null;
  oversightUrl: string | null;
  grantsOrAidUrl: string | null;
  summaryLines: string[];
};

function renderLocationPayload(
  parsed: LocationAssistantPayload,
  options?: { fallbackLocation?: string },
):
  | { success: true; html: string; payload: RenderedLocationPayload }
  | { success: false; error: string } {
  if (!parsed || typeof parsed !== "object") {
    return {
      success: false,
      error: "Assistant response was empty.",
    };
  }

  const departmentName =
    sanitizeText(parsed.departmentName) ||
    (options?.fallbackLocation
      ? `${toTitleCase(options.fallbackLocation)} water billing office`
      : "Local water billing office");
  const paymentUrl = sanitizeHttpUrl(parsed.billPaymentUrl);
  const phoneDetails = normalizePhone(parsed.phoneNumber);
  const departmentSite = sanitizeHttpUrl(parsed.departmentWebsiteUrl);
  const oversightName = sanitizeText(parsed.oversightDepartment);
  const oversightUrl = sanitizeHttpUrl(parsed.oversightUrl);
  const grantsUrl = sanitizeHttpUrl(parsed.grantsOrAidUrl);

  if (!paymentUrl && !departmentSite && !phoneDetails) {
    return {
      success: false,
      error: "Location assistant did not return usable contact details.",
    };
  }

  const detailBlocks: string[] = [];

  const structuredPayload: RenderedLocationPayload = {
    departmentName,
    billPaymentUrl: paymentUrl,
    phoneNumber: phoneDetails?.display || null,
    departmentWebsiteUrl: departmentSite,
    oversightDepartment: oversightName || null,
    oversightUrl: oversightUrl || null,
    grantsOrAidUrl: grantsUrl || null,
    summaryLines: [],
  };

  detailBlocks.push(
    `<p><strong>Department:</strong> ${escapeHtml(departmentName)}</p>`,
  );

  if (phoneDetails) {
    detailBlocks.push(
      `<p><strong>Phone:</strong> <a href="${escapeHtml(phoneDetails.href)}">${escapeHtml(phoneDetails.display)}</a></p>`,
    );
  } else {
    detailBlocks.push(
      `<p><strong>Phone:</strong> Contact your local 311 or city hall.</p>`,
    );
  }

  if (paymentUrl) {
    detailBlocks.push(
      `<p><a href="${escapeHtml(paymentUrl)}" target="_blank" rel="noopener noreferrer">View or pay your water bill</a></p>`,
    );
  } else if (departmentSite) {
    detailBlocks.push(
      `<p><a href="${escapeHtml(departmentSite)}" target="_blank" rel="noopener noreferrer">Visit the utility website for payment options</a></p>`,
    );
  } else {
    detailBlocks.push(
      `<p><strong>Tip:</strong> Ask the department above for the payment portal.</p>`,
    );
  }

  if (departmentSite && departmentSite !== paymentUrl) {
    detailBlocks.push(
      `<p><a href="${escapeHtml(departmentSite)}" target="_blank" rel="noopener noreferrer">Department website</a></p>`,
    );
  }

  if (oversightName) {
    const oversightLabel = `<strong>Oversight:</strong> ${escapeHtml(oversightName)}`;
    if (oversightUrl) {
      detailBlocks.push(
        `<p>${oversightLabel} - <a href="${escapeHtml(oversightUrl)}" target="_blank" rel="noopener noreferrer">Learn more</a></p>`,
      );
    } else {
      detailBlocks.push(`<p>${oversightLabel}</p>`);
    }
  }

  if (grantsUrl) {
    detailBlocks.push(
      `<p><a href="${escapeHtml(grantsUrl)}" target="_blank" rel="noopener noreferrer">Bill assistance or grants information</a></p>`,
    );
  }

  const summaryLines = Array.isArray(parsed.summaryLines)
    ? parsed.summaryLines
    : [];
  const sanitizedSummaries = summaryLines
    .map((line) => sanitizeText(line))
    .filter((line): line is string => Boolean(line))
    .slice(0, 3);

  if (sanitizedSummaries.length) {
    structuredPayload.summaryLines = sanitizedSummaries;
    detailBlocks.push(
      '<div class="location-context">' +
        sanitizedSummaries
          .map((line) => `<p>${escapeHtml(line)}</p>`)
          .join("") +
        "</div>",
    );
  }

  return {
    success: true,
    html: `<div class="location-result-block">${detailBlocks.join("")}</div>`,
    payload: structuredPayload,
  };
}

function applyFallbackLocationPayload(
  parsed: LocationAssistantPayload,
  fallbackLocation?: string,
): LocationAssistantPayload {
  if (!fallbackLocation) {
    return parsed;
  }

  const fallback = buildFallbackLocationPayload(fallbackLocation);
  const summaryLines = Array.isArray(parsed.summaryLines)
    ? parsed.summaryLines.filter((line): line is string =>
        typeof line === "string" && Boolean(line.trim()),
      )
    : [];

  return {
    departmentName: parsed.departmentName || fallback.departmentName,
    billPaymentUrl: parsed.billPaymentUrl || fallback.billPaymentUrl,
    phoneNumber: parsed.phoneNumber || fallback.phoneNumber,
    departmentWebsiteUrl:
      parsed.departmentWebsiteUrl ?? fallback.departmentWebsiteUrl,
    oversightDepartment: parsed.oversightDepartment ?? fallback.oversightDepartment,
    oversightUrl: parsed.oversightUrl ?? fallback.oversightUrl,
    grantsOrAidUrl: parsed.grantsOrAidUrl ?? fallback.grantsOrAidUrl,
    summaryLines: summaryLines.length ? summaryLines.slice(0, 3) : fallback.summaryLines,
  };
}

function extractJsonObject(raw: string): string | null {
  if (!raw) {
    return null;
  }

  const withoutFences = raw.replace(/```json|```/gi, "").trim();
  let depth = 0;
  let inString = false;
  let escape = false;
  let start = -1;

  for (let i = 0; i < withoutFences.length; i++) {
    const char = withoutFences[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        const candidate = withoutFences.slice(start, i + 1);
        try {
          JSON.parse(candidate);
          return candidate;
        } catch (error) {
          console.error("JSON candidate parse failed:", error, candidate);
        }
        start = -1;
      }
    }
  }

  return null;
}

function sanitizeText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed || null;
}

function sanitizeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;
  if (/^www\./i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    const url = new URL(normalized);
    if (!/^https?:$/i.test(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch (error) {
    console.error("Invalid URL from assistant:", value, error);
    return null;
  }
}

function normalizePhone(value: unknown): { display: string; href: string } | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const digits = trimmed.replace(/[^0-9+]/g, "");
  const numericDigits = digits.replace(/[^0-9]/g, "");

  if (numericDigits.length < 7) {
    return null;
  }

  const telValue = digits.startsWith("+") ? digits : numericDigits;
  return {
    display: trimmed,
    href: `tel:${telValue}`,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.replace(/[^a-z0-9']/gi, ""))
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export {
  buildBreadcrumbs,
  injectAdSlots,
  renderAdSlot,
  renderAdsDiagnosticsPage,
  renderBreadcrumbs,
  renderModals,
};
