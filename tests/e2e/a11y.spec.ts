import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`home page has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('./');
      const results = await new AxeBuilder({ page }).withTags(WCAG_21_AA).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('has landmarks and a logical heading order', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    const levels = await page.getByRole('heading').evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `heading jump at index ${i}`).toBeLessThanOrEqual(1);
    }
  });
});
