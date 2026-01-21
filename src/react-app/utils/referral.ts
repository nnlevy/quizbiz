import {
  formatStoredReferralToken,
  isReferralTokenExpired,
  parseStoredReferralToken,
  type StoredReferralToken,
} from "../../shared/referral";

const REFERRAL_TOKEN_KEY = "ws_referral_token";
const REFERRER_TOKEN_KEY = "ws_referrer_token";
const REFERRAL_CLAIM_KEY = "ws_referral_claimed";

type ReferralClaimResponse = {
  credits?: number;
  message?: string;
  error?: string;
};

const clearStoredReferralToken = () => {
  try {
    window.localStorage.removeItem(REFERRAL_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

const clearStoredReferrerToken = () => {
  try {
    window.localStorage.removeItem(REFERRER_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

const readStoredReferralToken = (): StoredReferralToken | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(REFERRAL_TOKEN_KEY);
    if (!stored) return null;
    const parsed = parseStoredReferralToken(stored);
    if (!parsed) {
      clearStoredReferralToken();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const getCachedReferralToken = (nowMs = Date.now()): string | null => {
  const stored = readStoredReferralToken();
  if (!stored) return null;
  if (stored.issuedAt <= 0 || isReferralTokenExpired(stored.issuedAt, nowMs)) {
    clearStoredReferralToken();
    return null;
  }
  return stored.token;
};

const fetchFreshReferralToken = async (): Promise<string | null> => {
  const response = await fetch("/api/referral/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { token?: string | null };
  if (payload?.token) {
    try {
      window.localStorage.setItem(REFERRAL_TOKEN_KEY, formatStoredReferralToken(payload.token));
    } catch {
      // ignore storage errors
    }
    return payload.token;
  }
  return null;
};

export const appendReferralToUrl = (url: string, token: string | null) => {
  if (!token) return url;
  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : undefined);
    parsed.searchParams.set("ref", token);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}ref=${encodeURIComponent(token)}`;
  }
};

export const fetchReferralToken = async (options?: { forceRefresh?: boolean }): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  if (!options?.forceRefresh) {
    const cached = getCachedReferralToken();
    if (cached) return cached;
  }
  return fetchFreshReferralToken();
};

export const captureReferralFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return null;
  try {
    window.localStorage.setItem(REFERRER_TOKEN_KEY, ref);
  } catch {
    // ignore storage errors
  }
  return ref;
};

export const claimReferralCredit = async (): Promise<ReferralClaimResponse | null> => {
  if (typeof window === "undefined") return null;
  let refToken: string | null = null;
  try {
    refToken = window.localStorage.getItem(REFERRER_TOKEN_KEY);
    const claimed = window.localStorage.getItem(REFERRAL_CLAIM_KEY) === "true";
    if (!refToken || claimed) return null;
  } catch {
    return null;
  }

  const claimWithToken = async (
    token: string,
    hasRetried: boolean,
  ): Promise<ReferralClaimResponse | null> => {
    const response = await fetch("/api/referral/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token }),
    });
    const payload = (await response
      .json()
      .catch(() => null)) as (ReferralClaimResponse & { claimed?: boolean }) | null;
    if (!response.ok) {
      const errorMessage = payload?.error ?? "";
      const isExpired =
        response.status === 404 ||
        response.status === 410 ||
        /expired/i.test(errorMessage) ||
        /not found/i.test(errorMessage);
      if (!hasRetried && isExpired) {
        clearStoredReferrerToken();
        clearStoredReferralToken();
        const freshToken = await fetchReferralToken({ forceRefresh: true });
        if (freshToken) {
          return claimWithToken(freshToken, true);
        }
      }
      return null;
    }
    if (payload?.claimed) {
      try {
        window.localStorage.setItem(REFERRAL_CLAIM_KEY, "true");
      } catch {
        // ignore storage errors
      }
    }
    return payload;
  };

  return claimWithToken(refToken, false);
};
