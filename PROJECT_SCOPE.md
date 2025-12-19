# Project Scope Tracker

## Completed
- Built a multi-page, sitemap-driven Cloudflare Worker using Hono with canonical metadata, JSON-LD, modals, and trust/legal routes.
- Implemented cached static assets for shared CSS/JS powering calculators, wizards, modals, copy/print helpers, and GA/AdSense hooks.
- Preserved legacy upload and location flows by routing POST `/` to the new `/api/analyze-bill` handler with Document AI + OpenAI calls.
- Generated `/sitemap.xml`, `/robots.txt`, and a human sitemap page from a single `siteRoutes` source of truth.

## Outstanding / Follow Up Items
- Validate Document AI and OpenAI bindings in the target Cloudflare environment to confirm bill analysis works end-to-end.
- Add real provider lookup data in `locationFallback` or connect a live data source so `/api/location` can return utility details beyond the placeholder payload.
- Harden calculator and wizard analytics by verifying GA events in production and adding any missing events for new routes.
- Expand tests or linting to cover Worker render helpers and client-side JS to catch regressions before deploy.

## Next prompt for continuation
Use this prompt with the next agent to operationalize the Dec 2025 audit requirements:

```
Hardening tasks
- Fix the mobile menu overlay so it traps focus, dismisses reliably, and never obscures primary content or ads.
- Add semantic headings plus SSR/prerendering so every page has crawlable structure, color-contrast-safe palettes, and descriptive alt text for all imagery.
- Ensure every file/bill upload control has an explicit label, helper copy, and privacy-policy link; surface a persistent privacy policy link in the footer/header.
- Improve keyboard navigation (skip links, visible focus states, logical tab order) across modals, forms, and menus.

SEO + monetization directives
- Create unique, descriptive titles and meta descriptions per page; add JSON-LD/FAQ schema where applicable and document XML sitemap submission to search consoles.
- Optimize bundle size and images (compression, formats, lazy loading) to improve LCP and CLS; note any required prerender paths.
- Add trust messaging on bill uploads covering data retention, consent, and analysis scope; include clear CTAs to upload bills or start analysis alongside non-blocking AdSense placements.

Revenue focus + measurement
- Ensure AdSense slots never block core content or primary CTAs; define optimal placements for above-the-fold and in-content without harming UX.
- Specify success metrics for the next iteration: upload conversion rate, ad CTR, and completion rates for the bill analysis flow with tracking guidance.
```
