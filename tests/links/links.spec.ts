import { test, expect } from '@playwright/test';

// LinkedIn answers bots with a non-standard 999; it means "reachable, but not for scripts".
const BOT_BLOCKED = new Map([['www.linkedin.com', 999], ['linkedin.com', 999]]);

test('every link and image on the deployed page resolves', async ({ page, request }) => {
  await page.goto('./');
  const urls = await page.evaluate(() => {
    const found = new Set<string>();
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => found.add(a.href));
    document.querySelectorAll<HTMLImageElement>('img[src]').forEach((i) => found.add(i.src));
    return [...found].filter((u) => u.startsWith('http'));
  });
  expect(urls.length, 'expected the page to contain links').toBeGreaterThan(3);

  const failures: string[] = [];
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await request.get(url, { timeout: 20_000 });
        const status = res.status();
        const tolerated = BOT_BLOCKED.get(new URL(url).hostname) === status;
        if (status >= 400 && !tolerated) failures.push(`${status} ${url}`);
      } catch (error) {
        failures.push(`ERR ${url} (${(error as Error).message.split('\n')[0]})`);
      }
    }),
  );
  expect(failures.sort(), 'broken links').toEqual([]);
});
