# Design System Strategy: The Fluid Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Hydro-Luxe Editorial."** 

We are moving away from the utilitarian, "utility-first" look of standard fitness trackers. Instead, we are treating hydration as a premium wellness ritual. This system leverages high-contrast typography, expansive white space, and organic, layered surfaces to create an experience that feels as refreshing as a cold glass of water. 

To break the "template" look, we utilize **Intentional Asymmetry**. Instead of centered, boxed-in content, we use staggered layouts where headers bleed toward the edges and glassmorphic cards overlap one another, creating a sense of depth and movement—mimicking the fluid nature of water itself.

---

## 2. Colors & Surface Philosophy

The palette is rooted in the clarity of `surface` (#F7F9FB) and the energy of `primary_container` (#00AEEF). 

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define space, you must rely exclusively on background shifts. For example, a `surface_container_low` section should sit directly on a `surface` background. The transition of tone is the only boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to "nest" depth:
*   **Base:** `surface` (The canvas).
*   **Sectioning:** `surface_container_low` (Subtle areas for grouping).
*   **Actionable Content:** `surface_container_lowest` (Pure white cards to draw the eye).

### The "Glass & Gradient" Rule
To achieve a signature feel, floating elements (like FABs or Navigation Bars) must use **Glassmorphism**.
*   **Formula:** `surface_container_lowest` at 70% opacity + `backdrop-blur: 20px`.
*   **Signature Texture:** Use a subtle linear gradient on primary CTAs—transitioning from `primary` (#00658D) at the top left to `primary_container` (#00AEEF) at the bottom right. This adds "soul" and a sense of liquid volume.

---

## 3. Typography: The Voice of Clarity

We pair the sophisticated, wide apertures of **Plus Jakarta Sans** for high-impact displays with the functional precision of **Inter** for data-heavy tracking.

*   **Display (Plus Jakarta Sans):** Used for daily totals and motivational headers. Use `display-lg` (3.5rem) to make water volume feel monumental.
*   **Headlines (Plus Jakarta Sans):** Bold, authoritative, and tight-tracking. These anchor the page.
*   **Body & Labels (Inter):** Optimized for readability. Use `body-md` (0.875rem) for most data points to maintain a "light" visual weight.

The hierarchy is intentionally dramatic: we use a massive scale jump between `display-lg` and `body-md` to create an editorial, high-end feel that guides the user's focus instantly to their most important metric.

---

## 4. Elevation & Depth: Tonal Layering

We reject the standard "drop shadow" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface_container_lowest` card on a `surface_container_high` background to create a "lift" that feels integrated, not "pasted on."
*   **Ambient Shadows:** If a shadow is required for a floating state, use a 32px blur at 6% opacity, tinted with `primary` (#00658D). This creates a soft "caustic" glow rather than a muddy grey shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-glare environments), use the `outline_variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.
*   **Liquid Motion:** All transitions between surface states should use a `cubic-bezier(0.23, 1, 0.32, 1)` easing function to mimic the smooth, effortless flow of water.

---

## 5. Components

### Buttons & Interaction
*   **Primary Button:** `xl` (3rem) rounding. Gradient fill (Primary to Primary-Container). No border. Label in `on_primary` (White).
*   **Secondary/Glass Button:** `surface_container_lowest` at 40% opacity with a heavy backdrop blur. This allows the background "water" imagery to peek through.
*   **Fluid Progress Indicators:** Use `tertiary_container` (#00B3C6) for the fill. The container should have a subtle inner shadow to look like a vessel being filled.

### Inputs & Selection
*   **Input Fields:** No bottom line. Use `surface_container_low` with `md` (1.5rem) rounding. Focus state is a soft 2px glow of `primary_fixed`.
*   **Chips:** Use `full` (9999px) rounding. Unselected chips should be `surface_container_high`; selected chips should be `primary` with `on_primary` text.

### Cards & Lists
*   **The "No Divider" Rule:** Forbid the use of divider lines. Separate list items using `spacing-3` (1rem) of vertical white space or by alternating background tones between `surface_container_low` and `surface_container_lowest`.
*   **Glassmorphic Cards:** For top-level stats, use a card with `lg` (2rem) rounding, a `surface_container_lowest` 60% opacity fill, and a 24px backdrop-blur.

### Signature App Components
*   **The "Wave" Navigation:** A bottom navigation bar that is entirely glassmorphic, with a floating "Add Water" action button that uses a `tertiary` (#006874) glow.
*   **Volume Dial:** A large, circular gesture area using `surface_container_highest` for the track and a `primary` gradient for the progress.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional element. If in doubt, add more padding from the `spacing-8` or `spacing-10` scales.
*   **DO** overlap elements. A glassmorphic card should slightly "hang" over a section transition to create depth.
*   **DO** use `tertiary` (Teal) for "Success" states and "Goal Reached" moments—it feels more refreshing than a standard green.

### Don't
*   **DON'T** use 1px solid borders. It breaks the "liquid" metaphor and makes the UI look like a legacy form.
*   **DON'T** use pure black for text. Always use `on_surface` (#191C1E) to keep the contrast high but the "vibe" soft.
*   **DON'T** crowd the display. Every primary metric should have at least `spacing-6` of "breathing room" around it.