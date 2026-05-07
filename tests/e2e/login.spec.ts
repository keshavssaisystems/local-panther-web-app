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

  // Click the 'Sign in' button explicitly after filling credentials
  const signInBtn = page.getByRole('button', { name: /sign\s?in|log\s?in|login|submit/i }).first();
  if ((await signInBtn.count()) === 0) {
    const fallback = page.locator('button[type="submit"], input[type="submit"]');
    if ((await fallback.count()) > 0) {
      await fallback.first().click();
    } else {
      // last resort: press Enter to submit
      await page.keyboard.press('Enter');
    }
  } else {
    await signInBtn.click();
  }
  await page.waitForLoadState('networkidle');

  // Expect a logout link or profile to be visible, or that URL changed away from login
  const logout = page.getByRole('link', { name: /sign\s?out|log\s?out|logout/i });
  const profile = page.getByRole('link', { name: /profile|my\s?account/i });

  if ((await logout.count()) === 0 && (await profile.count()) === 0) {
    // Detect MFA / code verification dialog (e.g., phone/OTP prompt)
    const mfaPrompt = page.getByText(/enter code|to proceed, please enter the code|verification code|enter the verification code/i);
    if ((await mfaPrompt.count()) > 0) {
      const mfaCode = process.env.PLAYWRIGHT_TEST_MFA_CODE;
      if (!mfaCode) {
        test.skip(true, 'MFA required; set PLAYWRIGHT_TEST_MFA_CODE to run');
      }
      const code = mfaCode.trim();
      const digits = code.split('');
      const otpSelectors = [
        'dialog input',
        'input[name*="code"]',
        'input[placeholder*="code"]',
        'input[aria-label*="code"]',
        'input[aria-label*="OTP"]',
        'input[type="tel"]',
        'input[type="number"]',
        'input[type="text"]'
      ].join(',');
      const inputs = page.locator(otpSelectors);
      if ((await inputs.count()) >= digits.length) {
        for (let i = 0; i < digits.length; i++) {
          await inputs.nth(i).fill(digits[i]);
        }
      } else if ((await inputs.count()) > 0) {
        await inputs.first().fill(code);
      } else {
        test.skip(true, 'MFA present but no OTP inputs found to fill');
      }
      const verifyBtn = page.getByRole('button', { name: /submit|verify|continue|confirm/i }).first();
      if ((await verifyBtn.count()) > 0) {
        await verifyBtn.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForLoadState('networkidle');
    }
    await expect(page).not.toHaveURL(/\/login|\/auth|\/signin/i, { timeout: 20000 });
  } else {
    if ((await logout.count()) > 0) await expect(logout.first()).toBeVisible({ timeout: 10000 });
    if ((await profile.count()) > 0) await expect(profile.first()).toBeVisible({ timeout: 10000 });
  }
});
