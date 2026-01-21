import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import WsImage from "../WsImage";

describe("WsImage", () => {
  it("defaults to lazy loading and async decoding", () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    act(() => {
      root.render(
        <WsImage
          src="/test.png"
          alt="Lazy image"
          width={320}
          height={180}
        />,
      );
    });

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("decoding")).toBe("async");
  });

  it("supports eager loading with high fetch priority", () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    act(() => {
      root.render(
        <WsImage
          src="/hero.png"
          alt="Hero image"
          width={640}
          height={360}
          eager
        />,
      );
    });

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("loading")).toBe("eager");
    expect(img.getAttribute("fetchpriority")).toBe("high");
  });
});
