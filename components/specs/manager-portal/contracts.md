# Spec — Contracts List, Contract Detail, Contract Create

**App**: `manager-portal`
**Components**: `ContractsScreen` in `manager-portal/screens.jsx`
**Status**:
  - Contracts list: ✅ Prototype done
  - Contract detail: ❌ Missing
  - Contract create: ❌ Missing

---

## Contracts List Screen (`contracts-list`)

### Purpose

Full list of all rental contracts. Filterable by status. Entry to contract detail and creation.

### Layout

```
[ PageHeader: Hợp đồng ]   [ Tạo hợp đồng ]

[ Toolbar ]
  [ Search ]  [ Tất cả | Đang hiệu lực | Sắp hết hạn | Đã hết hạn ]

[ Table: .tbl ]
```

### Table Columns

| Column | Type | Notes |
|--------|------|-------|
| Mã HĐ | code | "HD-2026-0142" — `.money` font |
| Người thuê | text | Name |
| Phòng | text | "Phòng 101" |
| Từ ngày | date | `.num` DD/MM/YYYY |
| Đến ngày | date | `.num` DD/MM/YYYY |
| Giá thuê | money | `<Money>` |
| Trạng thái | chip | `rented` / `expiring` / `overdue` |
| Actions | — | View / Print / More |

### Action Icons

| Icon | Title | Action |
|------|-------|--------|
| `visibility` | Xem | Contract detail (planned) |
| `print` | In | Print contract (planned) |
| `more_vert` | Thêm | Overflow menu |

### Filter Behavior

- "Tất cả": all statuses
- "Đang hiệu lực": `rented` + `expiring`
- "Sắp hết hạn": `expiring` (≤30 days remaining)
- "Đã hết hạn": `overdue` + contracts past end date

---

## Contract Detail Screen (`contract-detail`) — ❌ Missing

**Route**: `/contracts/{contractId}`

### Layout

```
[ PageHeader: HD-2026-0142 ]   [ Gia hạn | In | Kết thúc HĐ ]

[ grid-2-1 ]
  ┌── Left (2fr) ──────────────────────────┐
  │ Card: Thông tin hợp đồng               │
  │   dl: Mã HĐ, Ngày ký, Từ/Đến, Giá,   │
  │       Cọc, Ngày thanh toán, Trạng thái │
  │                                         │
  │ Card: Lịch sử thanh toán (table)        │
  └────────────────────────────────────────┘
  ┌── Right (1fr) ─────────────────────────┐
  │ Card: Người thuê (person-row + dl)     │
  │ Card: Phòng (dl + link to room detail) │
  └────────────────────────────────────────┘
```

### Contract Info Fields (definition list)

| Label | Value |
|-------|-------|
| Mã hợp đồng | HD-2026-0142 (`.money`) |
| Ngày ký | DD/MM/YYYY |
| Hiệu lực từ | DD/MM/YYYY |
| Đến ngày | DD/MM/YYYY |
| Giá thuê | `<Money>` / tháng |
| Tiền cọc | `<Money>` |
| Ngày thanh toán | Ngày {N} hàng tháng |
| Trạng thái | `<Chip>` |

### Actions in Header

| Button | Variant | Condition | Action |
|--------|---------|-----------|--------|
| Gia hạn | secondary | shown when expiring/overdue | open renewal form |
| In | text | always | print/PDF |
| Kết thúc HĐ | danger | shown when active | confirmation dialog → terminate |

"Kết thúc HĐ" must show a confirmation dialog: "Bạn có chắc muốn kết thúc hợp đồng HD-2026-0142 không? Hành động này không thể hoàn tác."

---

## Contract Create Screen (`contract-create`) — ❌ Missing

**Route**: `/contracts/create` or `/rooms/{roomId}/contracts/create`

### Planned Form Fields

**Section 1 — Thông tin cơ bản**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Phòng | select | Yes | Dropdown of available rooms only |
| Người thuê | select / search | Yes | From tenant directory or add new |
| Ngày bắt đầu | date | Yes | Default: today |
| Thời hạn (tháng) | number | Yes | 6 / 12 / 24 presets + custom |
| Ngày kết thúc | date | Auto | Calculated from start + duration; editable |

**Section 2 — Điều khoản tài chính**

| Field | Type | Required |
|-------|------|----------|
| Giá thuê / tháng | number | Yes |
| Tiền đặt cọc | number | Yes |
| Ngày thanh toán hàng tháng | number (1–28) | Yes |
| Phương thức thanh toán | select | Yes |

**Section 3 — Điều khoản bổ sung (optional)**

Free-text textarea for custom clauses.

### CTA Row

```
[ Lưu nháp — secondary ]  [ Tạo hợp đồng — primary ]
```

"Tạo hợp đồng" → confirmation: "Xác nhận tạo hợp đồng cho {tenant} — Phòng {room}, {months} tháng, {price}/tháng?"
