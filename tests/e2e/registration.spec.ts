import { test, expect } from '@playwright/test';

test('registration form displays and accepts input for candidate role', async ({ page }) => {
  await page.goto('/registration');

  // Select Candidate (Job Seeker) role card to reveal the form
  await page.click('text=Candidate (Job Seeker)');

  // Ensure key inputs are visible
  await expect(page.locator('#firstName')).toBeVisible();
  await expect(page.locator('#lastName')).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#phoneNumber')).toBeVisible();

  // Fill example values (do not submit to avoid side-effects)
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'test@example.com');
  await page.fill('#phoneNumber', '(123)-456-7890');

  // Create account button should be present
  await expect(page.locator('button:has-text("Create account")')).toBeVisible();
});
