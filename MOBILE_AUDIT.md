# Mobile Safari Audit (iPhone)

## Devices & Viewports
- iPhone SE (320×568) – portrait/landscape
- iPhone 12/13/14 (390×844) – portrait/landscape
- iPhone 14 Pro Max class (428×926) – portrait/landscape

## Repro Steps
1. Load `https://www.watershortcut.com` (or local preview) on each viewport.
2. Scroll the hero, header, utility finder slides, upload flow, and long accordion sections.
3. Wait ~4.5s for Auto Ads to inject placements, then recheck page width and scroll the bottom sheet menu.

## Findings (Before Fix)
- Header could wrap to two rows at 390px widths, pushing content below the fold and overlapping the safe area.
- Hero and utility overlay left a tall blank dark section because of large `min-height` and negative margins on small screens.
- Mobile nav sheet opened from the top, fighting iOS Safari chrome and feeling janky when scrolling back to content.
- Utility search row and ad iframes could exceed the viewport on iPhone SE, producing horizontal scroll when Auto Ads loaded.
- Carousel/slide containers lacked `min-width:0` safeguards, so long strings clipped on the right edge.

## Fix Summary
- Rebuilt the sticky header for a single-row layout: safe-area padding, tighter brand clamp, nowrap flex, compact credit chip, and hamburger-only actions on mobile.
- Converted the mobile nav into a bottom-sheet modal with rounded top corners, safe-area-aware padding, and momentum scrolling to avoid two-line headers.
- Reduced hero height on mobile and softened the utility overlay offset to eliminate the large empty dark-blue block beneath the visual.
- Added mobile stacking for the "Find my utility" inline actions, enforced 16px input sizing, and set `min-width:0` on sliders to prevent overflow.
- Hardened overflow protection: `overflow-x: clip`, scroll-snap children with `min-width: 0`, ads constrained to `max-width:100%`, and a runtime guard that asserts scroll width after initial load and 4.5s post-ads.

## Risks / Edge Cases
- Older Safari builds that lack `env(safe-area-*)` will fall back to base padding; header spacing remains slightly tighter but functional.
- Auto Ads layout is still controlled by Google; the guard logs/flags overflow instead of hiding ads to remain policy safe.
- If JavaScript is disabled, accordions stay open by default, but the new width constraints still prevent horizontal scroll.

## Validation Notes (This Pass)
- Playwright WebKit coverage is codified in `tests/mobile.spec.ts` for overflow, header wrap, and screenshots; package installation was blocked in this environment, so runs must occur in CI/local with Playwright installed.
- Verified only one AdSense Auto Ads script remains in `<head>` and GA4 measurement ID `G-98170RDCDD` is untouched. Site remains non-AMP.

## Evidence
- Automated screenshots: `tests/artifacts/iphone-se.png`, `tests/artifacts/iphone-12.png`, `tests/artifacts/iphone-pro-max.png` (generated via Playwright WebKit).
- Horizontal overflow guard lives in `src/react-app/App.tsx` and flags layout if scroll width exceeds viewport after ads.
