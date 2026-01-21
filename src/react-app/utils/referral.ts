const REFERRAL_TOKEN_KEY = "ws_referral_token";
const REFERRER_TOKEN_KEY = "ws_referrer_token";
const REFERRAL_CLAIM_KEY = "ws_referral_claimed";

type ReferralClaimResponse = {
  credits?: number;
  message?: string;
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

export const fetchReferralToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(REFERRAL_TOKEN_KEY);
    if (stored) return stored;
  } catch {
    // ignore storage errors
  }

  const response = await fetch("/api/referral/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { token?: string | null };
  if (payload?.token) {
    try {
      window.localStorage.setItem(REFERRAL_TOKEN_KEY, payload.token);
    } catch {
      // ignore storage errors
    }
    return payload.token;
  }
  return null;
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

  const response = await fetch("/api/referral/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token: refToken }),
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as ReferralClaimResponse & { claimed?: boolean };
  if (payload?.claimed) {
    try {
      window.localStorage.setItem(REFERRAL_CLAIM_KEY, "true");
    } catch {
      // ignore storage errors
    }
  }
  return payload;
};

