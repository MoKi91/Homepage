# Homepage

[![CI](https://github.com/MoKi91/Homepage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/MoKi91/Homepage/actions/workflows/ci.yml)

Personal CV site for Moritz Kipp, built with Astro + TypeScript. The repo doubles as a showcase of QA engineering practice.

## Setup

Requires Node 22 and pnpm.

```bash
pnpm install
pnpm exec playwright install chromium webkit
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static build to `dist/` (validates `cv.json`) |
| `pnpm preview` | Serve the build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit tests, then E2E |
| `pnpm test:unit` | Vitest (`tests/unit`) |
| `pnpm og` | Regenerate `public/og.png` (1200x630 link preview) from `cv.json` and the portrait |
| `pnpm test:links` | Link check against the deployed site (`LINK_CHECK_URL` to override) |
| `pnpm lighthouse` | Lighthouse CI on the built site (needs Chrome; set `CHROME_PATH` if not found) |
| `pnpm test:e2e` / `pnpm test:smoke` | Playwright (builds and serves the site itself) |

## Architecture

CV content lives in `src/content/cv.json`, validated by `src/lib/cv.ts`. The Quality Engineering section is driven by `src/content/quality.json` (`src/lib/quality.ts`). `src/pages/index.astro` only renders it.
Served from GitHub Pages at `/Homepage/`.

## Test strategy

See [docs/test-strategy.md](docs/test-strategy.md).

## CI / Deploy

`.github/workflows/ci.yml`: typecheck and build, then Playwright E2E (report uploaded as an artifact) and Lighthouse CI (all categories must be >= 95), then deploy to GitHub Pages on pushes to `main` only. The deployed site includes that run's Playwright report at `/Homepage/reports/playwright/`.

Deploy is opt-in: it runs only when the repository variable `DEPLOY_ENABLED` is `true` (Settings → Secrets and variables → Actions → Variables). Enable it after the repo is public and Settings → Pages → Source is set to **GitHub Actions**.

## Portrait

`src/assets/portrait-320.jpg` and `portrait-480.jpg` are square crops of the source photo (re-encoded, no EXIF/GPS), served as a responsive `srcset`. The full-size original is kept out of the repo (`/private/`, gitignored). Alt text lives in `cv.json` (`photo.alt`).

## Link previews and SEO

Title, description, canonical URL, Open Graph/Twitter tags and Person JSON-LD are generated from `cv.json` in `src/layouts/Base.astro` and `src/pages/index.astro`. No sitemap or robots.txt: this is a single page on a project path (`/Homepage/`), where crawlers only read the host-root `robots.txt`.

## Link check

`.github/workflows/links.yml` runs weekly (Mondays 06:00 UTC) and on demand against the live site. Scheduled workflows on public repos are paused by GitHub after 60 days without repo activity.

## Print as CV

Printing the page (or the "Print or save as PDF" button, shown only with JavaScript) produces a compact two-page A4 CV: the Quality Engineering section and site chrome are hidden, and email/LinkedIn are printed as plain text. Styles live in the `@media print` block and `@page` rule of `src/styles/global.css`; `tests/e2e/print.spec.ts` guards the behaviour, including a two-page limit.
