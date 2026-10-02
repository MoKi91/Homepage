import { test, expect } from './fixtures';
import cv from '../../src/content/cv.json' with { type: 'json' };

const SITE = 'https://moki91.github.io';
const PAGE_URL = `${SITE}/Homepage/`;

test.describe('SEO and link previews', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('has a title, a concise description and a canonical URL', async ({ page }) => {
    await expect(page).toHaveTitle(`${cv.name} – ${cv.title}`);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', cv.description);
    expect(cv.description.length).toBeLessThanOrEqual(160);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', PAGE_URL);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('declares Open Graph and Twitter card metadata with an absolute image URL', async ({ page }) => {
    const og = (property: string) => page.locator(`meta[property="${property}"]`);
    await expect(og('og:type')).toHaveAttribute('content', 'website');
    await expect(og('og:title')).toHaveAttribute('content', `${cv.name} – ${cv.title}`);
    await expect(og('og:description')).toHaveAttribute('content', cv.description);
    await expect(og('og:url')).toHaveAttribute('content', PAGE_URL);
    await expect(og('og:image')).toHaveAttribute('content', `${PAGE_URL}og.png`);
    await expect(og('og:image:width')).toHaveAttribute('content', '1200');
    await expect(og('og:image:height')).toHaveAttribute('content', '630');
    await expect(og('og:image:alt')).not.toHaveAttribute('content', '');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('serves the link-preview image at 1200x630', async ({ request }) => {
    const res = await request.get('og.png');
    expect(res.ok()).toBe(true);
    expect(res.headers()['content-type']).toContain('image/png');
    const png = await res.body();
    // PNG IHDR: width and height are big-endian uint32 at byte offsets 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(400_000);
  });

  test('embeds valid Person structured data that matches cv.json and contains no email', async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? '');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe(cv.name);
    expect(data.jobTitle).toBe(cv.title);
    expect(data.address.addressLocality).toBe('Hamburg');
    expect(data.sameAs).toEqual([`https://${cv.links.linkedin}`]);
    expect(raw).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });
});
