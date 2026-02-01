import { describe, expect, it } from "vitest";

import { signShareToken, verifyShareToken } from "../src/worker/growthUtils";

const secret = "unit-test-secret";

describe("growth token signing", () => {
  it("signs and verifies share tokens", async () => {
    const payload = { shareTokenId: "token-123", refCode: "ref-abc", exp: Date.now() + 10000 };
    const token = await signShareToken(payload, secret);
    const verified = await verifyShareToken(token, secret);
    expect(verified).toEqual(payload);
  });

  it("rejects tokens with invalid signature", async () => {
    const payload = { shareTokenId: "token-999", refCode: "ref-xyz", exp: Date.now() + 10000 };
    const token = await signShareToken(payload, secret);
    const verified = await verifyShareToken(token, "wrong-secret");
    expect(verified).toBeNull();
  });
});
