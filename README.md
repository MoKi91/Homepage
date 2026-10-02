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
