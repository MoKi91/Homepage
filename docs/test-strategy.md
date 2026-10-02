# Test strategy

Risk-based: spend test effort where a failure would hurt the site's purpose (a trustworthy CV).

| Risk | Coverage | Status |
|---|---|---|
| Invalid or malformed `src/content/cv.json` | Zod schema validated at build time (build fails); unit contract tests for date order, one current role, newest-first | M1, M4 |
| Content not rendered from `cv.json` | `tests/e2e/smoke.spec.ts` compares the page to the JSON | M1 |
| Wrong "Present" / certification status | Smoke tests | M1 |
| Broken contact links | Smoke tests assert `href`s | M1 |
| Private data leaking (phone etc.) | Unit contract test on `cv.json` (forbidden keys, phone-like values) plus a rendered-page smoke check | M1, M4 |
| Date/label formatting bugs | Vitest unit tests for `formatRange`, `languageLevel`, `certificationStatus` | M4 |
| Accessibility regressions | axe-core (WCAG 2.1 A/AA, light and dark), landmark and heading-order checks | M4 |
| Browser/viewport differences | Playwright projects: chromium, webkit, mobile (Pixel 7) | M2, M4 |
| Visual regressions | Screenshots of key sections | planned |
| Performance / SEO / best practices | Lighthouse CI (3 runs), every category must be >= 95 or the pipeline fails; scores are published with the site | M6 |

Conventions: web-first assertions, `data-test` ids via `getByTestId`, no fixed sleeps, no test-order dependencies.
Smoke tests carry the `@smoke` tag (`pnpm test:smoke`).

## Known browser differences

- WebKit does not Tab to links by default, so the skip-link keyboard test is skipped there (documented in the spec).

## Layers

- Unit (Vitest, `tests/unit`): pure functions and the data contract.
- E2E (Playwright, `tests/e2e`): rendering, links, layout, accessibility.

## Published evidence

The page's Quality Engineering section renders `src/content/quality.json` (risks and pipeline) and links to the live CI badge and to the latest Playwright report. On deploy, CI assembles the Pages artifact from the build plus the Playwright HTML report of the same run, published at `/Homepage/reports/playwright/`. Tests stub the badge request so they never depend on github.com.

## Lighthouse

`pnpm lighthouse` runs Lighthouse CI against the built site (`lighthouserc.json`) and reduces the median run to `lhci-reports/lighthouse.json`. In CI the deploy job publishes that file as `/Homepage/lighthouse.json`; the page reads it to draw the score rings and hides them if it is missing or invalid. The committed `public/lighthouse.json` is a placeholder (`{ "scores": null }`) so local runs and Lighthouse itself never see a 404. Fixing the first run's only finding (missing favicon, logged as a console error) took Best Practices from 96 to 100.
