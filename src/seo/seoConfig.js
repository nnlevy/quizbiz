const site = {
  brandName: "WaterShortcut",
  canonicalHost: "www.watershortcut.com",
  defaultOgImage: "https://www.watershortcut.com/og/watershortcut-og.png",
  twitterHandle: "@watershortcut",
  locale: "en_US",
};

const pages = {
  "/": {
    title: "WaterShortcut | Save water. Save money.",
    description:
      "Upload a water bill for a clear breakdown and a savings plan. Or use fast calculators for showers, toilets, leaks, laundry, and outdoor watering.",
    canonicalPath: "/",
    h1: "Cut your water bill with AI-powered insights",
    intro:
      "WaterShortcut turns confusing water bills into a clear checklist. Upload a PDF to find leaks, avoid tier jumps, and lower costs without guesswork.",
    bodyHtml:
      '<section class="seo-section"><h2>Why it works</h2><ul><li>AI highlights suspicious usage patterns before they become costly.</li><li>Plain-English explanations replace jargon-heavy bill sections.</li><li>Step-by-step fixes are prioritized for impact and effort.</li></ul></section><section class="seo-section"><h2>What to expect</h2><p>Upload a bill to get a 200-level breakdown, savings checklist, and shareable summary you can act on immediately.</p></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WaterShortcut",
        url: canonicalUrl("/"),
        logo: site.defaultOgImage,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "WaterShortcut",
        url: canonicalUrl("/"),
      },
    ],
  },
  "/analyze-water-bill": {
    title: "Analyze a water bill PDF | WaterShortcut",
    description:
      "Upload a water bill PDF to get a plain-English breakdown, usage clues, and prioritized savings moves.",
    canonicalPath: "/analyze-water-bill",
  },
  "/manual-entry": {
    title: "Manual water bill entry | WaterShortcut",
    description:
      "Enter water bill numbers manually to get AI water bill analysis, savings tips, and ways to save water.",
    canonicalPath: "/manual-entry",
  },
  "/find-water-provider": {
    title: "Find your water provider | WaterShortcut",
    description:
      "Enter your city to find your water authority, bill portal, and contact details.",
    canonicalPath: "/find-water-provider",
  },
  "/research": {
    title: "Water research plan | WaterShortcut",
    description:
      "Build a research plan with AI water bill analysis insights to save water and reduce costs.",
    canonicalPath: "/research",
  },
  "/savings-plan": {
    title: "Build a water savings plan | WaterShortcut",
    description:
      "Answer a few questions to get a personalized, prioritized plan to lower your water bill.",
    canonicalPath: "/savings-plan",
  },
  "/water-iq": {
    title: "Water IQ Challenge | WaterShortcut",
    description:
      "Take the 2–3 minute Water IQ Challenge to get your score, a shareable badge, and your next best water-saving moves.",
    canonicalPath: "/water-iq",
    h1: "Water IQ Challenge",
    intro:
      "Test your water-saving knowledge in minutes, then get practical next steps you can share.",
    bodyHtml:
      '<section class="seo-section"><h2>What you’ll learn</h2><ul><li>Mythbuster facts that reveal the biggest leaks.</li><li>Habit questions that highlight your fastest wins.</li><li>A shareable badge and next-step checklist.</li></ul></section>',
  },
  "/calculators": {
    title: "Water saving calculators | WaterShortcut",
    description:
      "Fast, no-login calculators for showers, faucets, toilets, laundry, leaks, and outdoor watering.",
    canonicalPath: "/calculators",
  },
  "/calculators/shower": {
    title: "Shower savings calculator | WaterShortcut",
    description:
      "Estimate water (and money) savings from a WaterSense showerhead and shorter showers.",
    canonicalPath: "/calculators/shower",
  },
  "/calculators/faucet": {
    title: "Faucet savings calculator | WaterShortcut",
    description:
      "Estimate savings from WaterSense bathroom faucets/aerators and small habit changes.",
    canonicalPath: "/calculators/faucet",
  },
  "/calculators/toilet": {
    title: "Toilet savings calculator | WaterShortcut",
    description: "Estimate savings from upgrading toilets and fixing silent leaks.",
    canonicalPath: "/calculators/toilet",
  },
  "/calculators/laundry": {
    title: "Laundry savings calculator | WaterShortcut",
    description: "Estimate savings from switching to an ENERGY STAR clothes washer.",
    canonicalPath: "/calculators/laundry",
  },
  "/calculators/outdoor": {
    title: "Outdoor watering savings | WaterShortcut",
    description:
      "Build a smarter outdoor watering plan and estimate waste from overwatering.",
    canonicalPath: "/calculators/outdoor",
  },
  "/leak-check": {
    title: "Leak check | WaterShortcut",
    description:
      "A fast, guided checklist to find common household leaks and what to do next.",
    canonicalPath: "/leak-check",
  },
  "/rebates": {
    title: "Find water rebates | WaterShortcut",
    description: "Find official rebates for WaterSense and ENERGY STAR products in minutes.",
    canonicalPath: "/rebates",
  },
  "/guides": {
    title: "Water saving guides | WaterShortcut",
    description:
      "Short guides for showerheads, leaks, toilets, outdoor watering, and reading your bill.",
    canonicalPath: "/guides",
  },
  "/guides/showerheads": {
    title: "WaterSense showerheads | WaterShortcut",
    description: "What to buy, what to expect, and how to calculate savings.",
    canonicalPath: "/guides/showerheads",
  },
  "/guides/find-fix-leaks": {
    title: "Find and fix household leaks | WaterShortcut",
    description: "The fastest way to lower your water bill is stopping silent waste.",
    canonicalPath: "/guides/find-fix-leaks",
  },
  "/guides/toilets": {
    title: "WaterSense toilets | WaterShortcut",
    description: "How to spot a running toilet and when an upgrade is worth it.",
    canonicalPath: "/guides/toilets",
  },
  "/guides/water-bill": {
    title: "Water bill basics | WaterShortcut",
    description: "How to read your usage, units, tiers, and common fees.",
    canonicalPath: "/guides/water-bill",
  },
  "/guides/outdoor-watering": {
    title: "Outdoor watering basics | WaterShortcut",
    description:
      "A simple checklist to reduce outdoor waste and keep plants healthy.",
    canonicalPath: "/guides/outdoor-watering",
  },
  "/blog-how-to-eject.html": {
    title: "How to Eject Water from Your iPhone Speakers Instantly | WaterShortcut",
    description:
      "Use the Water Eject Shortcut to clear water from iPhone speakers quickly with safe, low-frequency sound.",
    canonicalPath: "/blog-how-to-eject.html",
  },
  "/blog-is-it-safe.html": {
    title: "Is the Water Eject Shortcut Safe? | WaterShortcut",
    description:
      "Learn how the Water Eject Shortcut works, why it is safe for iPhones, and when to use professional repair.",
    canonicalPath: "/blog-is-it-safe.html",
  },
  "/about": {
    title: "About WaterShortcut",
    description:
      "WaterShortcut turns confusing bills into simple next steps—fast.",
    canonicalPath: "/about",
  },
  "/sign-in": {
    title: "Sign in | WaterShortcut",
    description: "Sign in to access AI water bill analysis history and save water.",
    canonicalPath: "/sign-in",
    robots: "noindex,follow",
  },
  "/sign-up": {
    title: "Create a WaterShortcut account",
    description: "Create a WaterShortcut account to save water and track AI insights.",
    canonicalPath: "/sign-up",
    robots: "noindex,follow",
  },
  "/dashboard": {
    title: "WaterShortcut dashboard",
    description: "Track AI water bill analysis history and savings goals in your dashboard.",
    canonicalPath: "/dashboard",
    robots: "noindex,follow",
  },
  "/credits": {
    title: "WaterShortcut credits",
    description: "Manage credits for AI water bill analysis and water-saving tools.",
    canonicalPath: "/credits",
    robots: "noindex,follow",
  },
  "/contact": {
    title: "Contact WaterShortcut",
    description: "Questions, feedback, or corrections? Send a note.",
    canonicalPath: "/contact",
  },
  "/privacy": {
    title: "Privacy | WaterShortcut",
    description: "How we handle analytics, uploads, and data.",
    canonicalPath: "/privacy",
  },
  "/terms": {
    title: "Terms | WaterShortcut",
    description: "Use at your own risk. Estimates only.",
    canonicalPath: "/terms",
  },
  "/affiliate": {
    title: "Affiliate disclosure | WaterShortcut",
    description: "Some links may pay a commission that keeps the site free.",
    canonicalPath: "/affiliate",
  },
  "/disclaimer": {
    title: "Disclaimer | WaterShortcut",
    description: "Not legal, financial, or plumbing advice.",
    canonicalPath: "/disclaimer",
  },
  "/sitemap": {
    title: "Sitemap | WaterShortcut",
    description: "Browse every WaterShortcut page, tool, and guide.",
    canonicalPath: "/sitemap",
    robots: "noindex,follow",
  },
};

function buildTitle(pageTitle) {
  if (pageTitle.includes(site.brandName)) {
    return pageTitle;
  }
  return `${pageTitle} | ${site.brandName}`;
}

function clampDescription(description) {
  const trimmed = description.trim();
  if (trimmed.length > 160) {
    console.warn(`Description too long (${trimmed.length} chars): ${trimmed}`);
    return `${trimmed.slice(0, 157)}...`;
  }
  return trimmed;
}

function canonicalUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `https://${site.canonicalHost}${normalized}`;
}

export { buildTitle, canonicalUrl, clampDescription, pages, site };
