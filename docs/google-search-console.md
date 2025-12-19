# Google Search Console verification for watershortcut.com

Use the canonical host **https://www.watershortcut.com** everywhere so Google sees one version of the site.

## Verify site ownership (recommended: DNS TXT)
1. In your DNS provider, create a TXT record for the root domain `watershortcut.com`.
   - Name/Host: `@`
   - Value: the TXT token provided by Search Console (looks like `google-site-verification=...`).
2. Wait for DNS to propagate, then click **Verify** in Search Console. DNS is resilient to code deploys and works for both www and bare domains.

## Add sitemap
1. In Search Console, select the property for `https://www.watershortcut.com/`.
2. Open **Indexing → Sitemaps**.
3. Submit the sitemap URL: `https://www.watershortcut.com/sitemap.xml`.
4. Confirm the status shows **Success** and a recent fetch date.

## Request indexing for key pages
After deploy:
1. Open **URL inspection** in Search Console.
2. Test live URLs for:
   - `/`
   - `/upload`
   - `/learn/read-water-bill`
   - `/learn/leak-detection`
   - `/learn/water-saving-tips`
   - `/learn/water-bill-spikes`
   - `/learn/hidden-leaks`
   - `/game`
3. If the URL is not indexed, click **Request indexing**.

## Pre-submission checklist
- `https://www.watershortcut.com/robots.txt` is reachable and allows crawling.
- `https://www.watershortcut.com/sitemap.xml` lists the public, indexable routes.
- Canonical tags on each page point to the https://www.watershortcut.com host (www enforced).
- Each public route returns a 200 status with meaningful HTML (H1, meta title/description, OG/Twitter tags).
- Avoid submitting any private or user-specific URLs; mark them noindex if they ever appear.
