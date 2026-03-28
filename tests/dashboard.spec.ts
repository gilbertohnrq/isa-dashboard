import { expect, test } from "@playwright/test";

test.describe("dashboard screenshots", () => {
  test("desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1151 });
    await page.goto("/");
    await page.getByText("Perfil do Parceiro").waitFor();
    await expect(page).toHaveScreenshot("dashboard-desktop.png", {
      fullPage: true,
    });
  });

  test("tablet", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1600 });
    await page.goto("/");
    await page.getByText("Perfil do Parceiro").waitFor();
    await expect(page).toHaveScreenshot("dashboard-tablet.png", {
      fullPage: true,
    });
  });

  test("mobile", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 1800 });
    await page.goto("/");
    await page.getByText("Perfil do Parceiro").waitFor();
    await expect(page).toHaveScreenshot("dashboard-mobile.png", {
      fullPage: true,
    });
  });
});
