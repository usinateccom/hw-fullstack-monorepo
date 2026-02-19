import { expect, test } from "@playwright/test";

test("execute populates rows and clear empties table without reload", async ({ page }) => {
  await page.route("http://localhost:9999/users/execute", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        users: [
          { nome: "Ana Silva", email: "ana@example.com", phone: "+55 11 99999-1111" },
          { nome: "Bruno Souza", email: "bruno@example.com", phone: "+55 21 98888-2222" }
        ]
      })
    });
  });

  await page.route("http://localhost:9999/users/clear", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ cleared: true })
    });
  });

  await page.goto("/");

  await expect(page.getByRole("button", { name: "Executar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Limpar" })).toBeDisabled();
  await expect(page.getByText("Sem dados no momento.")).toBeVisible();

  await page.getByRole("button", { name: "Executar" }).click();

  await expect(page.getByRole("cell", { name: "Ana Silva" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Bruno Souza" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Limpar" })).toBeEnabled();

  await page.getByRole("button", { name: "Limpar" }).click();

  await expect(page.getByText("Sem dados no momento.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Limpar" })).toBeDisabled();
});
