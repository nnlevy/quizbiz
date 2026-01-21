type UsageSummary = {
  value: number;
  unit: string;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildAnalysisShareSvg = (payload: {
  usage: UsageSummary;
  cost: number;
  summary: string;
  linkLabel: string;
}) => {
  const usageLabel = `${payload.usage.value.toLocaleString()} ${payload.usage.unit}`;
  const costLabel = `$${payload.cost.toFixed(2)}`;
  const summary = escapeXml(payload.summary);
  const linkLabel = escapeXml(payload.linkLabel);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#fdf4ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="50" y="50" width="1100" height="530" rx="32" fill="#ffffff" stroke="#0f172a" stroke-width="4" />
  <text x="110" y="160" font-size="48" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#0f172a">
    Water bill insights
  </text>
  <text x="110" y="230" font-size="28" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="#0f172a">
    Total usage: ${escapeXml(usageLabel)}
  </text>
  <text x="110" y="280" font-size="28" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="#0f172a">
    Total cost: ${escapeXml(costLabel)}
  </text>
  <foreignObject x="110" y="320" width="980" height="180">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:system-ui,-apple-system,sans-serif;font-size:26px;color:#0f172a;line-height:1.4;">
      ${summary}
    </div>
  </foreignObject>
  <text x="110" y="540" font-size="22" font-family="system-ui, -apple-system, sans-serif" fill="#475569">
    AI water bill analysis · ${linkLabel}
  </text>
</svg>`;
};
