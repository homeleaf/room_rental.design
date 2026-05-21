# Spec — Register Screen (`register`)

**App**: `auth-server`
**Component**: `RegisterScreen` in `auth-server/App.jsx`
**Status**: ✅ Prototype done
**Route**: `/register`

---

## Purpose

Creates a new landlord/property manager account. Tenants do not self-register through this screen (managed by the landlord in the Manager Portal).

---

## Layout

```
┌──────────────────────────────────────┐
│  [Logo]                              │
│  Đăng ký tài khoản    ← h1          │
│  Bắt đầu quản lý...   ← sub         │
│                                      │
│  [ Họ và tên                 ]       │
│  [ Email                     ]       │
│  [ Số điện thoại             ]       │
│  [ Mật khẩu                  ]       │
│  [ Nhập lại mật khẩu         ]       │
│                                      │
│  [✓] Tôi đồng ý với [Điều khoản]    │
│      và [Chính sách bảo mật].        │
│                                      │
│  [ Tạo tài khoản — primary full ]    │
│    (disabled until terms checked)    │
│                                      │
│  Đã có tài khoản? Đăng nhập         │
└──────────────────────────────────────┘
```

---

## Fields

| Field | Type | `autoComplete` | Placeholder | Required |
|-------|------|----------------|-------------|----------|
| Họ và tên | `text` | `name` | "VD: Nguyễn Văn An" | Yes |
| Email | `email` | `email` | "Nhập email của bạn" | Yes |
| Số điện thoại | `tel` | `tel` | "VD: 0912 345 678" | Optional (validated if provided) |
| Mật khẩu | `password` | `new-password` | "Tối thiểu 8 ký tự" | Yes |
| Nhập lại mật khẩu | `password` | `new-password` | — | Yes |

---

## Validation

Triggered on submit.

| Field | Rule | Error message |
|-------|------|---------------|
| Số điện thoại | If non-empty: `/^0\d{9,10}$/` (after stripping spaces) | "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại." |
| Mật khẩu | Min 8 characters | "Mật khẩu phải có ít nhất 8 ký tự." |
| Nhập lại mật khẩu | Must match mật khẩu | "Mật khẩu không khớp. Vui lòng nhập lại." |
| Email | Valid email format | "Email không hợp lệ." |
| Họ và tên | Non-empty | "Vui lòng nhập họ và tên." |

---

## CTA Button State

"Tạo tài khoản" is **disabled** until `terms === true`. Once terms are checked, the button becomes enabled immediately (no further validation needed to enable the button — submit shows errors after click).

---

## Terms Checkbox

Label contains two inline links:
- "Điều khoản sử dụng" → `/terms` (opens in new tab in production)
- "Chính sách bảo mật" → `/privacy` (opens in new tab)

Link color: `var(--color-primary)` (green).

---

## Footer

"Đã có tài khoản? [Đăng nhập]" → navigates to `login` screen.

---

## Accessibility

- `new-password` autocomplete prevents password managers from accidentally filling registration fields with saved credentials
- Phone field: `type="tel"` enables numeric keyboard on mobile
- Terms checkbox: the CTA's `disabled` state must be communicated to screen readers via `aria-disabled` + descriptive `aria-describedby`
- No CAPTCHA in prototype — add invisibly in production
