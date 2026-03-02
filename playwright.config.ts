import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config (see Context7 /microsoft/playwright).
 * Auth API tests use the request fixture and baseURL; webServer starts the app via dev:test (same DB as seed).
 */
export default defineConfig({
  testDir: 'tests',
  globalSetup: require.resolve('./tests/global-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9002',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:9002',
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
})
