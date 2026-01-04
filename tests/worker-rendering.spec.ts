import { describe, expect, it } from "vitest";
import {
  buildBreadcrumbs,
  injectAdSlots,
  renderAdSlot,
  renderAdsDiagnosticsPage,
  renderBreadcrumbs,
  renderModals,
} from "../src/worker/index";

describe("worker render helpers", () => {
  it("renders a placeholder when an ad slot id is missing", () => {
    const html = renderAdSlot(null, { clientId: "ca-pub-123", slotName: "inline" });
    expect(html).toContain("ad-slot-placeholder");
    expect(html).toContain("Ad space reserved");
  });

  it("escapes ad slot attributes and renders slots", () => {
    const html = renderAdSlot("slot-1", {
      clientId: 'ca-pub-"bad"',
      slotName: "inline",
      format: "auto",
    });
    expect(html).toContain('data-ad-client="ca-pub-&quot;bad&quot;"');
    expect(html).toContain('data-ad-slot="slot-1"');
    expect(html).toContain('data-ad-region="inline"');
  });

  it("injects inline ads into page markup", () => {
    const body = "<div>Start<!--INLINE_AD_SLOT-->End</div>";
    const injected = injectAdSlots(
      body,
      { inline: "111", footer: "222", sticky: "333" },
      "ca-pub-123",
    );
    expect(injected).toContain("adsbygoogle");
    expect(injected).not.toContain("INLINE_AD_SLOT");
  });

  it("renders breadcrumbs with escaped labels", () => {
    const crumbs = buildBreadcrumbs("/guides/leak-<check>");
    const html = renderBreadcrumbs(crumbs);
    expect(html).toContain("aria-label=\"Breadcrumbs\"");
    expect(html).toContain("&lt;Check&gt;");
    expect(html).toContain("aria-current=\"page\"");
  });

  it("renders diagnostics slots and modals", () => {
    const diagnostics = renderAdsDiagnosticsPage("ca-pub-123", {
      inline: "111",
      footer: "222",
      sticky: "333",
    });
    expect(diagnostics).toContain("AdSense diagnostics");
    expect(diagnostics).toContain('data-ad-slot="111"');
    expect(diagnostics).toContain('data-ad-slot="222"');

    const modals = renderModals();
    expect(modals).toContain("privacy-modal");
    expect(modals).toContain("data-close-modal");
  });
});
