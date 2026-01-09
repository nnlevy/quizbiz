// Usage:
//   node scripts/waterIqAudit.mjs http://localhost:3000
// Exits 0 if pass, 1 if fail.

const base = process.argv[2] || "http://localhost:3000";

async function main() {
  const audit = await fetchJson(`${base}/api/water-iq/audit`);
  if (!audit?.ok) {
    console.error("❌ Could not fetch audit endpoint");
    process.exit(1);
  }

  const pass = Boolean(audit.audit?.pass);
  console.log("Audit pass:", pass);
  for (const c of audit.audit.checks) {
    console.log(`${c.pass ? "✅" : "❌"} ${c.id} — ${c.detail}`);
  }

  await assertOk(`${base}/water-iq`);
  await assertOk(`${base}/api/water-iq/stats`);

  const ogRes = await fetch(`${base}/water-iq/og/invalidtoken`).catch(() => null);
  console.log("OG route status:", ogRes?.status);

  process.exit(pass ? 0 : 1);
}

async function fetchJson(url) {
  try {
    const r = await fetch(url);
    return await r.json();
  } catch {
    return null;
  }
}

async function assertOk(url) {
  const r = await fetch(url).catch(() => null);
  if (!r || r.status >= 400) {
    console.error("❌ Endpoint failed:", url, r?.status);
    process.exit(1);
  }
  console.log("✅", url, r.status);
}

main();
