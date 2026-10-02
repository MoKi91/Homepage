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
| Performance / SEO | Lighthouse CI, budgets >= 95 | planned |

Conventions: web-first assertions, `data-test` ids via `getByTestId`, no fixed sleeps, no test-order dependencies.
Smoke tests carry the `@smoke` tag (`pnpm test:smoke`).

## Known browser differences

- WebKit does not Tab to links by default, so the skip-link keyboard test is skipped there (documented in the spec).

## Layers

- Unit (Vitest, `tests/unit`): pure functions and the data contract.
- E2E (Playwright, `tests/e2e`): rendering, links, layout, accessibility.
