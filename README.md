# Quizbiz.org

Quizbiz.org is the public trust and product home for Quizbiz LLC, doing business as Growth.business. It presents Growth.business as a B2B AI workflow studio for intake, follow-up, routing, and customer messaging while publishing the privacy, terms, and optional SMS disclosure language needed for business-review flows.

## Current Deployment Path

The live Cloudflare Worker config in `wrangler.json` points at `src/index.js`. That file is a self-contained static Worker with:

- `/` SaaS-style Growth.business landing page with product positioning, animated workflow panels, an interactive client-side growth brief builder, use cases, and text messaging disclosures.
- `/privacy` privacy policy with mobile opt-in data non-sharing language.
- `/terms` terms and mobile messaging terms.
- `/robots.txt`, `/sitemap.xml`, and `/security.txt`.

Deploy the current Worker path with:

```bash
npm run deploy
```

## React App Path

The richer Vite/React app lives in `src/react-app/App.tsx` and uses `src/seo/seoConfig.js` for prerendered metadata. It mirrors the Worker experience with the interactive growth brief builder, motion states, public trust copy, and the same privacy and messaging terms.

Local development:

```bash
npm install
npm run dev
npm run build
```

## Compliance-Facing Copy

The site intentionally makes these points public:

- Business identity: Quizbiz LLC, doing business as Growth.business.
- Messaging purpose: requested project updates, onboarding reminders, support follow-ups, and service notifications.
- Consent: optional, explicit, separate from required terms, and not a condition of purchase or service.
- Frequency/cost: message frequency varies; message and data rates may apply.
- Opt-out/help: reply STOP to unsubscribe or HELP for help.
- Privacy: mobile opt-in data and consent are not shared or sold to third parties.

This content supports review, but it is not legal advice and does not guarantee approval by Twilio, carriers, or The Campaign Registry.
