import { describe, expect, it } from "vitest";

import { buildAttributionCookie, buildReferralRedirectLocation } from "../src/worker/growthUtils";

describe("growth referral redirect", () => {
  it("builds redirect urls with UTM params", () => {
    const location = buildReferralRedirectLocation("https://watershortcut.com", "/", "B");
    expect(location).toContain("utm_source=x");
    expect(location).toContain("utm_medium=share");
    expect(location).toContain("utm_campaign=credit_share");
    expect(location).toContain("utm_content=B");
  });

  it("sets attribution cookies with domain when provided", () => {
    const cookie = buildAttributionCookie("ws_ref_code", "abc123", 3600, "watershortcut.com");
    expect(cookie).toContain("ws_ref_code=abc123");
    expect(cookie).toContain("Max-Age=3600");
    expect(cookie).toContain("Domain=watershortcut.com");
  });
});
