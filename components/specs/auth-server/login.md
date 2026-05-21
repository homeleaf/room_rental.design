# Spec — Login Screen (`login`)

**App**: `auth-server`
**Component**: `LoginScreen` in `auth-server/App.jsx`
**Status**: ✅ Prototype done
**Route**: `/login` (or the default auth-server page)

---

## Purpose

The primary entry point for all authenticated apps. Collects email + password, validates, and redirects to the app the user came from.

---

## Layout

Uses `<AuthShell>` with `title="Đăng nhập"` and `sub="Quản lý phòng trọ của bạn ở mọi nơi."`.

```
┌─────────────────────────────────────┐
│  [Logo 56px]                        │
│  Đăng nhập          ← h1, primary   │
│  Quản lý phòng...   ← sub, fg-2     │
│                                     │
│  [ Email field              ]       │
│  [ Mật khẩu field           ]       │
│                                     │
│  [✓ Ghi nhớ]      [Quên mật khẩu?] │
│                                     │
│  [ Đăng nhập — primary full ]       │
│                                     │
│  ─── hoặc đăng nhập với ───         │
│  [ Google button ]                  │
│  [ Facebook button ]                │
│                                     │
│  Chưa có tài khoản? Đăng ký        │
└─────────────────────────────────────┘
```

---

## Fields

| Field | Type | `autoComplete` | Placeholder | Required |
|-------|------|----------------|-------------|----------|
| Email | `email` | `email` | "Nhập email của bạn" | Yes |
| Mật khẩu | `password` | `current-password` | "Nhập mật khẩu" | Yes |

---

## Interactive Elements

| Element | Action |
|---------|--------|
| "Quên mật khẩu?" link | Navigate to `forgot` screen |
| "Ghi nhớ đăng nhập" checkbox | Controlled; default `true` |
| "Đăng nhập" button | Primary, full-width; triggers validation on click |
| SSO buttons | See SSO Block spec below |
| "Đăng ký" link | Navigate to `register` screen |

---

## Validation

Validation is triggered on **submit** (not on blur).

| Field | Error condition | Message |
|-------|-----------------|---------|
| Mật khẩu | Empty on submit | "Vui lòng nhập mật khẩu." |

Error display: `<Alert kind="err">` above the form + red border + inline error on the password field.

The email field is pre-filled in the prototype (`hoang@example.vn`) to accelerate review. Production must not pre-fill.

---

## SSO Block (`SsoBlock`)

Shown below the primary button when at least one SSO provider is enabled.

### DividerOr
"hoặc đăng nhập với"

### SSO Buttons

**Style: `outlined`** (default)
- White background, brand icon (Google / Facebook colored), `--color-secondary` border
- Same as `.btn.secondary` shape, full width

**Style: `brand`**
- Google: white bg, `#DADCE0` border
- Facebook: `#1877F2` blue bg, white text

### Passkey button (optional)
Icon: `passkey` (Material Symbols), label: "Đăng nhập bằng passkey"

### Layout: `stacked` (default) vs `inline`
- `stacked`: Google and Facebook stacked vertically (full-width each)
- `inline`: side-by-side in a `grid-template-columns: 1fr 1fr` when exactly 2 providers

All SSO options are controlled by tweaks panel (hidden in production).

---

## AuthShell

Shared wrapper for all auth screens.

| Part | Token | Value |
|------|-------|-------|
| Card max-width | — | 420px |
| Card background | `color.surface.surface` | white |
| Card radius | `border.radius.lg` | 12px |
| Card shadow | `elevation.4` | `--elev-4` |
| Card padding | — | `32px 32px 28px` |
| Page background | `color.surface.background` | `--color-bg` |
| `h1` color | `color.primary.DEFAULT` | green |
| `h1` font | `typography.font-family.display` | Inter Tight |
| `h1` weight | — | 300 (Light) |
| `h1` size | `typography.font-size.h2` | 24px |
| `.sub` color | `color.text.secondary` | `--fg-2` |
| `.sub` size | — | 13px, center-aligned |

---

## Tweaks (prototype only)

| Tweak | Default | Options |
|-------|---------|---------|
| showGoogle | true | toggle |
| showFacebook | true | toggle |
| showPasskey | false | toggle |
| ssoLayout | "stacked" | "stacked" / "inline" |
| ssoStyle | "outlined" | "outlined" / "brand" |
| showRemember | true | toggle |

---

## Accessibility

- `<form>` element (production) — allows Enter to submit
- Email and password fields have `autocomplete` set
- Focus order: Email → Password → Remember → Submit → SSO buttons → Footer link
- "Quên mật khẩu?" is a link, not a button — no role override needed
- Error alert announced via `role="alert"` in production
