import { test, expect } from "@playwright/test";
import axeCore from "axe-core";

const routes = [
  { path: "/", name: "home" },
  { path: "/analyze-water-bill", name: "analyze" },
  { path: "/guides", name: "guides" },
];

routes.forEach(({ path, name }) => {
  test(`a11y scan: ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.addScriptTag({ content: axeCore.source });
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axe = (window as any).axe;
      return axe.run(document.body, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
        rules: { "color-contrast": { enabled: true } },
      });
    });

    expect(results.violations).toEqual([]);
  });
});
