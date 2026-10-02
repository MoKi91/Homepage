import { test, expect } from '@playwright/test';

test.describe('Layout', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`has no horizontal scroll (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('./');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
    });
  }

  test('follows prefers-color-scheme', async ({ page }) => {
    await page.goto('./');
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 248, 244)');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(20, 19, 15)');
  });

  test('skip link becomes visible on keyboard focus and targets main', async ({ page, browserName }) => {
    // Safari/WebKit leaves links out of the Tab order by default (needs Option+Tab or a system setting).
    test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default');
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveAttribute('href', '#main');
  });
});
