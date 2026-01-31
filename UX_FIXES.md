# UX Fixes

## Issues fixed
- Consolidated the homepage CTA into a single StartCard inside the hero to remove duplicate action clusters.
- Refactored the homepage into reusable sections (Hero, FeatureGrid, QuickCheck, TrustPrivacy, ExploreTools) for consistent spacing and typography.
- Separated the Feature grid from the Quick Check slider to improve flow and scannability.
- Kept calculator deep links intact while standardizing button styles and section headers.
- Updated the credits modal to show “Google sign-in coming soon” when OAuth is disabled and made name optional for email signup.

## Screenshots
- Before (desktop): `browser:/tmp/codex_browser_invocations/b8c8ff71a2522c00/artifacts/artifacts/baseline-desktop.png`
- Before (mobile): `browser:/tmp/codex_browser_invocations/b8c8ff71a2522c00/artifacts/artifacts/baseline-mobile.png`
- After (desktop): `browser:/tmp/codex_browser_invocations/d5a076d3669b3ca0/artifacts/artifacts/after-desktop.png`
- After (mobile): `browser:/tmp/codex_browser_invocations/d5a076d3669b3ca0/artifacts/artifacts/after-mobile.png`

## Tradeoffs / assumptions
- Assumed the home page (`/`) is the primary entry point for first-time visitors; the single StartCard handles all entry modes.
- Mapped “Bill Audit” to the “Bill Savings Projector” calculator to keep tool navigation consistent without inventing new content.

## How to verify
1. Load `/` and confirm the hero includes a single StartCard with Upload, Demo, and Manual entry actions.
2. Click “Upload a bill” and confirm the file picker opens and the file name appears after selection.
3. Verify the Feature grid cards navigate to the correct calculator anchors.
4. Move the Quick Check slider and confirm the savings estimate updates plus the CTA deep link updates.
5. Open the Credits modal via the header, then press Escape to confirm it closes.
