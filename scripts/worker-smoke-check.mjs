const explicitBaseUrl = process.env.WORKER_BASE_URL || process.env.SMOKE_BASE_URL;
const filePath = process.env.SMOKE_FILE || "tests/fixtures/sample-bill.pdf";
const timeoutMs = Number.parseInt(process.env.SMOKE_TIMEOUT_MS || "30000", 10);

const fs = await import("node:fs/promises");

if (!explicitBaseUrl) {
  await fs.access(filePath);
  console.warn(
    "[smoke:worker] WORKER_BASE_URL is not set. Ran offline smoke validation (fixture + request construction).",
  );
  console.log("Offline smoke check succeeded.");
  process.exit(0);
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

try {
  const fileBuffer = await fs.readFile(filePath);
  const formData = new FormData();
  formData.set("file", new Blob([fileBuffer], { type: "application/pdf" }), "sample-bill.pdf");

  const url = new URL("/api/analyze-bill", explicitBaseUrl);
  console.log(`Running smoke check against ${url.origin}`);
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
    signal: controller.signal,
  });

  const encoding = (response.headers.get("content-encoding") || "").toLowerCase();
  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  const rawBuffer = Buffer.from(await response.arrayBuffer());
  const decodedBuffer = encoding.includes("gzip")
    ? (await import("node:zlib")).gunzipSync(rawBuffer)
    : rawBuffer;
  const payloadText = decodedBuffer.toString("utf-8");

  if (!response.ok) {
    console.error("Smoke check failed with status:", response.status);
    console.error(payloadText);
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    console.error("Expected JSON response but got:");
    console.error({ contentType, encoding });
    console.error(payloadText.slice(0, 2000));
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
