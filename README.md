# Homepage

Personal CV site for Moritz Kipp, built with Astro + TypeScript. The repo doubles as a showcase of QA engineering practice.

## Setup

Requires Node 22 and pnpm.

```bash
pnpm install
pnpm exec playwright install chromium
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static build to `dist/` (validates `cv.json`) |
| `pnpm preview` | Serve the build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` / `pnpm test:smoke` | Playwright (builds and serves the site itself) |

## Architecture

All content lives in `src/content/cv.json`, validated by `src/lib/cv.ts`. `src/pages/index.astro` only renders it.
Served from GitHub Pages at `/Homepage/`.

## Test strategy

See [docs/test-strategy.md](docs/test-strategy.md).
