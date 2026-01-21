export const REFERRAL_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export const REFERRAL_TOKEN_TTL_MS = REFERRAL_TOKEN_TTL_SECONDS * 1000;

export type StoredReferralToken = {
  token: string;
  issuedAt: number;
};

export const isReferralTokenExpired = (issuedAtMs: number, nowMs = Date.now()): boolean =>
  nowMs - issuedAtMs > REFERRAL_TOKEN_TTL_MS;

export const parseStoredReferralToken = (raw: string): StoredReferralToken | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "string") {
      return { token: parsed, issuedAt: 0 };
    }
    if (typeof parsed === "object" && parsed !== null) {
      const record = parsed as Partial<StoredReferralToken>;
      if (typeof record.token === "string" && typeof record.issuedAt === "number") {
        return { token: record.token, issuedAt: record.issuedAt };
      }
    }
  } catch {
    return { token: raw, issuedAt: 0 };
  }
  return null;
};

export const formatStoredReferralToken = (token: string, issuedAtMs = Date.now()): string =>
  JSON.stringify({ token, issuedAt: issuedAtMs } satisfies StoredReferralToken);
