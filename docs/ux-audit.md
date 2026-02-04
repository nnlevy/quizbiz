# WaterShortcut UX Audit (Device-Responsive)

## Scope & sources
- **Primary surface:** public marketing + analysis entry points noted in the README route map (home, analyze flow, calculators, guides, and legal pages).【F:README.md†L29-L67】
- **Inputs reviewed:** prior mobile audit and UX fixes, plus key React entry components for the homepage conversion path (Hero + Start card, Feature grid, Quick check).【F:MOBILE_AUDIT.md†L1-L38】【F:UX_FIXES.md†L1-L13】【F:src/react-app/routes/Home.tsx†L1-L180】

## Global UX themes (cross-device)

### Strengths
- **Single primary entry funnel on home:** The homepage centers the “Analyze my water bill” Start card with clear mode selection (upload/demo/manual) and privacy reassurance, which reduces decision fatigue and clarifies next steps.【F:src/react-app/routes/Home.tsx†L98-L180】【F:src/react-app/components/StartCard.tsx†L1-L120】
- **Clear supporting pathways:** Feature grid and quick-check slider provide additional entry points without overwhelming the hero CTA, improving scannability and progressive disclosure.【F:src/react-app/routes/Home.tsx†L124-L175】【F:src/react-app/components/FeatureGrid.tsx†L1-L90】【F:src/react-app/components/QuickCheck.tsx†L1-L66】
- **Explicit mode feedback:** Upload states, file name feedback, and inline errors improve predictability for uploads and reduce “did it work?” ambiguity.【F:src/react-app/components/StartCard.tsx†L26-L109】

### Friction risks
- **Mode switching relies on timing + animation delay:** The upload/demo/manual transitions are delayed by a fixed 320ms; on older devices this can feel laggy and ambiguous if there isn’t immediate visual feedback beyond the button state.【F:src/react-app/routes/Home.tsx†L38-L118】
- **Quick-check slider depends on precise touch target:** Range input sliders are usable but can be imprecise on smaller screens; the UI doesn’t show an inline numeric input override for accessibility or high-precision needs.【F:src/react-app/components/QuickCheck.tsx†L20-L60】
- **Multiple CTA styles in proximity:** The Start card contains a label-based upload, two secondary buttons, and a portal link; on smaller screens this can visually compete unless spacing and typography remain tight.【F:src/react-app/components/StartCard.tsx†L27-L104】

## Device-class audit

### Small mobile (320–360px)
**Findings**
- **Tight CTA cluster risk:** The Start card’s three action buttons plus the portal link can feel cramped; errors and file-name feedback appear below, which can push the primary actions off-screen after interaction.【F:src/react-app/components/StartCard.tsx†L27-L109】
- **Horizontal overflow sensitivity:** Prior iPhone SE audit notes layout overflow risks from dense components and ads, indicating special care is needed for 320px widths and Safari’s dynamic chrome.【F:MOBILE_AUDIT.md†L5-L25】

**Recommendations**
- Stack Start card actions into a vertical layout at <=360px (single column) and keep the portal link below a subtle divider.
- Add a compact numeric input toggle for the quick-check slider at small widths to reduce slider precision frustration.

### Large mobile (390–430px)
**Findings**
- **Hero + Start card flow is strong, but button hierarchy may still blur:** With three action buttons and a portal link, it’s easy to ignore the primary action or misinterpret the “Upload” label-as-button control.【F:src/react-app/components/StartCard.tsx†L27-L104】
- **Safari bottom sheet nuances:** Previous mobile audit noted nav bottom sheet behaviors and safe-area constraints; this should remain a QA priority at this size tier.【F:MOBILE_AUDIT.md†L11-L33】

**Recommendations**
- Add a microcopy “Recommended” badge on the primary CTA (Upload) to clarify priority.
- Use consistent button visuals for all CTAs (avoid label-as-button if possible) to reduce confusion, or enhance hover/pressed states for the label control.

### Tablet (768–1024px)
**Findings**
- **Layout density shifts:** Feature grid + quick check + Start card can appear as three distinct blocks; tablet users often expect a left-right split or tighter vertical rhythm to reduce scroll.
- **Range input on tablet:** Sliders are easier to use than on mobile, but the lack of keyboard-adjustable numeric input may still hinder precise values.【F:src/react-app/components/QuickCheck.tsx†L20-L60】

**Recommendations**
- Experiment with a two-column hero + Start card layout for tablet widths to reduce scroll.
- Add a numeric input or stepper alongside the slider for accessibility and precision.

### Desktop (1280–1440px)
**Findings**
- **Clear scanning flow, but repeated CTAs may dilute focus:** Feature grid and quick check appear after the hero; they remain useful but can shift attention away from the bill analysis primary funnel early in the scroll.【F:src/react-app/routes/Home.tsx†L124-L175】
- **Portal link in Start card can be misread as a secondary primary action:** It competes with the upload/demo/manual flows for users who want immediate action.【F:src/react-app/components/StartCard.tsx†L27-L40】

**Recommendations**
- Emphasize the Start card as the primary “first action” with stronger visual weight or supporting text (e.g., “Most users start here”).
- Reframe the portal link as supporting help text or a smaller tertiary link, possibly placed after the main action grid.

### Large desktop (1440px+)
**Findings**
- **Potential for visual emptiness:** The hero + CTA cluster can feel narrower against large monitors unless max-widths and background accents balance the whitespace.
- **Attention drift:** Large screens increase the chance of users scanning away from the primary CTA cluster if additional sections are visually equal in hierarchy.【F:src/react-app/routes/Home.tsx†L124-L175】

**Recommendations**
- Increase hero visual emphasis or expand the Start card to use more horizontal space on wide screens.
- Introduce a subtle in-hero “scroll hint” that clarifies the page flow without stealing attention from the CTA cluster.

## Component-specific UX checks

### Start card (Upload/Demo/Manual)
**Observations**
- Provides clear mode choices and upload feedback with a privacy note; keyboard handling allows Enter/Space on the upload label, which is a positive accessibility detail.【F:src/react-app/components/StartCard.tsx†L27-L118】

**Opportunities**
- Consider a dedicated upload button rather than a label-as-button to align with expected UX patterns (especially on touch).
- Add inline helper text describing expected upload time/limits (file size, supported PDFs) to reduce uncertainty.

### Quick check slider
**Observations**
- Clear copy and immediate savings estimate; the CTA flows directly into calculators with the selected value encoded in the URL.【F:src/react-app/components/QuickCheck.tsx†L8-L66】

**Opportunities**
- Provide a numeric input override for precision and accessibility.
- Show a “typical bill” marker (e.g., $80–$120) to help users pick a reasonable estimate quickly.

### Feature grid
**Observations**
- Concise titles and descriptions with directional “Open” CTA that aids scanning; consistent card structure for predictable interaction.【F:src/react-app/components/FeatureGrid.tsx†L1-L88】

**Opportunities**
- Add short proof points or outcomes under each tool on larger screens to help users choose quickly.

## Priority fixes (ranked)
1. **Small mobile Start card layout & CTA hierarchy** — Reduce vertical stack density and CTA confusion at <=360px.【F:src/react-app/components/StartCard.tsx†L27-L104】
2. **Quick check precision controls** — Add numeric input or stepper to complement slider for accessibility and precision across device classes.【F:src/react-app/components/QuickCheck.tsx†L20-L60】
3. **Clarify primary funnel vs supporting tools** — Reinforce the Start card as the main action to reduce choice overload on desktop and tablet layouts.【F:src/react-app/routes/Home.tsx†L124-L175】

## QA checklist for future passes
- Validate in small mobile Safari (<=360px) for overflow and CTA compression; prior audits highlighted overflow sensitivity.【F:MOBILE_AUDIT.md†L5-L25】
- Confirm keyboard navigation on desktop for upload/demo/manual and range controls.【F:src/react-app/components/StartCard.tsx†L27-L109】【F:src/react-app/components/QuickCheck.tsx†L20-L60】
- Confirm that ad injection or external scripts don’t shift layout on mobile (see historical notes).【F:MOBILE_AUDIT.md†L15-L27】
