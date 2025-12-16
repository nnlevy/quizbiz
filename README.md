# WaterShortcut.com

WaterShortcut pairs a Vite + React experience with a Hono + Cloudflare Workers backend to decode water bills, surface leak risks, and deliver privacy-aware analytics and advertising. The app now includes dedicated learning pages, cookie consent handling, and SEO assets like `sitemap.xml` and `robots.txt`.

## Analytics and advertising
- **GA4**: Measurement ID `G-98170RDCDD` is wired into `index.html`. The helper in `src/react-app/analytics.ts` exposes `logEvent` so you can record custom events (for example `logEvent('upload_started')`).
- **AdSense**: The client script lives in `index.html` with reserved ad spaces in the UI. Set your client and slot IDs in `index.html`, `src/react-app/components/AdUnit.tsx`, and where the components are used. Ads load only after consent for EU visitors.

## Updating site content
- **Learn pages**: Long-form guides live in `src/pages` and are rendered both client-side and via Hono routes for SEO. Update or add pages here, then register them in the worker routes and the sitemap list.
- **Privacy and terms**: Content sits in `src/pages/PrivacyPage.tsx` and `src/pages/TermsPage.tsx` and is linked in the site footer.
- **Navigation**: Shared navigation/footer components are in `src/react-app/components`.

## Sitemap and robots
`src/worker/index.ts` serves `/sitemap.xml` and `/robots.txt`. When adding new routes, append the path to the `urls` array in the sitemap handler so search engines discover them.

## Running locally
```bash
npm install
npm run dev     # Vite dev server
npm run build   # Build front-end bundle
npm run preview # Preview the production build
```

To dry-run the Worker deployment and type generation:
```bash
npm run check
```

## Deploying the Worker
Ensure Wrangler bindings are configured (Document AI credentials, OpenAI keys, and D1 database). Then deploy:
```bash
npm run deploy
```

## Ad identifiers to set
- **GA Measurement ID:** `G-98170RDCDD` (already baked into `index.html`).
- **AdSense client ID:** Replace `ca-pub-1860356577073395` in `index.html` and `AdUnit.tsx` with your production account if it changes.
- **AdSense slot IDs:** Update the `slot` props passed to `AdUnit` in `src/react-app/App.tsx` once your placements are live.

## Running the Worker locally
Use Wrangler to emulate the Worker routes (including the new SEO pages):
```bash
npm run build
npm run preview
# or run `wrangler dev` if you prefer the Worker-first workflow
```

## Worker environment and secrets
- The Document AI processor endpoint is prefilled in `wrangler.json` (`Google_Document_AI_Processor_Prediction_Endpoint`). Update this value if you swap processors or regions.
- Add secrets via Wrangler before deploying:
  - `Google-Service-Account-FINAL`: full service account JSON (must include `client_email` and `private_key`) used to fetch OAuth tokens for Document AI.
  - `OPEN_API_KEY_NEW`: required for the OpenAI analysis calls. `OPENAI_ORG_ID` is optional but recommended if your OpenAI account enforces it.
  - `Cloudflare_User_API_Token` (if required for your pipelines) and any other private values should also be stored as secrets, not in source control.
- With those bindings in place, the `/api/upload` route will authenticate to Google Document AI, OCR the PDF, and return analysis results from OpenAI.

Comments in the code explain how each change boosts ad viewability, adds organic entry points, and keeps analytics/privacy compliant.
