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

test("below-the-fold share card image is lazy-loaded", async ({ page }) => {
  const record = buildRecord();
  await page.addInitScript((data) => {
    window.localStorage.setItem("ws-analysis-history", JSON.stringify([data]));
  }, record);

  await page.goto(`/analysis-results/${demo.analysisId}`);

  const image = page.locator(".ws-share-card__media img");
  await expect(image).toHaveAttribute("loading", "lazy");
  await expect(image).toHaveAttribute("decoding", "async");
});
