import { describe, expect, it } from "vitest";

import { colorPairings } from "../src/react-app/styles/colorTokens";

const hexToRgb = (hex: string) => {
  const sanitized = hex.replace("#", "");
  const value = sanitized.length === 3
    ? sanitized
        .split("")
        .map((char) => char + char)
        .join("")
    : sanitized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const channelToLinear = (value: number) => {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
};

const contrastRatio = (foreground: string, background: string) => {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
};

describe("color token contrast", () => {
  it("meets WCAG AA contrast ratios for key pairings", () => {
    const failures = colorPairings
      .map((pair) => ({
        ...pair,
        ratioValue: contrastRatio(pair.foreground, pair.background),
      }))
      .filter((pair) => pair.ratioValue < pair.ratio);

    expect(failures, `Contrast failures: ${JSON.stringify(failures, null, 2)}`).toEqual([]);
  });
});
