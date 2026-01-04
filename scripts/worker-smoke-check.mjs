const baseUrl = process.env.WORKER_BASE_URL || process.env.SMOKE_BASE_URL;
const filePath = process.env.SMOKE_FILE || "tests/fixtures/sample-bill.pdf";
const timeoutMs = Number.parseInt(process.env.SMOKE_TIMEOUT_MS || "30000", 10);

if (!baseUrl) {
  console.error("Missing WORKER_BASE_URL (e.g., https://www.watershortcut.com).");
  process.exit(1);
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

try {
  const fileBuffer = await import("node:fs/promises").then((fs) => fs.readFile(filePath));
  const formData = new FormData();
  formData.set("file", new Blob([fileBuffer], { type: "application/pdf" }), "sample-bill.pdf");

  const url = new URL("/api/analyze-bill", baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
    signal: controller.signal,
  });

  const payloadText = await response.text();
  if (!response.ok) {
    console.error("Smoke check failed with status:", response.status);
    console.error(payloadText);
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(payloadText);
  } catch (error) {
    console.error("Expected JSON response but got:");
    console.error(payloadText);
    process.exit(1);
  }

  if (!payload?.analysis?.topMoves?.length) {
    console.error("Missing analysis data in response:", payload);
    process.exit(1);
  }

  console.log("Smoke check succeeded.");
  console.log("Top move sample:", payload.analysis.topMoves[0]);
} catch (error) {
  if (error?.name === "AbortError") {
    console.error(`Smoke check timed out after ${timeoutMs}ms.`);
  } else {
    console.error("Smoke check error:", error);
  }
  process.exit(1);
} finally {
  clearTimeout(timeout);
}
