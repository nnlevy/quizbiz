import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const demoPath = path.join(process.cwd(), "src", "react-app", "data", "demo.json");
const demo = JSON.parse(fs.readFileSync(demoPath, "utf-8"));

const buildRecord = () => ({
  ...demo,
  id: demo.analysisId,
  createdAt: new Date().toISOString(),
  mode: "upload",
});

test("third-party scripts stay idle on the homepage", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("accounts.google.com") || url.includes("chart")) {
      requests.push(url);
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(requests).toEqual([]);
});

test("chart.js loads only when charts are visible", async ({ page }) => {
  const record = buildRecord();
  await page.addInitScript((data) => {
    window.localStorage.setItem("ws-analysis-history", JSON.stringify([data]));
  }, record);

  await page.goto("/analyze-water-bill");
  await page.waitForSelector(".ws-chart");

  const initialLoaded = await page.evaluate(() => (window as typeof window & { __WS_CHART_JS_LOADED__?: boolean }).__WS_CHART_JS_LOADED__);
  expect(initialLoaded).toBeFalsy();

  await page.locator(".ws-chart").first().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => (window as typeof window & { __WS_CHART_JS_LOADED__?: boolean }).__WS_CHART_JS_LOADED__ === true);

  const loaded = await page.evaluate(() => (window as typeof window & { __WS_CHART_JS_LOADED__?: boolean }).__WS_CHART_JS_LOADED__);
  expect(loaded).toBe(true);
});
