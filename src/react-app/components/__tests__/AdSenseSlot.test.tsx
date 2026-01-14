import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AdSenseSlot from "../AdSenseSlot";

vi.mock("../../adsense", () => ({
  requestAdForSlot: vi.fn(),
  subscribeToRouteChanges: () => () => undefined,
}));

describe("AdSenseSlot", () => {
  it("renders a slot with required AdSense attributes", () => {
    const { container } = render(<AdSenseSlot slotId="1234567890" />);
    const slot = container.querySelector("ins.adsbygoogle");
    expect(slot).toBeInTheDocument();
    expect(slot).toHaveAttribute("data-ad-slot", "1234567890");
    expect(slot).toHaveAttribute("data-ad-type", "inline");
    expect(slot?.getAttribute("data-ad-client")).toMatch(/^ca-pub-/);
    expect(slot).toHaveAttribute("data-ad-format", "auto");
    expect(slot).toHaveAttribute("data-full-width-responsive", "true");
  });
});
