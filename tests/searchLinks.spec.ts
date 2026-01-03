import { describe, expect, it } from "vitest";
import { buildSearchKeywords, buildSearchQuery, buildSearchUrl } from "../src/react-app/utils/searchLinks";

describe("search link builders", () => {
  it("builds a deduped keyword list with location", () => {
    const keywords = buildSearchKeywords({
      baseKeywords: ["WaterSense showerhead", "low-flow shower"],
      moveTitles: ["Trim shower flow"],
      location: "Austin, TX",
      preference: "in-person",
    });
    expect(keywords).toContain("Austin, TX");
    expect(keywords).toContain("local installer");
  });

  it("builds encoded provider URLs", () => {
    const query = buildSearchQuery({
      baseKeywords: ["WaterSense showerhead"],
      location: "Austin, TX",
      preference: "online",
    });
    expect(buildSearchUrl("duckduckgo", query)).toMatch(
      /^https:\/\/duckduckgo\.com\/\?q=/,
    );
    expect(buildSearchUrl("google", query)).toMatch(
      /^https:\/\/www\.google\.com\/search\?q=/,
    );
    expect(buildSearchUrl("facebook", query)).toMatch(
      /^https:\/\/www\.facebook\.com\/marketplace\/search\/\?query=/,
    );
    expect(buildSearchUrl("maps", query)).toMatch(
      /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/,
    );
  });
});
