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
Use this prompt with the next agent to focus on research and copy depth:

```
Audit each route in src/worker/index.ts for accuracy against the authoritative EPA/ENERGY STAR sources. Expand any missing numerical citations with inline [n] markers and add concise, source-backed copy where the current content is thin. Ensure the human sitemap and XML sitemap stay in sync after edits.
```
