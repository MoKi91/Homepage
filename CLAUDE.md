# Project: Personal CV site for Moritz Kipp (Senior Software Quality Engineer)

## Goal
Fast, accessible, static CV/portfolio site that also *demonstrates* QA
engineering: the repo itself is the proof (tests, CI, quality gates).

## Stack
- Astro + TypeScript (static output), plain CSS (no UI framework unless asked)
- Playwright (TypeScript) for E2E, a11y (@axe-core/playwright), visual regression
- GitHub Actions: lint -> build -> tests -> Lighthouse CI -> deploy
- Hosting: Cloudflare Pages (or GitHub Pages)
- Package manager: pnpm. Ask before adding any dependency.

## Content rules
- All CV content lives in `src/content/cv.json` (sections: summary, experience,
  education, skills, certifications, languages). Components only render it.
- Language: English first; structure must allow adding `de` later.
- PUBLIC DATA ONLY: name, title, city (Hamburg), LinkedIn, contact email.
  NEVER include phone number, birth date or street address.
- Source PDFs live in `/private/` (gitignored). Never commit them.
- Certifications: CT-GenAI is "in preparation (10/2026)", not achieved.
- Do not invent metrics or claims. Only use facts from the CV
  (e.g. high-priority regression coverage 0% -> 90% with Playwright/TypeScript).

## Quality bar (non-negotiable)
- Lighthouse: Performance/A11y/Best Practices/SEO >= 95
- WCAG 2.1 AA, keyboard navigable, dark/light via prefers-color-scheme
- No layout shift, no third-party trackers, no cookie banner needed
- Tests must be deterministic: no fixed sleeps, use web-first assertions,
  role/label locators, no test-order dependencies

## Test strategy (document in /docs/test-strategy.md)
- Risk-based: navigation/links, content rendering from cv.json, contact links,
  a11y, responsive layouts, visual regression on key sections
- Smoke suite on every push, full suite on PR/main
- Playwright HTML report + traces as CI artifacts

## Workflow
- Small commits, conventional commit messages, feature branches + PR
- Plan first, then implement. Run `pnpm test` before declaring anything done.
- Keep README current: setup, scripts, architecture, test strategy, CI badge.