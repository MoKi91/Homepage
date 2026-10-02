import { defineConfig } from '@playwright/test';

// Avoids pulling in @types/node just for process.env.
declare const process: { env: Record<string, string | undefined> };

// Checks the links on the deployed site. Run on a schedule, not on every PR,
// so a flaky third-party host can never block a merge.
export default defineConfig({
  testDir: 'tests/links',
  retries: 1,
  reporter: [['list']],
  use: { baseURL: process.env.LINK_CHECK_URL ?? 'https://moki91.github.io/Homepage/' },
});
