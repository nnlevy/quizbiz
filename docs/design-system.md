# Design system quick guide

This document captures the shared UI primitives introduced for calculators and future route work.

## Card

Use `Card` when you need a themed surface with consistent spacing and typography.

```tsx
import Card from "../components/Card";

<Card id="leak-estimator" title="Leak Cost Estimator">
  <div className="ws-card__body">...</div>
</Card>
```

The `Card` styles read CSS variables such as `--ws-card-background` and
`--ws-card-border`, so you can override them in a route-level stylesheet to
create alternate themes.

## Button

Use `Button` for actions that need the shared button styling hook. Assign a
route-specific class when you need a different palette.

```tsx
import Button from "../components/Button";

<Button className="ws-calculators__insight-button" type="button">
  Get Personalized Insight
</Button>
```

Buttons read theme variables like `--ws-button-bg`, `--ws-button-hover-bg`, and
`--ws-button-color`.

## Input

Use `Input` for numeric or text fields.

```tsx
import Input from "../components/Input";

<Input type="number" min={1} value={householdSize} onChange={...} />
```

Inputs are theme-aware via variables such as `--ws-input-border` and
`--ws-input-focus-border`.

## Slider

Use `Slider` for range-based inputs and set limits with the normal HTML
attributes.

```tsx
import Slider from "../components/Slider";

<Slider min={0} max={180} value={dripsPerMinute} onChange={...} />
```

Slider accents use `--ws-slider-accent` for theme-driven color updates.
