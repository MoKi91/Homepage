import { test, expect } from './fixtures';
import cv from '../../src/content/cv.json' with { type: 'json' };

test.describe('Print as CV', () => {
  test('print view drops the site chrome and shows contact details as text', async ({ page }) => {
    await page.goto('./');
    await page.emulateMedia({ media: 'print' });
    await expect(page.getByTestId('quality')).toBeHidden();
    await expect(page.getByTestId('link-how-built')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Contact' })).toBeHidden();
    await expect(page.getByTestId('print-cv')).toBeHidden();
    await expect(page.getByTestId('print-contact')).toHaveText(`${cv.links.email} · ${cv.links.linkedin}`);
    for (const id of ['hero-photo', 'about', 'experience', 'skills', 'education', 'certifications', 'languages']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  test('on screen the contact line is hidden and the CV content is unchanged', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByTestId('print-contact')).toBeHidden();
    await expect(page.getByTestId('quality')).toBeVisible();
  });

  test('fits on at most two A4 pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'page.pdf() is Chromium-only; one desktop run is enough');
    await page.goto('./');
    const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true });
    // Chromium writes one "/Type /Page" object per page ("/Type /Pages" is the tree root and excluded by \b).
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;
    expect(pages).toBeGreaterThanOrEqual(1);
    expect(pages).toBeLessThanOrEqual(2);
  });

  test('"Print or save as PDF" opens the print dialog', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { printed: number }).printed = 0;
      window.print = () => {
        (window as unknown as { printed: number }).printed += 1;
      };
    });
    await page.goto('./');
    await page.getByTestId('print-cv').click();
    expect(await page.evaluate(() => (window as unknown as { printed: number }).printed)).toBe(1);
  });

  test('the print button is not offered without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto('./');
    await expect(page.getByTestId('print-cv')).toBeHidden();
    await context.close();
  });
});
