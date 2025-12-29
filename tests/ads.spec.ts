import { expect, test } from "@playwright/test";

test("ad wiring is present on a content page", async ({ page }) => {
  const adScriptRequest = page.waitForRequest((req) =>
    req.url().includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"),
  );
  await page.goto("/analyze-water-bill");
  await adScriptRequest;
  await expect(page.locator("ins.adsbygoogle").first()).toBeVisible();
});
