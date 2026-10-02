import { test, expect, LIGHTHOUSE_STUB } from './fixtures';
import quality from '../../src/content/quality.json' with { type: 'json' };

test.describe('Quality Engineering section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('is present with a heading and the intro from quality.json', async ({ page }) => {
    const section = page.getByTestId('quality');
    await expect(section.getByRole('heading', { name: 'Quality Engineering', level: 2 })).toBeVisible();
    await expect(section).toContainText(quality.intro);
  });

  test('links to the CI workflow, the Playwright report and the source', async ({ page }) => {
    const ci = page.getByTestId('quality-ci');
    await expect(ci).toHaveAttribute('href', `https://github.com/${quality.repo}/actions/workflows/ci.yml`);
    await expect(ci.getByRole('img', { name: /CI status/ })).toBeVisible();
    await expect(page.getByTestId('quality-report')).toHaveAttribute('href', /\/reports\/playwright\/$/);
    await expect(page.getByTestId('quality-repo')).toHaveAttribute('href', `https://github.com/${quality.repo}`);
  });

  test('lists the pipeline stages and every risk in data order', async ({ page }) => {
    await expect(page.getByTestId('quality-pipeline').getByRole('listitem')).toHaveText(quality.pipeline);
    const risks = page.getByTestId('quality-risk');
    await expect(risks).toHaveCount(quality.risks.length);
    for (const [i, r] of quality.risks.entries()) {
      await expect(risks.nth(i)).toContainText(r.risk);
      await expect(risks.nth(i)).toContainText(r.coverage);
    }
  });

  test('badge reserves its 20px height up front', async ({ page }) => {
    const box = await page.getByTestId('quality-ci').boundingBox();
    expect(box?.height).toBe(20);
  });
});

test.describe('Lighthouse scores', () => {
  test('renders the scores from lighthouse.json with their context', async ({ page }) => {
    await page.route('**/lighthouse.json', (route) => route.fulfill({ json: LIGHTHOUSE_STUB }));
    await page.goto('./');

    const block = page.getByTestId('lighthouse');
    await expect(block).toHaveAttribute('data-state', 'ready');
    const scores = page.getByTestId('lighthouse-score');
    await expect(scores).toHaveCount(4);
    await expect(scores).toContainText(['100', '98', '96', '100']);
    await expect(scores).toContainText(['Performance', 'Accessibility', 'Best Practices', 'SEO']);
    await expect(page.getByTestId('lighthouse-meta')).toHaveText(
      'Median of 3 Lighthouse runs on the deployed build (2026-01-02, commit abc1234).',
    );
  });

  test('is hidden while the published file has no scores (placeholder)', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByTestId('lighthouse')).toHaveAttribute('data-state', 'unavailable');
    await expect(page.getByTestId('lighthouse')).toBeHidden();
  });

  for (const [name, fulfill] of [
    ['missing', { status: 404, body: 'nope' }],
    ['malformed', { json: { ...LIGHTHOUSE_STUB, scores: { ...LIGHTHOUSE_STUB.scores, seo: 'high' } } }],
    ['out of range', { json: { ...LIGHTHOUSE_STUB, scores: { ...LIGHTHOUSE_STUB.scores, seo: 140 } } }],
  ] as const) {
    test(`is hidden when lighthouse.json is ${name}`, async ({ page }) => {
      await page.route('**/lighthouse.json', (route) => route.fulfill(fulfill));
      await page.goto('./');
      await expect(page.getByTestId('lighthouse')).toHaveAttribute('data-state', 'unavailable');
    });
  }
});
