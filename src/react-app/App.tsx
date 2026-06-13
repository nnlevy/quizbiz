import { useMemo, useState } from "react";

import { usePageMeta } from "./hooks/usePageMeta";
import "./App.css";
import { normalizePathname } from "./utils/pathname";

type Priority = "capture" | "followup" | "pipeline" | "content";
type Volume = "low" | "medium" | "high";
type Speed = "instant" | "same-day" | "weekly";

type BriefState = {
  company: string;
  market: string;
  priority: Priority;
  volume: Volume;
  speed: Speed;
  sms: boolean;
};

type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPage = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT_EMAIL = "hello@growth.business";

const defaultBrief: BriefState = {
  company: "Service business",
  market: "Local and B2B buyers",
  priority: "capture",
  volume: "medium",
  speed: "same-day",
  sms: true,
};

const priorityLabels: Record<Priority, string> = {
  capture: "Lead capture",
  followup: "Follow-up",
  pipeline: "Pipeline routing",
  content: "Content ops",
};

const volumeLabels: Record<Volume, string> = {
  low: "Under 50 leads/mo",
  medium: "50-250 leads/mo",
  high: "250+ leads/mo",
};

const speedLabels: Record<Speed, string> = {
  instant: "Instant response",
  "same-day": "Same-day response",
  weekly: "Weekly operating rhythm",
};

const outcomes = [
  {
    title: "Capture demand",
    copy: "Convert calls, forms, email, and campaign clicks into structured intake that a team can act on.",
  },
  {
    title: "Respond fast",
    copy: "Generate useful first replies, reminders, and status updates while customer intent is still warm.",
  },
  {
    title: "Route work",
    copy: "Match the request to the right offer, domain property, owner, or next step without manual sorting.",
  },
  {
    title: "Keep consent clear",
    copy: "Make opt-in, opt-out, privacy, and messaging expectations visible before any text program scales.",
  },
];

const platformSteps = [
  ["1", "Intent capture", "Forms, calls, landing pages, and campaign responses become one clean intake stream."],
  ["2", "AI brief", "Each inquiry is summarized with fit, urgency, missing context, and recommended next action."],
  ["3", "Human review", "Teams approve customer-facing language, offers, and edge-case handling before escalation."],
  ["4", "Follow-up loop", "Email and optional SMS updates keep buyers informed with clear consent records."],
];

const useCases = [
  {
    label: "Service teams",
    title: "From inquiry to booked work",
    copy: "Qualify requests, explain the next step, and reduce missed follow-up across high-intent leads.",
  },
  {
    label: "Recruiting and search",
    title: "Cleaner candidate and client intake",
    copy: "Turn vague messages into structured briefs that make specialization, urgency, and fit easier to see.",
  },
  {
    label: "Content operations",
    title: "Authority pages with a reason to exist",
    copy: "Convert operational knowledge into useful explainers, comparison pages, and buyer guidance.",
  },
];

const trustRows = [
  ["Business identity", "Quizbiz LLC, doing business as Growth.business."],
  ["Messaging purpose", "Requested project updates, onboarding reminders, support follow-ups, and service notifications."],
  ["Audience", "Customers, leads, and collaborators who explicitly ask to receive text messages."],
  ["Frequency", "Message frequency varies by request; recurring programs disclose expected frequency at opt-in."],
  ["Costs", "Message and data rates may apply."],
  ["Opt-out", "Reply STOP to unsubscribe. Reply HELP for help."],
  ["Consent", "Text consent is optional and is not a condition of purchase or service."],
  ["Data sharing", "Mobile opt-in data and consent are not shared or sold to third parties."],
];

const legalPages: Record<string, LegalPage> = {
  "/privacy": {
    title: "Privacy Policy | Quizbiz LLC",
    description:
      "Privacy policy for Quizbiz LLC, Growth.business, Quizbiz.org, and optional text messaging services.",
    heading: "Privacy Policy",
    intro:
      "Quizbiz LLC operates Quizbiz.org as the public trust and policy home for Growth.business services and related business initiatives.",
    sections: [
      {
        heading: "Who Operates This Site",
        body: [
          "Quizbiz LLC operates Quizbiz.org and does business as Growth.business for AI-assisted growth systems, intake workflows, and related business services.",
          `Questions about privacy can be sent to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: "Information We Collect",
        body: [
          "We may collect information you choose to send, such as your name, email address, business details, message, and phone number when you request a follow-up.",
          "Interactive tools on this site can run in your browser to generate a recommendation. Submitting a tool is not required to browse the site.",
        ],
      },
      {
        heading: "Text Messaging Privacy",
        body: [
          "If you opt in to text messages, we use your phone number and consent record only to send the messages you requested, such as project updates, onboarding reminders, support follow-ups, and service notifications.",
          "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.",
          "You can opt out at any time by replying STOP. You can request help by replying HELP.",
        ],
      },
      {
        heading: "Service Providers",
        body: [
          "We may use vendors for hosting, analytics, security, messaging delivery, and operations. These vendors are authorized to use information only to provide services to Quizbiz LLC.",
          "We do not sell personal information or mobile opt-in consent data.",
        ],
      },
      {
        heading: "Updates",
        body: ["We may update this policy as services change. The public version on Quizbiz.org is the current version."],
      },
    ],
  },
  "/terms": {
    title: "Terms and Messaging Terms | Quizbiz LLC",
    description:
      "Terms of service and mobile messaging terms for Quizbiz LLC, Growth.business, and Quizbiz.org.",
    heading: "Terms and Messaging Terms",
    intro:
      "These terms govern Quizbiz.org, Growth.business services, and optional text messaging programs operated by Quizbiz LLC.",
    sections: [
      {
        heading: "Use of the Site",
        body: [
          "Quizbiz.org provides service information, business policies, and educational material about AI-assisted growth systems.",
          "The site is not legal, tax, financial, or compliance advice. You are responsible for decisions you make based on the content.",
        ],
      },
      {
        heading: "Mobile Messaging Terms",
        body: [
          "By opting in, you agree to receive text messages from Quizbiz LLC / Growth.business about requested project updates, onboarding reminders, support follow-ups, and service notifications.",
          "Message frequency varies based on your request or active project. Message and data rates may apply.",
          "Reply STOP to unsubscribe. Reply HELP for help.",
          "Text consent is optional and is not a condition of purchase or service.",
        ],
      },
      {
        heading: "Acceptable Use",
        body: [
          "Do not use the site or messaging channels for unlawful, abusive, misleading, or harmful activity.",
          "Do not submit information that you do not have permission to share.",
        ],
      },
      {
        heading: "No Guaranteed Outcomes",
        body: [
          "AI-assisted workflows can help organize work, generate recommendations, and improve follow-up, but Quizbiz LLC does not guarantee business growth, revenue, ranking, deliverability, or approval by any third-party platform.",
        ],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`],
      },
    ],
  },
};

function buildBrief(state: BriefState) {
  const priorityScore = state.priority === "capture" || state.priority === "followup" ? 28 : 22;
  const volumeScore = state.volume === "high" ? 26 : state.volume === "medium" ? 21 : 16;
  const speedScore = state.speed === "instant" ? 24 : state.speed === "same-day" ? 19 : 13;
  const consentScore = state.sms ? 12 : 8;
  const score = Math.min(97, priorityScore + volumeScore + speedScore + consentScore);

  const title =
    state.priority === "capture"
      ? "AI intake and booking workflow"
      : state.priority === "followup"
        ? "AI follow-up and status workflow"
        : state.priority === "pipeline"
          ? "AI routing and pipeline workflow"
          : "AI content operations workflow";

  const automation =
    state.priority === "content"
      ? "Convert qualified questions into concise pages, reply drafts, and sales enablement notes."
      : state.priority === "pipeline"
        ? "Classify each inquiry by offer fit, urgency, source, and owner before a human reviews it."
        : state.priority === "followup"
          ? "Draft next-step replies, reminders, and status updates from the intake record."
          : "Capture the request, identify missing fields, and recommend the fastest booking path.";

  const firstSteps = [
    `Map the top 3 ${state.company || "business"} inquiry types and the exact next step each one deserves.`,
    "Create a single intake record with source, urgency, offer fit, consent status, and owner.",
    state.sms
      ? "Add optional SMS language with STOP/HELP instructions and a consent timestamp."
      : "Keep email as the primary follow-up channel until SMS consent is explicitly collected.",
  ];

  return {
    score,
    title,
    automation,
    summary: `${state.market || "Your audience"} should receive a faster, clearer response path built around ${priorityLabels[state.priority].toLowerCase()}, ${volumeLabels[state.volume].toLowerCase()}, and a ${speedLabels[state.speed].toLowerCase()} expectation.`,
    firstSteps,
    checks: [
      "Publish privacy and messaging terms before launching outbound text updates.",
      "Keep human review on offer terms, pricing, sensitive requests, and unclear consent.",
      "Track response time, qualified rate, booked rate, opt-out rate, and unresolved requests.",
    ],
  };
}

function LegalView({ page }: { page: LegalPage }) {
  usePageMeta({ title: page.title, description: page.description });

  return (
    <main className="qb-legal">
      <p className="qb-eyebrow">Quizbiz LLC</p>
      <h1>{page.heading}</h1>
      <p className="qb-legal__intro">{page.intro}</p>
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </main>
  );
}

function HomeView() {
  const [brief, setBrief] = useState(defaultBrief);
  const result = useMemo(() => buildBrief(brief), [brief]);

  usePageMeta({
    title: "Growth.business by Quizbiz LLC | AI Growth Workflows",
    description:
      "B2B AI-assisted intake, follow-up, and customer messaging workflows from Quizbiz LLC doing business as Growth.business.",
    canonicalPath: "/",
    ogImage: "https://quizbiz.org/og/quizbiz-og.png",
  });

  return (
    <main>
      <section className="qb-hero" aria-labelledby="home-title">
        <div className="qb-hero__copy qb-reveal">
          <p className="qb-eyebrow">Growth.business by Quizbiz LLC</p>
          <h1 id="home-title">Turn missed demand into booked work.</h1>
          <p>
            A B2B growth workflow studio for teams that need faster intake, clearer follow-up, and compliant customer
            messaging without adding operational drag.
          </p>
          <div className="qb-actions">
            <a className="qb-button qb-button--primary" href="#brief">
              Generate a growth brief
            </a>
            <a className="qb-button qb-button--secondary" href="#trust">
              Review messaging terms
            </a>
          </div>
        </div>

        <div className="qb-product qb-reveal" aria-label="Growth workflow preview">
          <div className="qb-product__top">
            <span>Live workflow</span>
            <strong>{result.score}% ready</strong>
          </div>
          <div className="qb-flow">
            {platformSteps.map(([step, title]) => (
              <div className="qb-flow__step" key={title}>
                <span>{step}</span>
                <strong>{title}</strong>
              </div>
            ))}
          </div>
          <div className="qb-command">
            <span />
            <p>{result.automation}</p>
          </div>
          <div className="qb-metrics" aria-label="Operating metrics">
            <div>
              <strong>8 min</strong>
              <span>target first response</span>
            </div>
            <div>
              <strong>4</strong>
              <span>review checkpoints</span>
            </div>
            <div>
              <strong>0</strong>
              <span>shared opt-in lists</span>
            </div>
          </div>
        </div>
      </section>

      <section className="qb-proof" aria-label="Quizbiz service promises">
        {["Lead intake", "AI brief generation", "Human review", "Optional SMS"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="qb-section" id="platform">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Platform</p>
          <h2>Built for revenue teams that need useful follow-up, not more software theater.</h2>
          <p>
            Quizbiz LLC packages Growth.business workflows around a simple operating loop: capture demand, generate a
            useful brief, review the next action, and keep the customer informed.
          </p>
        </div>
        <div className="qb-outcomes">
          {outcomes.map((outcome) => (
            <article className="qb-card qb-reveal" key={outcome.title}>
              <h3>{outcome.title}</h3>
              <p>{outcome.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-workflow" aria-labelledby="workflow-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Operating model</p>
          <h2 id="workflow-title">Every workflow is designed to be auditable before it scales.</h2>
        </div>
        <div className="qb-timeline">
          {platformSteps.map(([step, title, copy]) => (
            <article key={title}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-brief" id="brief" aria-labelledby="brief-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">AI growth brief</p>
          <h2 id="brief-title">Generate a practical starting point in under a minute.</h2>
          <p>
            This interactive brief builder turns a business situation into a recommended workflow, launch checklist,
            and risk notes. It runs client-side and does not require an account.
          </p>
        </div>

        <div className="qb-brief__grid">
          <form className="qb-builder" onSubmit={(event) => event.preventDefault()}>
            <label>
              Business type
              <input
                value={brief.company}
                onChange={(event) => setBrief({ ...brief, company: event.target.value })}
                placeholder="e.g. HVAC company, search firm, SaaS agency"
              />
            </label>
            <label>
              Audience
              <input
                value={brief.market}
                onChange={(event) => setBrief({ ...brief, market: event.target.value })}
                placeholder="e.g. local homeowners, B2B buyers"
              />
            </label>
            <fieldset>
              <legend>Priority</legend>
              <div className="qb-segmented">
                {(Object.keys(priorityLabels) as Priority[]).map((key) => (
                  <button
                    className={brief.priority === key ? "is-active" : ""}
                    key={key}
                    onClick={() => setBrief({ ...brief, priority: key })}
                    type="button"
                  >
                    {priorityLabels[key]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Monthly volume</legend>
              <div className="qb-segmented">
                {(Object.keys(volumeLabels) as Volume[]).map((key) => (
                  <button
                    className={brief.volume === key ? "is-active" : ""}
                    key={key}
                    onClick={() => setBrief({ ...brief, volume: key })}
                    type="button"
                  >
                    {volumeLabels[key]}
                  </button>
                ))}
              </div>
            </fieldset>
            <label>
              Response expectation
              <select value={brief.speed} onChange={(event) => setBrief({ ...brief, speed: event.target.value as Speed })}>
                {(Object.keys(speedLabels) as Speed[]).map((key) => (
                  <option key={key} value={key}>
                    {speedLabels[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="qb-toggle">
              <input
                checked={brief.sms}
                onChange={(event) => setBrief({ ...brief, sms: event.target.checked })}
                type="checkbox"
              />
              Include optional SMS readiness
            </label>
          </form>

          <article className="qb-result" aria-live="polite">
            <div className="qb-score">
              <span>{result.score}</span>
              <strong>Readiness score</strong>
            </div>
            <p className="qb-eyebrow">Recommended workflow</p>
            <h3>{result.title}</h3>
            <p>{result.summary}</p>
            <h4>First 7 days</h4>
            <ol>
              {result.firstSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h4>Launch checks</h4>
            <ul>
              {result.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="qb-section" id="use-cases">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Use cases</p>
          <h2>Focused workflows for service, search, and content-led growth.</h2>
        </div>
        <div className="qb-use-cases">
          {useCases.map((useCase) => (
            <article className="qb-card qb-reveal" key={useCase.title}>
              <span>{useCase.label}</span>
              <h3>{useCase.title}</h3>
              <p>{useCase.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-trust" id="trust">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Trust and messaging</p>
          <h2>Clear public disclosures for customer communication programs.</h2>
          <p>
            Quizbiz.org is the public policy surface for Quizbiz LLC and Growth.business. Text messaging is used only
            for requested updates and service communication.
          </p>
        </div>
        <div className="qb-trust__grid">
          <div className="qb-table">
            {trustRows.map(([label, value]) => (
              <div className="qb-row" key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <aside className="qb-consent">
            <p className="qb-eyebrow">Sample opt-in language</p>
            <p>
              By submitting a request, you agree to receive text messages from Quizbiz LLC / Growth.business about your
              project or service request. Message frequency varies. Message and data rates may apply. Reply STOP to
              unsubscribe or HELP for help.
            </p>
            <div className="qb-actions">
              <a className="qb-button qb-button--primary" href="/privacy">
                Privacy
              </a>
              <a className="qb-button qb-button--secondary" href="/terms">
                Terms
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="qb-final">
        <div>
          <p className="qb-eyebrow">Next step</p>
          <h2>Launch a workflow customers can understand.</h2>
          <p>
            Start with one painful follow-up moment, one clear consent path, and one measurable operating loop.
          </p>
        </div>
        <a className="qb-button qb-button--primary" href={`mailto:${CONTACT_EMAIL}?subject=Growth.business workflow request`}>
          Start a workflow
        </a>
      </section>
    </main>
  );
}

function App() {
  const pathname = normalizePathname(window.location.pathname);
  const legalPage = legalPages[pathname];

  return (
    <div className="qb-app">
      <header className="qb-header">
        <a className="qb-brand" href="/" aria-label="Quizbiz home">
          <span className="qb-brand__mark" aria-hidden="true">
            Q
          </span>
          <span>
            <strong>Growth.business</strong>
            <small>by Quizbiz LLC</small>
          </span>
        </a>
        <nav className="qb-nav" aria-label="Primary">
          <a href="/#platform">Platform</a>
          <a href="/#brief">Brief</a>
          <a href="/#trust">Trust</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </header>

      {legalPage ? <LegalView page={legalPage} /> : <HomeView />}

      <footer className="qb-footer">
        <div>
          <strong>Quizbiz LLC</strong>
          <p>
            Public trust home for Growth.business, customer messaging disclosures, and AI-assisted business workflow
            initiatives.
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
