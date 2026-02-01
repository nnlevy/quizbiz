import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("growth ledger constraints", () => {
  it("defines unique indexes for award gating", () => {
    const migration = readFileSync("migrations/0004_growth_tables.sql", "utf8");
    expect(migration).toContain("idx_credit_awards_user_bucket");
    expect(migration).toContain("idx_credit_awards_session_bucket");
    expect(migration).toContain("idx_referral_attribution_unique");
  });
});
