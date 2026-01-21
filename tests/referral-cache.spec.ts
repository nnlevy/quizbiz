import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchReferralToken } from "../src/react-app/utils/referral";
import { formatStoredReferralToken, REFERRAL_TOKEN_TTL_MS } from "../src/shared/referral";

const mockFetch = (token: string) =>
  vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

describe("referral token cache", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-02-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns cached token when fresh", async () => {
    const now = Date.now();
    localStorage.setItem(
      "ws_referral_token",
      formatStoredReferralToken("cached-token", now - REFERRAL_TOKEN_TTL_MS + 1_000),
    );

    const fetchSpy = mockFetch("fresh-token");
    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);

    const token = await fetchReferralToken();

    expect(token).toBe("cached-token");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("refreshes token when expired", async () => {
    const now = Date.now();
    localStorage.setItem(
      "ws_referral_token",
      formatStoredReferralToken("stale-token", now - REFERRAL_TOKEN_TTL_MS - 1_000),
    );

    const fetchSpy = mockFetch("fresh-token");
    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);

    const token = await fetchReferralToken();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(token).toBe("fresh-token");
    const stored = localStorage.getItem("ws_referral_token");
    expect(stored).toContain("fresh-token");
    const sessionStored = sessionStorage.getItem("ws_referral_token");
    expect(sessionStored).toContain("fresh-token");
  });
});
