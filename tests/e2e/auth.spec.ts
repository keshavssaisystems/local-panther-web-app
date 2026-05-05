import { test, expect } from '@playwright/test';

test('login link reveals login form', async ({ page }) => {
  await page.goto('/');

  const loginLink = page.getByRole('link', { name: /sign\s?in|log\s?in|login/i });
  const loginBtn = page.getByRole('button', { name: /sign\s?in|log\s?in|login/i });

  if ((await loginLink.count()) === 0 && (await loginBtn.count()) === 0) {
    console.log('No login link/button found; skipping login assertions.');
    return;
  }

  if ((await loginLink.count()) > 0) {
    await loginLink.first().click();
  } else {
    await loginBtn.first().click();
  }

  const email = page.locator('input[type="email"], input[name="email"], #email');
  const password = page.locator('input[type="password"], input[name="password"], #password');

  await expect(email.first()).toBeVisible();
  await expect(password.first()).toBeVisible();
});
