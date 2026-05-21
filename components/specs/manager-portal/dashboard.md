# Spec — Dashboard Screen (`dashboard`)

**App**: `manager-portal`
**Component**: `DashboardScreen` in `manager-portal/screens.jsx`
**Status**: ✅ Prototype done
**Route**: `/dashboard` (default after login)

---

## Purpose

At-a-glance overview of the property portfolio: revenue, occupancy, expiring contracts, and outstanding receivables. Entry point for the most common daily workflows.

---

## Layout

```
[ PageHeader: Tổng quan ]  [ Thêm phòng button ]

[ KPI row — grid-4 ]

[ grid-2-1 ]
  [ Card: Tình trạng phòng  ]   [ Card: Sắp đến hạn ]

[ Card: Hoạt động gần đây — full width ]
```

---

## KPI Row

4 KPI cards side by side (`grid-4`, `gap: var(--sp-4)`).

| KPI | Icon | Value (mock) | Delta |
|-----|------|-------------|-------|
| Doanh thu tháng 5 | `payments` | 28.400.000đ | +12,4% so với tháng 4 ↑ |
| Tỷ lệ lấp đầy | `trending_up` | 70% (7/10) | +3 phòng ↑ |
| Hợp đồng sắp hết hạn | `event_busy` | 2 | trong 30 ngày ↓ |
| Khoản phải thu | `error` | 3.500.000đ | 1 phòng quá hạn ↓ |

### KPI Card spec

```
Label (11px / uppercase / 0.08em / --fg-2)
[ icon right-aligned ]

Value (26px / 600 / JetBrains Mono / --color-primary)

↑ Delta (12px / flex row / icon + text)
  deltaDir="up"   → color: #1B5E3F (green)
  deltaDir="down" → color: --color-error (red)
```

Background: `--color-surface`, radius: `--radius-lg`, shadow: `--elev-1`, padding: `16px 18px`.

---

## Room Status Card

Left panel of `grid-2-1`.

### Donut chart (CSS conic-gradient)

```
.pie {
  width: 140px; height: 140px;
  background: conic-gradient(
    #67C090 0 {rented%},                ← Đã thuê (green)
    #DDF4E7 {rented%} {rented+avail%},  ← Còn trống (mint)
    #E65100 {rented+avail%} 100%        ← Đang sửa chữa (orange)
  );
  border-radius: 50%;
}
.pie::after { /* donut hole */ inset: 18px; background: --color-surface; }
```

The `--rented` and `--avail` CSS custom properties are set inline on the element.

### Legend

Right of chart, flex column, `gap: 8px`. Each row: `display: flex; justify-content: space-between`.

| Swatch | Label | Count |
|--------|-------|-------|
| `#67C090` | Đã thuê | 7 |
| `#DDF4E7` + border | Còn trống | 2 |
| `#E65100` | Đang sửa chữa | 1 |
| — (divider) | Tổng số phòng | **10** (bold) |

---

## Expiring Contracts Card

Right panel of `grid-2-1`. Shows top 3 contracts by urgency.

Each row: `display: flex; justify-content: space-between; align-items: center`

```
[ name / room ]    [ Chip status ]
  caption: date
```

Shows `overdue` first, then `expiring` sorted by days remaining.

---

## Recent Activity Card

Full-width below. Shows last 4 events.

### Activity Row

```
[ ico circle ]  title (13px / --fg-1)
                meta  (11px / --fg-2)  ← room · timestamp
```

Icon circle: `32×32px`, `border-radius: 50%`, background: `--color-primary-container`, icon color: `--color-primary-on-container`.

Separated by `border-bottom: 1px dashed var(--divider)`.

### Event types (mock)

| Icon | Description |
|------|-------------|
| `payments` | Payment received |
| `description` | Contract created |
| `build` | Maintenance request opened |
| `person_add` | New tenant added |

---

## Empty States

When no data: KPIs show "—", activity list shows "Chưa có hoạt động nào." (centered, `--fg-2`).

---

## Navigation from Dashboard

"Thêm phòng" button → navigates to room-create screen (planned).
Clicking any expiring-contract row → contract detail (planned).
