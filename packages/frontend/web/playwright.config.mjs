import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true
  },
  webServer: {
    command: "VITE_API_BASE_URL=http://localhost:9999 bunx vite --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    timeout: 120000,
    reuseExistingServer: true
  }
});
