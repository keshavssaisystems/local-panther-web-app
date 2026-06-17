# panther-web-app

Codebase for web app

# install node package

yarn --legacy-peer-deps

yarn audit fix

# End-to-end tests (Playwright)

Playwright E2E tests are configured under web-app/tests/e2e and use web-app/playwright.config.ts.

Prerequisites: Node 18+ and npm or yarn.

Recommended (from repository root, npm):

- npm --prefix web-app ci
- npx playwright install --with-deps
- npm --prefix web-app run test:e2e

Alternative (inside web-app, yarn):

- cd web-app
- yarn --legacy-peer-deps
- npx playwright install --with-deps
- npx playwright test

Run a single test, headed (for debugging):

- npx playwright test tests/e2e/home.spec.ts --project=chromium --headed

PowerShell debug (headed):

- $env:PWDEBUG=1; npx playwright test

Notes:
- If a dev server is running at http://127.0.0.1:3000 Playwright will reuse it. In CI the config builds and serves the app on port 5000.
- CI workflow: .github/workflows/playwright-web-app.yml runs Playwright on PRs.
