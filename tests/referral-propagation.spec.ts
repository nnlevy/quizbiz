import { test, expect } from "@playwright/test";

test("referral token propagates through internal links", async ({ page }) => {
  await page.goto("/?ref=TEST123");

  await page.getByRole("link", { name: /look up my water bill portal/i }).click();

  await expect(page).toHaveURL(/ref=TEST123/);
});
