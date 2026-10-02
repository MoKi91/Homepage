import { test as base } from '@playwright/test';

const STUB_BADGE = '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20"><rect width="90" height="20" fill="#2e7d32"/></svg>';

// Keeps tests independent of github.com: the live CI badge is served from a stub.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://github.com/**/badge.svg*', (route) =>
      route.fulfill({ contentType: 'image/svg+xml', body: STUB_BADGE }),
    );
    await use(page);
  },
});

export { expect } from '@playwright/test';
