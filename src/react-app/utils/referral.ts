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

const safeStorageRead = (storage: Storage | null, key: string): StoredReferralToken | null => {
  if (!storage) return null;
  try {
    const stored = storage.getItem(key);
    if (!stored) return null;
    const parsed = parseStoredReferralToken(stored);
    if (!parsed) {
      storage.removeItem(key);
      return null;
    }
    if (parsed.issuedAt <= 0 || isReferralTokenExpired(parsed.issuedAt)) {
      storage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const safeStorageWrite = (storage: Storage | null, key: string, token: string) => {
  if (!storage) return;
  try {
    storage.setItem(key, formatStoredReferralToken(token));
  } catch {
    // ignore storage errors
  }
};

const clearStoredReferralToken = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(REFERRAL_TOKEN_KEY);
  } catch {
    // ignore
  }
  try {
    window.localStorage.removeItem(REFERRAL_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

const clearStoredReferrerToken = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(REFERRER_TOKEN_KEY);
  } catch {
    // ignore
  }
  try {
    window.localStorage.removeItem(REFERRER_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

const getCachedReferralToken = (nowMs = Date.now()): string | null => {
  if (typeof window === "undefined") return null;
  const sessionStored = safeStorageRead(window.sessionStorage, REFERRAL_TOKEN_KEY);
  if (sessionStored?.token) return sessionStored.token;
  const localStored = safeStorageRead(window.localStorage, REFERRAL_TOKEN_KEY);
  if (!localStored) return null;
  if (localStored.issuedAt <= 0 || isReferralTokenExpired(localStored.issuedAt, nowMs)) {
    clearStoredReferralToken();
    return null;
  }
  return localStored.token;
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
      safeStorageWrite(window.sessionStorage, REFERRAL_TOKEN_KEY, payload.token);
      safeStorageWrite(window.localStorage, REFERRAL_TOKEN_KEY, payload.token);
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
    if (parsed.searchParams.has("ref")) return parsed.toString();
    parsed.searchParams.set("ref", token);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    if (url.includes("ref=")) return url;
    return `${url}${separator}ref=${encodeURIComponent(token)}`;
  }
};

export const getActiveReferralToken = () => {
  if (typeof window === "undefined") return null;
  const sessionToken = safeStorageRead(window.sessionStorage, REFERRER_TOKEN_KEY);
  if (sessionToken?.token) return sessionToken.token;
  const localToken = safeStorageRead(window.localStorage, REFERRER_TOKEN_KEY);
  return localToken?.token ?? null;
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
    safeStorageWrite(window.sessionStorage, REFERRER_TOKEN_KEY, ref);
    safeStorageWrite(window.localStorage, REFERRER_TOKEN_KEY, ref);
  } catch {
    // ignore storage errors
  }
  return ref;
};

export const claimReferralCredit = async (): Promise<ReferralClaimResponse | null> => {
  if (typeof window === "undefined") return null;
  let refToken: string | null = null;
  try {
    refToken = getActiveReferralToken();
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
