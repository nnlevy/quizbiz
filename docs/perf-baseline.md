# Performance baseline

_Date:_ 2025-02-14

## URLs targeted
- `/`
- `/analyze-water-bill`
- `/guides`

## Lighthouse metrics
> **Note:** Lighthouse was not run in this environment (no local Chrome/Lighthouse runner available). Run the commands in `docs/perf.md` to capture before/after values on your machine.

## Key observations
- Initial critical CSS was minimal in the HTML shell.
- Render-blocking CSS and third-party scripts were present on all routes.

## LCP notes
> **Placeholder:** Capture LCP element + blocking resources during local Lighthouse run.
