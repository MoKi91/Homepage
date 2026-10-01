# Test strategy

Risk-based: spend test effort where a failure would hurt the site's purpose (a trustworthy CV).

| Risk | Coverage | Status |
|---|---|---|
| Invalid or malformed `src/content/cv.json` | Zod schema validated at build time; build fails | M1 |
| Content not rendered from `cv.json` | `tests/e2e/smoke.spec.ts` compares the page to the JSON | M1 |
| Wrong "Present" / certification status | Smoke tests | M1 |
| Broken contact links | Smoke tests assert `href`s | M1 |
| Private data leaking (phone etc.) | Smoke test pattern check | M1 |
| Accessibility regressions | axe-core | planned |
| Responsive / visual regressions | Mobile project, screenshots of key sections | planned |
| Performance / SEO | Lighthouse CI, budgets >= 95 | planned |

Conventions: web-first assertions, `data-test` ids via `getByTestId`, no fixed sleeps, no test-order dependencies.
Smoke tests carry the `@smoke` tag (`pnpm test:smoke`).
