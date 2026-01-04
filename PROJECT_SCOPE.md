# Project Scope Tracker

## Completed
- Built a multi-page Cloudflare Worker (Hono) that serves the full marketing and tools surface: home, bill analyzer, provider finder, savings plan, calculators hub + per-calculator pages, leak check, rebates wizard, guides hub + guides, blog articles, about/contact, trust/legal pages, and the human sitemap.
- Centralized SEO metadata + JSON-LD in `src/seo/seoConfig.js` and wired canonical redirects, prerendered markup, and per-route titles/descriptions across public pages.
- Implemented cached static assets (`/assets/styles.css`, `/assets/app.js`) that power calculators, wizards, modals, copy/print helpers, ad fallbacks, and analytics events.
- Preserved legacy upload and location flows by routing POST `/` and `/api/upload` to `/api/analyze-bill` with Document AI + OpenAI processing.
- Shipped Worker endpoints for location lookup, rebates lookup, usage defaults, and Stripe checkout (`/api/credits/checkout`) alongside diagnostic routes (`/__ads`, `ads.txt`, `robots.txt`, `sitemap.xml`, `security.txt`, `humans.txt`).
- Integrated GA4 + AdSense with consent-aware script loading and reserved layout slots to minimize CLS.

## Outstanding / Follow Up Items
- Validate Document AI, OpenAI, and Stripe bindings in the target Cloudflare environment to confirm bill analysis and credit checkout work end-to-end.
- Replace placeholder provider/rebate data in the location and rebates flows with live sources so `/api/location` and `/api/rebates` return authoritative utility data.
- Harden calculator and wizard analytics by verifying GA events in production and adding any missing events for new routes or funnels.
- Expand tests or linting to cover Worker render helpers, API handlers, and client-side JS to catch regressions before deploy.

## Next prompt for continuation
Use this prompt with the next agent to operationalize the Dec 2025 audit requirements while aligning changes to the existing Cloudflare Worker pages, wizards, calculators, rebates, and bill-analysis flows documented above:

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
- When editing this file, reconcile any removals or replacements with the actual Worker functionality and current scope notes above instead of overwriting blindly.
```
