const { test, expect } = require('@playwright/test');

const searchPath = process.env.PLAYWRIGHT_CANDIDATE_SEARCH_PATH || '/applicants';

test('applicant search page responds OK', async ({ page }) => {
  const response = await page.goto(searchPath);
  expect(response).not.toBeNull();
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(400);
});
