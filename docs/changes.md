# PR summary

## What changed
- Added build-time critical CSS inlining and non-blocking CSS swap for SPA + legacy shells.
- Introduced a unified third-party script loader and lazy chart imports.
- Standardized image loading defaults with a reusable `<WsImage>` component.
- Added automated a11y checks (Playwright + axe) and contrast token enforcement.
- Implemented global referral token propagation with sessionStorage TTL and link decoration.

## Why it matters
- Faster first paint and reduced render-blocking CSS improve perceived performance.
- Deferred third-party scripts reduce main-thread contention and idle network activity.
- Lazy images and chart loading keep LCP prioritized and avoid CLS.
- A11y automation + contrast guardrails prevent regressions.
- Referral tokens persist across SPA + legacy links without polluting canonical URLs.

## How to verify locally
```
npm run build
npm run test:unit
npm run test:e2e
```

## Before/after metrics
> **Lighthouse:** Not captured in this environment (no local Chrome/Lighthouse runner). Run locally on `/`, `/analyze-water-bill`, and `/guides`.

> **A11y (axe):** Run `npm run test:e2e -- tests/a11y.spec.ts` to capture current results.
