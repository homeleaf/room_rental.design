# Spec — Payments, Invoices, Reports

**App**: `manager-portal`
**Status**:
  - Payments list: ✅ Prototype done
  - Invoices: ⚠️ Placeholder
  - Reports: ❌ Missing

---

## Payments List Screen (`payments-list`)

**Component**: `PaymentsScreen` in `manager-portal/screens.jsx`

### Purpose

Transaction ledger — records of money collected and expenses incurred. Supports month filtering and transaction creation.

### Layout

```
[ PageHeader: Thu chi ]   [ Ghi thu | Ghi chi ]

[ Toolbar ]
  [ ← Tháng 5/2026 → (month navigator) ]
  [ FilterChip: Tất cả | Thu | Chi ]
  [ spacer ]
  [ Xuất báo cáo ]

[ Summary row — grid-3 ]
  [ Card: Tổng thu ]   [ Card: Tổng chi ]   [ Card: Chênh lệch ]

[ Table: .tbl (transaction list) ]
```

### Month Navigator

`← Tháng 5/2026 →` — previous/next month buttons (`IconBtn`) with current month label centered.

### Summary Cards

Three dense cards side by side.

| Card | Color | Value |
|------|-------|-------|
| Tổng thu | `--color-primary` (green) | `<Money>` |
| Tổng chi | `--color-error` (red) | `<Money>` |
| Chênh lệch | depends on sign: green if +, red if − | `<Money>` |

### Transaction Table Columns

| Column | Notes |
|--------|-------|
| Ngày | DD/MM/YYYY — `.num` |
| Mô tả | e.g. "Tiền thuê tháng 5 — Phòng 101" |
| Loại | Chip: `paid` (Thu) / `overdue` (Chi) |
| Số tiền | `<Money>` — green if income, red if expense |
| Phòng / Người liên quan | link to room or tenant |
| Actions | Edit / Delete |

### Mock data (prototype)

7 rows: rent payments from tenants, minus maintenance costs.

### Add Transaction buttons

Two primary actions in PageHeader:
- "Ghi thu" (`payments` icon) — record income
- "Ghi chi" (`remove_circle` icon, `variant="secondary"`) — record expense

---

## Invoices Screen (`invoices-list`) — ⚠️ Placeholder

**Route**: `/invoices`
**Current state**: `PlaceholderScreen` with title "Hóa đơn"

### Planned Purpose

Generate and track monthly utility invoices (điện + nước + internet + phí dịch vụ) per room. Send PDF to tenant via email/Zalo.

### Planned Layout

```
[ PageHeader: Hóa đơn ]   [ Tạo hóa đơn hàng loạt ]

[ Toolbar: month nav + filter by status ]

[ Table ]
  Phòng / Người thuê / Kỳ / Tiền điện / Tiền nước / Tổng / Trạng thái / Actions
```

Invoice statuses: `pending` (chưa gửi) / `sent` (đã gửi) / `paid` (đã thanh toán) / `overdue` (quá hạn).

---

## Reports Screen (`reports`) — ❌ Missing

**Route**: `/reports`

### Planned Purpose

Financial reports and analytics for the property portfolio. Revenue trends, occupancy rates, maintenance cost tracking.

### Planned Sections

**1. Báo cáo doanh thu** (Revenue Report)
- Date range picker (month, quarter, year)
- Line chart: monthly revenue over time
- Table: breakdown by room

**2. Tình trạng phòng** (Occupancy Report)
- Pie chart: available / rented / maintenance %
- Occupancy rate over time (bar chart)

**3. Công nợ** (Outstanding Receivables)
- List of tenants with outstanding balance
- Aging analysis: 0–30 days / 31–60 days / 60+ days

**4. Chi phí bảo trì** (Maintenance Cost)
- Table + total by month
- Breakdown by room

### Export

All reports must support CSV export and PDF download. Print-friendly view (white background, no chrome).
