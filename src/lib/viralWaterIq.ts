export type ViralWaterIqInputs = {
  showerMinutes: number;
  sinkMinutes: number;
  irrigationMinutes: number;
  hasBillUpload: boolean;
  hasLeakInteraction: boolean;
};

export type ViralWaterIqBadgeId =
  | "leak_detective"
  | "utility_insider"
  | "water_roi_optimizer"
  | "efficiency_thinker";

export type ViralWaterIqBadge = {
  id: ViralWaterIqBadgeId;
  label: string;
  description: string;
};

export type ViralWaterIqPayload = {
  v: 1;
  sh: number;
  si: number;
  ir: number;
  bl: 0 | 1;
  lk: 0 | 1;
  sc: number;
  bd: ViralWaterIqBadgeId;
  in: string;
};

const BADGE_IDS = new Set<ViralWaterIqBadgeId>([
  "leak_detective",
  "utility_insider",
  "water_roi_optimizer",
  "efficiency_thinker",
]);

const SHOWER_RANGE = { min: 5, max: 30 };
const SINK_RANGE = { min: 5, max: 30 };
const IRRIGATION_RANGE = { min: 1, max: 20 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const normalizeViralInputs = (inputs: ViralWaterIqInputs) => ({
  showerMinutes: clamp(Math.round(inputs.showerMinutes), SHOWER_RANGE.min, SHOWER_RANGE.max),
  sinkMinutes: clamp(Math.round(inputs.sinkMinutes), SINK_RANGE.min, SINK_RANGE.max),
  irrigationMinutes: clamp(Math.round(inputs.irrigationMinutes), IRRIGATION_RANGE.min, IRRIGATION_RANGE.max),
  hasBillUpload: Boolean(inputs.hasBillUpload),
  hasLeakInteraction: Boolean(inputs.hasLeakInteraction),
});

const scoreFromRange = (value: number, min: number, max: number, weight: number) => {
  const normalized = (max - value) / (max - min);
  return Math.round(normalized * weight);
};

export const computeWaterIqScore = (inputs: ViralWaterIqInputs): number => {
  const normalized = normalizeViralInputs(inputs);
  const showerScore = scoreFromRange(
    normalized.showerMinutes,
    SHOWER_RANGE.min,
    SHOWER_RANGE.max,
    30,
  );
  const sinkScore = scoreFromRange(
    normalized.sinkMinutes,
    SINK_RANGE.min,
    SINK_RANGE.max,
    25,
  );
  const irrigationScore = scoreFromRange(
    normalized.irrigationMinutes,
    IRRIGATION_RANGE.min,
    IRRIGATION_RANGE.max,
    25,
  );
  const billScore = normalized.hasBillUpload ? 10 : 0;
  const leakScore = normalized.hasLeakInteraction ? 10 : 0;

  return clamp(showerScore + sinkScore + irrigationScore + billScore + leakScore, 0, 100);
};

export const assignWaterIqBadge = (inputs: ViralWaterIqInputs, score: number): ViralWaterIqBadge => {
  const normalized = normalizeViralInputs(inputs);

  // Deterministic rules prioritize explicit signals (leaks + bill uploads) before score tiers.
  if (normalized.hasLeakInteraction) {
    return BADGE_COPY.leak_detective;
  }
  if (normalized.hasBillUpload) {
    return BADGE_COPY.utility_insider;
  }
  if (score >= 75) {
    return BADGE_COPY.water_roi_optimizer;
  }
  return BADGE_COPY.efficiency_thinker;
};

export const buildInsightCacheKey = (inputs: ViralWaterIqInputs, score: number, badgeId: ViralWaterIqBadgeId) => {
  const normalized = normalizeViralInputs(inputs);
  return JSON.stringify({
    sh: normalized.showerMinutes,
    si: normalized.sinkMinutes,
    ir: normalized.irrigationMinutes,
    bl: normalized.hasBillUpload ? 1 : 0,
    lk: normalized.hasLeakInteraction ? 1 : 0,
    sc: score,
    bd: badgeId,
  });
};

const binaryToBase64 = (binary: string): string | null => {
  if (typeof btoa === "function") {
    return btoa(binary);
  }
  const maybeBuffer = (globalThis as typeof globalThis & {
    Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
  }).Buffer;
  return maybeBuffer ? maybeBuffer.from(binary, "binary").toString("base64") : null;
};

const base64ToBinary = (value: string): string | null => {
  if (typeof atob === "function") {
    return atob(value);
  }
  const maybeBuffer = (globalThis as typeof globalThis & {
    Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
  }).Buffer;
  if (maybeBuffer) {
    return maybeBuffer.from(value, "base64").toString("binary");
  }
  return null;
};

const encodeBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 = binaryToBase64(binary);
  if (!base64) {
    throw new Error("Base64 encoding unavailable");
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeBase64Url = (value: string): string | null => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  try {
    const binary = base64ToBinary(padded);
    if (!binary) return null;
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
};

export const encodeViralPayload = (payload: ViralWaterIqPayload): string =>
  encodeBase64Url(JSON.stringify(payload));

export const decodeViralPayload = (token: string): ViralWaterIqPayload | null => {
  const decoded = decodeBase64Url(token);
  if (!decoded) return null;
  try {
    const parsed = JSON.parse(decoded) as ViralWaterIqPayload;
    if (parsed?.v !== 1) return null;
    if (
      typeof parsed.sh !== "number" ||
      typeof parsed.si !== "number" ||
      typeof parsed.ir !== "number" ||
      typeof parsed.sc !== "number"
    ) {
      return null;
    }
    if (parsed.bl !== 0 && parsed.bl !== 1) return null;
    if (parsed.lk !== 0 && parsed.lk !== 1) return null;
    if (!parsed.in || typeof parsed.in !== "string") return null;
    if (!BADGE_IDS.has(parsed.bd)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const buildViralPayload = (
  inputs: ViralWaterIqInputs,
  score: number,
  badgeId: ViralWaterIqBadgeId,
  insight: string,
): ViralWaterIqPayload => {
  const normalized = normalizeViralInputs(inputs);
  return {
    v: 1,
    sh: normalized.showerMinutes,
    si: normalized.sinkMinutes,
    ir: normalized.irrigationMinutes,
    bl: normalized.hasBillUpload ? 1 : 0,
    lk: normalized.hasLeakInteraction ? 1 : 0,
    sc: score,
    bd: badgeId,
    in: insight,
  };
};

const BADGE_COPY: Record<ViralWaterIqBadgeId, ViralWaterIqBadge> = {
  leak_detective: {
    id: "leak_detective",
    label: "Leak Detective",
    description: "Spotted leak signals and stayed alert to hidden waste.",
  },
  utility_insider: {
    id: "utility_insider",
    label: "Utility Insider",
    description: "Matched habits to bill data for clearer decisions.",
  },
  water_roi_optimizer: {
    id: "water_roi_optimizer",
    label: "Water ROI Optimizer",
    description: "Focuses on high-return usage tweaks and upgrades.",
  },
  efficiency_thinker: {
    id: "efficiency_thinker",
    label: "Efficiency Thinker",
    description: "Exploring efficient habits with steady improvements.",
  },
};

export const getBadgeCopy = (badgeId: ViralWaterIqBadgeId): ViralWaterIqBadge => BADGE_COPY[badgeId];

const badgeIconById: Record<ViralWaterIqBadgeId, string> = {
  leak_detective: `
    <circle cx="70" cy="72" r="24" fill="none" stroke="currentColor" stroke-width="6" />
    <path d="M86 88 L110 110" stroke="currentColor" stroke-width="8" stroke-linecap="round" />
    <path d="M70 42 C62 56 56 66 56 76 A14 14 0 0 0 84 76 C84 66 78 56 70 42" fill="none" stroke="currentColor" stroke-width="6" />
  `,
  utility_insider: `
    <rect x="48" y="52" width="44" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="6" />
    <path d="M52 66 H88" stroke="currentColor" stroke-width="6" />
    <path d="M52 80 H88" stroke="currentColor" stroke-width="6" />
    <path d="M70 36 C60 52 56 60 56 68 A14 14 0 0 0 84 68 C84 60 80 52 70 36" fill="none" stroke="currentColor" stroke-width="6" />
  `,
  water_roi_optimizer: `
    <path d="M46 90 L70 66 L88 78 L112 54" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M112 54 L108 70" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" />
    <path d="M112 54 L96 58" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" />
    <path d="M70 40 C60 56 56 64 56 72 A14 14 0 0 0 84 72 C84 64 80 56 70 40" fill="none" stroke="currentColor" stroke-width="6" />
  `,
  efficiency_thinker: `
    <circle cx="70" cy="70" r="26" fill="none" stroke="currentColor" stroke-width="6" />
    <path d="M70 54 V70 L84 80" stroke="currentColor" stroke-width="6" stroke-linecap="round" />
    <path d="M70 36 C60 52 56 60 56 68 A14 14 0 0 0 84 68 C84 60 80 52 70 36" fill="none" stroke="currentColor" stroke-width="6" />
  `,
};

export const buildBadgeSvg = (
  badgeId: ViralWaterIqBadgeId,
  options?: { score?: number; includeXmlHeader?: boolean },
) => {
  const badge = getBadgeCopy(badgeId);
  const scoreLabel = typeof options?.score === "number" ? `${options.score}` : "";
  const xmlHeader =
    options?.includeXmlHeader === false ? "" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  return `${xmlHeader}<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" role="img" aria-label="${badge.label}">
  <defs>
    <linearGradient id="badgeGradient" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e6f7ff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="344" height="184" rx="24" fill="url(#badgeGradient)" stroke="#0f172a" stroke-width="4" />
  <circle cx="76" cy="86" r="44" fill="#e0f2fe" stroke="#0f172a" stroke-width="4" />
  <g transform="translate(8 6)" fill="none" stroke="currentColor" color="#0f172a">
    ${badgeIconById[badgeId]}
  </g>
  <text x="140" y="78" font-size="22" font-family="system-ui, -apple-system, sans-serif" fill="#0f172a" font-weight="700">${badge.label}</text>
  <text x="140" y="104" font-size="14" font-family="system-ui, -apple-system, sans-serif" fill="#0f172a" opacity="0.75">${badge.description}</text>
  ${scoreLabel ? `<text x="324" y="54" text-anchor="end" font-size="24" font-family="system-ui, -apple-system, sans-serif" fill="#0f172a" font-weight="800">${scoreLabel}/100</text>` : ""}
  <text x="140" y="148" font-size="12" font-family="system-ui, -apple-system, sans-serif" fill="#0f172a" opacity="0.6">Water IQ Badge</text>
</svg>`;
};
