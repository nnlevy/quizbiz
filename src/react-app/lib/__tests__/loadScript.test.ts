import { describe, expect, it, vi } from "vitest";

import { loadScript } from "../loadScript";

describe("loadScript", () => {
  it("deduplicates scripts by src", async () => {
    const promiseA = loadScript({ src: "/assets/test.js" });
    const promiseB = loadScript({ src: "/assets/test.js" });

    const scripts = document.querySelectorAll("script[src=\"/assets/test.js\"]");
    expect(scripts.length).toBe(1);

    scripts[0].dispatchEvent(new Event("load"));
    await expect(promiseA).resolves.toBeInstanceOf(HTMLScriptElement);
    await expect(promiseB).resolves.toBeInstanceOf(HTMLScriptElement);
  });

  it("waits for interaction strategy before loading", async () => {
    const button = document.createElement("button");
    document.body.appendChild(button);

    const promise = loadScript({
      src: "/assets/interaction.js",
      strategies: [{ type: "interaction", element: button, events: ["click"] }],
    });

    expect(document.querySelector("script[src=\"/assets/interaction.js\"]")).toBeNull();

    button.click();

    const script = document.querySelector("script[src=\"/assets/interaction.js\"]") as HTMLScriptElement;
    script.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBeInstanceOf(HTMLScriptElement);
  });

  it("loads on idle strategy", async () => {
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => {
      cb();
      return 1;
    });

    const promise = loadScript({
      src: "/assets/idle.js",
      strategies: [{ type: "idle", timeout: 10 }],
    });

    const script = document.querySelector("script[src=\"/assets/idle.js\"]") as HTMLScriptElement;
    script.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBeInstanceOf(HTMLScriptElement);
    vi.unstubAllGlobals();
  });
});
