import { beforeEach, describe, expect, it, vi } from "vitest";
import { clientScript } from "../src/worker/assets";

describe("client script behaviors", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    Object.defineProperty(navigator, "doNotTrack", {
      value: "0",
      configurable: true,
    });
  });

  it("marks reduced motion preference on the body", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });

    clientScript();

    expect(document.body.classList.contains("prefers-reduced-motion")).toBe(true);
  });

  it("stores consent on accept and hides the banner", () => {
    document.body.innerHTML = `
      <div class="consent-banner" data-consent-banner>
        <label><input type="checkbox" data-consent-option="functional" checked disabled /></label>
        <label><input type="checkbox" data-consent-option="analytics" /></label>
        <label><input type="checkbox" data-consent-option="ads" /></label>
        <button type="button" data-consent-reject>Reject</button>
        <button type="button" data-consent-save>Save</button>
        <button type="button" data-consent-accept>Accept</button>
      </div>
    `;

    clientScript();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const banner = document.querySelector<HTMLElement>("[data-consent-banner]");
    const accept = document.querySelector<HTMLButtonElement>("[data-consent-accept]");
    expect(banner?.hidden).toBe(false);

    accept?.click();

    const stored = localStorage.getItem("ws-consent-v1");
    expect(stored).not.toBeNull();
    const consent = JSON.parse(stored ?? "{}") as { analytics?: boolean; ads?: boolean };
    expect(consent.analytics).toBe(true);
    expect(consent.ads).toBe(true);
    expect(banner?.hidden).toBe(true);
  });
});
