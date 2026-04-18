const site = {
  brandName: "Quizbiz",
  canonicalHost: "quizbiz.org",
  defaultOgImage: "https://quizbiz.org/brand/icon.png",
  locale: "en_US",
};

function canonicalUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `https://${site.canonicalHost}${normalized}`;
}

const pages = {
  "/": {
    title: "Startup Basics Quiz | Quizbiz",
    description:
      "Take the five-question Quizbiz startup quiz and get a score from 0% to 100% with practical launch tips.",
    canonicalPath: "/",
    h1: "Startup Basics Quiz",
    intro:
      "Quizbiz helps first-time founders pressure-test the basics before spending more time or money.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>What the quiz covers</h2><ul><li>Customer validation and problem discovery.</li><li>Simple first-pass pricing decisions.</li><li>Channel focus, hiring timing, and launch metrics.</li></ul></section><section class=\"seo-section\"><h2>What you get</h2><p>A clear score, answer review, and a short list of practical tips based on your result.</p></section>",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Quizbiz",
        url: canonicalUrl("/"),
      },
      {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: "Startup Basics Quiz",
        description:
          "A five-question business quiz about validation, pricing, channels, hiring, and launch metrics.",
        educationalAlignment: "Self-assessment",
        numberOfQuestions: 5,
      },
    ],
  },
  "/privacy": {
    title: "Privacy | Quizbiz",
    description:
      "Quizbiz privacy information for the startup quiz experience on quizbiz.org.",
    canonicalPath: "/privacy",
    h1: "Privacy",
    intro: "A short summary of how Quizbiz handles quiz activity, analytics, and ads.",
    bodyHtml:
      "<section class=\"seo-section\"><p>Quizbiz keeps the experience lightweight and uses analytics and advertising only to support the free quiz.</p></section>",
  },
  "/terms": {
    title: "Terms | Quizbiz",
    description: "Terms for using Quizbiz and its startup quiz content.",
    canonicalPath: "/terms",
    h1: "Terms",
    intro: "Quizbiz provides educational material, not legal, financial, or tax advice.",
    bodyHtml:
      "<section class=\"seo-section\"><p>Use the quiz as a learning tool and make business decisions with appropriate professional judgment.</p></section>",
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

export { buildTitle, canonicalUrl, clampDescription, pages, site };
