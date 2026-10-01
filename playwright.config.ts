import { defineConfig, devices } from '@playwright/test';

// Avoids pulling in @types/node just for process.env.
declare const process: { env: Record<string, string | undefined> };

const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}/Homepage/`,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx astro build && npx astro preview --ignore-lock --port ${PORT}`,
    url: `http://localhost:${PORT}/Homepage/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
