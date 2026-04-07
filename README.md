# WaterShortcut.com

WaterShortcut runs as a Cloudflare Worker with Hono routing and a Vite-built React client. Public marketing routes are prerendered to static HTML for crawlability and share the same SEO metadata source of truth. GA4 and AdSense load asynchronously and keep reserved space to limit layout shifts.

## Architecture
- **Worker entry:** `src/worker/index.ts` handles API endpoints, legacy HTML routes, and enforces HTTPS + canonical host redirects. Robots and the XML sitemap now draw from the central SEO config.
- **Static assets:** `src/worker/assets.ts` exports `/assets/styles.css` and `/assets/app.js` with immutable caching headers. The JS powers wizards, calculators, modals, copy/print helpers, and GA events.
- **SEO source of truth:** `src/seo/seoConfig.js` defines the canonical host plus per-route title, description, canonical paths, OG/Twitter data, and JSON-LD.
- **Prerendering:** `npm run prerender` clones the built `dist/index.html`, injects metadata and prerendered HTML shells for each public route, and writes `sitemap.xml` + `robots.txt`.
- **Structured data:** Organization/WebSite JSON-LD lives on `/`; Article JSON-LD is added for each Learn page.
- **Ads & analytics:** GA4 measurement ID `G-98170RDCDD` and AdSense client `ca-pub-1860356577073395` are wired into the layout head. Auto ads are queued by default; set slot IDs to monetize inline/footer placements.

## Developing locally
```bash
npm install
npm run dev       # Vite dev server for client bundle
npm run build     # Type-check + build client assets + prerender SEO HTML
npm run preview   # Preview production build
```

To run the Worker with Wrangler-style bindings locally, build first and then run:
```bash
npm run build
npm run preview
# or `npx wrangler dev` pointing at dist/watershortcut/wrangler.json
```

## Adding or editing pages
1. Update or add entries in `src/seo/seoConfig.js` with the route path, title, description, canonicalPath, and structured data.
2. If the React page content changes materially, consider adding an HTML snippet to `bodyHtml` so prerendered output stays descriptive.
3. Run `npm run build` to regenerate prerendered HTML, sitemap.xml, and robots.txt.
4. Keep copy concise and cite authoritative sources inline when using numeric claims.

### Public route map (prerendered)
- `/`
- `/analyze-water-bill`
- `/find-water-provider`
- `/savings-plan`
- `/water-iq`
- `/calculators`
- `/calculators/shower`
- `/calculators/faucet`
- `/calculators/toilet`
- `/calculators/laundry`
- `/calculators/outdoor`
- `/leak-check`
- `/rebates`
- `/guides`
- `/guides/showerheads`
- `/guides/find-fix-leaks`
- `/guides/toilets`
- `/guides/water-bill`
- `/guides/outdoor-watering`
- `/blog-how-to-eject.html`
- `/blog-is-it-safe.html`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/affiliate`
- `/disclaimer`

## SEO validation checklist
- Run `npm run seo:check` after a build to verify every prerendered route has `<title>`, description, canonical, OG/Twitter tags, and exactly one H1.
- Manually open `view-source:https://www.watershortcut.com/<route>` for each public page to confirm metadata renders server-side.
- Confirm `https://www.watershortcut.com/robots.txt` allows crawling and references the sitemap.
- Confirm `https://www.watershortcut.com/sitemap.xml` lists the indexable routes and uses the canonical host.
- Confirm non-`www` hosts redirect to `www.watershortcut.com`.

## API endpoints
- `POST /api/location` — location-to-provider helper (preserves legacy POST `/`).
- `POST /api/analyze-bill` — PDF upload handler that calls Google Document AI and OpenAI (legacy POST `/` still routes here).
- `GET /api/health` — runtime binding/config check for AI + document processing.

## Deployment
Build artifacts land in `dist/` via `npm run build`. Deployment relies on `wrangler.json` plus the generated `dist/watershortcut/wrangler.json` during CI. Ensure secrets are set in Cloudflare:
- `PORTFOLIO_AI_SERVICE` (preferred Worker service binding to `riskfreettrial#PortfolioAIService`)
- `OPEN_API_KEY_NEW` (optional legacy fallback only)
- `OPENAI_ORG_ID` (optional)
- `Google_Document_AI_Processor_Prediction_Endpoint`
- `Google-Service-Account-FINAL` (service account JSON used by `getOAuthToken`)
- `OAUTH_API_KEY` (Google OAuth API key for server-side Google auth)
- `OAUTH_Client_ID` (Google OAuth Client ID used to verify ID tokens)
- `OUATH_Client_Secret` (Google OAuth client secret used for token exchange)
- `OAUTH_DOMAIN` (optional cookie domain to share sessions across domains)
- optional `domains-db` D1 binding if needed later

Because WaterShortcut enforces HTTPS and the canonical `www` host inside the Worker, the asset pipeline uses selective `run_worker_first` rules for document routes. Without that, Cloudflare can serve prerendered HTML directly from the asset layer and bypass the redirect middleware for apex-page requests.

### Auth + credits persistence
The Worker expects these bindings in `wrangler.json` (or equivalent Wrangler config):
- `UsersAcrossAllDomains` — D1 database for `users`, `auth_sessions`, and `oauth_states` (use the D1 database ID).
- `USER_SESSIONS_ACROSS_DOMAINS` — KV namespace for OAuth state + session data (use the KV namespace ID from the dashboard or `wrangler kv:namespace list`).

During builds we replace `${DOMAINS_DB_ID}` and `${USER_SESSIONS_ACROSS_DOMAINS_ID}` placeholders with the Cloudflare resource IDs. Set the `_NEW` variables (or the original names) as build-time environment variables (Pages: Settings → Build & Deployments → Environment variables) to the UUID values shown in the Cloudflare dashboard (not the display names). If you already stored the KV namespace UUID under `USER_SESSIONS_ACROSS_DOMAINS`, the build step will accept it but logs a deprecation warning. If you only set them under the Worker runtime bindings, the build step will not see them.
Avoid defining `DOMAINS_DB_ID` or `USER_SESSIONS_ACROSS_DOMAINS_ID` under `vars` in `wrangler.json`; those names are reserved for the D1/KV bindings and Wrangler requires binding names to be unique across vars and resources.

Run migrations to provision auth tables and credits columns:
```bash
wrangler d1 migrations apply UsersAcrossAllDomains
```
Migrations live in `migrations/` and include:
- `0002_create_auth_tables.sql` (users, auth_sessions, oauth_states)
- `0003_update_users_for_auth.sql` (credits + password hash fields)

## Deployment smoke check
Use the automated smoke check to verify the Worker can fetch a Google OAuth token, call the Document AI endpoint, and reach OpenAI. See `docs/deployment-checklist.md` for the full checklist.

```bash
WORKER_BASE_URL="https://www.watershortcut.com" npm run smoke:worker
```

## Ads and compliance
- AdSense loads asynchronously; avoid adding manual ad slots without confirmed IDs. The Worker ships with built-in defaults for each slot, and you can override them with Cloudflare vars (numeric slot IDs from AdSense):
  - `ADSENSE_SLOT_INLINE` (auto format, default `5613501243`)
  - `ADSENSE_SLOT_FOOTER` (autorelaxed format, default `1809987601`)
  - `ADSENSE_SLOT_STICKY` (fluid format, default `7418194041`, layout key `-gw-3+1f-3d+2z`)
  Add overrides to `wrangler.json` under `vars` or `wrangler secret put` so the Worker renders live `<ins class="adsbygoogle">` units.
- If Cloudflare Rocket Loader is enabled, exclude the AdSense script or keep `data-cfasync="false"` on the AdSense `<script>` tag to avoid breaking Auto Ads. Purge the Cloudflare HTML cache after deploying head changes so the updated script tag ships.
- Set `VITE_ADSENSE_DEBUG=true` to enable optional AdSense debug logging in the SPA (script presence/load state, slot counts, and push errors).
- If AdSense does not fill a slot within a few seconds, the client injects a polite fallback message inside the ad container so visitors still see a prompt to support WaterShortcut.
- Keep ads out of modals and away from tight interactive clusters to prevent accidental clicks.
- Follow Google publisher policies and Better Ads standards.

## How to add a new calculator or wizard
- Implement UI markup in a render helper alongside existing calculators in `src/worker/index.ts`.
- Wire inputs with `data-calc`/`data-wizard` attributes so `app.js` can handle steps, results, copy/print, and GA events.
- Add the route to `siteRoutes` to auto-include it in sitemaps and navigation.
