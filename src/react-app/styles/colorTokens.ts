export const colorTokens = {
  text: "#0b1b3a",
  mutedText: "#4c5a75",
  background: "#ffffff",
  surface: "#f8fafc",
  border: "#e2e8f0",
  accent: "#2d6bff",
  accentHover: "#5b4bf2",
  inverseText: "#ffffff",
  inverseSurface: "#0b1221",
} as const;

export const colorPairings = [
  { name: "text on background", foreground: colorTokens.text, background: colorTokens.background, ratio: 4.5 },
  { name: "muted text on background", foreground: colorTokens.mutedText, background: colorTokens.background, ratio: 4.5 },
  { name: "text on surface", foreground: colorTokens.text, background: colorTokens.surface, ratio: 4.5 },
  { name: "accent on background", foreground: colorTokens.accent, background: colorTokens.background, ratio: 4.5 },
  { name: "accent hover on background", foreground: colorTokens.accentHover, background: colorTokens.background, ratio: 4.5 },
  { name: "inverse text on inverse surface", foreground: colorTokens.inverseText, background: colorTokens.inverseSurface, ratio: 4.5 },
] as const;
