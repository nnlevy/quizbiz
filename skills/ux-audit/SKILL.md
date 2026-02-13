---
name: ux-audit
description: Conduct a UX audit of WaterShortcut across mobile, tablet, and desktop, capturing usability, clarity, accessibility, and conversion friction with device-specific findings and recommendations.
---

# UX Audit (WaterShortcut)

## When to use
Use this skill whenever the user asks for a UX audit, UX review, or usability assessment of the WaterShortcut app across devices.

## Workflow
1. **Establish scope + surfaces**
   - Review the public routes list in `README.md` to confirm what to audit.
   - Note primary entry points (home, analyze, calculators, guides).

2. **Collect prior context**
   - Read `MOBILE_AUDIT.md` and `UX_FIXES.md` for known mobile issues and recent fixes.
   - Check `docs/accessibility.md` and `docs/a11y-baseline.md` for accessibility expectations.

3. **Inspect primary UI flows**
   - Review key React routes and components in `src/react-app/routes` and `src/react-app/components`.
   - Focus on conversion paths: Start card (upload/demo/manual), quick check slider, calculators entry points, and trust/credit messaging.

4. **Device matrix**
   - Evaluate UX for:
     - **Small mobile** (320–360px)
     - **Large mobile** (390–430px)
     - **Tablet** (768–1024px)
     - **Desktop** (1280–1440px)
     - **Large desktop** (1440px+)
   - For each, assess: navigation, layout density, CTA visibility, form input ergonomics, and ad placement stability.

5. **Accessibility + clarity pass**
   - Confirm labels, aria usage, focusability, and error messaging behavior in key forms.
   - Identify text clarity, jargon, and “what happens next” gaps.

6. **Summarize findings**
   - Produce a report with sections for each device class, plus cross-device themes.
   - For each issue: include severity, affected surfaces, and a concrete recommendation.

## Output format
- Provide a structured Markdown report.
- Use headings for device classes and separate "Findings" and "Recommendations" sections.
- Reference file paths and evidence from the codebase where applicable.

## References
- `README.md` (route map + architecture)
- `MOBILE_AUDIT.md` (mobile-specific learnings)
- `UX_FIXES.md` (recent UX adjustments)
- `docs/accessibility.md`, `docs/a11y-baseline.md`
