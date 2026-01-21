# Performance strategy

## Critical CSS strategy
- Build-time critical CSS is extracted with `critters` in `scripts/critical-css.mjs`.
- The script inlines above-the-fold styles per HTML shell and converts the full CSS to a non-blocking preload + deferred stylesheet.
- A lightweight loader (`public/critical-css-loader.js`) flips `media="print"` to `media="all"` on load, with a `<noscript>` fallback for JS-disabled browsers.

**Run locally**
```
npm run build
```

The build pipeline runs critical CSS extraction automatically after prerendering.

## Third-party loading strategy
- `src/react-app/lib/loadScript.ts` provides a unified loader with consent, idle, visibility, and interaction strategies (all listed strategies must resolve before load).
- Google Sign-In loads on idle when the UI is present, and loads immediately on user interaction.
- Chart.js is dynamically imported only when charts enter the viewport (`useNearViewport`).

**Verify locally**
```
npm run test:e2e -- tests/script-loading.spec.ts
```
