import { test, expect } from '@playwright/test';

test('landing page components are visible', async ({ page }) => {
  // Use baseURL from playwright.config.ts (http://127.0.0.1:3000 in dev)
  await page.goto('/');
  // Page has a non-empty title
  await expect(page).toHaveTitle(/./);

  // Logo (many places use .logo class or alt text containing "logo")
  const logo = page.locator('img[alt*="logo"], .logo');
  await expect(logo.first()).toBeVisible();

  // Footer should expose key public links like Privacy Policy
  await expect(page.locator('footer').getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
});
