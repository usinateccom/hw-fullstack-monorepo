import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

test("execute populates rows and clear empties table without reload", async ({ page }) => {
  const evidenceDir = path.resolve(process.cwd(), "docs/evidence/assets");
  mkdirSync(evidenceDir, { recursive: true });

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
  await page.screenshot({
    path: path.join(evidenceDir, "m3-desktop-after-execute.png"),
    fullPage: true
  });

  await page.getByRole("button", { name: "Limpar" }).click();

  await expect(page.getByText("Sem dados no momento.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Limpar" })).toBeDisabled();
  await page.screenshot({
    path: path.join(evidenceDir, "m3-desktop-after-clear.png"),
    fullPage: true
  });
});

test("mobile viewport keeps controls and table readable", async ({ browser }) => {
  const evidenceDir = path.resolve(process.cwd(), "docs/evidence/assets");
  mkdirSync(evidenceDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  const page = await context.newPage();
  await page.route("http://localhost:9999/users/execute", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        users: [{ nome: "Ana Silva", email: "ana@example.com", phone: "+55 11 99999-1111" }]
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
  await page.getByRole("button", { name: "Executar" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.screenshot({
    path: path.join(evidenceDir, "m3-mobile-after-execute.png"),
    fullPage: true
  });
  await context.close();
});
