import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: "https://www.saucedemo.com",
    trace: "retain-on-failure",
    screenshot: "on",
    video: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.001, // 0.1% difference allowed
    },
  },
  snapshotPathTemplate: "data/screenshots/{testFilePath}/{projectName}/{arg}{ext}",
  // Screenshot retry configuration
  timeout: 15000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: 'safari-mobile',
      use: { ...devices['iPhone 14 Pro'] },
    },
  ],
});
