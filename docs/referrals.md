# Referral token propagation

## Canonical param
- The canonical referral param is `ref`.

## Behavior
- On first visit, `ref` is captured from the URL and stored in **sessionStorage** with a 30-day TTL.
- localStorage is used as a fallback to survive reloads when sessionStorage is unavailable.
- Tokens are appended to internal navigation (SPA links, programmatic navigation) and whitelisted external links only.

## Whitelist policy
- External referral propagation is opt-in via a whitelist (currently empty) in:
  - `src/react-app/utils/referralLinks.ts`
  - `public/referral-linker.js` (legacy/static pages)

## How to verify
1. Visit a page with `?ref=TEST123`.
2. Click internal CTAs.
3. Confirm the next URL retains `ref=TEST123`.

**Playwright test**
```
npm run test:e2e -- tests/referral-propagation.spec.ts
```
