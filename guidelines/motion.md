# Motion Guidelines — Room Rental Design System

> Token source: `tokens/tokens.json → motion.*` — v2.1.0 (motion tokens added)
> Motion tokens are available in `generated/prototype/base.css` as `--duration-*` and `--easing-*`.
> They are **not** directly mapped to MudBlazor theme parameters (see MudBlazor section below).

---

## Purpose of Motion

Motion in this design system serves one purpose: **communicate state changes clearly without drawing attention to itself**.

Good motion is invisible — users notice the result, not the animation.
Bad motion is decorative, slow, or distracting.

---

## Duration Tokens

| Token | Var | Value | When to use |
|-------|-----|-------|-------------|
| `motion.duration.instant` | `--duration-instant` | `0ms` | Programmatic visibility toggling (no animation needed) |
| `motion.duration.fast` | `--duration-fast` | `100ms` | Micro-interactions: checkbox tick, toggle switch, ripple, icon swap |
| `motion.duration.normal` | `--duration-normal` | `150ms` | **Default** — hover color/background, button press feedback, input focus ring |
| `motion.duration.slow` | `--duration-slow` | `200ms` | Expand/collapse, accordion, tab switch, tooltip appear/disappear |
| `motion.duration.deliberate` | `--duration-deliberate` | `300ms` | Drawer slide open/close, modal enter/exit, page-level transitions |

**Rule**: Never go above `300ms` for UI feedback. Anything slower feels broken. Never animate for decoration alone — if removing the animation doesn't break comprehension, remove it.

---

## Easing Tokens

Easing curves define the *feel* of a transition. Each has a specific job:

| Token | Var | Curve | When to use |
|-------|-----|-------|-------------|
| `motion.easing.standard` | `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | **Default** — elements staying within the screen (hover, reorder, color change) |
| `motion.easing.decelerate` | `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements **entering** the screen — starts fast, glides to rest (drawer open, modal enter, slide-in) |
| `motion.easing.accelerate` | `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Elements **leaving** the screen — accelerates away (drawer close, modal exit, slide-out) |
| `motion.easing.sharp` | `--easing-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` | Temporary panels that must feel snappy — quick expand then immediate collapse |

---

## Usage in Prototype CSS

```css
/* Hover feedback — normal duration, standard easing */
.btn {
  transition: background var(--duration-normal) var(--easing-standard),
              box-shadow  var(--duration-normal) var(--easing-standard);
}

/* Drawer slide-in */
.drawer-right {
  transition: transform var(--duration-deliberate) var(--easing-decelerate);
}

/* Drawer slide-out (on close) */
.drawer-right.closing {
  transition: transform var(--duration-deliberate) var(--easing-accelerate);
}

/* Tooltip appear */
.tooltip {
  transition: opacity var(--duration-slow) var(--easing-standard),
              transform var(--duration-slow) var(--easing-decelerate);
}
```

---

## What Should Animate

✅ **Always animate**:
- Button hover/press (background, shadow)
- Input focus ring (border-color, box-shadow)
- Checkbox/toggle state change
- Drawer open/close
- Modal enter/exit
- Notification snackbar slide-in
- Row hover (background)
- Chip/filter-chip selected state

⚠️ **Animate cautiously** (keep under 150ms or skip):
- Table sort / filter results — data change should be instant; only sort indicator animates
- Page-level route transitions — only if the routing architecture supports it cleanly

❌ **Never animate**:
- Error messages — they must appear instantly for user trust
- Loading states replacing loading states — skip the animation
- Pure decorative / looping animations (unless on an empty state illustration)
- Font-size transitions (triggers reflow on every frame)

---

## Patterns by Component

### Button

```css
.btn {
  transition: background var(--duration-normal) var(--easing-standard),
              color       var(--duration-normal) var(--easing-standard),
              box-shadow  var(--duration-normal) var(--easing-standard);
}
```
No scale or transform — buttons don't physically move.

### Input Focus

```css
.field .inp {
  transition: border-color var(--duration-normal) var(--easing-standard),
              box-shadow   var(--duration-normal) var(--easing-standard);
}
```

### Drawer (right-side receipt panel)

```css
/* Enter: decelerate from right */
.drawer-right {
  transform: translateX(100%);
  transition: transform var(--duration-deliberate) var(--easing-decelerate);
}
.drawer-right.open {
  transform: translateX(0);
}
/* Exit: accelerate back out */
/* Swap to easing-accelerate when removing .open */
```

### Scrim / Overlay

```css
.scrim {
  transition: opacity var(--duration-slow) var(--easing-standard);
}
```

### Chip / Status badge

No animation — status is data-driven. Changes appear instantly.

### Drawer navigation (left drawer)

The left drawer in the portal is **persistent** (always visible on desktop) — it does not animate open/close.

---

## `prefers-reduced-motion`

**This is mandatory, not optional.**

Wrap all motion in a reduced-motion check. Users with vestibular disorders can be harmed by unexpected motion.

```css
/* All transitions in shared/atoms.css and app stylesheets must respect this */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Place this block in `shared/atoms.css` (Phase 3 todo — currently each prototype handles this implicitly via the browser default).

For Blazor:
```csharp
// Check in JS interop or CSS — MudBlazor does not expose a prefers-reduced-motion hook,
// so use a global CSS rule in wwwroot/app.css.
```

---

## MudBlazor Motion

MudBlazor 9.x has its own internal transitions for MudDrawer, MudDialog, MudSnackbar, etc.
These are **not** controlled by the motion tokens directly — MudBlazor uses its own `MudTransition` system.

To align MudBlazor transitions with the design system:
- **Don't** fight MudBlazor's built-in transitions — they are close enough
- **Do** override `transition-duration` for custom overlay components in your `app.css`
- The `--duration-deliberate: 300ms` value was chosen to match MudBlazor's default drawer transition

---

## Anti-patterns

| Anti-pattern | Problem | Correct approach |
|---|---|---|
| `transition: all 0.3s ease` | Animates everything, including layout-triggering properties | Specify only `background`, `color`, `transform`, `opacity`, `box-shadow` |
| `animation: spin infinite` on a loading indicator | Fine for a spinner, but remove when data arrives instantly | Only animate when there is actual async wait |
| `transition-duration: 500ms+` on any UI element | Feels sluggish — breaks flow | Cap at `var(--duration-deliberate)` (300ms) |
| Hover animation on mobile/touch | `hover` has no clear trigger on touch — causes sticky states | Use `@media (hover: hover)` guard |
| Animating `width`, `height`, `margin`, `padding` | Triggers layout reflow on every frame | Use `transform: scale()` or `max-height` workaround |
