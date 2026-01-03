import { describe, expect, it } from "vitest";
import { isIphoneUserAgent } from "../src/react-app/utils/device";

describe("device detection", () => {
  it("detects iPhone user agents", () => {
    expect(
      isIphoneUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      ),
    ).toBe(true);
  });

  it("does not flag Android as iPhone", () => {
    expect(
      isIphoneUserAgent(
        "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Mobile Safari/537.36",
      ),
    ).toBe(false);
  });

  it("does not flag iPad as iPhone", () => {
    expect(
      isIphoneUserAgent(
        "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      ),
    ).toBe(false);
  });
});
