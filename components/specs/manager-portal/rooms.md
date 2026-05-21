# Spec — Rooms List + Room Detail

**App**: `manager-portal`
**Components**: `RoomsScreen`, `RoomDetailScreen` in `manager-portal/screens.jsx`
**Status**:
  - Rooms list: ✅ Prototype done
  - Room detail: ✅ Prototype done
  - Room create: ❌ Missing

---

## Rooms List Screen (`rooms`)

### Purpose

Master list of all rooms with filterable status, searchable by code or tenant name. Entry to room detail and room creation.

### Layout

```
[ PageHeader: Quản lý phòng ]   [ Thêm phòng ]

[ Toolbar ]
  [ Search input (flex-grow) ]
  [ FilterChip: Tất cả / Đã thuê / Còn trống / Sắp hết hạn / Quá hạn ]
  [ Lọc nâng cao | Xuất CSV ]

[ Table: .tbl ]
```

### Toolbar

Search input (`flex: 1`, `max-width: 360px`):
- Background: `--color-surface`, border: `1px solid --divider`
- Icon: `search`, 20px, `--fg-2`
- Focus: `border-color: --color-primary`, `box-shadow: 0 0 0 2px rgba(18,65,112,.18)` *(planned: update to green-tinted)*

FilterChips: single-select. Active chip: `--color-primary-container` bg, `--color-primary-on-container` text.

Advanced filter button: `.btn.secondary.sm` with `filter_list` icon.
Export button: `.btn.text.sm` with `file_download` icon.

### Table Columns

| Column | Width | Notes |
|--------|-------|-------|
| Mã phòng | 96px | Bold, `--color-primary` |
| Tầng / Diện tích | auto | "Tầng 1 · 25m²" |
| Người thuê | auto | "—" if vacant |
| Hết hạn HĐ | auto | `.num` (JetBrains Mono) |
| Giá thuê | auto | `<Money>` — tabular nums |
| Trạng thái | auto | `<Chip>` |
| Hành động | auto | `.actions` (right-aligned): View / Edit / More |

Row click → Room 101 navigates to `room` detail. Other rows: no-op in prototype.

### Action Icons (per row)

| Icon | `title` | Action |
|------|---------|--------|
| `visibility` | Xem | View room detail |
| `edit` | Sửa | Edit room (planned) |
| `more_vert` | Thêm | Overflow menu (planned) |

### Status Filter Behaviour

Filter state is local (`useState`). `filter === "all"` shows all rooms. Other values match `room.status` exactly. Count shown in tab only on production (not in prototype).

---

## Room Detail Screen (`room`)

### Purpose

Full profile of a single room: photo, tenant info, contract summary, utility readings for current month, payment history.

### Layout

```
[ PageHeader: Phòng 101 ]   [ Sửa | Tạo hóa đơn ]

[ grid-2-1 ]
  ┌── Left (2fr) ──────────────────────────┐
  │ Photo tile (placeholder)               │
  │ Card: Người thuê hiện tại              │
  │ Card: Lịch sử thanh toán               │
  └────────────────────────────────────────┘
  ┌── Right (1fr) ─────────────────────────┐
  │ Card: Thông tin phòng                  │
  │ Card: Đồng hồ tháng này               │
  └────────────────────────────────────────┘
```

### Photo Tile

Placeholder (`220px` height):
- Background: `linear-gradient(135deg, #C8EDD9 0%, #DDF4E7 100%)`
- Icon: `bedroom_parent`, `64px`, `opacity: .35`, `--color-primary`
- Caption: "Ảnh phòng (kéo & thả để tải lên)" — `11px`, bottom-left pill

Production: image carousel with upload.

### Tenant Card

Person row layout:

```
[ Avatar 44px ]  Name (14px / 500)
                 CMND · phone
                 [ Chip: Đang thuê ]

Definition list:
  Mã hợp đồng: HD-2026-0142
  Thời hạn:    01/01/2026 — 30/06/2026
  Tiền cọc:    5.000.000đ
  Tiền thuê:   2.500.000đ / tháng
```

### Payment History Card

Embedded table (no shadow: `box-shadow: none`). Columns: Kỳ / Ngày trả / Số tiền / Trạng thái.

### Room Info Card (right)

Definition list: Tầng, Diện tích, Hướng, Tiện nghi, Ghi chú.

### Utility Card (right)

Definition list: Điện (amount + kWh), Nước (amount + m³), Internet, Vệ sinh.
Divider + bold total row at bottom: `display: flex; justify-content: space-between`.

### Definition List (`.dl`) Spec

```css
.dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 18px;
  font-size: 13px;
}
dt { color: var(--fg-2); }
dd { margin: 0; color: var(--fg-1); }
```

---

## Room Create Screen (`room-create`) — ❌ Missing

**Route**: `/rooms/create`

Planned fields: Mã phòng, Tầng, Diện tích (m²), Hướng, Giá thuê, Tiện nghi (multi-select chips), Ghi chú, Photo upload.

CTA: "Tạo phòng" → redirects to room detail on success.
