# WaterShortcut internal product manual (audit + clone guide)

## Purpose
This document inventories the WaterShortcut app surfaces, components, and data flows, then provides a duplication checklist for reusing the app in another niche (e.g., energy bills, insurance, telecom). It is based on repository inspection only.

---

## 1) Architecture overview

### Runtime layers
- **Cloudflare Worker (Hono)** serves HTML routes, API endpoints, CSP/security headers, and static assets (`/assets/styles.css`, `/assets/app.js`).
- **React SPA (Vite)** powers interactive pages and the main “Analyze bill” workflow for authenticated/SPA experiences.
- **SEO prerender** (build-time) clones HTML for public routes with metadata from a single SEO config.

### Key source-of-truth files
- **Worker entry**: `src/worker/index.ts` (routes, API, HTML rendering, CSP).
- **Client SPA entry**: `src/react-app/main.tsx` (route selection) + `src/react-app/App.tsx` (primary app UI).
- **SEO config**: `src/seo/seoConfig.js` (titles, descriptions, canonical paths, JSON‑LD).
- **Brand/content copy**: `src/copy.ts` (most UI strings and policy text).
- **Ads + analytics config**: `src/config/adsense.ts`, `src/config/analytics.ts`.

### Growth / portfolio integration (hub submissions surfacing)
- Proxy route `/api/growth/contacts/recent` fetches from growth.business (its /api/recent-contacts which queries shared D1 leads + chatbot_conversations for app_id='growth.business' contacts from forms + AI chat on the hub).
- Logs to local D1 growth_events (event_type "growth_contact", platform "growth.business", meta with samples) to integrate into quizbiz growth system (shares, referrals, admin summary, attribution).
- React Dashboard.tsx includes "Portfolio Access Requests (from growth.business)" section (polls proxy, renders list with name/email/outcome/unit/kind/date for ops/portfolio visibility).
- This fulfills cross-hub lead/contact surfacing in quizbiz dashboard without duplicating capture. See GROWTH_TRACKING.md for details.
- GA: consent-gated (G-... id), events include growth social + now growth_contact for cross-domain visitor/lead audit (marquee on hub uses custom + GA).
- No direct D1 cross for leads (separate DBs), but KV shared for growth counters; services (AI/billing) shared. Use portfolio-qmd for state, gstack /browse for QA.

---

## 2) Route map (what renders where)

### React SPA routes
Rendered by `src/react-app/main.tsx` and the `App` component.
- `/` → **React App** (bill analysis, calculators, location finder, savings plan UX).
- `/analysis-results/*`, `/manual-entry`, `/credits`, `/dashboard`, `/sign-in`, `/sign-up` → **React App**.
- `/learn/*` pages → **React content pages** (redirected to Worker guides in production).
- `/privacy`, `/terms`, `/site-map` → **React pages**.

### Worker HTML routes (SSR + static, with vanilla JS)
Rendered by `src/worker/index.ts` via `siteRoutes` and HTML renderer helpers.
- Marketing + utility tools: `/`, `/analyze-water-bill`, `/find-water-provider`, `/savings-plan`, `/calculators/*`, `/leak-check`, `/rebates`, `/guides/*`, `/water-iq`.
- Water Eject blog pages: `/blog-how-to-eject.html`, `/blog-is-it-safe.html`.
- Trust modals and legal pages: `/privacy`, `/terms`, `/affiliate`, `/disclaimer`.
- Diagnostics: `/__ads` (admin-key gated).

> ⚠️ Note: some routes exist in both the Worker-rendered set and the React SPA. The Worker output is optimized for crawlability and non‑JS rendering; the SPA takes over when React is loaded.

---

## 3) Component inventory (UI + utilities)

### React components (primary UI)
- **Navigation & layout:** `SiteNav`, `SiteFooter`, `PageLayout`.
- **Consent + privacy:** `ConsentBanner`, `PrivacyControls`.
- **Results + sharing:** `ResultsCard`, `ShareExportBar`, `UtilityResultCard`.
- **UI helpers:** `Stepper`, `TrustCapsule`, `InlineHelpAccordion`.

### React utilities
- **Analytics/consent gating:** `src/react-app/analytics.ts`, `src/react-app/consent.ts`.
- **AdSense initialization:** `src/react-app/adsense.ts` + `AdSenseSlot` component.
- **Calculations:** `src/react-app/utils/calculators.ts`.
- **Search helpers:** `src/react-app/utils/searchLinks.ts`.
- **Credits context:** `src/react-app/context/CreditsContext.tsx`.

### Worker HTML render helpers
All of these produce HTML fragments used by the Worker to render static pages:
- `renderHome`, `renderBillAnalyzer`, `renderSavingsPlan`, `renderCalculatorsHub`, `renderLeakCheck`, `renderRebatesWizard`, `renderGuidesHub`, `renderBlogHowToEject`, `renderBlogIsItSafe`, `renderAbout`, `renderContact`, `renderTrustPage`, and multiple calculator renderers.

---

## 4) Functionality audit (working vs. dependency‑gated)

> “Working” below means the feature is implemented in code. The actual runtime status depends on external services and environment secrets.

| Feature | Where it lives | Status | Dependencies / notes |
| --- | --- | --- | --- |
| Core navigation, layout, static content | React + Worker HTML | ✅ Implemented | No external services required. |
| Bill upload + AI analysis | Worker `/api/analyze-bill` | ⚠️ Requires external services | Needs Google Document AI endpoint + service account secret + OpenAI key. |
| Manual bill entry (no upload) | Worker `/api/analyze-manual` + React | ✅ Implemented | Uses OpenAI to build insights from manual inputs. |
| Results display + share/export | React `ResultsCard` + `ShareExportBar` | ✅ Implemented | Share uses URL fragment encoding. |
| Location/provider assistant | Worker `/api/location` + React fetch | ⚠️ Requires network | Uses D1 lookup if configured; otherwise static fallback data. |
| Rebate finder | Worker `/api/rebates` | ⚠️ Requires OpenAI | Requires OpenAI key; cached in KV. |
| Credit purchase checkout | Worker `/api/credits/checkout` | ⚠️ Requires Stripe | Requires `STRIPE_API_KEY`. |
| Water Eject shortcut UI | React App | ✅ Implemented | Uses hardcoded iCloud shortcut link + QR generator. |
| QR generation for Water Eject | React App | ⚠️ Requires external network | Uses `api.qrserver.com` image URL. |
| Ads | Worker HTML + React slots | ⚠️ Requires AdSense + consent | Requires AdSense client/slot IDs, CSP, user consent. |
| Analytics | React analytics helpers | ⚠️ Requires GA + consent | Requires GA measurement ID, user consent. |
| SEO prerender output | Build step | ✅ Implemented | Requires `npm run build` / `npm run prerender`. |

---

## 5) Data flows (end-to-end)

### A) Bill analysis upload
1. User uploads a PDF in the React UI.
2. Client posts to `/api/analyze-bill`.
3. Worker sends PDF to **Google Document AI** for OCR.
4. Extracted text is redacted, then sent to **OpenAI** for analysis.
5. Worker returns structured results + HTML to render in the client.

### B) Location/provider assistant
1. User enters a city or utility name.
2. Client hits `/api/location`.
3. Worker attempts:
   - D1 lookup (if `domains-db` bound).
   - Fallback hardcoded lookup or generic search link.

### C) Rebates assistant
1. User provides ZIP and upgrade preferences.
2. Client posts to `/api/rebates`.
3. Worker prompts OpenAI to return structured rebate results.
4. Results cached in KV for 12 hours.

### D) Credits + Stripe checkout
1. User clicks “Add credits.”
2. Client posts `/api/credits/checkout`.
3. Worker creates Stripe Checkout session and returns the URL.

---

## 6) Duplication guide (new niche)

### Step 1: Update brand + copy
- `src/copy.ts`: rewrite all UI strings, trust/terms/disclaimer copy, and slogans.
- `src/seo/seoConfig.js`: update titles, descriptions, JSON‑LD, and canonical host.
- `public/` assets: favicon, social images, brand marks.

### Step 2: Replace domain‑specific constants
- **Worker constants**: update baseline rates (`SHOWER_FLOW_RATE`, `SINK_FLOW_RATE`, etc.) and any niche‑specific defaults.
- **React utilities**: update calculators in `src/react-app/utils/calculators.ts` if the math changes.

### Step 3: Redesign core workflows
- **Analyzer**: update the OpenAI prompt templates in `src/worker/index.ts` to match the new niche.
- **Results UI**: tweak `src/react-app/App.tsx` (top moves, results cards, next steps) to display the new advice.
- **Location/assistant**: replace fallback data in `src/worker/locationFallback.ts` and adjust `LocationAssistantPayload` fields.

### Step 4: Swap supporting tools
- **Rebates** (or equivalent program finder): update prompt + UI wording in `src/worker/index.ts` and `src/react-app/App.tsx`.
- **Calculators**: adjust the calculators in `src/worker/index.ts` and any client‑side equivalents.
- **Game**: replace `LeakPatrol.tsx` scenarios and copy to match the niche (or remove entirely).

### Step 5: Update compliance + monetization
- **Analytics ID**: `src/config/analytics.ts`.
- **AdSense client/slots**: `src/config/adsense.ts` and Worker env overrides.
- **Consent copy**: `src/copy.ts` privacy/terms sections.
- **Stripe**: update product names and descriptions in `/api/credits/checkout`.

### Step 6: Build + verify
- Run `npm run build` and `npm run prerender` to regenerate SEO HTML and sitemap.
- Smoke‑check API endpoints locally or in preview.
- Confirm privacy controls, ads/analytics gating, and CSP remain correct.

---

## 7) Environment + secrets checklist

Set these in Cloudflare (or local secrets) for full functionality:
- `OPEN_API_KEY_NEW` (+ optional `OPENAI_ORG_ID`).
- `Google_Document_AI_Processor_Prediction_Endpoint`.
- `Google-Service-Account-FINAL` (service account JSON).
- `STRIPE_API_KEY` (if credits checkout is enabled).
- `domains-db` (optional D1 binding for utility lookup).
- `ADSENSE_CLIENT`, `ADSENSE_SLOT_INLINE`, `ADSENSE_SLOT_FOOTER`, `ADSENSE_SLOT_STICKY` (optional overrides).
- `GA_MEASUREMENT_ID` (optional override).

---

## 8) Known limitations / risks
- **External service dependence**: bill analysis and rebates degrade without OpenAI + Google credentials. Location lookup is limited without the D1 directory binding.
- **Ads/analytics**: always gated by consent; expect no ads if consent is denied.
- **QR code**: relies on an external image service; replace if you need full offline capability.

---

## 9) Quick file index
- **Worker + API:** `src/worker/index.ts`
- **Fallback utility data:** `src/worker/locationFallback.ts`
- **React app:** `src/react-app/App.tsx`
- **React pages:** `src/pages/*`
- **Copy + policies:** `src/copy.ts`
- **SEO config:** `src/seo/seoConfig.js`
- **Ads + analytics config:** `src/config/adsense.ts`, `src/config/analytics.ts`
- **Consent/ads/analytics helpers:** `src/react-app/consent.ts`, `src/react-app/adsense.ts`, `src/react-app/analytics.ts`
