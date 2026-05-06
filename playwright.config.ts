import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  use: {
    baseURL: process.env.CI ? 'http://127.0.0.1:5000' : 'http://127.0.0.1:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: !process.env.CI
    ? {
        command: 'npm --prefix web-app start',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: true,
      }
    : {
        command: 'npm --prefix web-app run build && npx serve -s web-app/build -l 5000',
        url: 'http://127.0.0.1:5000',
        reuseExistingServer: false,
      },
});
