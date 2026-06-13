import { useMemo, useState } from "react";

import { usePageMeta } from "./hooks/usePageMeta";
import "./App.css";
import { normalizePathname } from "./utils/pathname";

type DomainEntry = {
  domain: string;
  title: string;
  audience: string;
  challenge: string;
  solution: string;
  impact: string;
  tags: string[];
};

type LeadState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  need: string;
  urgency: "today" | "week" | "month";
  smsOptIn: boolean;
};

type CohortProgramState = {
  organization: string;
  domain: string;
  eventName: string;
  cohort: string;
  rosterSource: string;
  rsvpSource: string;
  calendarSource: string;
  attendanceSource: string;
  reminderCadence: string;
  consentBasis: string;
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

const CONTACT_EMAIL = "hello@quizbiz.org";
const SMS_CONSENT_TEXT =
  "I agree to receive text messages from Quizbiz LLC about this request, including project updates, onboarding reminders, support follow-ups, and service notifications. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe and HELP for help. Consent is optional and is not a condition of purchase or service.";

const domainDirectory: DomainEntry[] = [
  {
    domain: "quizbiz.org",
    title: "Quizbiz LLC",
    audience: "Business buyers, partners, reviewers, and messaging providers",
    challenge: "Verify who operates the service and how customer communication works",
    solution: "Public company home, intake demo, domain directory, privacy policy, and messaging terms",
    impact: "Shortens trust review and gives every visitor a clear next step",
    tags: ["quizbiz", "company", "trust", "compliance", "twilio", "sms", "privacy", "terms", "business identity"],
  },
  {
    domain: "growth.business",
    title: "Growth workflow hub",
    audience: "B2B teams that need more qualified leads and faster follow-up",
    challenge: "Leads arrive from multiple places and no one knows which next step fits",
    solution: "Lead capture, qualification, routing, and follow-up workflow design",
    impact: "Turns scattered demand into a prioritized sales queue",
    tags: ["growth", "leads", "sales", "follow up", "crm", "pipeline", "booking", "revenue", "b2b"],
  },
  {
    domain: "contentasaservice.co",
    title: "Content as a Service",
    audience: "Experts, agencies, and operators with knowledge that should become buyer-facing content",
    challenge: "Useful expertise is trapped in calls, notes, and internal docs",
    solution: "Content systems for service pages, explainers, comparison pages, and authority assets",
    impact: "Creates pages that answer buyer questions before a sales conversation",
    tags: ["content", "seo", "authority", "articles", "agency", "blog", "service pages", "education"],
  },
  {
    domain: "searchfirm.co",
    title: "Search firm intake",
    audience: "Recruiters, search firms, candidates, and hiring teams",
    challenge: "Candidate and client requests are vague, urgent, and hard to compare",
    solution: "Structured intake and routing for roles, searches, candidate fit, and hiring priorities",
    impact: "Makes search work easier to qualify and faster to act on",
    tags: ["recruiting", "search", "staffing", "candidate", "hiring", "jobs", "talent", "placement"],
  },
  {
    domain: "smallbusinessholder.com",
    title: "Small business help",
    audience: "Owners who need plain-English next steps",
    challenge: "Business advice is too abstract when the owner needs action today",
    solution: "Practical checklists and decision support for local and small business operators",
    impact: "Gives owners a starting point they can use without learning a platform first",
    tags: ["small business", "owner", "local", "operations", "startup", "plan", "cash flow", "marketing"],
  },
  {
    domain: "earn.software",
    title: "Software that earns",
    audience: "Software builders and operators",
    challenge: "Tools exist, but the workflow does not produce measurable business value",
    solution: "Productized operating workflows, evaluation notes, and utility software",
    impact: "Connects software effort to revenue, savings, or throughput",
    tags: ["software", "saas", "automation", "tools", "roi", "product", "workflow", "ops"],
  },
  {
    domain: "affordablehome.us",
    title: "Affordable home eligibility",
    audience: "Homeowners, renters, housing programs, and property operators",
    challenge: "People need to understand housing options, affordability, and address-specific eligibility",
    solution: "Address-aware intake and clear next-step routing for housing opportunities",
    impact: "Captures high-intent housing demand with a useful first answer",
    tags: ["home", "housing", "affordable", "real estate", "address", "rent", "property", "eligibility"],
  },
  {
    domain: "watershortcut.com",
    title: "Water bill help",
    audience: "Homeowners, renters, property managers, and utility-adjacent programs",
    challenge: "Water bills are confusing and people do not know which fix matters",
    solution: "Bill analysis, provider lookup, leak checks, and plain-English savings steps",
    impact: "Turns a bill question into a concrete conservation or savings action",
    tags: ["water", "utility", "bill", "leak", "savings", "homeowner", "renter", "rebate"],
  },
  {
    domain: "doting.co",
    title: "Relationship follow-through",
    audience: "People, coaches, creators, and communities focused on stronger relationships",
    challenge: "Good intentions do not reliably become thoughtful follow-through",
    solution: "AI-guided prompts, gestures, reminders, and relationship habit support",
    impact: "Makes personal follow-through easier to start and sustain",
    tags: ["relationship", "gift", "care", "coach", "community", "reminder", "personal", "habit"],
  },
  {
    domain: "communityinternet.co",
    title: "Community internet",
    audience: "Neighborhoods, property groups, and community connectivity buyers",
    challenge: "Connectivity options are hard to compare and explain locally",
    solution: "Education and intake for community internet needs and provider conversations",
    impact: "Turns connectivity interest into a clearer request",
    tags: ["internet", "broadband", "community", "wifi", "connectivity", "neighborhood", "provider"],
  },
  {
    domain: "roofleakatlanta.com",
    title: "Atlanta roof leak intake",
    audience: "Atlanta homeowners and property managers with urgent roof issues",
    challenge: "Leaks need fast triage before damage spreads",
    solution: "Local issue intake, urgency routing, and repair-request capture",
    impact: "Gets the right details into a contractor-ready request",
    tags: ["roof", "leak", "atlanta", "repair", "contractor", "storm", "home", "emergency"],
  },
  {
    domain: "fixac.co",
    title: "AC repair routing",
    audience: "Homeowners and businesses with cooling problems",
    challenge: "AC issues need quick triage and local service routing",
    solution: "Symptom intake and repair request capture for HVAC service",
    impact: "Collects the details a service team needs before the first call",
    tags: ["ac", "hvac", "air conditioning", "repair", "cooling", "service", "contractor"],
  },
  {
    domain: "checkinforwork.com",
    title: "Work check-in",
    audience: "Teams that need simple attendance, jobsite, or shift confirmation",
    challenge: "Manual check-ins create gaps in accountability and scheduling",
    solution: "Lightweight check-in flows for workers, locations, and operational status",
    impact: "Improves visibility without forcing a heavy workforce platform",
    tags: ["work", "check in", "attendance", "shift", "jobsite", "field", "team", "operations"],
  },
  {
    domain: "cloudgpo.com",
    title: "Cloud purchasing groups",
    audience: "Organizations comparing SaaS, cloud, and group purchasing options",
    challenge: "Cloud buying is fragmented and hard to benchmark",
    solution: "GPO-style intake for cloud needs, categories, and purchasing opportunities",
    impact: "Finds shared demand and buying leverage",
    tags: ["cloud", "gpo", "procurement", "saas", "purchasing", "vendor", "discount", "it"],
  },
  {
    domain: "crmforlaw.com",
    title: "CRM for law firms",
    audience: "Law firms and legal operators",
    challenge: "Client intake and follow-up often fall between email, calls, and case systems",
    solution: "Legal CRM evaluation and intake workflow guidance",
    impact: "Helps firms capture inquiries and manage client communication more consistently",
    tags: ["law", "legal", "crm", "client intake", "attorney", "case", "firm", "lead"],
  },
  {
    domain: "staffing.how",
    title: "Staffing playbooks",
    audience: "Staffing teams, recruiters, and operators",
    challenge: "Staffing workflows need repeatable intake, screening, and placement steps",
    solution: "Practical staffing process guidance and workflow routing",
    impact: "Makes staffing operations easier to explain and improve",
    tags: ["staffing", "recruiting", "hiring", "screening", "placement", "workforce"],
  },
  {
    domain: "firmwebsite.com",
    title: "Firm website conversion",
    audience: "Professional services firms",
    challenge: "A firm website describes services but does not turn interest into qualified conversations",
    solution: "Website positioning, intake, proof, and conversion-path guidance",
    impact: "Makes service websites clearer and more useful to prospective clients",
    tags: ["firm", "website", "professional services", "agency", "law", "consulting", "conversion"],
  },
  {
    domain: "voicesearch.cc",
    title: "Voice search utility",
    audience: "Teams exploring voice search, audio input, and query interfaces",
    challenge: "Search experiences miss natural-language and spoken intent",
    solution: "Voice-first search and query workflow experiments",
    impact: "Turns spoken questions into actionable search results",
    tags: ["voice", "search", "audio", "query", "natural language", "accessibility"],
  },
  {
    domain: "estimatemarketshare.com",
    title: "Market share estimates",
    audience: "Founders, operators, and analysts sizing markets",
    challenge: "Market sizing is slow when assumptions are scattered",
    solution: "Estimate workflows for market share, category demand, and opportunity framing",
    impact: "Produces a starting estimate and the assumptions behind it",
    tags: ["market", "share", "tam", "forecast", "analysis", "estimate", "research"],
  },
  {
    domain: "riskfreetrial.org",
    title: "Trial and offer trust",
    audience: "Buyers comparing subscriptions, trials, and service offers",
    challenge: "Trial terms can feel risky or unclear",
    solution: "Plain-English offer analysis and trust-oriented conversion support",
    impact: "Helps buyers understand what they are agreeing to",
    tags: ["trial", "offer", "subscription", "billing", "risk", "trust", "pricing"],
  },
  {
    domain: "visualtos.com",
    title: "Visual terms of service",
    audience: "Customers and teams that need clearer policy experiences",
    challenge: "Legal terms are hard to scan and understand",
    solution: "Visual summaries and structured policy reading aids",
    impact: "Makes terms easier to review without replacing legal advice",
    tags: ["terms", "tos", "legal", "policy", "privacy", "visual", "contract"],
  },
  {
    domain: "startbusiness.us",
    title: "Start business guidance",
    audience: "New founders and small business starters",
    challenge: "Starting a business creates too many disconnected tasks",
    solution: "Plain steps for entity, offer, website, lead capture, and launch basics",
    impact: "Turns startup confusion into a practical first-week plan",
    tags: ["start business", "founder", "llc", "startup", "launch", "formation", "plan"],
  },
  {
    domain: "cascadeave.com",
    title: "Cascade Avenue local guide",
    audience: "Residents, visitors, and local businesses around Cascade",
    challenge: "Local discovery is fragmented across maps, social posts, and word of mouth",
    solution: "Neighborhood guide and local-intent capture",
    impact: "Connects local demand to places, events, and everyday services",
    tags: ["local", "cascade", "atlanta", "neighborhood", "events", "restaurants", "guide"],
  },
  {
    domain: "deadtreeatlanta.com",
    title: "Dead tree Atlanta",
    audience: "Atlanta property owners with hazardous trees",
    challenge: "Tree risk needs fast local triage and service routing",
    solution: "Issue intake for tree removal, storm risk, and property safety requests",
    impact: "Captures urgent local service demand with the right context",
    tags: ["tree", "atlanta", "dead tree", "removal", "storm", "hazard", "property"],
  },
  {
    domain: "buypatioheater.com",
    title: "Patio heater recommendations",
    audience: "Shoppers comparing outdoor heating options",
    challenge: "Patio heaters vary by space, fuel, safety, and budget",
    solution: "Recommendation flow for heater type, use case, and product fit",
    impact: "Turns product confusion into a short list",
    tags: ["patio", "heater", "outdoor", "shopping", "recommendation", "home", "product"],
  },
  {
    domain: "grocerydelivered.org",
    title: "Grocery delivery help",
    audience: "Households comparing grocery delivery options",
    challenge: "Delivery choices vary by location, budget, and urgency",
    solution: "Simple routing for grocery delivery needs and service comparison",
    impact: "Helps users find a practical delivery path",
    tags: ["grocery", "delivery", "food", "shopping", "household", "local"],
  },
  {
    domain: "makelife.org",
    title: "Make Life",
    audience: "People looking for practical life improvement workflows",
    challenge: "Personal goals need small repeatable actions",
    solution: "Guided prompts and simple action plans for everyday improvement",
    impact: "Makes broad goals easier to start",
    tags: ["life", "goals", "habits", "personal", "planning", "wellbeing"],
  },
  {
    domain: "chatulah.com",
    title: "Neighborhood cat quest",
    audience: "Neighborhood communities and playful local groups",
    challenge: "Local sightings and community moments disappear quickly",
    solution: "A playful shared experience for sightings, check-ins, and neighborhood discovery",
    impact: "Creates lightweight community engagement",
    tags: ["community", "neighborhood", "game", "local", "sightings", "quest"],
  },
  {
    domain: "10-7.org",
    title: "Learn, act, and advocate",
    audience: "People seeking civic, educational, or advocacy resources",
    challenge: "Sensitive topics need clear resources and responsible next steps",
    solution: "Structured resource hub and action-oriented education",
    impact: "Helps visitors move from awareness to responsible action",
    tags: ["education", "advocacy", "resources", "civic", "learn", "act"],
  },
  {
    domain: "freestock.tips",
    title: "Stock research tips",
    audience: "Individual investors and research-minded readers",
    challenge: "Market ideas need filtering, caution, and source-aware research",
    solution: "Research prompts and stock-screening education",
    impact: "Encourages more disciplined investing research",
    tags: ["stocks", "investing", "market", "research", "screen", "finance"],
  },
  {
    domain: "valuestockscreen.com",
    title: "Value stock screen",
    audience: "Investors screening for value opportunities",
    challenge: "Finding potential value stocks requires repeatable criteria",
    solution: "Screening workflow and research framing for value-oriented ideas",
    impact: "Makes a research process easier to repeat",
    tags: ["value", "stocks", "screen", "investing", "finance", "research"],
  },
  {
    domain: "makeyourownbitcoin.com",
    title: "Bitcoin learning",
    audience: "People trying to understand Bitcoin concepts",
    challenge: "Crypto explanations are often hype-heavy or too technical",
    solution: "Educational framing for Bitcoin mechanics, custody, and experiments",
    impact: "Supports safer learning before action",
    tags: ["bitcoin", "crypto", "education", "wallet", "mining", "blockchain"],
  },
  {
    domain: "investyourlifeinsurance.com",
    title: "Life insurance education",
    audience: "Consumers comparing life insurance and financial options",
    challenge: "Insurance decisions mix protection, cost, and investment language",
    solution: "Plain-English education and question routing",
    impact: "Helps visitors prepare better questions before buying",
    tags: ["life insurance", "insurance", "finance", "investment", "policy", "consumer"],
  },
  {
    domain: "debtsettlements.co",
    title: "Debt settlement education",
    audience: "Consumers researching debt options",
    challenge: "Debt settlement has tradeoffs that need careful review",
    solution: "Educational intake and plain-language comparison prompts",
    impact: "Helps visitors understand options before contacting a provider",
    tags: ["debt", "settlement", "credit", "finance", "consumer", "relief"],
  },
  {
    domain: "industrialrefurbisher.com",
    title: "Industrial refurbishment",
    audience: "Industrial buyers and equipment operators",
    challenge: "Repair, refurbish, or replace decisions require context",
    solution: "Equipment-intake and vendor-routing workflow",
    impact: "Captures industrial service demand in a structured way",
    tags: ["industrial", "equipment", "refurbish", "repair", "manufacturing", "vendor"],
  },
  {
    domain: "nirlevy.org",
    title: "Nir Levy public profile",
    audience: "People looking for background, projects, and contact context",
    challenge: "Personal project context is scattered across domains",
    solution: "Public profile and project context hub",
    impact: "Gives human context when appropriate without making Quizbiz founder-centered",
    tags: ["profile", "founder", "projects", "contact", "background"],
  },
];

const processSteps = [
  ["1", "Define the domain", "Select the domain, sender profile, message category, and public compliance surface."],
  ["2", "Load the cohort", "Import roster lists, recognition society membership, board segments, and consent status."],
  ["3", "Sync engagement", "Map Microsoft Forms RSVPs, Outlook attendee status, and Zoom attendance back to each cohort."],
  ["4", "Automate follow-up", "Queue reminders, confirmations, thank-you notes, and engagement reports with audit evidence."],
];

const trustRows = [
  ["Business identity", "Quizbiz LLC is the operator of Quizbiz.org and the responsible business for the lead capture and messaging program."],
  ["Messaging purpose", "Domain-specific event reminders, RSVP nudges, attendance confirmations, support follow-ups, and service notifications."],
  ["Cohort controls", "Rosters can be segmented by board role, donor recognition society membership, program, geography, attendance status, and opt-in evidence."],
  ["Engagement sources", "Microsoft Forms exports, Outlook event responses, Zoom participant reports, and manual check-in lists can be reconciled against cohort rosters."],
  ["Audience", "Customers, leads, members, donors, board members, and collaborators who explicitly ask to receive text messages."],
  ["Frequency", "Message frequency varies by request; recurring programs disclose expected frequency at opt-in."],
  ["Costs", "Message and data rates may apply."],
  ["Opt-out", "Reply STOP to unsubscribe. Reply HELP for help."],
  ["Consent", "Text consent is optional and is not a condition of purchase or service."],
  ["Data sharing", "Mobile opt-in data and consent are not shared or sold to third parties."],
];

const legalPages: Record<string, LegalPage> = {
  "/privacy": {
    title: "Privacy Policy | Quizbiz LLC",
    description: "Privacy policy for Quizbiz LLC, Quizbiz.org, lead capture, and optional text messaging services.",
    heading: "Privacy Policy",
    intro: "Quizbiz LLC operates Quizbiz.org as the public company, cohort messaging, domain directory, and policy home for its business initiatives.",
    sections: [
      {
        heading: "Who Operates This Site",
        body: [
          "Quizbiz LLC operates Quizbiz.org and the listed domain initiatives.",
          `Questions about privacy can be sent to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: "Information We Collect",
        body: [
          "We may collect information you choose to send, such as your name, email address, phone number, business details, cohort roster notes, event or program details, RSVP sources, attendance sources, message, search terms, domain match, urgency, source page, timestamp, and consent choice when you request a follow-up or configure a messaging program.",
          "The directory search can run in your browser. Submitted leads and program plans are stored by Quizbiz LLC for follow-up, implementation planning, and compliance records.",
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
    description: "Terms of service and mobile messaging terms for Quizbiz LLC, Quizbiz.org, and related domains.",
    heading: "Terms and Messaging Terms",
    intro: "These terms govern Quizbiz.org, Quizbiz LLC cohort controls, domain directory routing, related business initiatives, and optional text messaging programs.",
    sections: [
      {
        heading: "Use of the Site",
        body: [
          "Quizbiz.org provides company information, business policies, domain directory routing, lead capture previews, cohort messaging planning, and educational material about Quizbiz LLC initiatives.",
          "The site is not legal, tax, financial, medical, or compliance advice. You are responsible for decisions you make based on the content.",
        ],
      },
      {
        heading: "Mobile Messaging Terms",
        body: [
          "By opting in, you agree to receive text messages from Quizbiz LLC about requested event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications.",
          "Message frequency varies based on your request or active project. Message and data rates may apply.",
          "Reply STOP to unsubscribe. Reply HELP for help.",
          "Text consent is optional and is not a condition of purchase or service.",
        ],
      },
      {
        heading: "Lead Capture and Directory Results",
        body: [
          "Directory matches are generated from local portfolio descriptions, tags, and the search terms you provide. A match is a routing suggestion, not a guarantee that a service is available or appropriate for every situation.",
          "Do not submit information that you do not have permission to share.",
        ],
      },
      {
        heading: "No Guaranteed Outcomes",
        body: [
          "Quizbiz LLC workflows can help organize requests, generate recommendations, and improve follow-up, but Quizbiz LLC does not guarantee business growth, revenue, ranking, deliverability, or approval by any third-party platform.",
        ],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`],
      },
    ],
  },
  "/sms": {
    title: "SMS Program Details | Quizbiz LLC",
    description: "SMS opt-in, STOP, HELP, frequency, rates, and privacy details for Quizbiz LLC messaging.",
    heading: "SMS Program Details",
    intro: "Quizbiz LLC sends text messages only to people who explicitly request SMS updates or otherwise provide consent for a specific cohort messaging program.",
    sections: [
      {
        heading: "How to Opt In",
        body: [
          "On Quizbiz.org, SMS opt-in is collected through an unchecked checkbox next to the mobile phone field. The checkbox states the messaging purpose, message frequency, rates notice, STOP and HELP instructions, and links to the Privacy Policy and Terms.",
          "Consent is optional and is not a condition of purchase or service.",
        ],
      },
      {
        heading: "Message Types",
        body: [
          "Messages may include requested event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications related to a submitted inquiry, cohort program, or active project.",
        ],
      },
      {
        heading: "Frequency and Charges",
        body: ["Message frequency varies based on the request or active project. Message and data rates may apply."],
      },
      {
        heading: "Opt Out and Help",
        body: [`Reply STOP to unsubscribe. Reply HELP for help. You can also contact ${CONTACT_EMAIL}.`],
      },
      {
        heading: "Privacy",
        body: [
          "Mobile opt-in data and consent are not shared or sold to third parties. No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.",
        ],
      },
    ],
  },
};

const defaultLead: LeadState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  need: "I need more qualified leads and faster follow-up for a local service business",
  urgency: "week",
  smsOptIn: false,
};

const defaultProgram: CohortProgramState = {
  organization: "American Jewish Committee pilot workspace",
  domain: "quizbiz.org",
  eventName: "Board and donor recognition society program reminder",
  cohort: "Board members, donors, and recognition society members with documented SMS opt-in",
  rosterSource: "Cohort roster CSV with name, mobile, email, society, board role, city, and consent source",
  rsvpSource: "Microsoft Forms RSVP export or share link",
  calendarSource: "Outlook event ID, attendee response export, or organizer calendar link",
  attendanceSource: "Zoom participant report plus in-room check-in list",
  reminderCadence: "Invitation confirmation, RSVP nudge, day-before reminder, post-event thank-you, missed-you follow-up",
  consentBasis: "Send only to contacts with explicit SMS opt-in; exclude unsubscribed, missing consent, and unknown mobile records.",
};

function scoreDomain(entry: DomainEntry, query: string) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return entry.domain === "quizbiz.org" ? 4 : 0;
  const haystack = [
    entry.domain,
    entry.title,
    entry.audience,
    entry.challenge,
    entry.solution,
    entry.impact,
    ...entry.tags,
  ].join(" ").toLowerCase();
  const terms = normalized.split(/[^a-z0-9.]+/).filter((term) => term.length > 1);
  return terms.reduce((total, term) => {
    if (entry.domain.includes(term)) return total + 10;
    if (entry.tags.some((tag) => tag.toLowerCase().includes(term))) return total + 7;
    if (haystack.includes(term)) return total + 3;
    return total;
  }, 0);
}

function getMatches(query: string) {
  return domainDirectory
    .map((entry) => ({ entry, score: scoreDomain(entry, query) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.domain.localeCompare(b.entry.domain))
    .slice(0, 6);
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
  const [lead, setLead] = useState(defaultLead);
  const [query, setQuery] = useState(defaultLead.need);
  const [program, setProgram] = useState(defaultProgram);
  const [programStatus, setProgramStatus] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const matches = useMemo(() => getMatches(`${query} ${lead.company}`), [lead.company, query]);
  const bestMatch = matches[0]?.entry;
  const programReadiness = useMemo<Array<[string, boolean]>>(
    () => [
      ["Domain profile", Boolean(program.domain && program.organization)],
      ["Cohort roster", Boolean(program.cohort && program.rosterSource)],
      ["RSVP source", Boolean(program.rsvpSource)],
      ["Calendar source", Boolean(program.calendarSource)],
      ["Attendance source", Boolean(program.attendanceSource)],
      ["Consent rules", program.consentBasis.toLowerCase().includes("opt-in")],
    ],
    [program],
  );
  const readyCount = programReadiness.filter(([, ready]) => ready).length;

  async function submitLead() {
    setIsSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...lead,
          query,
          matchedDomain: bestMatch?.domain ?? "",
          matchedTitle: bestMatch?.title ?? "",
          consentText: lead.smsOptIn ? SMS_CONSENT_TEXT : "",
          pageUrl: window.location.href,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string; id?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Lead could not be submitted.");
      }
      setStatus(`Lead stored for ${bestMatch?.domain ?? "manual routing"} (${result.id}).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Lead could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitProgram() {
    setIsSavingProgram(true);
    setProgramStatus("");
    try {
      const response = await fetch("/api/cohort-programs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...program,
          readiness: programReadiness,
          pageUrl: window.location.href,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string; id?: string; readyCount?: number };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Program plan could not be saved.");
      }
      setProgramStatus(`Program plan saved (${result.id}). Readiness checks passed: ${result.readyCount ?? readyCount}/6.`);
    } catch (error) {
      setProgramStatus(error instanceof Error ? error.message : "Program plan could not be saved.");
    } finally {
      setIsSavingProgram(false);
    }
  }

  usePageMeta({
    title: "Quizbiz LLC | Domain-Specific Customer Messaging",
    description:
      "Quizbiz LLC powers domain-specific customer messaging with cohort-specific controls, automations, consent evidence, and engagement reporting.",
    canonicalPath: "/",
    ogImage: "https://quizbiz.org/og/quizbiz-og.png",
  });

  return (
    <main>
      <section className="qb-hero" aria-labelledby="home-title">
        <div className="qb-hero__copy qb-reveal">
          <p className="qb-eyebrow">Quizbiz LLC</p>
          <h1 id="home-title">Domain specific customer messaging with cohort specific controls and automations</h1>
          <p>
            Quizbiz.org is becoming the control surface for domain-specific SMS programs: define the sender, load the
            cohort, prove consent, automate event reminders, and reconcile engagement from RSVP and attendance systems.
          </p>
          <div className="qb-actions">
            <a className="qb-button qb-button--primary" href="#cohort-control">
              Build a program
            </a>
            <a className="qb-button qb-button--secondary" href="#directory">
              Search the directory
            </a>
          </div>
        </div>

        <div className="qb-product qb-reveal" aria-label="Quizbiz process preview">
          <div className="qb-product__top">
            <span>Messaging control plane</span>
            <strong>{program.domain}</strong>
          </div>
          <div className="qb-flow">
            {processSteps.map(([step, title]) => (
              <div className="qb-flow__step" key={title}>
                <span>{step}</span>
                <strong>{title}</strong>
              </div>
            ))}
          </div>
          <div className="qb-command">
            <span />
            <p>{program.eventName}: {program.cohort}</p>
          </div>
          <div className="qb-metrics" aria-label="Directory metrics">
            <div>
              <strong>{domainDirectory.length}</strong>
              <span>indexed domains</span>
            </div>
            <div>
              <strong>{readyCount}/6</strong>
              <span>ready checks</span>
            </div>
            <div>
              <strong>KV</strong>
              <span>audit storage</span>
            </div>
          </div>
        </div>
      </section>

      <section className="qb-proof" aria-label="Quizbiz process">
        {["Domain sender", "Cohort roster", "RSVP sync", "Attendance report"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="qb-section" id="platform">
        <div className="qb-section__header">
          <p className="qb-eyebrow">What Quizbiz does</p>
          <h2>Each domain becomes a compliant messaging workspace for a specific audience.</h2>
          <p>
            The process is built for real operating use: choose the domain and message purpose, load a permissioned
            roster, map engagement sources, send only where consent is documented, and produce an audit trail for review.
          </p>
        </div>
        <div className="qb-outcomes">
          {[
            ["Control", "Configure the domain, sender identity, message category, and public opt-in path before launch."],
            ["Segment", "Filter board members, donors, recognition society members, and other cohorts by eligibility and consent."],
            ["Reconcile", "Pull RSVP and attendance evidence from Microsoft Forms, Outlook, Zoom, and manual check-in exports."],
            ["Report", "Store the program plan, readiness checks, consent rules, and engagement summary for review/export."],
          ].map(([title, copy]) => (
            <article className="qb-card qb-reveal" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-brief" id="cohort-control" aria-labelledby="cohort-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Dogfood workspace</p>
          <h2 id="cohort-title">Plan event reminders for board and donor cohorts before any SMS goes out.</h2>
          <p>
            This workspace models the actual operating need: AJC-style program reminders for board members, donors, and
            donor recognition society cohorts, with RSVP and attendance evidence reconciled back to the roster.
          </p>
        </div>

        <div className="qb-brief__grid">
          <form className="qb-builder qb-program-builder" onSubmit={(event) => event.preventDefault()}>
            <label>
              Organization or pilot workspace
              <input
                value={program.organization}
                onChange={(event) => setProgram({ ...program, organization: event.target.value })}
              />
            </label>
            <label>
              Domain and sender surface
              <input value={program.domain} onChange={(event) => setProgram({ ...program, domain: event.target.value })} />
            </label>
            <label>
              Event or program
              <input value={program.eventName} onChange={(event) => setProgram({ ...program, eventName: event.target.value })} />
            </label>
            <label>
              Cohort rule
              <textarea value={program.cohort} onChange={(event) => setProgram({ ...program, cohort: event.target.value })} />
            </label>
            <label>
              Roster source
              <textarea
                value={program.rosterSource}
                onChange={(event) => setProgram({ ...program, rosterSource: event.target.value })}
              />
            </label>
            <label>
              Microsoft Forms RSVP source
              <input value={program.rsvpSource} onChange={(event) => setProgram({ ...program, rsvpSource: event.target.value })} />
            </label>
            <label>
              Outlook event source
              <input
                value={program.calendarSource}
                onChange={(event) => setProgram({ ...program, calendarSource: event.target.value })}
              />
            </label>
            <label>
              Zoom or attendance source
              <input
                value={program.attendanceSource}
                onChange={(event) => setProgram({ ...program, attendanceSource: event.target.value })}
              />
            </label>
            <label>
              Reminder automation cadence
              <textarea
                value={program.reminderCadence}
                onChange={(event) => setProgram({ ...program, reminderCadence: event.target.value })}
              />
            </label>
            <label>
              Consent and exclusion rule
              <textarea
                value={program.consentBasis}
                onChange={(event) => setProgram({ ...program, consentBasis: event.target.value })}
              />
            </label>
          </form>

          <article className="qb-result qb-program-result" aria-live="polite">
            <div className="qb-score qb-score--domain">
              <span>{readyCount}</span>
              <strong>Approval packet checks</strong>
            </div>
            <p className="qb-eyebrow">Program preview</p>
            <h3>{program.eventName}</h3>
            <p>
              Quizbiz will treat the roster as the source of truth, suppress contacts without documented opt-in, and
              reconcile RSVP and attendance signals before each follow-up.
            </p>
            <h4>Readiness checklist</h4>
            <ul>
              {programReadiness.map(([label, ready]) => (
                <li key={label}>{ready ? "Ready" : "Needs detail"}: {label}</li>
              ))}
            </ul>
            <h4>Sample compliant message</h4>
            <p>
              Quizbiz LLC: Reminder for {program.eventName}. Reply YES to confirm, STOP to unsubscribe, or HELP for
              help. Msg frequency varies. Msg & data rates may apply.
            </p>
            <div className="qb-actions">
              <button className="qb-button qb-button--primary" disabled={isSavingProgram} onClick={submitProgram} type="button">
                {isSavingProgram ? "Saving..." : "Save program plan"}
              </button>
              <a className="qb-button qb-button--secondary" href="/sms">
                SMS details
              </a>
            </div>
            {programStatus ? <p className="qb-status">{programStatus}</p> : null}
          </article>
        </div>
      </section>

      <section className="qb-section qb-brief" id="capture" aria-labelledby="capture-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Domain routing remains built in</p>
          <h2 id="capture-title">Match any business need to the right domain workspace.</h2>
          <p>
            The portfolio directory still routes broad requests to the right domain, but the primary operating layer is
            now cohort messaging with consent, automation, and engagement reporting.
          </p>
        </div>

        <div className="qb-brief__grid">
          <form className="qb-builder" onSubmit={(event) => event.preventDefault()}>
            <label>
              Name
              <input value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} placeholder="Jane Smith" />
            </label>
            <label>
              Email
              <input
                type="email"
                value={lead.email}
                onChange={(event) => setLead({ ...lead, email: event.target.value })}
                placeholder="jane@example.com"
              />
            </label>
            <label>
              Mobile phone, optional
              <input
                type="tel"
                value={lead.phone}
                onChange={(event) => setLead({ ...lead, phone: event.target.value })}
                placeholder="+1 404 555 0100"
              />
            </label>
            <label>
              Company or context
              <input
                value={lead.company}
                onChange={(event) => setLead({ ...lead, company: event.target.value })}
                placeholder="Atlanta roofing company, law firm, utility customer"
              />
            </label>
            <label>
              What do they need?
              <textarea
                value={lead.need}
                onChange={(event) => {
                  setLead({ ...lead, need: event.target.value });
                  setQuery(event.target.value);
                }}
                placeholder="Describe the audience, challenge, or solution they are looking for"
              />
            </label>
            <fieldset>
              <legend>Urgency</legend>
              <div className="qb-segmented qb-segmented--three">
                {(["today", "week", "month"] as LeadState["urgency"][]).map((urgency) => (
                  <button
                    className={lead.urgency === urgency ? "is-active" : ""}
                    key={urgency}
                    onClick={() => setLead({ ...lead, urgency })}
                    type="button"
                  >
                    {urgency === "today" ? "Today" : urgency === "week" ? "This week" : "This month"}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="qb-sms-consent">
              <input
                checked={lead.smsOptIn}
                onChange={(event) => setLead({ ...lead, smsOptIn: event.target.checked })}
                type="checkbox"
              />
              <span>
                {SMS_CONSENT_TEXT} See the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.
              </span>
            </label>
            <p className="qb-fine">SMS is used only if this box is checked. Mobile opt-in data and consent are not shared or sold.</p>
          </form>

          <article className="qb-result" aria-live="polite">
            <div className="qb-score qb-score--domain">
              <span>{matches.length}</span>
              <strong>Portfolio matches</strong>
            </div>
            <p className="qb-eyebrow">Best match</p>
            <h3>{bestMatch?.domain ?? "Enter a need to search"}</h3>
            <p>{bestMatch?.impact ?? "Search by audience, challenge, desired outcome, service type, or domain name."}</p>
            {bestMatch ? (
              <>
                <h4>Why this fits</h4>
                <ul>
                  <li>{bestMatch.audience}</li>
                  <li>{bestMatch.challenge}</li>
                  <li>{bestMatch.solution}</li>
                </ul>
              </>
            ) : null}
            <div className="qb-actions">
              <button className="qb-button qb-button--primary" disabled={isSubmitting} onClick={submitLead} type="button">
                {isSubmitting ? "Submitting..." : "Submit lead"}
              </button>
              {bestMatch ? (
                <a className="qb-button qb-button--secondary" href={`https://${bestMatch.domain}`}>
                  Open domain
                </a>
              ) : null}
            </div>
            {status ? <p className="qb-status">{status}</p> : null}
          </article>
        </div>
      </section>

      <section className="qb-section qb-directory" id="directory" aria-labelledby="directory-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Domain portfolio router</p>
          <h2 id="directory-title">Route the use case before configuring the messaging program.</h2>
          <p>
            Try searches like “board donor event reminder,” “CRM for a law firm,” “water bill savings,” “recruiting
            intake,” “patio heater,” or “terms of service.” The directory helps choose the right workspace before the
            cohort controls take over.
          </p>
        </div>
        <div className="qb-search">
          <label>
            Search the Quizbiz LLC portfolio
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What does the visitor need?" />
          </label>
        </div>
        <div className="qb-results-grid">
          {matches.map(({ entry, score }) => (
            <article className="qb-domain-card" key={entry.domain}>
              <div>
                <span>{score} match score</span>
                <h3>{entry.domain}</h3>
                <p>{entry.title}</p>
              </div>
              <p>{entry.solution}</p>
              <a href={`https://${entry.domain}`}>Open {entry.domain}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-workflow" aria-labelledby="workflow-title">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Operating model</p>
          <h2 id="workflow-title">One roster becomes reminders, confirmations, attendance, and reporting.</h2>
        </div>
        <div className="qb-timeline">
          {processSteps.map(([step, title, copy]) => (
            <article key={title}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qb-section qb-trust" id="trust">
        <div className="qb-section__header">
          <p className="qb-eyebrow">Trust and messaging</p>
          <h2>Quizbiz LLC is the brand and the responsible business.</h2>
          <p>
            Quizbiz.org presents the business identity, privacy terms, opt-in language, cohort controls, and consent
            evidence needed before any customer messaging program should be submitted for carrier review.
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
            <p>{SMS_CONSENT_TEXT}</p>
            <div className="qb-actions">
              <a className="qb-button qb-button--primary" href="/sms">
                SMS details
              </a>
              <a className="qb-button qb-button--secondary" href="/privacy">
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
          <h2>Prepare the Twilio approval packet from the same workflow used to run the program.</h2>
          <p>Use the cohort workspace to prove message purpose, audience, consent, suppression rules, and reporting.</p>
        </div>
        <a className="qb-button qb-button--primary" href="#cohort-control">
          Build a program
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
            <strong>Quizbiz LLC</strong>
            <small>Lead capture and domain routing</small>
          </span>
        </a>
        <nav className="qb-nav" aria-label="Primary">
          <a href="/#capture">Capture</a>
          <a href="/#cohort-control">Cohorts</a>
          <a href="/#directory">Directory</a>
          <a href="/#trust">Trust</a>
          <a href="/sms">SMS</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </header>

      {legalPage ? <LegalView page={legalPage} /> : <HomeView />}

      <footer className="qb-footer">
        <div>
          <strong>Quizbiz LLC</strong>
          <p>
            Company home, lead capture surface, domain directory, privacy policy, and messaging terms for Quizbiz LLC
            initiatives.
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/sms">SMS</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
