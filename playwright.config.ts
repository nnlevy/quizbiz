import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
  projects: [
    {
      name: "webkit-se",
      use: { ...devices["iPhone SE"], viewport: { width: 320, height: 568 } },
    },
    {
      name: "webkit-12",
      use: { ...devices["iPhone 12"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "webkit-pro-max",
      use: { ...devices["iPhone 14 Pro Max"], viewport: { width: 428, height: 926 } },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 0.0.0.0 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
