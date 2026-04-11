import { expect, test } from "@playwright/test";

const creatorId = "459177910";

test.describe("creator directory smoke", () => {
  test("home renders the creator directory", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Todos os criadores da base").waitFor();
    await expect(page.getByRole("link").first()).toBeVisible();
  });

  test("creator dashboard renders the creator sections", async ({ page }) => {
    await page.goto(`/criadores/${creatorId}`);
    await page.getByText("Perfil do Criador").waitFor();
    await expect(page.getByRole("link", { name: "Conteúdos" })).toBeVisible();
    await expect(page.getByText("Redes sociais")).toBeVisible();
  });

  test("legacy section routes redirect back to the directory", async ({ page }) => {
    await page.goto("/financeiro");
    await page.getByText("Todos os criadores da base").waitFor();
    await expect(page).toHaveURL(/\/$/);
  });
});
