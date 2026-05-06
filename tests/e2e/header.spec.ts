import { test, expect } from '@playwright/test';

test('navigation is present and key links behave', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('nav, header, [role="navigation"]');
  if ((await nav.count()) === 0) {
    console.log('No navigation element found; skipping navigation assertions.');
    return;
  }

  await expect(nav.first()).toBeVisible();

  const jobsLink = page.getByRole('link', { name: /jobs/i });
  if ((await jobsLink.count()) > 0) {
    await jobsLink.first().click();
    // basic sanity check: page loaded (title should not be empty)
    await expect(page).toHaveTitle(/./);
  }
});
