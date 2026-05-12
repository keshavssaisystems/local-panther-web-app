const { test, expect } = require('@playwright/test');

const loginPath = process.env.PLAYWRIGHT_LOGIN_PATH || '/login';

test('login page responds OK', async ({ page }) => {
  const response = await page.goto(loginPath);
  expect(response).not.toBeNull();
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(400);
});
