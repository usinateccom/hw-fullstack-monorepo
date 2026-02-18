import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

describe("frontend smoke", () => {
  it("contains required table and buttons", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

    expect(html.includes("id=\"root\"")).toBe(true);

    const app = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
    expect(app.includes("Executar")).toBe(true);
    expect(app.includes("Limpar")).toBe(true);
    expect(app.includes("role: \"table\"")).toBe(true);
  });
});
