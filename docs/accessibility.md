# Accessibility standards

## Automated checks
- Playwright + axe scans key routes with WCAG 2.1 A/AA rules enabled.

**Run locally**
```
npm run test:e2e -- tests/a11y.spec.ts
```

## Color contrast policy
- Semantic tokens live in `src/react-app/styles/colorTokens.ts`.
- Contrast ratios are enforced with a unit test (`tests/color-contrast.spec.ts`).
- Minimum ratios:
  - 4.5:1 for normal text.
  - 3:1 for large text (18pt+ or 14pt+ bold).

**Run locally**
```
npm run test:unit -- tests/color-contrast.spec.ts
```

## ARIA + keyboard checklist
- Landmarks: header, nav, main, footer present on SPA + legacy shells.
- Skip link present and focusable on all pages.
- Dialogs:
  - `role="dialog"` and `aria-modal="true"` where applicable.
  - Focus trapped and restored; Escape closes.
- Form elements use `<label>` and `aria-describedby` for hints/errors.
- Icon-only controls include accessible names (`aria-label`).
