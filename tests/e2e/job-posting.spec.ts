import { test, expect } from '@playwright/test';

// Requires employer/test account credentials (same env vars used by login test)
test.skip(!(process.env.PLAYWRIGHT_TEST_USER && process.env.PLAYWRIGHT_TEST_PASSWORD), 'PLAYWRIGHT_TEST_USER/PASSWORD not set');

const jobCreatePath = process.env.PLAYWRIGHT_JOB_CREATE_PATH || '/jobs/new';

test('create job posting (basic)', async ({ page }) => {
  // Login (reuse same login approach)
  await page.goto('/login');
  const email = page.locator('input[type="email"], input[name="email"], #email, input[name="username"]');
  const password = page.locator('input[type="password"], input[name="password"], #password');

  if ((await email.count()) === 0) {
    const loginLink = page.getByRole('link', { name: /sign\s?in|log\s?in|login/i });
    const loginBtn = page.getByRole('button', { name: /sign\s?in|log\s?in|login/i });
    if ((await loginLink.count()) > 0) {
      await loginLink.first().click();
    } else if ((await loginBtn.count()) > 0) {
      await loginBtn.first().click();
    } else {
      test.skip(true, 'No login UI found');
    }
    await page.waitForLoadState('networkidle');
  }

  await email.first().fill(process.env.PLAYWRIGHT_TEST_USER!);
  await password.first().fill(process.env.PLAYWRIGHT_TEST_PASSWORD!);
  const submit = page.getByRole('button', { name: /sign\s?in|log\s?in|login|submit/i }).first();
  if ((await submit.count()) === 0) {
    await page.locator('button[type="submit"]').first().click();
  } else {
    await submit.click();
  }

  await page.waitForLoadState('networkidle');

  // Go to job creation page
  await page.goto(jobCreatePath);
  await page.waitForLoadState('networkidle');

  const titleInput = page.locator('input[name="title"], input[name="jobTitle"], input[id*="title"], input[placeholder*="Title"]');
  // If title input not present, attempt MFA code autofill or skip
  if ((await titleInput.count()) === 0) {
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
  }
  await expect(titleInput.first()).toBeVisible();

  const description = page.locator('textarea[name="description"], textarea[id*="description"], textarea[placeholder*="Description"]');
  if ((await description.count()) > 0) {
    await description.first().fill('Automated test job created by Playwright E2E test.');
  }

  const testTitle = `E2E Test Job ${Date.now()}`;
  await titleInput.first().fill(testTitle);

  const createBtn = page.getByRole('button', { name: /create|publish|post|save/i }).first();
  if ((await createBtn.count()) === 0) {
    await page.locator('button[type="submit"]').first().click();
  } else {
    await createBtn.click();
  }

  await page.waitForLoadState('networkidle');

  // Verify: either a success message or the job appears in the jobs list
  const successMsg = page.locator('text=/job created|created successfully|posted/i');
  if ((await successMsg.count()) > 0) {
    await expect(successMsg.first()).toBeVisible();
  } else {
    await page.goto('/jobs');
    const jobTitle = page.getByText(testTitle, { exact: false });
    await expect(jobTitle.first()).toBeVisible({ timeout: 10000 });
  }
});
