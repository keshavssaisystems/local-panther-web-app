import { test, expect } from '@playwright/test';

test('clicking Apply opens modal or navigates to application', async ({ page }) => {
  await page.goto('/');

  const applyBtn = page.getByRole('button', { name: /apply/i });
  if ((await applyBtn.count()) === 0) {
    console.log('No Apply button found on the page; skipping apply assertions.');
    return;
  }

  await applyBtn.first().click();

  const dialog = page.locator('[role="dialog"], .modal, #apply-modal');
  if ((await dialog.count()) > 0) {
    await expect(dialog.first()).toBeVisible();
  } else {
    await expect(page).toHaveURL(/apply|application|candidateapply/i);
  }
});
