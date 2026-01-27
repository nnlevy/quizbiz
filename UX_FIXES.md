# UX Fixes

## Issues fixed
- Added above-the-fold hero CTAs that jump directly into upload, demo, or manual entry flows so first-time visitors can start immediately.
- Moved the “Analyze my water bill” card directly beneath the hero and anchored it for reliable deep linking.
- Converted the “Stop Flushing Money” phrase into a real link that scrolls to the quick-check section.
- Replaced static tool bullets with clickable cards that include benefits and explicit “Open” affordances.
- Added deep-link anchors to calculator cards so tool links land on the correct calculator.
- Updated the credits modal to show “Google sign-in coming soon” when OAuth is disabled and made name optional for email signup.

## Screenshots
- Before (desktop): `browser:/tmp/codex_browser_invocations/b8c8ff71a2522c00/artifacts/artifacts/baseline-desktop.png`
- Before (mobile): `browser:/tmp/codex_browser_invocations/b8c8ff71a2522c00/artifacts/artifacts/baseline-mobile.png`
- After (desktop): `browser:/tmp/codex_browser_invocations/d5a076d3669b3ca0/artifacts/artifacts/after-desktop.png`
- After (mobile): `browser:/tmp/codex_browser_invocations/d5a076d3669b3ca0/artifacts/artifacts/after-mobile.png`

## Tradeoffs / assumptions
- Assumed the home page (`/`) is the primary entry point for first-time visitors; CTA links route or scroll within this page.
- Mapped “Bill Audit” to the “Bill Savings Projector” calculator to keep tool navigation consistent without inventing new content.

## How to verify
1. Load `/` and confirm the hero shows three CTA buttons plus the “Stop Flushing Money” link.
2. Click “Analyze my water bill” and confirm the upload card scrolls into view and the file picker opens.
3. Click “Stop Flushing Money” and confirm the page scrolls to the quick-check section.
4. Click “Leak Detector” to confirm it navigates to `/calculators#leak-estimator`.
5. Open the Credits modal via the header, then press Escape to confirm it closes.
