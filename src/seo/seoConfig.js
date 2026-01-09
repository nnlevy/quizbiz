const site = {
  brandName: "WaterShortcut",
  canonicalHost: "www.watershortcut.com",
  defaultOgImage: "https://res.cloudinary.com/dlxzgqi9g/image/upload/v1735510676/watershortcut-favicon.png",
  twitterHandle: "@watershortcut",
  locale: "en_US",
};

const pages = {
  "/": {
    title: "WaterShortcut — Cut Your Water Bill with AI Insights",
    description:
      "Upload a water bill to spot spikes, find leaks, and get clear steps to save water—fast, practical, and personalized.",
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
  "/upload": {
    title: "Upload Your Water Bill | WaterShortcut",
    description:
      "Upload your water bill to uncover unusual usage, compare patterns, and get next steps to reduce your costs.",
    canonicalPath: "/upload",
    h1: "Upload your water bill to uncover savings",
    intro:
      "Drop in your latest statement for instant analysis. We highlight leaks, odd surcharges, and the fastest fixes to shrink your next bill.",
    bodyHtml:
      '<section class="seo-section"><h2>What you get</h2><ul><li>Line-item breakdowns that separate fixed fees from usage-driven costs.</li><li>Alerts for leak signals, meter anomalies, and sudden tier jumps.</li><li>A prioritized action plan you can print or share.</li></ul></section>',
  },
  "/learn/read-water-bill": {
    title: "How to Read Your Water Bill | WaterShortcut",
    description:
      "Learn how charges, tiers, and meter readings work so you can spot problems early and avoid surprise bills.",
    canonicalPath: "/learn/read-water-bill",
    h1: "Read your water bill with confidence",
    intro:
      "Decode line items, meter reads, and seasonal surcharges so you can catch mistakes early and plan for lower usage tiers.",
    bodyHtml:
      '<section class="seo-section"><h2>Bill anatomy</h2><ul><li>Understand service fees versus volumetric charges.</li><li>Spot rate tiers and drought surcharges that change seasonally.</li><li>Check meter reads, units, and usage graphs for accuracy.</li></ul></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to Read Your Water Bill",
        description:
          "Learn how charges, tiers, and meter readings work so you can spot problems early and avoid surprise bills.",
        url: canonicalUrl("/learn/read-water-bill"),
        inLanguage: site.locale,
      },
    ],
  },
  "/learn/leak-detection": {
    title: "Leak Detection Guide | WaterShortcut",
    description:
      "Find and confirm leaks with simple checks, clear warning signs, and repair tips that prevent costly water loss.",
    canonicalPath: "/learn/leak-detection",
    h1: "Find and confirm household leaks",
    intro:
      "Use quick tests, meter checks, and warning signs to pinpoint leaks before they turn into expensive surprises.",
    bodyHtml:
      '<section class="seo-section"><h2>Quick leak checks</h2><ul><li>Track meter movement when fixtures are off.</li><li>Use dye tabs to confirm silent toilet leaks.</li><li>Inspect irrigation zones and valves for slow drips.</li></ul></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Leak Detection Guide",
        description:
          "Find and confirm leaks with simple checks, clear warning signs, and repair tips that prevent costly water loss.",
        url: canonicalUrl("/learn/leak-detection"),
        inLanguage: site.locale,
      },
    ],
  },
  "/learn/water-saving-tips": {
    title: "Water‑Saving Tips That Actually Lower Bills | WaterShortcut",
    description:
      "Actionable tips for bathrooms, kitchens, yards, and appliances—prioritized by impact so you save water with less effort.",
    canonicalPath: "/learn/water-saving-tips",
    h1: "Water-saving tips that actually lower bills",
    intro:
      "Target the highest-impact habits and hardware upgrades across your home so every gallon—and dollar—goes further.",
    bodyHtml:
      '<section class="seo-section"><h2>High-impact moves</h2><ul><li>Swap in WaterSense showerheads and faucet aerators.</li><li>Tune irrigation schedules to weather and soil conditions.</li><li>Run full laundry and dishwasher loads to avoid waste.</li></ul></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Water-Saving Tips",
        description:
          "Actionable tips for bathrooms, kitchens, yards, and appliances—prioritized by impact so you save water with less effort.",
        url: canonicalUrl("/learn/water-saving-tips"),
        inLanguage: site.locale,
      },
    ],
  },
  "/learn/water-bill-spikes": {
    title: "Why Your Water Bill Spiked | WaterShortcut",
    description:
      "Diagnose sudden bill spikes—leaks, irrigation issues, seasonal changes—and learn the fastest fixes to try first.",
    canonicalPath: "/learn/water-bill-spikes",
    h1: "Why did your water bill spike?",
    intro:
      "Spot the most common reasons for sudden increases, from hidden leaks to irrigation hiccups, and what to do first.",
    bodyHtml:
      '<section class="seo-section"><h2>Common spike causes</h2><ul><li>Hidden slab or irrigation leaks that never surface indoors.</li><li>Seasonal watering changes and stuck sprinkler valves.</li><li>Estimated reads that correct later and inflate bills.</li></ul></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Why Your Water Bill Spiked",
        description:
          "Diagnose sudden bill spikes—leaks, irrigation issues, seasonal changes—and learn the fastest fixes to try first.",
        url: canonicalUrl("/learn/water-bill-spikes"),
        inLanguage: site.locale,
      },
    ],
  },
  "/learn/hidden-leaks": {
    title: "Find Hidden Water Leaks | WaterShortcut",
    description:
      "Track down silent leaks in toilets, irrigation, and walls using quick tests and data clues before damage spreads.",
    canonicalPath: "/learn/hidden-leaks",
    h1: "Find hidden water leaks before they spread",
    intro:
      "Use data cues and quick dye tests to uncover silent toilet, irrigation, and wall leaks before they waste thousands of gallons.",
    bodyHtml:
      '<section class="seo-section"><h2>Find stealthy leaks</h2><ul><li>Listen for tank refills and running water when fixtures are idle.</li><li>Check irrigation controllers and meter boxes for hidden flow.</li><li>Log utility data to spot slow, steady increases.</li></ul></section>',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Find Hidden Water Leaks",
        description:
          "Track down silent leaks in toilets, irrigation, and walls using quick tests and data clues before damage spreads.",
        url: canonicalUrl("/learn/hidden-leaks"),
        inLanguage: site.locale,
      },
    ],
  },
  "/game": {
    title: "Water Savings Game | WaterShortcut",
    description:
      "Play a quick game that teaches the biggest water‑saving moves—and how small habits add up on your monthly bill.",
    canonicalPath: "/game",
    h1: "Play the Water Savings Game",
    intro:
      "Try quick challenges that reveal how everyday choices change your monthly water and sewer costs.",
    bodyHtml:
      '<section class="seo-section"><h2>How the game helps</h2><ul><li>See how small habit tweaks add up over a month.</li><li>Compare the impact of hardware upgrades versus behavior changes.</li><li>Share tips with family members to keep everyone on track.</li></ul></section>',
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
