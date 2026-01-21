# Deployment checklist (Cloudflare Worker)

This checklist validates the production Worker wiring used by the bill analysis flow in `src/worker/index.ts` (`handleAnalyzeBill → getOAuthToken → callVisionAPI → analyzeTextWithOpenAI`).

## Required secrets and bindings

Set these secrets in the target Cloudflare Worker environment:

| Secret | Used by | Notes |
| --- | --- | --- |
| `Google_Document_AI_Processor_Prediction_Endpoint` | `callVisionAPI` | Full Document AI processor `:process` endpoint. |
| `Google-Service-Account-FINAL` | `getOAuthToken` | Full Google service account JSON (includes `client_email` + `private_key`). |
| `OPEN_API_KEY_NEW` | `analyzeTextWithOpenAI` | OpenAI API key (the Worker expects this name). |
| `OPENAI_ORG_ID` | `analyzeTextWithOpenAI` | Optional org header when required. |

Optional bindings (not required for bill analysis):
- `domains-db` (D1 binding)
- Stripe (`STRIPE_API_KEY`)
- Ads/analytics vars (`ADSENSE_CLIENT`, `GA_MEASUREMENT_ID`, etc.)

## Build-time environment variables (when placeholders are used)

The build step runs `node scripts/prepare-wrangler.mjs`, which replaces placeholder IDs in
`wrangler.json`/`dist/watershortcut/wrangler.json`. If those files use `${...}` placeholders, set
these as **build-time** environment variables in Cloudflare Pages (Settings → Build & Deployments →
Environment variables), using the **resource UUIDs** (not display names):

- `DOMAINS_DB_ID_NEW` (or legacy `DOMAINS_DB_ID`) — D1 database resource ID for `UsersAcrossAllDomains`.
- `USER_SESSIONS_ACROSS_DOMAINS_ID_NEW` (or legacy `USER_SESSIONS_ACROSS_DOMAINS_ID`) — KV namespace
  ID for `USER_SESSIONS_ACROSS_DOMAINS`.

If these are only configured as runtime bindings, the build fails with a missing environment
variable error. When the IDs are hard-coded in `wrangler.json`, the build-time variables are not
required.

## Automated smoke check

Run the smoke check against a deployed Worker to confirm the Document AI endpoint, service account OAuth flow, and OpenAI API key are wired correctly.

```bash
WORKER_BASE_URL="https://www.watershortcut.com" \
  npm run smoke:worker
```

Notes:
- The script uploads `tests/fixtures/sample-bill.pdf` to `/api/analyze-bill` and expects JSON with `analysis.topMoves`.
- Override the PDF or timeout if needed:
  - `SMOKE_FILE=/path/to/your.pdf`
  - `SMOKE_TIMEOUT_MS=45000`

## Manual checklist (if automated check is unavailable)

1. Verify `Google_Document_AI_Processor_Prediction_Endpoint` matches the processor region and ID for the Document AI instance.
2. Confirm `Google-Service-Account-FINAL` is the full JSON payload and the service account has access to the processor.
3. Confirm `OPEN_API_KEY_NEW` is a valid OpenAI API key (and `OPENAI_ORG_ID` if required).
4. Trigger the bill analysis endpoint:
   ```bash
   curl -X POST "https://www.watershortcut.com/api/analyze-bill" \
     -H "Accept: application/json" \
     -F "file=@tests/fixtures/sample-bill.pdf"
   ```
   Expect a 200 response with `analysis.topMoves` populated.
