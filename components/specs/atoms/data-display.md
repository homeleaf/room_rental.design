# Spec — Data Display Atoms (`Chip`, `Avatar`, `Card`, `Icon`)

**Category**: Atom / Shared
**Location**: `components/prototypes/shared/atoms.jsx`, `shared/atoms.css`

---

## Chip (Status Badge)

Communicates the current status of a room, contract, or payment. Read-only — chips are not interactive.

### API

```tsx
<Chip status="available" | "rented" | "pending" | "expiring" | "overdue" | "maint" | "paid">
  Còn trống
</Chip>
```

### Visual Spec

```
  ● Label
  ↑ 6×6px dot
```

| Status | Background | Text color | Dot color | Vietnamese label |
|--------|-----------|------------|-----------|-----------------|
| `available` | `#EAF8F1` | `#1B5E3F` | `#67C090` green | Còn trống |
| `rented` | `#DDF4E7` mint | `#124170` navy | `#124170` | Đã thuê |
| `pending` | `#C5DCE6` | `#1B4D62` | `#26667F` teal | Đang chờ |
| `expiring` | `#FFE9D6` | `#B34000` | `#E65100` orange | Sắp hết hạn |
| `overdue` | `#FDECEC` | `#C62828` | `#C62828` | Quá hạn |
| `maint` | `#F3E9D8` | `#5D4500` | `#7A5C00` | Đang sửa chữa |
| `paid` | `#EAF8F1` | `#1B5E3F` | `#67C090` green | Đã thanh toán |

### Layout

- `padding: 3px 10px`, `border-radius: var(--radius-full)`, `font-size: 11px`, `font-weight: 500`
- Dot: `6×6px`, `border-radius: 50%`, `margin-right: 6px`
- `white-space: nowrap` — chip labels never wrap

### Rules

- Always use the predefined `status` prop — do not add custom colors or classes
- Chip labels must match the Vietnamese canonical labels above for consistency
- Do not use chips for actions (buttons) — chips are read-only indicators
- Maximum 1 chip per table row / list item (exception: room detail has 1 chip per record)

---

## Avatar

Displays a person's initials. Used in table rows, the appbar, and person-row patterns.

### API

```tsx
<Avatar
  initials = string   // 1–2 characters, uppercase
  size     = number   // px (default: 36)
  color    = "tertiary" | "primary"
/>
```

### Visual

Circle with initials centered. Colors:

| `color` prop | Background | Text |
|---|---|---|
| `tertiary` (default) | `color.tertiary.DEFAULT` (`#26667F`) | `color.tertiary.on` (`#fff`) |
| `primary` | `color.primary.container` (`#EAF8F1`) | `color.primary.on-container` (`#124170`) |

Font size is `size × 0.36` — auto-scales with the circle size.

### Sizes

| Context | Size |
|---------|------|
| Appbar (user avatar) | 36px |
| Table rows | 32px |
| Person detail card | 44px |

### Rules

- Initials: always last 2 words of the name, first letter each. "Nguyễn Văn An" → "NA"
- Do not use an image URL in the prototype — initials-only
- Production: support fallback to initials if profile photo fails to load

---

## Card

Content container with elevation. The primary grouping primitive in the portal.

### API

```tsx
<Card dense={boolean} style={CSSProperties} className={string}>
  {children}
</Card>
```

### Visual Spec

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.surface.surface` | `--color-surface` white |
| Border radius | `border.radius.lg` | `--radius-lg` 12px |
| Shadow | `elevation.1` | `--elev-1` |
| Padding (default) | — | `20px 22px` |
| Padding (dense) | — | `16px 18px` |

### Rules

- Use `dense` in layouts where vertical space is tight (e.g. room detail sidebar)
- Cards do not have a border — elevation alone provides separation from the page background
- Stack multiple cards with `gap: var(--sp-4)` (16px) using `.stack` utility
- Nesting a card inside a card: avoid; use a `section-title` + `dl` instead

---

## Icon

Renders a Material Symbols Outlined glyph.

### API

```tsx
<Icon
  name   = string           // Material Symbols icon name (e.g. "bedroom_parent")
  size   = number           // px (default: 20)
  filled = boolean          // 'FILL' 1 variation — use for active states
  color  = string | undefined  // CSS color string; inherits if omitted
/>
```

### Size Reference

| Context | Size | Touch target |
|---------|------|-------------|
| Inline with body text | 18px | — |
| Button icon | 18–20px | Via button |
| Drawer nav item | 22px | Via drawer item |
| KPI icon | 18px | — |
| Photo placeholder / empty state | 48–64px | — |

### Rules

- Use `filled` only for active/selected state (e.g. active drawer item)
- Do not override icon color with raw hex — use a semantic token value as the CSS color string
  - ✓ `color="var(--color-primary)"`
  - ✗ `color="#67C090"`
- All icons used in Room Rental must come from the predefined list in `guidelines/iconography.md`

---

## Alert

Inline contextual message. Not a toast — it appears inside the card/form flow.

### API

```tsx
<Alert kind="info" | "err" icon="material_symbol_name">
  Message text
</Alert>
```

| Kind | Background | Text color | Default icon |
|------|-----------|------------|-------------|
| `info` | `color.primary.container` | `color.primary.on-container` | `info` |
| `err` | `#FDECEC` | `#C62828` | `error` |

### Rules

- Error messages appear immediately on validation — no delay
- Info alerts for async confirmations ("Email đã gửi") appear in the same slot where the form was
- Never use `err` for system/server errors visible to anonymous users — use a generic message
- Alert is not a snackbar — it does not auto-dismiss and has no close button in the prototype

---

## DividerOr

Visual separator with a centered label. Used only in the auth SSO section.

### API

```tsx
<DividerOr>hoặc đăng nhập với</DividerOr>
```

### Visual

```
────────── hoặc đăng nhập với ──────────
```

Horizontal line (`1px var(--divider)`) with text centered in a flex gap. Text: `11px`, `500`, `0.08em` letter spacing, uppercase.

---

## formatVND / Money / DateVN / Phone

Formatting utilities — not visual components.

| Util | Input | Output | Example |
|------|-------|--------|---------|
| `formatVND(n)` | number | string | `2500000` → `"2.500.000đ"` |
| `<Money value={n}/>` | number | `<span class="money">` | Monospace, tabular nums |
| `<DateVN value={s}/>` | `DD/MM/YYYY` string | `<span>` | `"20/05/2026"` |
| `<Phone value={s}/>` | phone string | `<span>` | `"0912 345 678"` |

`.money` class applies: `font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums`

Always use `<Money>` for currency values in tables — ensures alignment via tabular numerals.
