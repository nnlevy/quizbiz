const site = {
  brandName: "Quizbiz",
  canonicalHost: "quizbiz.org",
  defaultOgImage: "https://quizbiz.org/og/quizbiz-og.png",
  locale: "en_US",
};

const contactEmail = "hello@growth.business";

function canonicalUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `https://${site.canonicalHost}${normalized}`;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quizbiz LLC",
  url: canonicalUrl("/"),
  email: contactEmail,
  brand: [
    {
      "@type": "Brand",
      name: "Growth.business",
      url: "https://growth.business/",
    },
  ],
};

const pages = {
  "/": {
    title: "Growth.business by Quizbiz LLC | AI Growth Workflows",
    description:
      "B2B AI-assisted intake, follow-up, and customer messaging workflows from Quizbiz LLC doing business as Growth.business.",
    canonicalPath: "/",
    h1: "Turn missed demand into booked work",
    intro:
      "Growth.business by Quizbiz LLC helps teams capture demand, generate useful briefs, review customer follow-up, and keep messaging consent clear.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>AI growth workflows</h2><p>Quizbiz LLC does business as Growth.business to provide AI-assisted intake, follow-up, routing, and customer messaging workflows for B2B and service teams.</p></section><section class=\"seo-section\"><h2>Text messaging program</h2><p>Customers can opt in to requested project updates, onboarding reminders, support follow-ups, and service notifications. Consent is optional, message frequency varies, message and data rates may apply, and users can reply STOP to unsubscribe or HELP for help.</p></section><section class=\"seo-section\"><h2>Public trust surface</h2><p>Quizbiz.org publishes business identity, privacy, messaging, and terms information for Quizbiz LLC and Growth.business.</p></section>",
    structuredData: [
      organizationSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Quizbiz.org",
        url: canonicalUrl("/"),
      },
    ],
  },
  "/privacy": {
    title: "Privacy Policy | Quizbiz LLC",
    description:
      "Privacy policy for Quizbiz LLC, Growth.business, Quizbiz.org, and optional text messaging services.",
    canonicalPath: "/privacy",
    h1: "Privacy Policy",
    intro:
      "Quizbiz LLC operates Quizbiz.org as the public trust and policy home for Growth.business services and related business initiatives.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Text messaging privacy</h2><p>If you opt in to text messages, we use your phone number and consent record only for the messages you requested. No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p></section><section class=\"seo-section\"><h2>Contact</h2><p>Questions can be sent to hello@growth.business.</p></section>",
    structuredData: [organizationSchema],
  },
  "/terms": {
    title: "Terms and Messaging Terms | Quizbiz LLC",
    description:
      "Terms of service and mobile messaging terms for Quizbiz LLC, Growth.business, and Quizbiz.org.",
    canonicalPath: "/terms",
    h1: "Terms and Messaging Terms",
    intro:
      "These terms govern Quizbiz.org, Growth.business services, and optional text messaging programs operated by Quizbiz LLC.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Mobile messaging terms</h2><p>By opting in, you agree to receive text messages from Quizbiz LLC / Growth.business about requested project updates, onboarding reminders, support follow-ups, and portfolio service notifications. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Text consent is optional and is not a condition of purchase or service.</p></section>",
    structuredData: [organizationSchema],
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
