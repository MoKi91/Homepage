import { test, expect } from './fixtures';
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
