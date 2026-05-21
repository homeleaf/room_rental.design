# Color Guidelines — Room Rental Design System

> Token source: `tokens/tokens.json` → v2.1.0
> All hex values below are the canonical values. Never hardcode colors — always reference tokens.

---

## Brand Palette

Four colors form the entire visual identity. Every color in every app derives from these four.

| Name | Hex | Raw token |
|------|-----|-----------|
| Mint | `#DDF4E7` | `--rr-mint` (prototype) |
| Green | `#67C090` | `--rr-green` |
| Teal | `#26667F` | `--rr-teal` |
| Navy | `#124170` | `--rr-navy` |

*Source: [ColorHunt palette ddf4e767c09026667f124170](https://colorhunt.co/palette/ddf4e767c09026667f124170)*

---

## Semantic Color Roles (v2.0.0+)

Each color role has a defined job. The roles rotated at v2.0.0 — green is now Primary, navy is Secondary.

### Primary — Green `#67C090`

**Purpose**: CTA buttons, links, active/selected states, available status, success indicators.

| Token | Value | Use |
|-------|-------|-----|
| `color.primary.DEFAULT` | `#67C090` | Button background, checkbox, focus ring, link |
| `color.primary.dark` | `#4DA07A` | Pressed/active primary button |
| `color.primary.container` | `#EAF8F1` | Chip/badge/tag/filter backgrounds |
| `color.primary.on` | `#124170` (navy) | Text/icon on green surfaces — 4.7:1 ✓ AA |
| `color.primary.on-container` | `#124170` | Text on light green container — ✓ AAA |

### Secondary — Navy `#124170`

**Purpose**: App chrome (appbar, drawer), outlined secondary CTAs, page titles, section headings.

| Token | Value | Use |
|-------|-------|-----|
| `color.secondary.DEFAULT` | `#124170` | Appbar, drawer, secondary button border/text, headings |
| `color.secondary.dark` | `#0C2E53` | Pressed secondary |
| `color.secondary.container` | `#DDE9F2` | Tags and badges on navy surfaces |
| `color.secondary.on` | `#FFFFFF` | White on navy — 15:1 ✓ AAA |
| `color.secondary.on-dim` | `rgba(255,255,255,0.72)` | Supporting text on navy chrome |

### Tertiary — Teal `#26667F`

**Purpose**: Info states, accent elements, supporting actions, pending status.

| Token | Value | Use |
|-------|-------|-----|
| `color.tertiary.DEFAULT` | `#26667F` | Accent, info, pending chip dot |
| `color.tertiary.container` | `#C5DCE6` | Teal-tinted container |
| `color.tertiary.on` | `#FFFFFF` | Text on teal — 5.3:1 ✓ AA |

### Semantic Colors

| Role | Token | Value | Context |
|------|-------|-------|---------|
| Success / Available | `color.semantic.success` | `#67C090` | Same as primary green |
| Error / Overdue | `color.semantic.error` | `#C62828` | Destructive, error, overdue |
| Warning / Expiring | `color.semantic.warning` | `#E65100` | Orange — needs attention |
| Info | `color.semantic.info` | `#26667F` | Same as tertiary teal |

### Surface Colors

| Token | Prototype var | Value | Use |
|-------|--------------|-------|-----|
| `color.surface.background` | `--color-bg` | `#F7FAF8` | Page background |
| `color.surface.surface` | `--color-surface` | `#FFFFFF` | Cards, modals, drawers |
| `color.surface.surface-dim` | `--color-surface-dim` | `#EFF5F1` | Hover state on rows, dimmed surfaces |

### Text Colors

| Token | Prototype var | Value | Use |
|-------|--------------|-------|-----|
| `color.text.primary` | `--fg-1` | `#0F1E2D` | Body text, headings |
| `color.text.secondary` | `--fg-2` | `#52687A` | Supporting text, labels, meta |
| `color.text.disabled` | `--fg-disabled` | `rgba(15,30,45,.38)` | Disabled inputs, buttons |
| `color.text.hint` | `--fg-hint` | `rgba(15,30,45,.45)` | Placeholder text |

---

## Dividers

| Token | Prototype var | Value | Use |
|-------|--------------|-------|-----|
| `color.divider.DEFAULT` | `--divider` | `rgba(18,65,112,.12)` | Subtle row separators, section dividers |
| `color.divider.strong` | `--divider-strong` | `rgba(18,65,112,.24)` | Input borders, card outlines when emphasis needed |

---

## Color Usage Rules

### Do ✓

- Use **primary (green)** for the single most important action on a screen
- Use **secondary (navy)** for app chrome, secondary CTAs, and page-level headings
- Use **semantic error** for field validation, overdue states, and destructive confirmations
- Use **semantic warning** for states that need attention but are not yet errors (expiring soon, pending)
- Pair `color.primary.on` (navy) on green backgrounds — never white (contrast ratio too low)
- Always use token-based color values — never raw hex in component code

### Don't ✗

- Don't use green (primary) for destructive actions — use `color.semantic.error`
- Don't use mint (`#DDF4E7`) as standalone text — it's a background only; contrast is too low
- Don't use more than 2 semantic accent colors per screen — it creates visual noise
- Don't place green text on white without checking: `#67C090` on `#FFFFFF` = 2.4:1 ✗ FAIL AA
- Don't hardcode `#124170`, `#67C090`, or any hex — always use CSS custom properties

---

## WCAG Accessibility

All color pairings in the system are tested to WCAG 2.1 AA minimum.

| Pairing | Ratio | Level |
|---------|-------|-------|
| Navy (`#124170`) on White | 12.5:1 | ✓ AAA |
| White on Navy (`#124170`) | 12.5:1 | ✓ AAA |
| White on Green (`#67C090`) | 2.4:1 | ✗ — avoid white text on green |
| Navy on Green (`#67C090`) | 4.7:1 | ✓ AA |
| Navy on Mint (`#DDF4E7`) | 11.2:1 | ✓ AAA |
| Error Red (`#C62828`) on White | 5.9:1 | ✓ AA |
| Warning Orange (`#E65100`) on White | 3.5:1 | ✓ AA (large text) |

**Rule**: Do not place colored text on a colored background without verifying contrast. Use the
`color.primary.on` / `color.secondary.on` tokens — they are pre-verified.

---

## Dark Mode

Dark mode swaps token values using `prefers-color-scheme: dark`. The `color.dark.*` tokens in
`tokens.json` define the overrides. Key changes:
- Surfaces darken: background → deep navy, cards → surface-dim
- Primary shifts to mint (`#DDF4E7`) for contrast on dark backgrounds
- Secondary becomes teal (`#26667F`)

Dark mode is automatically applied via the generated `tokens.css` media query.
Never write manual dark-mode overrides — add to `tokens.json → color.dark.*` instead.

---

## MudBlazor Usage

```csharp
// Primary CTA button
<MudButton Variant="Variant.Filled" Color="Color.Primary">Xác nhận</MudButton>

// Secondary outlined button
<MudButton Variant="Variant.Outlined" Color="Color.Secondary">Hủy</MudButton>

// Error destructive
<MudButton Variant="Variant.Filled" Color="Color.Error">Xóa</MudButton>

// Status chip
<MudChip Color="Color.Success">Còn trống</MudChip>
<MudChip Color="Color.Warning">Sắp hết hạn</MudChip>
<MudChip Color="Color.Error">Quá hạn</MudChip>
```

## Prototype CSS Usage

```css
/* In app-specific styles, use simplified var names from generated/prototype/base.css */
.my-component { background: var(--color-primary); color: var(--color-primary-on); }
.my-card { background: var(--color-surface); box-shadow: var(--elev-1); }
.error-text { color: var(--color-error); }
```
