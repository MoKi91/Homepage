// Renders public/og.png (1200x630) from cv.json and the portrait, using Playwright's Chromium.
// Run manually after changing name/title/portrait: pnpm og
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const cv = JSON.parse(readFileSync('src/content/cv.json', 'utf8'));
const portrait = readFileSync('src/assets/portrait-480.jpg').toString('base64');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const html = `<!doctype html><html><body style="margin:0;width:1200px;height:630px;background:#faf8f4;color:#1c1b19;
  font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;display:flex;align-items:center;box-sizing:border-box;padding:0 96px;gap:72px;position:relative">
  <div style="position:absolute;left:0;top:0;bottom:0;width:16px;background:#0b6b3a"></div>
  <div style="flex:1">
    <div style="font:600 24px/1 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#55534d">${esc(cv.location)}</div>
    <div style="font-size:104px;line-height:1.02;letter-spacing:-.02em;margin:24px 0 20px">${esc(cv.name)}</div>
    <div style="font-size:42px;font-style:italic;color:#55534d">${esc(cv.title)}</div>
    <div style="margin-top:36px;font:600 26px/1 system-ui,sans-serif;color:#0b6b3a">Playwright &middot; TypeScript &middot; Test strategy</div>
  </div>
  <img src="data:image/jpeg;base64,${portrait}" width="300" height="300"
    style="border-radius:50%;object-fit:cover;border:2px solid #d8d3c8;flex:none" />
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('Wrote public/og.png');
