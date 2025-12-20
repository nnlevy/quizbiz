import path from "path";
import { expect, test } from "@playwright/test";
import { existsSync, mkdirSync } from "fs";

const viewports = [
  { name: "iphone-se", size: { width: 320, height: 568 } },
  { name: "iphone-12", size: { width: 390, height: 844 } },
  { name: "iphone-pro-max", size: { width: 428, height: 926 } },
];

const artifactDir = path.join(process.cwd(), "tests", "artifacts");
if (!existsSync(artifactDir)) {
  mkdirSync(artifactDir, { recursive: true });
}

test.describe("mobile layout quality", () => {
  for (const viewport of viewports) {
    test(`no overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport.size);
      await page.goto("/");
      await page.waitForTimeout(600);
      const initial = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(initial.scrollWidth).toBeLessThanOrEqual(initial.clientWidth + 1);

      await page.waitForTimeout(4000);
      const afterAds = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(afterAds.scrollWidth).toBeLessThanOrEqual(afterAds.clientWidth + 1);

      const flexWrap = await page
        .locator(".nav-container")
        .evaluate((node) => getComputedStyle(node).flexWrap);
      expect(flexWrap).toBe("nowrap");

      const headerHeight = await page
        .locator(".nav-container")
        .evaluate((node) => node.getBoundingClientRect().height);
      expect(headerHeight).toBeLessThanOrEqual(84);

      await page.screenshot({
        path: path.join(artifactDir, `${viewport.name}.png`),
        fullPage: true,
      });
    });

    test(`key containers stay within viewport on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport.size);
      await page.goto("/");
      await page.waitForTimeout(800);
      const overflowStates = await page.evaluate(() => {
        const ids = ["hero", "location-intel", "dynamic-sliders", "upload"] as const;
        return ids.map((id) => {
          const el = document.getElementById(id);
          if (!el) return { id, ok: true };
          const rect = el.getBoundingClientRect();
          return { id, ok: rect.right <= document.documentElement.clientWidth + 1 };
        });
      });
      for (const state of overflowStates) {
        expect(state.ok).toBeTruthy();
      }
    });
  }
});
