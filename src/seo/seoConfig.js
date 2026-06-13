const site = {
  brandName: "Quizbiz",
  canonicalHost: "quizbiz.org",
  defaultOgImage: "https://quizbiz.org/og/quizbiz-og.png",
  locale: "en_US",
};

const contactEmail = "hello@quizbiz.org";

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
  brand: "Quizbiz LLC",
};

const pages = {
  "/": {
    title: "Quizbiz LLC | Domain-Specific Customer Messaging",
    description:
      "Domain-specific customer messaging with cohort controls, automations, consent evidence, and engagement reporting from Quizbiz LLC.",
    canonicalPath: "/",
    h1: "Domain specific customer messaging with cohort specific controls and automations",
    intro:
      "Quizbiz.org helps configure cohort messaging programs with roster controls, consent evidence, RSVP sources, attendance reconciliation, and reporting.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Cohort messaging control plane</h2><p>Quizbiz.org configures domain-specific messaging programs for event reminders, RSVP nudges, attendance confirmations, and service notifications.</p></section><section class=\"seo-section\"><h2>Roster and engagement controls</h2><p>Programs can model cohort rosters, donor recognition groups, Microsoft Forms RSVP sources, Outlook response tracking, Zoom attendance reports, consent rules, and suppression lists.</p></section><section class=\"seo-section\"><h2>Text messaging program</h2><p>Customers can opt in to requested messages. Consent is optional, message frequency varies, message and data rates may apply, and users can reply STOP to unsubscribe or HELP for help.</p></section>",
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
      "Privacy policy for Quizbiz LLC, Quizbiz.org, cohort messaging, consent records, and optional text messaging services.",
    canonicalPath: "/privacy",
    h1: "Privacy Policy",
    intro:
      "Quizbiz LLC operates Quizbiz.org as the public company, lead capture, domain directory, and policy home for its business initiatives.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Text messaging privacy</h2><p>If you opt in to text messages, we use your phone number and consent record only for the messages you requested. No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p></section><section class=\"seo-section\"><h2>Contact</h2><p>Questions can be sent to hello@quizbiz.org.</p></section>",
    structuredData: [organizationSchema],
  },
  "/terms": {
    title: "Terms and Messaging Terms | Quizbiz LLC",
    description:
      "Terms of service and mobile messaging terms for Quizbiz LLC, Quizbiz.org, cohort controls, and related domains.",
    canonicalPath: "/terms",
    h1: "Terms and Messaging Terms",
    intro:
      "These terms govern Quizbiz.org, Quizbiz LLC lead capture, domain directory routing, related business initiatives, and optional text messaging programs.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Mobile messaging terms</h2><p>By opting in, you agree to receive text messages from Quizbiz LLC about requested event reminders, RSVP nudges, attendance confirmations, project updates, support follow-ups, and service notifications. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Text consent is optional and is not a condition of purchase or service.</p></section>",
    structuredData: [organizationSchema],
  },
  "/sms": {
    title: "SMS Program Details | Quizbiz LLC",
    description:
      "SMS opt-in, STOP, HELP, frequency, rates, cohort controls, privacy, and contact details for Quizbiz LLC messaging.",
    canonicalPath: "/sms",
    h1: "SMS Program Details",
    intro:
      "Quizbiz LLC sends text messages only to people who explicitly request SMS updates or otherwise provide consent for a specific cohort messaging program.",
    bodyHtml:
      "<section class=\"seo-section\"><h2>Opt in</h2><p>SMS opt-in is collected through an unchecked checkbox next to the mobile phone field. Consent is optional and is not a condition of purchase or service.</p></section><section class=\"seo-section\"><h2>STOP and HELP</h2><p>Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. Message and data rates may apply.</p></section><section class=\"seo-section\"><h2>Privacy</h2><p>Mobile opt-in data and consent are not shared or sold to third parties.</p></section>",
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
