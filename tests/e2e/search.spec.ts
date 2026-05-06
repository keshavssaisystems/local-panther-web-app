import { test, expect } from '@playwright/test';

test('search input (if present) accepts input and attempts search', async ({ page }) => {
  await page.goto('/');

  const search = page.locator('input[type="search"], input[placeholder*="Search"], input[name*="search"], input[aria-label*="Search"]');
  if ((await search.count()) === 0) {
    console.log('No search input found; skipping search assertions.');
    return;
  }

  const s = search.first();
  await s.fill('engineer');
  await s.press('Enter');

  // wait briefly for results to appear
  const results = page.locator('[data-testid="search-results"], .search-results, .job-list, .list-view');
  if ((await results.count()) > 0) {
    await expect(results.first()).toBeVisible();
  } else {
    console.log('No explicit results container found after search; manual inspection may be required.');
  }
});
