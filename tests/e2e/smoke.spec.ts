import { test, expect } from './fixtures';
import cv from '../../src/content/cv.json' with { type: 'json' };

test.describe('CV home page @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('loads with the name as the single h1 and a matching title', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(cv.name));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(cv.name);
    await expect(page.getByTestId('hero-title')).toHaveText(cv.title);
    await expect(page.getByTestId('hero-location')).toHaveText(cv.location);
  });

  test('shows a loaded, circular portrait next to the name', async ({ page }) => {
    const photo = page.getByTestId('hero-photo');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('alt', cv.photo.alt);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(photo).toHaveCSS('border-radius', '50%');
    const box = await photo.boundingBox();
    expect(box?.width).toBe(box?.height);
    const name = (await page.getByTestId('hero-name').boundingBox())!;
    const photoBox = box!;
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      // Wide layout: beside the name, vertically overlapping it.
      expect(photoBox.y).toBeLessThan(name.y + name.height);
      expect(photoBox.y + photoBox.height).toBeGreaterThan(name.y);
    } else {
      // Narrow layout: stacked above the name.
      expect(photoBox.y + photoBox.height).toBeLessThanOrEqual(name.y);
    }
  });

  test('keeps the CV sections together, with Quality Engineering last and separate', async ({ page }) => {
    const order = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.getAttribute('data-test')));
    expect(order).toEqual(['about', 'experience', 'skills', 'education', 'certifications', 'languages', 'quality']);
  });

  test('renders every main section', async ({ page }) => {
    for (const id of ['about', 'experience', 'skills', 'education', 'certifications', 'languages']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  test('renders experience entries in data order, current role as Present', async ({ page }) => {
    const items = page.getByTestId('experience-item');
    await expect(items).toHaveCount(cv.experience.length);
    for (const [i, job] of cv.experience.entries()) {
      await expect(items.nth(i)).toContainText(job.role);
      await expect(items.nth(i)).toContainText(job.company);
    }
    const currentCount = cv.experience.filter((j) => j.end === null).length;
    await expect(page.getByTestId('experience-range').filter({ hasText: 'Present' })).toHaveCount(currentCount);
  });

  test('shows the tagline in the hero', async ({ page }) => {
    await expect(page.getByTestId('hero-tagline')).toHaveText(cv.description);
  });

  test('renders each role\'s summary and achievements bullets from cv.json', async ({ page }) => {
    const items = page.getByTestId('experience-item');
    for (const [i, job] of cv.experience.entries()) {
      const item = items.nth(i);
      if ('bullets' in job) {
        await expect(item.getByTestId('experience-bullets').getByRole('listitem')).toHaveText(job.bullets as string[]);
      } else {
        await expect(item.getByTestId('experience-bullets')).toHaveCount(0);
      }
      if ('summary' in job) await expect(item.getByTestId('experience-summary')).toHaveText(job.summary as string);
    }
  });

  test('marks in-preparation certifications distinctly from achieved ones', async ({ page }) => {
    const items = page.getByTestId('certification-item');
    await expect(items).toHaveCount(cv.certifications.length);
    for (const status of ['achieved', 'in_preparation'] as const) {
      const expected = cv.certifications.filter((c) => c.status === status).length;
      await expect(page.locator(`[data-test="certification-item"][data-status="${status}"]`)).toHaveCount(expected);
    }
    await expect(page.locator('[data-status="in_preparation"]').first()).toContainText('In preparation');
  });

  test('contact links point to the right targets', async ({ page }) => {
    await expect(page.getByTestId('link-email')).toHaveAttribute('href', `mailto:${cv.links.email}`);
    await expect(page.getByTestId('link-linkedin')).toHaveAttribute('href', `https://${cv.links.linkedin}`);
  });

  test('"How this site is built" jumps to the Quality Engineering section', async ({ page }) => {
    const link = page.getByTestId('link-how-built');
    await expect(link).toHaveAttribute('href', '#quality');
    await link.click();
    await expect(page).toHaveURL(/#quality$/);
    await expect(page.getByTestId('quality')).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Quality Engineering', level: 2 })).toBeInViewport();
  });

  test('never exposes private data', async ({ page }) => {
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/\+?\d[\d\s/-]{8,}\d/); // phone-like numbers
  });
});
