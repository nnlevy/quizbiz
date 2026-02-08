import { test, expect } from "@playwright/test";

test.describe("home UX smoke checks", () => {
  test("hero CTA scrolls to the analysis start card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Analyze my water bill" }).click();
    await expect(page.locator("#analysis-start")).toBeInViewport();
  });

  test("Stop Flushing Money link jumps to the quick check section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Stop Flushing Money →" }).click();
    await expect(page).toHaveURL(/#quick-check/);
    await expect(page.locator("#quick-check")).toBeInViewport();
  });

  test("credits modal opens and closes with Escape", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("ws_scroll_unlocked", "true");
      window.localStorage.setItem("ws_returning_user", "true");
    });
    await page.goto("/");
    await page.getByRole("button", { name: /Credits/ }).click();
    const modal = page.getByRole("dialog", { name: /Keep your WaterShortcut insights flowing/i });
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("tool cards navigate to calculators", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Leak Detector/ }).click();
    await expect(page).toHaveURL(/\/calculators#leak-estimator/);
    await expect(page.locator("#leak-estimator")).toBeVisible();
  });
});
