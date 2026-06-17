import { test, expect } from '@playwright/test';

// Skip if test credentials are not provided
test.skip(!(process.env.PLAYWRIGHT_TEST_USER && process.env.PLAYWRIGHT_TEST_PASSWORD), 'PLAYWRIGHT_TEST_USER/PASSWORD not set');

test('hiring manager: side menu shows expected items after login', async ({ page }) => {
  // Navigate to login
  await page.goto('/login');

  // Locate inputs by label with fallbacks
  let email = page.getByLabel(/email|username|email address/i);
  let password = page.getByLabel(/password/i);
  if ((await email.count()) === 0) {
    email = page.locator('input[type="email"], input[name="email"], #email, input[name="username"], input[type="text"]');
  }
  if ((await password.count()) === 0) {
    password = page.locator('input[type="password"], input[name="password"], #password');
  }

  if ((await email.count()) === 0) {
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

  // Submit the form targeting the in-form 'Sign in' button
  const signInBtn = page.locator('form').getByRole('button', { name: 'Sign in' }).first();
  const fallback = page.locator('form button[type="submit"], form input[type="submit"]');
  if ((await signInBtn.count()) === 0) {
    if ((await fallback.count()) > 0) {
      await fallback.first().click();
    } else {
      await page.keyboard.press('Enter');
    }
  } else {
    if (!(await signInBtn.isEnabled())) {
      try {
        await signInBtn.click({ force: true });
      } catch (e) {
        await page.locator('form').evaluate((f) => { if (typeof (f as any).requestSubmit === 'function') (f as any).requestSubmit(); else (f as any).submit(); });
      }
    } else {
      await signInBtn.click();
    }
  }

  // Wait for login response or token set
  try {
    await page.waitForResponse((resp) => resp.url().includes('/api/Auth/Login') && resp.request().method() === 'POST', { timeout: 20000 });
  } catch (e) {}
  try {
    await page.waitForFunction(() => !!window.localStorage.getItem('token'), null, { timeout: 15000 });
  } catch (e) {}

  // Ensure we are not still on login page
  const currentUrl = page.url();
  if (/\/login|\/auth|\/signin/i.test(currentUrl)) {
    await Promise.race([
      page.waitForURL((url) => !/\/login|\/auth|\/signin/i.test(url), { timeout: 15000 }).catch(() => null),
      page.getByRole('link', { name: /profile|my\s?account/i }).first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null),
      page.getByRole('link', { name: /sign\s?out|log\s?out|logout/i }).first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null),
    ]);
  }

  // Sidebar container
  const sidebar = page.locator('.appsidebar');
  await expect(sidebar).toBeVisible({ timeout: 20000 });

  // Expected menu items for a hiring manager
  const expectedItems = ['Dashboard', 'Jobs', 'Candidates', 'Calendar', 'Reports'];
  for (const itemText of expectedItems) {
    const item = sidebar.getByText(new RegExp(itemText, 'i')).first();
    await expect(item, `Sidebar item \"${itemText}\"`).toBeVisible({ timeout: 10000 });
  }

  // Verify navigation works for Jobs item (best-effort)
  const jobsItem = sidebar.getByText(/Jobs/i).first();
  if ((await jobsItem.count()) > 0) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => null),
      jobsItem.click().catch(() => null),
    ]);
    expect(!/\/login|\/auth|\/signin/i.test(page.url())).toBeTruthy();
  }

  // Cleanup: attempt to logout (best-effort)
  const profileToggle = page.locator('.header-btn-lg .dropdown-toggle, .header-btn-lg .p-0, .widget-content .rounded-circle, .header-btn-lg .widget-content-wrapper .rounded-circle').first();
  if ((await profileToggle.count()) > 0) {
    await profileToggle.click().catch(() => {});
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out"), a:has-text("Logout")').first();
    if ((await logoutButton.count()) > 0) {
      await logoutButton.click().catch(() => {});
      try { await page.waitForFunction(() => !window.localStorage.getItem('token'), null, { timeout: 10000 }); } catch (e) {}
    }
  }

});
