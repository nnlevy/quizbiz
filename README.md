# WaterShortcut.com

WaterShortcut runs as a Cloudflare Worker with Hono routing. Pages are server-rendered HTML with shared layout, long-lived cached assets, and lightweight client-side JS for calculators and multi-step wizards. GA4 and AdSense load asynchronously and keep reserved space to limit layout shifts.

## Architecture
- **Worker entry:** `src/worker/index.ts` defines all routes, shared layout metadata, sitemap/robots, and API handlers for location lookup and bill analysis (Document AI + OpenAI).
- **Static assets:** `src/worker/assets.ts` exports `/assets/styles.css` and `/assets/app.js` with immutable caching headers. The JS powers wizards, calculators, modals, copy/print helpers, and GA events.
- **Routing/IA:** Every public page path lives in the `siteRoutes` array inside `src/worker/index.ts`. This drives navigation, breadcrumbs, sitemap XML, and the human sitemap page.
- **Structured data:** Organization/WebSite JSON-LD and per-page breadcrumbs are injected from the layout helper.
- **Ads & analytics:** GA4 measurement ID `G-98170RDCDD` and AdSense client `ca-pub-1860356577073395` are wired into the layout head.

## Developing locally
```bash
npm install
npm run dev       # Vite dev server for client bundle
npm run build     # Type-check Worker + build client assets
npm run preview   # Preview production build
```

To run the Worker with Wrangler-style bindings locally, build first and then run:
```bash
npm run build
npm run preview
# or `npx wrangler dev` pointing at dist/watershortcut/wrangler.json
```

## Adding or editing pages
1. Update `siteRoutes` in `src/worker/index.ts` with the new path, title, meta description, body HTML, and optional breadcrumbs.
2. Add page-specific markup via a render helper (see existing render functions near the bottom of `src/worker/index.ts`).
3. Include internal links so the human sitemap, XML sitemap, and navigation stay in sync.
4. Keep copy concise and cite authoritative sources inline when using numeric claims.

## API endpoints
- `POST /api/location` — location-to-provider helper (preserves legacy POST `/`).
- `POST /api/analyze-bill` — PDF upload handler that calls Google Document AI and OpenAI (legacy POST `/` still routes here).

## Deployment
Build artifacts land in `dist/` via `npm run build`. Deployment relies on `wrangler.json` plus the generated `dist/watershortcut/wrangler.json` during CI. Ensure secrets are set in Cloudflare:
- `OPEN_API_KEY_NEW`
- `OPENAI_ORG_ID` (optional)
- `Google_Document_AI_Processor_Prediction_Endpoint`
- `Google-Service-Account-FINAL`
- optional `domains-db` D1 binding if needed later

## Ads and compliance
- AdSense loads asynchronously; avoid adding manual ad slots without confirmed IDs.
- Keep ads out of modals and away from tight interactive clusters to prevent accidental clicks.
- Follow Google publisher policies and Better Ads standards.

## How to add a new calculator or wizard
- Implement UI markup in a render helper alongside existing calculators in `src/worker/index.ts`.
- Wire inputs with `data-calc`/`data-wizard` attributes so `app.js` can handle steps, results, copy/print, and GA events.
- Add the route to `siteRoutes` to auto-include it in sitemaps and navigation.
