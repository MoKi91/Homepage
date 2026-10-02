import { defineConfig, devices } from '@playwright/test';

// Avoids pulling in @types/node just for process.env.
declare const process: { env: Record<string, string | undefined> };

const PORT = 4323;

// Baselines are rendered in CI inside the pinned Playwright container (fonts and rasterising must
// match), so there is one set of images, not one per OS. See README, "Visual regression".
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report-visual' }]]
    : [['list']],
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.002 } },
  use: {
    baseURL: `http://localhost:${PORT}/Homepage/`,
    testIdAttribute: 'data-test',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop-light', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, colorScheme: 'light' } },
    { name: 'desktop-dark', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, colorScheme: 'dark' } },
    { name: 'mobile-light', use: { ...devices['Pixel 7'], colorScheme: 'light' } },
  ],
  webServer: {
    command: `npx astro build && npx astro preview --ignore-lock --port ${PORT}`,
    url: `http://localhost:${PORT}/Homepage/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
