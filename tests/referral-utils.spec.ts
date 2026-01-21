import { describe, expect, it } from "vitest";

import { appendReferralToUrl } from "../src/react-app/utils/referral";

describe("appendReferralToUrl", () => {
  it("appends ref to clean URLs", () => {
    expect(appendReferralToUrl("/analyze-water-bill", "ABC")).toContain("ref=ABC");
  });

  it("preserves existing query params", () => {
    const url = appendReferralToUrl("/analyze-water-bill?foo=bar", "ABC");
    expect(url).toContain("foo=bar");
    expect(url).toContain("ref=ABC");
  });

  it("does not overwrite existing ref", () => {
    const url = appendReferralToUrl("/analyze-water-bill?ref=OLD", "ABC");
    expect(url).toContain("ref=OLD");
    expect(url).not.toContain("ref=ABC");
  });
});
