export type ShareVariantId = "A" | "B" | "C";

export type ShareVariant = {
  id: ShareVariantId;
  text: string;
};

export type SignedShareTokenPayload = {
  shareTokenId: string;
  refCode: string;
  exp: number;
};

export type ShareTokenState = "created" | "finalized" | "expired" | "void";

export type ShareTokenRecord = {
  state: ShareTokenState;
  credits_awarded?: number | null;
  finalize_reason?: string | null;
};

export const SHARE_VARIANTS: ShareVariant[] = [
  {
    id: "A",
    text: "I just found out how much water I’m wasting at home 😳\n@WaterShortcut makes it weirdly simple to fix.\nWorth checking if you pay a water bill 👉 {shareUrl}",
  },
  {
    id: "B",
    text: "Small changes = big water savings 💧\nI’m using @WaterShortcut to cut my bill without thinking about it.\n{shareUrl}",
  },
  {
    id: "C",
    text: "Didn’t expect a water bill tool to be this useful.\n@WaterShortcut surprised me.\n{shareUrl}",
  },
];

export const SHARE_CREDIT_AMOUNT = 5;
export const SHARE_START_LIMIT_PER_HOUR = 3;
export const SHARE_FINALIZE_LIMIT_PER_DAY = 5;
export const SHARE_TOKEN_TTL_MS = 10 * 60 * 1000;
export const SHARE_AWARD_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const SHARE_MIN_FINALIZE_DELAY_MS = 3 * 1000;

const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const toBase64Url = (value: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "=");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const textEncoder = new TextEncoder();

export const pickShareVariant = (variantId?: string | null): ShareVariant => {
  if (variantId) {
    const match = SHARE_VARIANTS.find((variant) => variant.id === variantId);
    if (match) return match;
  }
  const index = Math.floor(Math.random() * SHARE_VARIANTS.length);
  return SHARE_VARIANTS[index];
};

export const buildShareCopy = (variant: ShareVariant, shareUrl: string): string =>
  variant.text.replace("{shareUrl}", shareUrl);

export const createRefCode = (length = 9): string => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => BASE62_ALPHABET[value % BASE62_ALPHABET.length]).join("");
};

export const hashWithSalt = async (value: string, salt: string): Promise<string> => {
  const data = textEncoder.encode(`${salt}${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const signShareToken = async (
  payload: SignedShareTokenPayload,
  secret: string,
): Promise<string> => {
  const encodedPayload = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(encodedPayload),
  );
  const encodedSignature = toBase64Url(signature);
  return `${encodedPayload}.${encodedSignature}`;
};

export const verifyShareToken = async (
  token: string,
  secret: string,
): Promise<SignedShareTokenPayload | null> => {
  const [payloadSegment, signatureSegment] = token.split(".");
  if (!payloadSegment || !signatureSegment) return null;
<<<<<<< HEAD
  let payload: SignedShareTokenPayload;
=======
  let payload: SignedShareTokenPayload | null = null;
>>>>>>> origin/main
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadSegment))) as
      | SignedShareTokenPayload
      | null;
  } catch {
    return null;
  }
  if (!payload || typeof payload.exp !== "number") return null;
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signatureSegment),
    textEncoder.encode(payloadSegment),
  );
  return isValid ? payload : null;
};

export const buildDateBucket = (timestampMs: number): string => {
  const date = new Date(timestampMs);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const resolveFinalizeOutcome = (record: ShareTokenRecord) => {
  if (record.state === "finalized") {
    return { status: "granted" as const, credits: record.credits_awarded ?? 0 };
  }
  if (record.state === "expired") {
    return { status: "rejected" as const, reason: "Expired token" };
  }
  if (record.state === "void") {
    return {
      status: "rejected" as const,
      reason: record.finalize_reason || "Already claimed this week",
    };
  }
  return null;
};

export const isWithinWindow = (timestampMs: number, nowMs: number, windowMs: number): boolean =>
  nowMs - timestampMs < windowMs;

export const sanitizeLandingPath = (value: string | null | undefined): string => {
  if (!value) return "/";
  if (value.startsWith("//")) return "/";
  if (!value.startsWith("/")) return "/";
  return value;
};

export const buildReferralRedirectLocation = (
  origin: string,
  landingPath: string,
  variantId: ShareVariantId,
): string => {
  const safePath = sanitizeLandingPath(landingPath);
  const url = new URL(safePath, origin);
  url.searchParams.set("utm_source", "x");
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_campaign", "credit_share");
  url.searchParams.set("utm_content", variantId);
  return url.toString();
};

export const buildAttributionCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number,
  domain?: string,
): string => {
  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "Secure",
    "SameSite=Lax",
  ];
  if (domain) {
    cookieParts.push(`Domain=${domain}`);
  }
  return cookieParts.join("; ");
};
