const { test, expect } = require('@playwright/test');

const jobPath = process.env.PLAYWRIGHT_JOB_CREATE_PATH || '/jobs/new';

test('job posting page responds OK', async ({ page }) => {
  const response = await page.goto(jobPath);
  expect(response).not.toBeNull();
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(400);
});
