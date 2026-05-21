# Spec — Button (`Btn`)

**Category**: Atom / Shared
**Location**: `components/prototypes/shared/atoms.jsx`, `shared/atoms.css`
**Blazor**: `<MudButton>`, `<MudIconButton>`

---

## API

```tsx
<Btn
  variant  = "primary" | "secondary" | "tertiary" | "text" | "danger"
  full     = boolean          // width: 100%
  size     = "sm" | undefined // compact size
  icon     = string           // Material Symbols name — left of label
  type     = "button" | "submit" | "reset"
  disabled = boolean
  onClick  = () => void
>
  Label text
</Btn>

<IconBtn
  icon    = string    // Material Symbols name
  title   = string    // visible tooltip + aria-label
  onClick = () => void
/>
```

---

## Variants

### Primary
Default CTA. One primary button per screen section max.

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.primary.DEFAULT` | `#67C090` |
| Text | `color.primary.on` | `#124170` navy |
| Font weight | `typography.font-weight.semibold` | 600 |
| Background (hover) | `color.primary.dark` | `#4DA07A` |
| Background (disabled) | — | `rgba(18,65,112,.12)` |
| Text (disabled) | — | `rgba(18,65,112,.38)` |

### Secondary
Outlined. Used alongside Primary, or as the sole CTA when the action is reversible/low-risk.

| Property | Value |
|----------|-------|
| Background | transparent |
| Border | `1px solid color.secondary.DEFAULT` (`#124170`) |
| Text | `color.secondary.DEFAULT` |
| Background (hover) | `rgba(18,65,112,.06)` |
| Padding offset | 9px 15px (1px less to compensate for border) |

### Tertiary
Filled teal. Use sparingly — for a third-level action that needs distinction from secondary.

### Text
No border, no background. Use for low-priority inline actions (e.g. "Xuất CSV").

### Danger
Filled red. Destructive actions only. Always show a confirmation dialog before executing.

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.semantic.error` | `#C62828` |
| Text | — | `#fff` |

---

## Sizes

| Size | Padding | Font | Min touch target |
|------|---------|------|-----------------|
| Default | `10px 16px` | 14px / 500 | 44px height |
| Small `.sm` | `6px 12px` | 12px / 500 | 32px height (use only in dense tables/toolbars) |

---

## States

| State | Visual |
|-------|--------|
| Default | Base style |
| Hover | Darker background or subtle bg tint |
| Focus-visible | `2px solid color.primary` outline, `offset: 2px` |
| Active/pressed | Same as hover (no scale animation) |
| Disabled | Greyed: `rgba(18,65,112,.12)` bg, `.38` text, `cursor: not-allowed` |
| Loading | Add ellipsis to label: "Đang lưu..." + disable interaction |

---

## Icon Button (`IconBtn`)

Square, circular. Used in table rows and appbar actions.

| Property | Value |
|----------|-------|
| Size | 36×36px |
| Radius | `var(--radius-full)` |
| Color | `color.secondary.DEFAULT` |
| Background (hover) | `rgba(18,65,112,.08)` |
| **Must have** | `title` prop (visible tooltip) + `aria-label` |

---

## Layout Rules

- Icons render left of the label at 18px (16px in `.sm`)
- `.full` stretches to 100% width — use in forms and auth cards, never in toolbars
- Stacked buttons (vertically) must have `gap: var(--sp-2)` (8px) between them
- Inline button pairs: `gap: var(--sp-2)` to `var(--sp-3)` (8–12px)

---

## Accessibility

- All buttons have visible focus ring (`outline`) — do not suppress `focus-visible`
- Icon-only buttons (IconBtn) must have `aria-label` matching the visible tooltip
- Disabled buttons: set `disabled` attribute (not CSS-only) so assistive tech skips them
- Destructive buttons: confirm with a dialog (`role="dialog"`) before executing

---

## MudBlazor

```razor
@* Primary *@
<MudButton Variant="Variant.Filled" Color="Color.Primary" StartIcon="@Icons.Material.Outlined.AddHome">
    Thêm phòng
</MudButton>

@* Secondary outlined *@
<MudButton Variant="Variant.Outlined" Color="Color.Secondary" StartIcon="@Icons.Material.Outlined.Edit">
    Sửa
</MudButton>

@* Danger with confirmation *@
<MudButton Variant="Variant.Filled" Color="Color.Error" OnClick="OpenDeleteDialog">
    Xóa hợp đồng
</MudButton>

@* Icon button *@
<MudIconButton Icon="@Icons.Material.Outlined.Visibility"
               Size="Size.Small"
               aria-label="Xem chi tiết"
               title="Xem chi tiết" />
```
