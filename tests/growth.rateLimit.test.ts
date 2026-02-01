import { describe, expect, it } from "vitest";

import { incrementRateLimit } from "../src/worker/growthRateLimit";

class MemoryKV {
  store = new Map<string, string>();

  async get(key: string) {
    return this.store.get(key) ?? null;
  }

  async put(key: string, value: string) {
    this.store.set(key, value);
  }
}

describe("growth rate limits", () => {
  it("blocks after exceeding limit", async () => {
    const kv = new MemoryKV();
    const results = await Promise.all([
      incrementRateLimit(kv as unknown as KVNamespace, "rl:test", 3, 60),
      incrementRateLimit(kv as unknown as KVNamespace, "rl:test", 3, 60),
      incrementRateLimit(kv as unknown as KVNamespace, "rl:test", 3, 60),
    ]);
    results.forEach((result) => expect(result.allowed).toBe(true));
    const blocked = await incrementRateLimit(kv as unknown as KVNamespace, "rl:test", 3, 60);
    expect(blocked.allowed).toBe(false);
    expect(blocked.count).toBe(4);
  });
});
