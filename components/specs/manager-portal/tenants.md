# Spec — Tenants List + Tenant Detail

**App**: `manager-portal`
**Components**: `TenantsScreen` in `manager-portal/screens.jsx`
**Status**:
  - Tenants list: ✅ Prototype done
  - Tenant detail: ❌ Missing

---

## Tenants List Screen (`tenants`)

### Purpose

Directory of all tenants — current and historical. Searchable by name, phone, or room. Filterable by status and outstanding balance.

### Layout

```
[ PageHeader: Người thuê ]   [ Thêm người thuê ]

[ Toolbar ]
  [ Search ]  [ Tất cả | Đang thuê | Còn nợ ]

[ Table: .tbl ]
```

### Table Columns

| Column | Notes |
|--------|-------|
| Người thuê | `<Avatar size={32} color="primary">` + name (person-row pattern) |
| Phòng | "Phòng {code}" |
| Số điện thoại | `.num` (JetBrains Mono) |
| Bắt đầu thuê | `.num` (DD/MM/YYYY) |
| Công nợ | `<Money>` in `--color-error` / bold if > 0; "—" in `--fg-2` if zero |
| Trạng thái | `<Chip>` |
| Actions | View / Phone / More |

### Action Icons

| Icon | `title` | Action |
|------|---------|--------|
| `visibility` | Xem | Tenant detail (planned) |
| `phone` | Gọi | Initiate call (`tel:` link in production) |
| `more_vert` | Thêm | Overflow menu |

### Mock Data

7 tenants: Nguyễn Văn An (101), Trần Thị Mai (103), Lê Quốc Bảo (201 — expiring), Phạm Hồng Hạnh (202), Đỗ Minh Quân (204), Hoàng Anh Tuấn (301 — overdue, 3.500.000đ balance), Vũ Thị Lan (302).

### Balance Highlight

If `balance > 0`: render `<Money value={balance}/>` wrapped in `<span style={{ color: "var(--color-error)", fontWeight: 600 }}>`.

---

## Tenant Detail Screen (`tenant-detail`) — ❌ Missing

**Route**: `/tenants/{tenantId}`

### Planned Layout

```
[ PageHeader: Nguyễn Văn An ]   [ Sửa thông tin ]

[ grid-2-1 ]
  ┌── Left (2fr) ───────────────────────────┐
  │ Card: Thông tin cá nhân                 │
  │   Avatar (56px) + name + status chip    │
  │   dl: CMND, Ngày sinh, Địa chỉ, Phone  │
  │                                         │
  │ Card: Lịch sử hợp đồng (table)         │
  └─────────────────────────────────────────┘
  ┌── Right (1fr) ──────────────────────────┐
  │ Card: Phòng hiện tại                    │
  │   → link to room detail                 │
  │ Card: Công nợ / Thanh toán              │
  └─────────────────────────────────────────┘
```

### Required Fields (Personal Info)

| Field | Label |
|-------|-------|
| Full name | Họ và tên |
| CMND / CCCD | Số CMND/CCCD |
| Date of birth | Ngày sinh |
| Permanent address | Địa chỉ thường trú |
| Phone | Số điện thoại |
| Email | Email (optional) |
| Emergency contact | Liên hệ khẩn cấp (name + phone) |

### Contract History Table

Columns: Mã HĐ / Phòng / Từ ngày / Đến ngày / Giá thuê / Trạng thái. Sorted newest-first.
