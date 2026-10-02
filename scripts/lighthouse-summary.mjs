// Reduces the Lighthouse CI output to the scores the site displays.
// Reads lhci-reports/manifest.json, writes lhci-reports/lighthouse.json.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'lhci-reports';
const manifest = JSON.parse(readFileSync(`${DIR}/manifest.json`, 'utf8'));
const run = manifest.find((r) => r.isRepresentativeRun);
if (!run) throw new Error('No representative Lighthouse run found in manifest.json');

const { categories, finalDisplayedUrl } = JSON.parse(readFileSync(run.jsonPath, 'utf8'));
const pct = (id) => {
  const score = categories[id]?.score;
  if (typeof score !== 'number') throw new Error(`Missing Lighthouse category: ${id}`);
  return Math.round(score * 100);
};

const summary = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA?.slice(0, 7) ?? null,
  runs: manifest.length,
  scores: {
    performance: pct('performance'),
    accessibility: pct('accessibility'),
    bestPractices: pct('best-practices'),
    seo: pct('seo'),
  },
};

writeFileSync(`${DIR}/lighthouse.json`, `${JSON.stringify(summary, null, 2)}\n`);
console.log(`Lighthouse (${finalDisplayedUrl}, median of ${manifest.length}):`, summary.scores);
