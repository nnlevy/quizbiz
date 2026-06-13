# Quizbiz.org

Quizbiz.org is the public company and domain-specific customer messaging home for Quizbiz LLC. It presents Quizbiz LLC as the responsible brand, models cohort-specific controls and automations, stores approval-ready program plans, searches the portfolio by audience/challenge/solution language, and publishes the privacy, terms, and optional SMS disclosure language needed for business-review flows.

## Current Deployment Path

The live Cloudflare Worker config in `wrangler.json` points at `src/index.js`. That file is a self-contained static Worker with:

- `/` Quizbiz LLC landing page with cohort messaging program planning, readiness checks, lead capture, instant domain directory search, stored lead/program records, and text messaging disclosures.
- `/api/cohort-programs` stores cohort messaging program plans in Cloudflare KV.
- `/api/cohort-programs/recent` returns recent program plans when called with the admin key.
- `/privacy` privacy policy with mobile opt-in data non-sharing language.
- `/terms` terms and mobile messaging terms.
- `/robots.txt`, `/sitemap.xml`, and `/security.txt`.

Deploy the current Worker path with:

```bash
npm run deploy
```

## React App Path

The richer Vite/React app lives in `src/react-app/App.tsx` and uses `src/seo/seoConfig.js` for prerendered metadata. It mirrors the Worker experience with the cohort messaging workspace, interactive lead capture form, domain search, process preview, public trust copy, and the same privacy and messaging terms.

Local development:

```bash
npm install
npm run dev
npm run build
```

## Compliance-Facing Copy

The site intentionally makes these points public:

- Business identity: Quizbiz LLC is the operator of Quizbiz.org and the responsible business for the customer messaging program.
- Messaging purpose: domain-specific event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications.
- Cohort controls: roster lists, board roles, donor recognition society membership, RSVP sources, attendance sources, consent evidence, and suppression rules.
- Consent: optional, explicit, separate from required terms, and not a condition of purchase or service.
- Frequency/cost: message frequency varies; message and data rates may apply.
- Opt-out/help: reply STOP to unsubscribe or HELP for help.
- Privacy: mobile opt-in data and consent are not shared or sold to third parties.

This content supports review, but it is not legal advice and does not guarantee approval by Twilio, carriers, or The Campaign Registry.
