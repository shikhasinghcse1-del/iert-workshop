import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("UI Accessibility & Visual Gate", () => {
  test("Home Page - Axe accessibility audit", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    // Run axe-core accessibility analysis
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Assert zero accessibility violations (focus rings, contrast ratios, etc.)
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Signup Page - Form labels and tap targets audit", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Landing Page - Visual regression snapshot check", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.waitForLoadState("networkidle");

    // Visual snapshot gate to prevent unintentional layout regressions
    await expect(page).toHaveScreenshot("landing-page-baseline.png", {
      maxDiffPixelRatio: 0.02,
    });
  });
});
