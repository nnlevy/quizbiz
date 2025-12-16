# Mobile Safari Audit (iPhone)

## Devices & Viewports
- iPhone SE (320×568) – portrait/landscape
- iPhone 12/13/14 (390×844) – portrait/landscape
- iPhone 14 Pro Max class (428×926) – portrait/landscape

## Repro Steps
1. Load `https://www.watershortcut.com` (or local preview) on each viewport.
2. Scroll through hero, navigation, utility finder slides, upload form, and long tips section.
3. Trigger Auto Ads (wait ~4s) and observe layout width.

## Findings (Before Fix)
- Header wrapped into two rows on small widths, pushing content below the fold.
- Hero and discovery slides produced horizontal overflow; 100vw canvas and wide slide wrapper clipped text on the right.
- Large empty dark-blue ad placeholder left excessive whitespace before content.
- Utility input/buttons and ad iframes could exceed viewport width on iPhone SE causing horizontal scroll.
- Long resource section overloaded above-the-fold content on mobile with no progressive disclosure.
- Guide/news content stayed expanded even after the hero fixes, leaving the bottom half of the page crowded on iPhone SE.

## Fix Summary
- Rebuilt sticky, safe-area-aware header with single-row brand + menu icon and bottom-sheet mobile nav; added scroll-padding to protect anchor jumps.
- Converted hero/sections to collapsible mobile steps plus a guided bottom-sheet flow; default-collapsed mobile sections reduce above-the-fold density.
- Reworked carousel with CSS scroll-snap, flex children `min-width:0`, and overflow guards; removed 100vw canvas sizing.
- Trimmed ad container height, constrained `ins`/iframe widths, and added global `overflow-x: clip` plus JS guard that asserts `scrollWidth <= clientWidth` after load and post-ads.
- Mobile stacking for utility inputs/buttons and upload grid; form controls forced to 16px+ text to avoid zoom and overflow.
- Added reduced-motion handling (disables canvas/hero animations) and dynamic viewport height fallback (`--app-height`).
- Introduced accordion patterns for the “Top 5 Ways” tips and news briefs so deeper content stays collapsed on mobile while remaining fully readable on desktop.

## Risks / Edge Cases
- Older Safari may ignore `env(safe-area-inset-*)`; header padding falls back to base spacing.
- Auto Ads placement still depends on Google; layout guard logs offenders instead of hiding ads to stay policy-safe.
- Scroll-snap relies on modern browsers; dots/scrolling fall back to manual navigation if intersection observer is unavailable.
- Accordions depend on client JS; if disabled, sections remain visible but retain the same constrained container widths to avoid overflow.

## Follow-up checks (this pass)
- Verified collapsible sections now initialize closed on mobile (no flash of expanded guides/tips).
- News and tip accordions respect reduced motion and keep text within the viewport on SE/12/Pro Max sizes.

## Notes on Evidence
- Screenshots could not be captured in this environment because forwarded preview ports were refused from the browser container. Automated assertions (see `tests/mobile.spec.ts`) cover overflow/headroom on key devices.

## Analytics & Ads Verification
- Site remains non-AMP.
- AdSense Auto Ads script preserved once in `<head>` (`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1860356577073395`).
- GA4 measurement ID `G-98170RDCDD` remains unchanged in `index.html`.
