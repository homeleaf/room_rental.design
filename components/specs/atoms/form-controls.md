# Spec — Form Controls (`Field`, `Checkbox`)

**Category**: Atom / Shared
**Location**: `components/prototypes/shared/atoms.jsx`, `shared/atoms.css`
**Blazor**: `<MudTextField>`, `<MudCheckBox>`

---

## Field

### API

```tsx
<Field
  label        = string         // visible label above input
  name         = string         // id + name attributes
  type         = "text" | "email" | "password" | "tel" | "number"
  value        = string
  onChange     = (value: string) => void
  placeholder  = string         // describes expected input, not repeating the label
  help         = string         // helper text below input (shown when no error)
  error        = string | null  // validation message; shown instead of help
  autoComplete = string         // e.g. "email", "current-password"
/>
```

### Anatomy

```
[ Label ]         ← .lbl — 12px / 500 / fg-2
┌──────────────┐
│ input text   │  ← .inp — 14px / 400 / fg-1
└──────────────┘
  Helper or error  ← .help — 12px / fg-2 (or error color)
```

### Token Reference

| Part | Token | Prototype var |
|------|-------|--------------|
| Label color | `color.text.secondary` | `--fg-2` |
| Input border (default) | `color.divider.strong` | `--divider-strong` |
| Input border (focus) | `color.primary.DEFAULT` | `--color-primary` |
| Focus ring | green-tinted | `rgba(103,192,144,.25)` |
| Input border (error) | `color.semantic.error` | `--color-error` |
| Placeholder color | `color.text.hint` | `--fg-hint` |
| Background | — | `#fff` (always white, even in dark mode for prototype) |
| Border radius | `border.radius.md` | `--radius-md` |
| Padding | — | `10px 12px` |

### States

| State | Visual |
|-------|--------|
| Default | 1px `--divider-strong` border |
| Focus | 1px `--color-primary` border + `0 0 0 2px rgba(103,192,144,.25)` shadow |
| Error | 1px `--color-error` border; error text replaces helper text |
| Disabled | Grayed background, `cursor: not-allowed` (set via HTML `disabled` attribute) |

### Rules

- Placeholder text describes the expected format, not the field name
  - ✓ "Nhập email của bạn", "VD: 0912 345 678"
  - ✗ "Email", "Số điện thoại"
- Error messages appear inline below the field — not in a toast
- `autoComplete` should always be set for login/register forms (helps password managers)
- Field label is always visible — never use placeholder-as-label

### Phone validation (Register screen)
Pattern: `/^0\d{9,10}$/` after stripping whitespace. Error: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."

---

## Checkbox

### API

```tsx
<Checkbox
  checked  = boolean
  onChange = (checked: boolean) => void
>
  Label text (can contain JSX — links are allowed)
</Checkbox>
```

### Anatomy

```
[✓] Label text with optional <a>link</a>
 ↑
 18×18px custom checkbox
```

### Token Reference

| Part | Token | Value |
|------|-------|-------|
| Border (unchecked) | `color.divider.strong` | `--divider-strong` |
| Fill (checked) | `color.primary.DEFAULT` | `--color-primary` green |
| Border-radius | `border.radius.sm` | 4px |
| Checkmark | — | white SVG via CSS `::after` |
| Label font | `typography.font-size.body2` | 13px |

### States

| State | Visual |
|-------|--------|
| Unchecked | White fill, `--divider-strong` border |
| Checked | `--color-primary` fill + white checkmark |
| Disabled | Grayed fill + grayed border |
| Focus-visible | Outer ring on the checkbox element |

### Rules

- The entire `<label>` element is the click target — not just the text
- Do not use checkboxes for mutually-exclusive options — use radio buttons instead
- Terms-of-service checkbox: disabling the CTA button until checked is acceptable, but the button must show a tooltip explaining why it's disabled if tabbed to

---

## MudBlazor

```razor
@* Field *@
<MudTextField @bind-Value="email"
              Label="Email"
              Placeholder="Nhập email của bạn"
              InputType="InputType.Email"
              Variant="Variant.Outlined"
              HelperText="Chúng tôi sẽ không chia sẻ email của bạn."
              For="@(() => model.Email)" />

@* Password field *@
<MudTextField @bind-Value="password"
              Label="Mật khẩu"
              InputType="@passwordInputType"
              Adornment="Adornment.End"
              AdornmentIcon="@passwordIcon"
              OnAdornmentClick="TogglePasswordVisibility"
              Variant="Variant.Outlined"
              For="@(() => model.Password)" />

@* Checkbox *@
<MudCheckBox @bind-Checked="acceptTerms" Color="Color.Primary">
    <span>Tôi đồng ý với <MudLink>Điều khoản sử dụng</MudLink></span>
</MudCheckBox>
```
