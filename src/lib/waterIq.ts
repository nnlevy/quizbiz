export const WATER_IQ_VERSION = 2 as const;

export type ExperimentArm = "A" | "B";

export type WaterIqVariant = { v: 1; arm: ExperimentArm };

export type WaterIqAnswers = Record<string, unknown>;

export type WaterIqMoveId =
  | "leak_check"
  | "toilet_dye_test"
  | "fix_faucet"
  | "sprinkler_check"
  | "shower_timer"
  | "install_aerator"
  | "watersense_toilet"
  | "irrigation_controller"
  | "savings_plan"
  | "analyze_bill";

export type WaterIqBadgeId =
  | "leak_detective"
  | "irrigation_optimizer"
  | "bathroom_roi_hero"
  | "habit_hacker"
  | "starter";

export type WaterIqPersonaCode = "CS" | "PS" | "LS" | "WW";

export type WaterIqShareTokenV2 = {
  v: 2;
  n: string;
  ts: number;
  score: number;
  k: number;
  h: number;
  delta: number;
  persona: WaterIqPersonaCode;
  badge: WaterIqBadgeId;
  hook: string;
  moves: WaterIqMoveId[];
};

export type WaterIqSource = { label: string; url: string };

export type WaterIqQuestionBase = {
  id: string;
  stepTitle: string;
  tags: string[];
  required?: boolean;
};

export type WaterIqMCQ = WaterIqQuestionBase & {
  kind: "mcq";
  prompt: string;
  helper?: string;
  options: { id: string; label: string }[];
  correctOptionId?: string;
  explanationByArm?: Partial<Record<ExperimentArm, string>>;
  explanationDefault?: string;
  sources?: WaterIqSource[];
  shareFactShort?: string;
};

export type WaterIqNumber = WaterIqQuestionBase & {
  kind: "number";
  prompt: string;
  helper?: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
};

export type WaterIqTop2 = WaterIqQuestionBase & {
  kind: "top2";
  prompt: string;
  helper?: string;
  options: { id: string; label: string; hint?: string }[];
  minSelect: 2;
  maxSelect: 2;
};

export type WaterIqQuestion = WaterIqMCQ | WaterIqNumber | WaterIqTop2;

export type WaterIqImpactStat = {
  id: string;
  title: string;
  value: string;
  why: string;
  tags: ("indoor" | "outdoor" | "both")[];
  sources: WaterIqSource[];
};

export type WaterIqComputed = {
  version: 2;
  variant: WaterIqVariant;
  score: { total: number; knowledge: number; habit: number };
  knowledgeDelta: { pre: number; post: number; delta: number };
  persona: { code: WaterIqPersonaCode; name: string; emoji: string; tagline: string };
  badge: { id: WaterIqBadgeId; label: string; emoji: string; reason: string };
  hookFact: { id: string; short: string; sources: WaterIqSource[] };
  focus: "indoor" | "outdoor" | "both";
  segmentKey: string;
  recommendedMoves: { id: WaterIqMoveId; title: string; href: string; why: string; costLabel: string }[];
  impactRevealStats: WaterIqImpactStat[];
  pledge?: string;
  budgetTier: "0" | "low" | "med" | "high" | "na";
  homeSituation: "homeowner" | "renter" | "other";
};

export const SOURCES = {
  EPA_FIX_LEAK_WEEK: { label: "EPA WaterSense: Fix a Leak Week", url: "https://www.epa.gov/watersense/fix-leak-week" },
  EPA_STATS_FACTS: { label: "EPA WaterSense: Statistics & Facts", url: "https://www.epa.gov/watersense/statistics-and-facts" },
  CAPE_TOWN_JEEM: { label: "Brick et al. 2023 (JEEM): Cape Town nudges", url: "https://www.sciencedirect.com/science/article/pii/S0095069623000700" },
  ATTARI_PUBMED: { label: "Attari 2014 (PNAS) abstract via PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/24591608/" },
};

export const COPY: Record<ExperimentArm, {
  landingTitle: string;
  landingSubtitle: string;
  disclosureTitle: string;
  disclosureBody: string;
  impactTitle: string;
  impactSubtitle: string;
  socialProofPrefix: string;
  socialProofSuffix: string;
  socialProofCaveat: string;
  shareHeadline: string;
  shareBodyTemplate: (args: { score: number; persona: string; badge: string; challengeUrl: string; city?: string }) => string;
  followupTitle: string;
  followupBody: string;
}> = {
  A: {
    landingTitle: "Water IQ Challenge",
    landingSubtitle: "In 3 minutes, find your fastest path to save water and lower your bill.",
    disclosureTitle: "What we collect (and why)",
    disclosureBody:
      "If you allow analytics, we store anonymous quiz answers + button taps so we can improve WaterShortcut and publish aggregate insights. No selling. No personal data unless you opt-in for a follow-up email.",
    impactTitle: "Impact Reveal",
    impactSubtitle: "These are the highest-odds savings moves (based on EPA estimates).",
    socialProofPrefix: "People in your situation most often start with:",
    socialProofSuffix: "Good first move if you want quick savings.",
    socialProofCaveat: "Based on survey participants so far (not a rule).",
    shareHeadline: "Make it viral (in a good way)",
    shareBodyTemplate: ({ score, persona, badge, challengeUrl, city }) =>
      `I scored ${score}/10 on WaterShortcut’s Water IQ (${persona} · ${badge}). ` +
      `Tag 3 friends and try to beat ${city ? `${city}’s` : "the"} average: ${challengeUrl}`,
    followupTitle: "Want a check-in?",
    followupBody: "Optional: we’ll email you in 7 or 21 days to see if your pledge stuck. No spam.",
  },
  B: {
    landingTitle: "Water IQ Challenge",
    landingSubtitle: "In 3 minutes, learn the two actions that protect your local water system the most.",
    disclosureTitle: "Transparency",
    disclosureBody:
      "If you allow analytics, we store anonymous answers + button taps to improve WaterShortcut and share aggregated findings. No selling. Follow-up email is optional and separate.",
    impactTitle: "Impact Reveal",
    impactSubtitle: "A few high-leverage moves can reduce strain on your local water supply.",
    socialProofPrefix: "In our Water IQ community, many people like you start with:",
    socialProofSuffix: "If that feels doable, it’s a solid first step.",
    socialProofCaveat: "Based on survey participants so far; sample sizes can be small.",
    shareHeadline: "Challenge your circle",
    shareBodyTemplate: ({ score, persona, badge, challengeUrl, city }) =>
      `I took WaterShortcut’s Water IQ (${score}/10 · ${persona} · ${badge}). ` +
      `Tag 3 friends and see how you compare to ${city ? `${city}` : "your city"}: ${challengeUrl}`,
    followupTitle: "Want a gentle reminder?",
    followupBody: "Optional: we’ll email you in 7 or 21 days to see what changed (and what got in the way).",
  },
};

export function assignVariant(seed: string): WaterIqVariant {
  const h = simpleHash(seed);
  const arm: ExperimentArm = h % 2 === 0 ? "A" : "B";
  return { v: 1, arm };
}

export const QUESTIONS: WaterIqQuestion[] = [
  {
    id: "q_home",
    kind: "mcq",
    stepTitle: "Quick context",
    tags: ["context"],
    required: true,
    prompt: "What’s your situation?",
    helper: "This helps tailor next steps. No login.",
    options: [
      { id: "homeowner", label: "Homeowner" },
      { id: "renter", label: "Renter" },
      { id: "other", label: "Other / not sure" },
    ],
  },
  {
    id: "q_focus",
    kind: "mcq",
    stepTitle: "Quick context",
    tags: ["context"],
    required: true,
    prompt: "Where do you want the biggest wins first?",
    helper: "We’ll tailor your Impact Reveal + action plan.",
    options: [
      { id: "indoor", label: "Indoor" },
      { id: "outdoor", label: "Outdoor" },
      { id: "both", label: "Both" },
    ],
  },
  {
    id: "k_drip_pre",
    kind: "mcq",
    stepTitle: "Water MythBuster",
    tags: ["knowledge", "estimation", "misconception", "prepost:drip", "phase:pre"],
    required: true,
    prompt: "A faucet dripping at about 1 drip per second can waste about…",
    helper: "Best guess. This is more common than people think.",
    options: [
      { id: "a", label: "≈ 300 gallons per year" },
      { id: "b", label: "≈ 3,000+ gallons per year" },
      { id: "c", label: "≈ 30,000 gallons per year" },
    ],
    correctOptionId: "b",
    explanationDefault:
      "EPA WaterSense notes a faucet dripping ~1 drip/second can waste more than 3,000 gallons/year.",
    explanationByArm: {
      A: "EPA WaterSense notes a faucet dripping ~1 drip/second can waste 3,000+ gallons/year — a silent bill inflator.",
      B: "EPA WaterSense notes a faucet dripping ~1 drip/second can waste 3,000+ gallons/year — a quiet strain on shared supply.",
    },
    sources: [SOURCES.EPA_FIX_LEAK_WEEK],
    shareFactShort: "A 1‑drip/sec faucet can waste 3,000+ gallons/year (EPA).",
  },
  {
    id: "k_irrig_pre",
    kind: "mcq",
    stepTitle: "Water MythBuster",
    tags: ["knowledge", "estimation", "misconception", "prepost:irrig", "phase:pre"],
    required: true,
    prompt: "If you have sprinklers: a tiny leak (~1/32 inch, about a dime’s thickness) can waste about…",
    helper: "Outdoor leaks can be the stealthiest.",
    options: [
      { id: "a", label: "≈ 630 gallons per month" },
      { id: "b", label: "≈ 6,300 gallons per month" },
      { id: "c", label: "≈ 63,000 gallons per month" },
    ],
    correctOptionId: "b",
    explanationDefault:
      "EPA WaterSense notes an irrigation leak ~1/32 inch can waste about 6,300 gallons per month.",
    explanationByArm: {
      A: "EPA WaterSense: a tiny irrigation leak can waste ~6,300 gallons/month — an expensive bug if you water outdoors.",
      B: "EPA WaterSense: a tiny irrigation leak can waste ~6,300 gallons/month — and it’s easy to miss without checks.",
    },
    sources: [SOURCES.EPA_FIX_LEAK_WEEK],
    shareFactShort: "A tiny sprinkler leak can waste ~6,300 gallons/month (EPA).",
  },
  {
    id: "k_toilet",
    kind: "mcq",
    stepTitle: "Water MythBuster",
    tags: ["knowledge", "estimation", "misconception"],
    required: true,
    prompt: "Replacing old, inefficient toilets with WaterSense-labeled toilets can save an average family about…",
    helper: "This is the “always-on” upgrade.",
    options: [
      { id: "a", label: "≈ 1,300 gallons per year" },
      { id: "b", label: "≈ 13,000 gallons per year" },
      { id: "c", label: "≈ 130,000 gallons per year" },
    ],
    correctOptionId: "b",
    explanationDefault:
      "EPA WaterSense reports an average family can save ~13,000 gallons and about $130/year by replacing old toilets with WaterSense models.",
    explanationByArm: {
      A: "EPA WaterSense: ~13,000 gallons + about $130/year in water costs — one of the best bathroom ROIs.",
      B: "EPA WaterSense: ~13,000 gallons/year — high impact because toilets run the “background processes” of the home.",
    },
    sources: [SOURCES.EPA_STATS_FACTS],
    shareFactShort: "WaterSense toilets can save ~13,000 gallons/year (EPA).",
  },
  {
    id: "r_top2",
    kind: "top2",
    stepTitle: "Action ranking",
    tags: ["ranking", "action-ranking", "research-signal"],
    required: true,
    prompt: "If you had 30 minutes this weekend, which TWO would you start with?",
    helper: "No wrong answers — this helps us learn what people prioritize.",
    minSelect: 2,
    maxSelect: 2,
    options: [
      { id: "leak_check", label: "3‑minute leak check (meter test)", hint: "High-odds hidden waste" },
      { id: "toilet_dye", label: "Dye test toilet for silent leaks", hint: "Cheap + fast" },
      { id: "shower_2min", label: "Cut showers by 2 minutes", hint: "Habit change" },
      { id: "tap_brush", label: "Turn off tap while brushing", hint: "Easy win" },
      { id: "sprinkler_walk", label: "Walk sprinklers & fix obvious spray/overspray", hint: "Outdoor check" },
    ],
  },
  {
    id: "h_shower_min",
    kind: "number",
    stepTitle: "Your habits",
    tags: ["habits"],
    required: true,
    prompt: "How long is your average shower?",
    helper: "Minutes. Best guess is perfect.",
    min: 1,
    max: 30,
    step: 1,
    placeholder: "e.g., 8",
  },
  {
    id: "h_leaks_checked",
    kind: "mcq",
    stepTitle: "Your habits",
    tags: ["habits", "leaks"],
    required: true,
    prompt: "Have you checked for leaks in the last 12 months?",
    helper: "A quick check often beats a big lifestyle change.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "c_budget",
    kind: "mcq",
    stepTitle: "Constraints",
    tags: ["constraint", "ethics"],
    required: true,
    prompt: "Upfront budget for water-saving upgrades this month?",
    helper: "We’ll tailor recommendations. Free options exist.",
    options: [
      { id: "0", label: "$0 (free only)" },
      { id: "low", label: "Under $25" },
      { id: "med", label: "$25–$100" },
      { id: "high", label: "$100+" },
      { id: "na", label: "Prefer not to say" },
    ],
  },
  {
    id: "k_drip_post",
    kind: "mcq",
    stepTitle: "Quick check",
    tags: ["knowledge", "prepost:drip", "phase:post"],
    required: true,
    prompt: "Quick check: a faucet dripping ~1 drip/second can waste about…",
    helper: "Same question — we measure learning.",
    options: [
      { id: "a", label: "≈ 300 gallons per year" },
      { id: "b", label: "≈ 3,000+ gallons per year" },
      { id: "c", label: "≈ 30,000 gallons per year" },
    ],
    correctOptionId: "b",
    explanationDefault: "EPA WaterSense: 3,000+ gallons/year from a 1‑drip/sec faucet.",
    sources: [SOURCES.EPA_FIX_LEAK_WEEK],
    shareFactShort: "A 1‑drip/sec faucet can waste 3,000+ gallons/year (EPA).",
  },
  {
    id: "k_irrig_post",
    kind: "mcq",
    stepTitle: "Quick check",
    tags: ["knowledge", "prepost:irrig", "phase:post"],
    required: true,
    prompt: "Quick check: a tiny ~1/32 inch irrigation leak can waste about…",
    helper: "Same question — we measure learning.",
    options: [
      { id: "a", label: "≈ 630 gallons per month" },
      { id: "b", label: "≈ 6,300 gallons per month" },
      { id: "c", label: "≈ 63,000 gallons per month" },
    ],
    correctOptionId: "b",
    explanationDefault: "EPA WaterSense: about 6,300 gallons/month from a tiny irrigation leak.",
    sources: [SOURCES.EPA_FIX_LEAK_WEEK],
    shareFactShort: "A tiny sprinkler leak can waste ~6,300 gallons/month (EPA).",
  },
  {
    id: "p_pledge",
    kind: "mcq",
    stepTitle: "Pick your 1‑week challenge",
    tags: ["pledge", "commitment"],
    required: true,
    prompt: "Pick ONE action you’ll do this week.",
    helper: "Small is fine. Done beats perfect.",
    options: [
      { id: "leak_check", label: "Run the 3‑minute leak check" },
      { id: "toilet_dye_test", label: "Dye-test my toilet (silent leaks)" },
      { id: "sprinkler_check", label: "Walk my sprinklers and fix obvious leaks/overspray" },
      { id: "shower_timer", label: "Set a shower timer (cut 2 minutes)" },
      { id: "install_aerator", label: "Install a faucet aerator" },
      { id: "savings_plan", label: "Build my WaterShortcut savings plan" },
      { id: "analyze_bill", label: "Analyze my water bill" },
    ],
  },
];

export const FLOW: string[] = [
  "q_home",
  "q_focus",
  "k_drip_pre",
  "k_irrig_pre",
  "k_toilet",
  "r_top2",
  "h_shower_min",
  "h_leaks_checked",
  "c_budget",
  "__impact_reveal__",
  "k_drip_post",
  "k_irrig_post",
  "p_pledge",
];

export const IMPACT_STATS: WaterIqImpactStat[] = [
  {
    id: "stat_leaks_9400",
    title: "Household leaks add up",
    value: "≈ 180 gallons/week (≈ 9,400/year)",
    why: "Leaks are common, quiet, and high-odds. Check first before you sacrifice comfort.",
    tags: ["indoor", "outdoor", "both"],
    sources: [SOURCES.EPA_STATS_FACTS],
  },
  {
    id: "stat_irrig_6300",
    title: "Tiny sprinkler leaks are huge",
    value: "≈ 6,300 gallons/month",
    why: "Outdoor leaks can burn through water fast without looking dramatic.",
    tags: ["outdoor", "both"],
    sources: [SOURCES.EPA_FIX_LEAK_WEEK],
  },
  {
    id: "stat_toilet_13000",
    title: "Toilet upgrade can be massive",
    value: "≈ 13,000 gallons/year (≈ $130/year)",
    why: "Toilets are always-on. Efficient fixtures compound savings daily.",
    tags: ["indoor", "both"],
    sources: [SOURCES.EPA_STATS_FACTS],
  },
  {
    id: "stat_brush_8",
    title: "A tiny habit still matters",
    value: "≈ 8 gallons/day",
    why: "Turning off the tap while brushing is a simple behavior win — great for households with $0 budget.",
    tags: ["indoor", "both"],
    sources: [SOURCES.EPA_STATS_FACTS],
  },
];

export function personaFor(score: number): WaterIqComputed["persona"] {
  if (score >= 9) {
    return { code: "WW", name: "Water Wizard", emoji: "🧙‍♂️", tagline: "High efficiency. High leverage. Rare combo." };
  }
  if (score >= 7) {
    return { code: "LS", name: "Leak Sleuth", emoji: "🕵️‍♂️", tagline: "You hunt silent waste. That’s power." };
  }
  if (score >= 4) {
    return { code: "PS", name: "Practical Saver", emoji: "🛠️", tagline: "You focus on moves that actually matter." };
  }
  return { code: "CS", name: "Curious Starter", emoji: "💧", tagline: "You’re building a better water compass." };
}

export function badgeFor(input: {
  focus: "indoor" | "outdoor" | "both";
  budgetTier: WaterIqComputed["budgetTier"];
  answers: WaterIqAnswers;
  knowledgeDelta: number;
}): WaterIqComputed["badge"] {
  const checkedLeaks = String(input.answers["h_leaks_checked"] ?? "") === "yes";
  const focus = input.focus;

  if (focus === "outdoor") {
    return {
      id: "irrigation_optimizer",
      label: "Irrigation Optimizer",
      emoji: "🌿",
      reason: "Outdoor focus: your biggest wins are often outside.",
    };
  }
  if (checkedLeaks) {
    return { id: "leak_detective", label: "Leak Detective", emoji: "🔍", reason: "Leak awareness is high leverage." };
  }
  if (input.budgetTier === "high" || input.budgetTier === "med") {
    return {
      id: "bathroom_roi_hero",
      label: "Bathroom ROI Hero",
      emoji: "🚽",
      reason: "You can turn upgrades into compounding savings.",
    };
  }
  if (input.knowledgeDelta > 0) {
    return { id: "habit_hacker", label: "Habit Hacker", emoji: "⏱️", reason: "You learned fast and can execute small wins." };
  }
  return { id: "starter", label: "Starter", emoji: "✨", reason: "Begin with the quickest, cheapest wins." };
}

export function encodeToken(token: WaterIqShareTokenV2): string {
  return base64UrlEncode(JSON.stringify(token));
}

export function decodeToken(encoded: string): WaterIqShareTokenV2 | null {
  try {
    const parsed = JSON.parse(base64UrlDecode(encoded));
    if (!parsed || parsed.v !== 2) return null;
    if (typeof parsed.score !== "number" || typeof parsed.k !== "number" || typeof parsed.h !== "number") return null;
    if (typeof parsed.persona !== "string" || typeof parsed.badge !== "string" || typeof parsed.hook !== "string") return null;
    if (!Array.isArray(parsed.moves)) return null;
    return parsed as WaterIqShareTokenV2;
  } catch {
    return null;
  }
}

export function computeWaterIq(variant: WaterIqVariant, answers: WaterIqAnswers): WaterIqComputed {
  const homeSituation = asHome(answers["q_home"]);
  const focus = asFocus(answers["q_focus"]);
  const budgetTier = asBudget(answers["c_budget"]);

  const preDrip = isCorrect("k_drip_pre", answers);
  const postDrip = isCorrect("k_drip_post", answers);
  const preIrr = isCorrect("k_irrig_pre", answers);
  const postIrr = isCorrect("k_irrig_post", answers);

  const preScore = (preDrip ? 1 : 0) + (preIrr ? 1 : 0);
  const postScore = (postDrip ? 1 : 0) + (postIrr ? 1 : 0);
  const delta = postScore - preScore;

  const uniqueKnowledgeIds = ["k_drip_post", "k_irrig_post", "k_toilet"];
  const knowledgeScore = uniqueKnowledgeIds.reduce((s, id) => s + (isCorrect(id, answers) ? 1 : 0), 0);

  const shower = coerceNumber(answers["h_shower_min"]);
  const showerScore = shower == null ? 0 : shower <= 6 ? 2 : shower <= 8 ? 1 : 0;
  const leakCheckScore = String(answers["h_leaks_checked"] ?? "") === "yes" ? 1 : 0;
  const budgetScore = budgetTier === "0" || budgetTier === "low" ? 1 : 0;
  const habitScore = clamp(showerScore + leakCheckScore + budgetScore, 0, 4);

  const knowledgeScaled = Math.round((knowledgeScore / 3) * 6);
  const totalScore = clamp(knowledgeScaled + habitScore, 0, 10);

  const persona = personaFor(totalScore);
  const badge = badgeFor({ focus, budgetTier, answers, knowledgeDelta: delta });
  const segmentKey = segmentKeyFrom({ homeSituation, focus, budgetTier });
  const pledge = String(answers["p_pledge"] ?? "");
  const impactRevealStats = pickImpactStats(focus);
  const recommendedMoves = recommendMoves({ homeSituation, focus, budgetTier, answers, pledge });
  const hook = pickHookFactId(answers);
  const hookFact = hookFactById(hook);

  return {
    version: 2,
    variant,
    score: { total: totalScore, knowledge: knowledgeScaled, habit: habitScore },
    knowledgeDelta: { pre: preScore, post: postScore, delta },
    persona,
    badge,
    hookFact,
    focus,
    segmentKey,
    recommendedMoves,
    impactRevealStats,
    pledge,
    budgetTier,
    homeSituation,
  };
}

export function buildShareToken(computed: WaterIqComputed): WaterIqShareTokenV2 {
  const nonce = Math.random().toString(36).slice(2, 8);
  const ts = Math.floor(Date.now() / 1000);
  return {
    v: 2,
    n: nonce,
    ts,
    score: computed.score.total,
    k: computed.score.knowledge,
    h: computed.score.habit,
    delta: computed.knowledgeDelta.delta,
    persona: computed.persona.code,
    badge: computed.badge.id,
    hook: computed.hookFact.id,
    moves: computed.recommendedMoves.slice(0, 3).map((m) => m.id),
  };
}

export function segmentKeyFrom(input: {
  homeSituation: WaterIqComputed["homeSituation"];
  focus: WaterIqComputed["focus"];
  budgetTier: WaterIqComputed["budgetTier"];
}): string {
  return `${input.homeSituation}|${input.focus}|${input.budgetTier}`;
}

export function hookFactById(id: string): { id: string; short: string; sources: WaterIqSource[] } {
  const map: Record<string, { short: string; sources: WaterIqSource[] }> = {
    drip: { short: "A 1‑drip/sec faucet can waste 3,000+ gallons/year (EPA).", sources: [SOURCES.EPA_FIX_LEAK_WEEK] },
    irrig: { short: "A tiny sprinkler leak can waste ~6,300 gallons/month (EPA).", sources: [SOURCES.EPA_FIX_LEAK_WEEK] },
    toilet: { short: "WaterSense toilets can save ~13,000 gallons/year (EPA).", sources: [SOURCES.EPA_STATS_FACTS] },
    leaks: { short: "Household leaks can waste ~9,400 gallons/year (EPA).", sources: [SOURCES.EPA_STATS_FACTS] },
  };
  const item = map[id] ?? map.leaks;
  return { id, short: item.short, sources: item.sources };
}

function pickHookFactId(answers: WaterIqAnswers): string {
  const missedDrip = !isCorrect("k_drip_post", answers);
  const missedIrr = !isCorrect("k_irrig_post", answers);
  const missedToilet = !isCorrect("k_toilet", answers);

  if (missedIrr) return "irrig";
  if (missedDrip) return "drip";
  if (missedToilet) return "toilet";
  return "leaks";
}

function pickImpactStats(focus: "indoor" | "outdoor" | "both"): WaterIqImpactStat[] {
  const pool = IMPACT_STATS.filter((s) => s.tags.includes(focus) || (focus === "both" && s.tags.includes("both")));
  const leaks = IMPACT_STATS.find((s) => s.id === "stat_leaks_9400") as WaterIqImpactStat;
  const others = pool.filter((s) => s.id !== leaks.id);
  const chosen: WaterIqImpactStat[] = [leaks];
  for (const s of others) {
    if (chosen.length >= 3) break;
    if (!chosen.find((x) => x.id === s.id)) chosen.push(s);
  }
  return chosen.slice(0, 3);
}

export function moveMeta(id: WaterIqMoveId): { title: string; href: string } {
  const meta: Record<WaterIqMoveId, { title: string; href: string }> = {
    leak_check: { title: "3‑minute leak check", href: "/leak-check" },
    toilet_dye_test: { title: "Dye test: toilet leaks", href: "/leak-check" },
    fix_faucet: { title: "Fix a dripping faucet", href: "/learn/water-saving-tips" },
    sprinkler_check: { title: "Sprinkler walk-through", href: "/guides" },
    shower_timer: { title: "Shower timer plan", href: "/calculators/shower" },
    install_aerator: { title: "Install a faucet aerator", href: "/learn/water-saving-tips" },
    watersense_toilet: { title: "Upgrade to WaterSense toilet", href: "/learn/water-saving-tips" },
    irrigation_controller: { title: "Irrigation controller upgrade", href: "/guides" },
    savings_plan: { title: "Build a savings plan", href: "/savings-plan" },
    analyze_bill: { title: "Analyze your water bill", href: "/analyze-water-bill" },
  };
  return meta[id];
}

function recommendMoves(input: {
  homeSituation: WaterIqComputed["homeSituation"];
  focus: WaterIqComputed["focus"];
  budgetTier: WaterIqComputed["budgetTier"];
  answers: WaterIqAnswers;
  pledge: string;
}): WaterIqComputed["recommendedMoves"] {
  const { homeSituation, focus, budgetTier, answers, pledge } = input;
  const moves: WaterIqMoveId[] = [];

  const checkedLeaks = String(answers["h_leaks_checked"] ?? "") === "yes";
  const constrained = budgetTier === "0" || budgetTier === "low" || homeSituation === "renter";

  if (!checkedLeaks) moves.push("leak_check");

  if (focus === "outdoor") {
    moves.push("sprinkler_check");
    if (!constrained) moves.push("irrigation_controller");
  } else {
    moves.push("toilet_dye_test");
    if (!constrained) moves.push("watersense_toilet");
    moves.push("install_aerator");
  }

  if (pledge === "analyze_bill") moves.unshift("analyze_bill");
  if (pledge === "savings_plan") moves.unshift("savings_plan");

  moves.push("savings_plan");

  const uniq = Array.from(new Set(moves)).slice(0, 3);

  return uniq.map((id) => {
    const meta = moveMeta(id);
    const costLabel =
      budgetTier === "0" || homeSituation === "renter"
        ? "Free / low-cost"
        : budgetTier === "low"
          ? "Low-cost"
          : budgetTier === "med"
            ? "Mid-cost"
            : budgetTier === "high"
              ? "Higher-cost (optional)"
              : "Varies";

    const why =
      id === "leak_check"
        ? homeSituation === "renter"
          ? "Leak checks help you document issues for a landlord without spending money."
          : "Leaks are common and high-impact. Start here before you chase tiny habits."
        : id === "sprinkler_check"
          ? "Outdoor issues can waste thousands quickly — a walk-through is fast and revealing."
          : id === "toilet_dye_test"
            ? "Silent toilet leaks are common and cheap to detect."
            : id === "watersense_toilet"
              ? "If you can upgrade, toilets offer large year-round savings (EPA estimates)."
              : id === "install_aerator"
                ? "One of the simplest low-cost upgrades with immediate savings."
                : id === "irrigation_controller"
                  ? "If you irrigate, a smarter controller can reduce waste without lifestyle changes."
                  : id === "analyze_bill"
                    ? "Bills reveal spikes, tier jumps, and ‘silent’ waste patterns."
                    : "Get a prioritized checklist—impact first, effort second.";

    return { id, title: meta.title, href: meta.href, why, costLabel };
  });
}

export function shareChallengeUrl(origin: string, token: string): string {
  return `${origin}/water-iq?ref=${token}`;
}

export function shareResultUrl(origin: string, token: string): string {
  return `${origin}/water-iq/r/${token}`;
}

function isCorrect(qid: string, answers: WaterIqAnswers): boolean {
  const q = QUESTIONS.find((qq) => qq.id === qid) as WaterIqMCQ | undefined;
  if (!q || q.kind !== "mcq" || !q.correctOptionId) return false;
  return String(answers[qid] ?? "") === q.correctOptionId;
}

function asFocus(v: unknown): "indoor" | "outdoor" | "both" {
  const s = String(v ?? "");
  if (s === "indoor" || s === "outdoor" || s === "both") return s;
  return "both";
}

function asHome(v: unknown): "homeowner" | "renter" | "other" {
  const s = String(v ?? "");
  if (s === "homeowner" || s === "renter" || s === "other") return s;
  return "other";
}

function asBudget(v: unknown): WaterIqComputed["budgetTier"] {
  const s = String(v ?? "na");
  if (s === "0" || s === "low" || s === "med" || s === "high" || s === "na") return s;
  return "na";
}

function coerceNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function simpleHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function base64UrlEncode(utf8: string): string {
  const bytes = new TextEncoder().encode(utf8);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
