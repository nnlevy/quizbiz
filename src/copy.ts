export const BUILD_DATE = "2025-12-29";
export const UPLOAD_RETENTION_HOURS = 1;

export const copy = {
  brand: {
    tagline: "Save water. Save money.",
  },
  nav: {
    switcherLabel: "Mode",
    homeLabel: "Home Water Savings",
    ejectLabel: "Eject Water (iPhone)",
  },
  footer: {
    estimates: "Estimates, not guarantees.",
    sources: "Sources you can click.",
    help: "Need help or found a mistake? hello@watershortcut.com",
    privacySettings: "Change privacy settings",
  },
  home: {
    title: "Cut your water bill with AI-powered insights",
    subtitle:
      "Turn a confusing bill into a clear checklist. Upload a PDF (or enter numbers manually) to spot leaks, avoid tier jumps, and lower costs—without guesswork.",
    primaryCta: "Analyze my bill",
    secondaryCta: "Try a demo",
    tertiaryCta: "Prefer not to upload? Enter numbers manually",
    trustRow: [
      "No login",
      "Redact personal details if you want",
      "Uploads deleted after analysis",
      "We don’t sell personal data",
    ],
  },
  analyze: {
    title: "Your bill, explained.",
    subtitle:
      "Upload a PDF. Get your top 3 moves, a plain-English breakdown, and the next best step.",
    uploadLabel: "Upload your bill (PDF)",
    uploadHelper:
      "Tip: cover your account number if you want. We only need the usage and charges.",
    uploadConstraints: "PDF only • Max 10MB • Most bills work best when text is selectable",
    uploadIdle: "Choose PDF",
    uploadActive: "Analyze my bill",
    uploadAltDemo: "Try a demo",
    uploadAltManual: "Enter numbers manually",
    progressSteps: ["Uploading…", "Reading your bill…", "Building your plan…"],
    progressNote: "This usually takes under a minute.",
    errors: {
      wrongType: "Please upload a PDF water bill.",
      tooLarge: "That file is too large. Please upload a PDF under 10MB.",
      parseFail:
        "We couldn’t read that bill. Try a different PDF, or use manual entry.",
      aiFail:
        "We hit a snag building your plan. Please try again. If it keeps happening, email hello@watershortcut.com.",
    },
    results: {
      topMoves: "Your top 3 moves",
      payingFor: "What you’re really paying for",
      nextStep: "Your next best step",
      empty: "Upload a bill to see your top 3 moves here.",
    },
    trustCapsule: [
      "No login.",
      "Redact your account number if you want.",
      `Uploads are deleted after analysis (within ${UPLOAD_RETENTION_HOURS} hour${
        UPLOAD_RETENTION_HOURS === 1 ? "" : "s"
      }).`,
      "We don’t sell personal data.",
    ],
  },
  trust: {
    privacy: {
      title: "Privacy",
      summary:
        "We keep the site running with functional cookies, let you opt into analytics and ads, and delete uploads after analysis.",
      tldr: [
        "Functional cookies keep the site working.",
        "Analytics and ads are optional—choose in Privacy Controls.",
        "If you upload a bill, we process it to generate results.",
        "We don’t sell personal data.",
        `Uploads are deleted after analysis (within ${UPLOAD_RETENTION_HOURS} hour${
          UPLOAD_RETENTION_HOURS === 1 ? "" : "s"
        }).`,
      ],
      sections: [
        {
          title: "What we collect",
          body:
            "We collect basic usage data for site reliability and the information you provide in forms, including bill uploads or manual entries. We do not require accounts.",
        },
        {
          title: "How we use it",
          body:
            "We use your inputs to generate estimates, surface tools, and improve the experience. We keep analytics optional and use ads only when you opt in.",
        },
        {
          title: "Cookies & your choices",
          body:
            "Functional cookies keep the site working. Google Analytics and Google AdSense only load after you opt in. You can change your choices any time in Privacy Controls.",
        },
        {
          title: "Bill uploads",
          body:
            "Bills are processed to extract usage and charges. We redact common sensitive data before sending text to our AI provider (OpenAI). Uploads are processed in memory and deleted after analysis within the stated retention window.",
        },
        {
          title: "Sharing (service providers)",
          body:
            "We use trusted vendors to host the site (Cloudflare), analyze performance (Google Analytics), serve optional ads (Google AdSense), and process AI summaries (OpenAI). These providers can only use data to deliver their services to WaterShortcut.",
        },
        {
          title: "Security",
          body:
            "We encrypt data in transit and limit access to operational support. No system is perfect, but we design to minimize data exposure.",
        },
        {
          title: "Your rights & requests",
          body:
            "You can ask questions, request deletion, or opt out of analytics/ads at any time by emailing hello@watershortcut.com.",
        },
        {
          title: "Changes to this policy",
          body:
            "If we make meaningful changes, we’ll update this page and the date below.",
        },
      ],
    },
    terms: {
      title: "Terms",
      summary:
        "Use at your own risk. Estimates are not guarantees, and nothing here is legal, financial, or plumbing advice.",
      sections: [
        {
          title: "Acceptable use",
          body:
            "Use WaterShortcut for lawful purposes. Don’t upload content you don’t have rights to share or that harms others.",
        },
        {
          title: "Third‑party links",
          body:
            "We link to official programs and partners for convenience. We don’t control their content or policies.",
        },
        {
          title: "Disclaimer of warranties",
          body:
            "WaterShortcut is provided “as is” without warranties of any kind. We make no guarantees about savings or outcomes.",
        },
        {
          title: "Limitation of liability",
          body:
            "We are not liable for indirect or consequential damages related to your use of the site.",
        },
        {
          title: "Changes",
          body:
            "We may update these terms from time to time. Continued use means you accept the latest version.",
        },
        {
          title: "Contact",
          body:
            "Questions about these terms? Email hello@watershortcut.com.",
        },
      ],
    },
    affiliate: {
      title: "Affiliate disclosure",
      summary:
        "Some links are affiliate links. You pay the same price, and we only recommend what we believe is useful.",
      sections: [
        {
          title: "How affiliate links work",
          body:
            "If you buy through an affiliate link, we may earn a small commission at no extra cost to you.",
        },
        {
          title: "Why we include them",
          body:
            "Affiliate revenue helps keep WaterShortcut free and supports continued development.",
        },
        {
          title: "Our promise",
          body:
            "We recommend products because they’re useful—not because of commissions.",
        },
        {
          title: "Contact",
          body:
            "Questions about affiliate links? Email hello@watershortcut.com.",
        },
      ],
    },
    disclaimer: {
      title: "Disclaimer",
      summary:
        "WaterShortcut provides educational estimates, not professional advice.",
      sections: [
        {
          title: "Educational use",
          body:
            "Use the estimates as a starting point. They are not legal, financial, or plumbing advice.",
        },
        {
          title: "Emergencies",
          body:
            "For urgent leaks or safety issues, contact a licensed professional.",
        },
        {
          title: "Follow local rules",
          body:
            "Always follow local codes and manufacturer instructions.",
        },
        {
          title: "Contact",
          body:
            "Questions? Email hello@watershortcut.com.",
        },
      ],
    },
  },
};
