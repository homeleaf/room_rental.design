# Spec — OAuth Consent Screen (`oauth-consent`)

**App**: `auth-server`
**Component**: `ConsentScreen` in `auth-server/App.jsx`
**Status**: ✅ Prototype done
**Route**: `/oauth/consent?client_id=…&redirect_uri=…&scope=…&state=…`

---

## Purpose

OAuth 2.0 authorization endpoint. Shown when a third-party app requests access to a HouseLeaf account. The user reviews what data will be shared and approves or cancels.

---

## Layout

```
┌──────────────────────────────────────────┐
│  [HouseLeaf Logo]  ⇄  [App Avatar]       │
│                                          │
│  Cho phép truy cập?       ← h1 (20px)   │
│  "Chợ Phòng Trọ" muốn truy cập tài      │
│  khoản HouseLeaf của bạn                 │
│  (hoang@example.vn).                     │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ 🧑 Hồ sơ cá nhân                │    │
│  │   Tên, ảnh đại diện và email.   │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ 🛏 Danh sách phòng              │    │
│  │   Xem các phòng đang quản lý.   │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ 💳 Lịch sử thanh toán           │    │
│  │   Xem giao dịch 90 ngày gần.    │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Bạn có thể thu hồi quyền truy cập      │
│  bất cứ lúc nào trong Cài đặt →         │
│  Ứng dụng đã kết nối.                   │
│                                          │
│  [ Hủy — secondary ]  [ Cho phép — primary ] │
└──────────────────────────────────────────┘
```

Card `max-width: 460px` (slightly wider than standard 420px for scope list readability).

---

## Header Section

### Logo pair

HouseLeaf logo (48px) + `sync_alt` icon (22px, `--fg-2`) + App avatar circle.

### App avatar

Circular container: `56×56px`, `border-radius: var(--radius-xl)`, background `color.secondary.container`, icon color `color.secondary.DEFAULT`. Uses Material Symbols `storefront` as a generic app icon.

In production: replace with the registered client application's icon.

### Title

`h1` styled at `font-size: 20px` (not the standard 24px), `margin-top: 4px`.

### Subtitle

Displays the requesting app name (**bold**, `color.text.primary`) and the user's email address. Format:
> **{AppName}** muốn truy cập tài khoản HouseLeaf của bạn ({email}).

---

## Scope List

Each scope is a card-like row:

```
[ ico ]  Title (14px / 500 / --fg-1)
         Description (12px / --fg-2 / line-height 1.4)
```

| Part | Token | Value |
|------|-------|-------|
| Row background | `color.surface.surface-dim` | `--color-surface-dim` |
| Row radius | `border.radius.md` | `--radius-md` |
| Row padding | — | `12px` |
| Icon | Material Symbols | 22px, `--color-secondary` |
| Gap between rows | — | `8px` |

### Scope data (prototype)

| Icon | Title | Description |
|------|-------|-------------|
| `person` | Hồ sơ cá nhân | Tên, ảnh đại diện và email của bạn. |
| `bedroom_parent` | Danh sách phòng | Xem các phòng bạn đang quản lý (chỉ đọc). |
| `payments` | Lịch sử thanh toán | Xem các giao dịch trong 90 ngày gần nhất. |

In production: scopes are dynamic — rendered from the OAuth client registration.

---

## Revocation Notice

`font-size: 12px`, `color: --fg-2`, `line-height: 1.5`

> Bạn có thể thu hồi quyền truy cập bất cứ lúc nào trong phần [Cài đặt → Ứng dụng đã kết nối].

Link color: `var(--color-primary)`.

---

## Actions

Two full-width buttons side-by-side in a `display: flex; gap: 10px` row:

| Button | Variant | Action |
|--------|---------|--------|
| Hủy | `secondary` | Redirect back to `redirect_uri` with `?error=access_denied` |
| Cho phép | `primary` | Issue authorization code, redirect to `redirect_uri?code=…&state=…` |

---

## Security Notes (production)

- Validate `client_id`, `redirect_uri`, and `scope` server-side before rendering this screen
- If `client_id` is unknown or `redirect_uri` doesn't match registration → show error page, do not redirect
- `state` parameter must be echoed back to the redirect URI to prevent CSRF
- This screen must be served over HTTPS only — no exceptions
- Session must already be established (user authenticated) before reaching this screen
