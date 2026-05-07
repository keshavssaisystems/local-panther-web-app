import { test, expect } from '@playwright/test';

// Skip if test credentials are not provided
test.skip(!(process.env.PLAYWRIGHT_TEST_USER && process.env.PLAYWRIGHT_TEST_PASSWORD), 'PLAYWRIGHT_TEST_USER/PASSWORD not set');

test('login with test account', async ({ page }) => {
  // Try direct login route first
  await page.goto('/login');

  const email = page.locator('input[type="email"], input[name="email"], #email, input[name="username"], input[type="text"]');
  const password = page.locator('input[type="password"], input[name="password"], #password');

  if ((await email.count()) === 0) {
    // fallback: click login link/button on home
    const loginLink = page.getByRole('link', { name: /sign\s?in|log\s?in|login/i });
    const loginBtn = page.getByRole('button', { name: /sign\s?in|log\s?in|login/i });
    if ((await loginLink.count()) === 0 && (await loginBtn.count()) === 0) {
      test.skip(true, 'No login UI found on page');
    }
    if ((await loginLink.count()) > 0) {
      await loginLink.first().click();
    } else {
      await loginBtn.first().click();
    }
    await page.waitForLoadState('networkidle');
  }

  await expect(email.first()).toBeVisible();
  await expect(password.first()).toBeVisible();

  await email.first().fill(process.env.PLAYWRIGHT_TEST_USER!);
  await password.first().fill(process.env.PLAYWRIGHT_TEST_PASSWORD!);

  const submit = page.getByRole('button', { name: /sign\s?in|log\s?in|login|submit/i }).first();
  if ((await submit.count()) === 0) {
    await page.locator('button[type="submit"]').first().click();
  } else {
    await submit.click();
  }
  await page.waitForLoadState('networkidle');

  // Expect a logout link or profile to be visible, or that URL changed away from login
  const logout = page.getByRole('link', { name: /sign\s?out|log\s?out|logout/i });
  const profile = page.getByRole('link', { name: /profile|my\s?account/i });

  if ((await logout.count()) === 0 && (await profile.count()) === 0) {
    // Detect MFA / code verification dialog (e.g., phone/OTP prompt) and skip if present
    const mfaDialog = page.getByText(/enter code|to proceed, please enter the code/i);
    if ((await mfaDialog.count()) > 0) {
      test.skip(true, 'MFA required; interactive code verification shown');
    }
    await expect(page).not.toHaveURL(/\/login|\/auth|\/signin/i, { timeout: 10000 });
  } else {
    if ((await logout.count()) > 0) await expect(logout.first()).toBeVisible({ timeout: 10000 });
    if ((await profile.count()) > 0) await expect(profile.first()).toBeVisible({ timeout: 10000 });
  }
});
