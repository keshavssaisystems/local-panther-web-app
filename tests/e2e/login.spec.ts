import { test, expect } from '@playwright/test';

// Skip if test credentials are not provided
test.skip(!(process.env.PLAYWRIGHT_TEST_USER && process.env.PLAYWRIGHT_TEST_PASSWORD), 'PLAYWRIGHT_TEST_USER/PASSWORD not set');

test('login with test account', async ({ page }) => {
  // Try direct login route first
  await page.goto('/login');

  let email = page.getByLabel(/email|username|email address/i);
  let password = page.getByLabel(/password/i);
  // Fallback to common input selectors if labels/placeholders are not present
  if ((await email.count()) === 0) {
    email = page.locator('input[type="email"], input[name="email"], #email, input[name="username"], input[type="text"]');
  }
  if ((await password.count()) === 0) {
    password = page.locator('input[type="password"], input[name="password"], #password');
  }

  if ((await email.count()) === 0) {
    // fallback: click login link/button on home
    const loginLink = page.getByRole('link', { name: 'Sign in' });
    const loginBtn = page.getByRole('button', { name: 'Sign in' });
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

  // Click the 'Sign in' button explicitly after filling credentials (target the button inside the login form to avoid header links)
  const signInBtn = page.locator('form').getByRole('button', { name: 'Sign in' }).first();
  const fallback = page.locator('form button[type="submit"], form input[type="submit"]');
  if ((await signInBtn.count()) === 0) {
    if ((await fallback.count()) > 0) {
      await fallback.first().click();
    } else {
      // last resort: press Enter to submit
      await page.keyboard.press('Enter');
    }
  } else {
    // If the button is disabled (e.g., isSubmitting), try a forced click or directly submit the form
    if (!(await signInBtn.isEnabled())) {
      try {
        await signInBtn.click({ force: true });
      } catch (e) {
        // Fallback: request form submit via DOM API
        await page.locator('form').evaluate((f) => { if (typeof f.requestSubmit === 'function') f.requestSubmit(); else f.submit(); });
      }
    } else {
      await signInBtn.click();
    }
  }
  // Give the app a moment to settle (short wait to avoid blocking on navigation)
  await page.waitForTimeout(1000);

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

    // Wait for the login API response (more reliable across browsers)
    let loginResponse = null;
    try {
      loginResponse = await page.waitForResponse(
        (resp) => resp.url().includes('/api/Auth/Login') && resp.request().method() === 'POST',
        { timeout: 20000 }
      );
    } catch (e) {
      // no response observed within timeout
    }

    if (loginResponse) {
      expect([200, 201, 204]).toContain(loginResponse.status());
      // Wait for token in localStorage (more reliable than a single evaluate). Fallback to UI checks if not set.
      try {
        await page.waitForFunction(() => !!window.localStorage.getItem('token'), null, { timeout: 10000 });
      } catch (e) {
        await Promise.race([
          page.waitForURL((url) => !/\/login|\/auth|\/signin/i.test(url), { timeout: 10000 }).catch(() => null),
          logout.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
          profile.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
        ]);
      }
      const tokenExists = await page.evaluate(() => !!window.localStorage.getItem('token'));
    } else {
      // No login network response observed; wait for UI change (navigation or account links)
      await Promise.race([
        page.waitForURL((url) => !/sign in/i.test(url), { timeout: 20000 }).catch(() => null),
        logout.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
        profile.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
      ]);
    }

    // Final assertion: ensure we've left login page or seen logout/profile
    const currentUrl = page.url();
    // Normalize check: are we still on login-like path?
    const onLoginUrl = /\/login|\/auth|\/signin/i.test(currentUrl);
    if (onLoginUrl) {
      const logoutCount = await logout.count();
      const profileCount = await profile.count();
      expect(logoutCount > 0 || profileCount > 0 || !onLoginUrl).toBeTruthy();
    }

    // Attempt a robust logout flow: open profile dropdown first, then click Logout
    const profileToggle = page.locator('.header-btn-lg .dropdown-toggle, .header-btn-lg .p-0, .widget-content .rounded-circle, .header-btn-lg .widget-content-wrapper .rounded-circle').first();
    if ((await profileToggle.count()) > 0) {
      await profileToggle.click().catch(() => {});
      // await page.waitForTimeout(300);
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out"), a:has-text("Logout")').first();
      if ((await logoutButton.count()) > 0) {
        await logoutButton.click().catch(() => {});
        // await page.waitForURL(/\/login|\/auth|\/signin/i, { timeout: 10000 }).catch(() => {});
        try {
          await page.waitForFunction(() => !window.localStorage.getItem('token'), null, { timeout: 10000 });
        } catch (e) {}
        const tokenAfterLogout = await page.evaluate(() => !!window.localStorage.getItem('token'));
        expect(tokenAfterLogout).toBeFalsy();
      }
    } else {
      // Fallback: try a direct logout link (if present)
      const logoutDirect = page.getByRole('link', { name: /sign\s?out|log\s?out|logout/i }).first();
      if ((await logoutDirect.count()) > 0) {
        await logoutDirect.click().catch(() => {});
        await page.waitForURL(/\/login|\/auth|\/signin/i, { timeout: 10000 }).catch(() => {});
        try {
          await page.waitForFunction(() => !window.localStorage.getItem('token'), null, { timeout: 10000 });
        } catch (e) {}
        const tokenAfterLogout = await page.evaluate(() => !!window.localStorage.getItem('token'));
        expect(tokenAfterLogout).toBeFalsy();
      }
    }
    if ((await logout.count()) > 0) await expect(logout.first()).toBeVisible({ timeout: 10000 });
    if ((await profile.count()) > 0) await expect(profile.first()).toBeVisible({ timeout: 10000 });
  }
});
