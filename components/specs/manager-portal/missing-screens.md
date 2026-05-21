# Spec — Missing Screens (Backlog)

These screens are tracked in `docs/app-ownership.md` as `❌ Missing` or `⚠️ Placeholder`.
Each entry is a forward-spec (intent + requirements) for when the prototype or implementation is built.

---

## Notifications (`notifications`) — ❌ Missing

**Route**: `/notifications`

### Purpose

Aggregated feed of system events requiring manager attention: expiring contracts, overdue payments, maintenance completed, new tenant requests.

### Planned Layout

```
[ PageHeader: Thông báo ]   [ Đánh dấu tất cả đã đọc ]

[ FilterChip: Tất cả | Chưa đọc | Hợp đồng | Thanh toán | Bảo trì ]

[ Notification list ]
  Each row: icon circle + title + meta + timestamp + Chip (if actionable)
  Unread rows: slightly darker background (--color-surface-dim)
```

### Notification Types

| Type | Icon | Example |
|------|------|---------|
| Contract expiring | `event_busy` | "Hợp đồng Phòng 201 hết hạn trong 5 ngày." |
| Payment overdue | `error` | "Hoàng Anh Tuấn chưa thanh toán tháng 3." |
| Maintenance completed | `build` | "Yêu cầu sửa vòi nước P203 đã hoàn thành." |
| New tenant request | `person_add` | "Đỗ Minh Quân đã gửi đơn đăng ký thuê P204." |

### Behaviour

- Unread indicator: appbar bell badge (count)
- Click notification → navigate to relevant screen (contract detail / room detail / etc.)
- "Đánh dấu tất cả đã đọc" clears all unread states

---

## Settings (`settings`) — ⚠️ Placeholder

**Route**: `/settings`

### Purpose

Property manager preferences and account management.

### Planned Sections (tabs or accordion)

**1. Hồ sơ cá nhân**
- Avatar upload
- Name, phone, email (read-only; change email via auth-server)
- Password change → redirects to auth-server `change-password`

**2. Tòa nhà / Bất động sản**
- Property name, address, number of floors
- Utility pricing: điện (đ/kWh), nước (đ/m³), internet (flat fee)
- Default services: vệ sinh, phí quản lý

**3. Thông báo**
- Toggle: Email / In-app notifications per event type

**4. Ứng dụng đã kết nối** (OAuth clients)
- List of third-party apps that have been granted access
- Revoke button per app

**5. Tài khoản**
- Danger zone: Xóa tài khoản (with confirmation dialog)

---

## Maintenance List (`maintenance-list`) — ⚠️ Placeholder

**Route**: `/maintenance`

### Purpose

Track maintenance requests for all rooms.

### Planned Layout

```
[ PageHeader: Bảo trì ]   [ Tạo yêu cầu ]

[ Toolbar: search + filter by status ]

[ Table ]
  # / Phòng / Mô tả / Ngày tạo / Ngày hoàn thành / Chi phí / Trạng thái / Actions
```

### Maintenance Statuses

| Status | Chip | Meaning |
|--------|------|---------|
| `pending` | Đang chờ | Request opened, not yet started |
| `maint` | Đang sửa | Work in progress |
| `paid` | Hoàn thành | Work done, cost recorded |
| `overdue` | Trễ hạn | Past expected completion date |

---

## Auth-Server Missing Screens

### Verify Email (`verify-email`) — ❌ Missing

Shown after registration. User must click the link sent to their email before accessing the app.

```
[ Logo ]
Xác thực email
Chúng tôi đã gửi liên kết xác thực đến {email}.

[ Resend email — secondary ]
← Quay về đăng nhập
```

Token validation on page load (same pattern as reset-password).

### Account Locked (`account-locked`) — ❌ Missing

Shown after N failed login attempts (brute-force protection).

```
[ Logo ]
Tài khoản tạm thời bị khóa

Alert (err): "Tài khoản của bạn đã bị khóa sau nhiều lần đăng nhập thất bại.
Vui lòng thử lại sau {minutes} phút hoặc đặt lại mật khẩu."

[ Đặt lại mật khẩu — secondary ]
← Quay về đăng nhập
```

### Change Password (`change-password`) — ❌ Missing

Accessed from Settings within any app → redirects to auth-server.

```
[ Logo ]
Đổi mật khẩu

[ Mật khẩu hiện tại ]
[ Mật khẩu mới          ]
[ Xác nhận mật khẩu mới ]

[ Đổi mật khẩu — primary full ]
← Quay lại
```

Validation: current password must be correct (server-side); new password min 8 chars.
Success: "Mật khẩu đã được thay đổi thành công." → auto-redirect to originating app after 3s.
