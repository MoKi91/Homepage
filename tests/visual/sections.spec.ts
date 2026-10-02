import { test, expect, LIGHTHOUSE_STUB } from '../e2e/fixtures';

declare const process: { env: Record<string, string | undefined> };

const SECTIONS = ['hero', 'experience', 'skills', 'certifications', 'quality'] as const;

test.describe('Visual regression: key sections', () => {
  test.skip(
    !process.env.CI && !process.env.VISUAL_TESTS,
    'Baselines are rendered in the CI container; set VISUAL_TESTS=1 to run anyway (expect font diffs on macOS)',
  );

  test.beforeEach(async ({ page }) => {
    // Deterministic inputs: fixed Lighthouse scores, badge stubbed by the shared fixture.
    await page.route('**/lighthouse.json', (route) => route.fulfill({ json: LIGHTHOUSE_STUB }));
    await page.goto('./');
    await expect(page.getByTestId('lighthouse')).toHaveAttribute('data-state', 'ready');
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() =>
      page.getByTestId('hero-photo').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
  });

  for (const section of SECTIONS) {
    test(`${section} looks as expected`, async ({ page }) => {
      await expect(page.getByTestId(section)).toHaveScreenshot(`${section}.png`);
    });
  }
});
