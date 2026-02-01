import { describe, expect, it } from "vitest";

import {
  SHARE_AWARD_WINDOW_MS,
  isWithinWindow,
  resolveFinalizeOutcome,
} from "../src/worker/growthUtils";

describe("growth finalize rules", () => {
  it("returns granted for already finalized tokens", () => {
    const outcome = resolveFinalizeOutcome({ state: "finalized", credits_awarded: 5 });
    expect(outcome).toEqual({ status: "granted", credits: 5 });
  });

  it("blocks awards inside the 7-day window", () => {
    const now = Date.now();
    expect(isWithinWindow(now - SHARE_AWARD_WINDOW_MS + 1000, now, SHARE_AWARD_WINDOW_MS)).toBe(true);
    expect(isWithinWindow(now - SHARE_AWARD_WINDOW_MS - 1000, now, SHARE_AWARD_WINDOW_MS)).toBe(false);
  });
});
