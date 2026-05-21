# Spec — Forgot Password + Reset Password

**App**: `auth-server`
**Components**:
  - `ForgotScreen` — `auth-server/App.jsx` — ✅ Prototype done
  - `ResetPasswordScreen` — ❌ Missing (spec only)
**Routes**: `/forgot-password`, `/reset-password?token=…`

---

## Forgot Password Screen (`forgot`)

### Purpose

User enters their email; the system sends a password reset link. The screen is a dead-end — the next step happens via email.

### Layout

```
┌──────────────────────────────────────┐
│  [Logo]                              │
│  Quên mật khẩu          ← h1        │
│  Nhập email để nhận...  ← sub       │
│                                      │
│  [success alert — shown after send] │
│                                      │
│  [ Email                     ]       │
│                                      │
│  [ Gửi liên kết đặt lại — primary ] │
│    (disabled when email empty)       │
│                                      │
│  ← Quay về đăng nhập                │
└──────────────────────────────────────┘
```

### Success State

After clicking "Gửi liên kết đặt lại":

Alert (`kind="info"`, `icon="mark_email_read"`):
> "Đã gửi liên kết đặt lại đến {email}. Vui lòng kiểm tra hộp thư."

The email field and button remain visible (user can resend with a different address).

### CTA

"Gửi liên kết đặt lại" — `disabled` when email field is empty.

### Footer

"← Quay về đăng nhập" — single link, navigates to `login`.

---

## Reset Password Screen (`reset-password`) — ❌ Missing

### Purpose

Reached via a time-limited link in the reset email. User sets a new password.

### URL
`/reset-password?token=<jwt>`

### Layout

```
┌──────────────────────────────────────┐
│  [Logo]                              │
│  Đặt lại mật khẩu        ← h1       │
│  Nhập mật khẩu mới...    ← sub      │
│                                      │
│  [error alert if token invalid]      │
│                                      │
│  [ Mật khẩu mới              ]       │
│  [ Xác nhận mật khẩu mới    ]       │
│                                      │
│  [ Đặt lại mật khẩu — primary full] │
│                                      │
│  ← Quay về đăng nhập                │
└──────────────────────────────────────┘
```

### Token Validation

On page load, validate the `token` query param:
- **Invalid / expired**: show `<Alert kind="err">` "Liên kết đặt lại đã hết hạn hoặc không hợp lệ. Vui lòng [yêu cầu lại]." (link to `/forgot-password`). Hide the form.
- **Valid**: show the form normally.

### Fields

| Field | Type | `autoComplete` | Placeholder | Validation |
|-------|------|----------------|-------------|------------|
| Mật khẩu mới | `password` | `new-password` | "Tối thiểu 8 ký tự" | Min 8 chars |
| Xác nhận mật khẩu mới | `password` | `new-password` | — | Must match |

### Success State

After successful reset:
- Show `<Alert kind="info">` "Mật khẩu đã được đặt lại thành công."
- Replace form with a "Đăng nhập ngay" button → `/login`
- Invalidate the token server-side (single-use)
