# AdSense diagnostics & verification

## Snapshot (repo-based)
- **Stack:** Cloudflare Worker (Hono) serving HTML + Vite-built React SPA.
- **Global head:** `src/worker/index.ts` builds the HTML `<head>` for production pages.
- **Ads wiring:** AdSense script loads globally, ad slots rendered server-side, client JS initializes ads.

## Production checks (manual)
Use a clean browser profile (no extensions) and verify:
1. **Network:** `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...` loads `200`.
2. **Console:** no CSP violations or `adsbygoogle.push()` errors.
3. **Elements:** `<ins class="adsbygoogle">` nodes exist with non-zero size.
4. **Mobile viewport:** repeat to ensure widths remain >0.

> Note: direct external HTTP verification from this environment returned a 403 tunnel error, so production checks must be done manually.

## Ad diagnostics mode
Open:
- `https://www.watershortcut.com/__ads`
- or append `?ads_debug=1` on any page

The diagnostics panel reports:
- Script loaded status
- `window.adsbygoogle` presence
- Slot count + measured sizes
- Timestamp of the last initialization

## ads.txt verification
1. Visit `https://www.watershortcut.com/ads.txt`
2. Ensure `200 OK`, `text/plain`, and line:
   ```
   google.com, pub-1860356577073395, DIRECT, f08c47fec0942fa0
   ```

## CSP requirements
If ads or analytics are blocked, confirm CSP allows:
- `script-src` for:
  - `https://pagead2.googlesyndication.com`
  - `https://www.googletagservices.com`
  - `https://www.googletagmanager.com`
- `frame-src` for:
  - `https://googleads.g.doubleclick.net`
  - `https://tpc.googlesyndication.com`
- `connect-src` / `img-src` for:
  - `https://www.google-analytics.com`
  - `https://stats.g.doubleclick.net`

## Cloudflare settings to verify
- **Rocket Loader:** disable or exclude AdSense scripts.
- **Auto-minify (JS):** disable if it rewrites AdSense.
- **WAF/Bot fight:** allow AdSense crawlers + `/ads.txt`.
- **Cache purge:** after head/script updates.

## Root cause summary
1. **Consent mode & gating were missing**, which can suppress ads in EEA/UK and make ad requests appear “dead.”
2. **No built-in diagnostics route**, making it hard to confirm script load or slot sizing.
3. **Hardcoded IDs scattered in multiple files**, making mismatches easy and limiting environment overrides.
4. **Margin ad handlers were treating all fixed AdSense units the same**, which suppressed vignette overlays and prevented their close buttons from being clickable on `#google_vignette` routes.

## Fix summary
- Added consent mode v2 + banner with stored preferences.
- Added `/__ads` diagnostics route and `?ads_debug=1` mode.
- Centralized AdSense client/slots in a shared config with optional Worker env overrides.
- Tightened CSP + security headers to allow ads/analytics safely.
- Exempted vignette routes from margin-ad hiding logic and restored pointer events on fixed overlays so the close button works.
