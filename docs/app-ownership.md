# Design System — Application Ownership Manifest

> **Authority**: This file is the single source of truth for which screens, components,
> and assets belong to which application.
> Update this file whenever a new screen or app is added.
> Referenced by the `design-sync` agent.

---

## Application Registry

| ID | Name | Stack | Status | Prototype folder | Spec folder |
|----|------|-------|--------|-----------------|-------------|
| `auth-server` | HouseLeaf AuthServer.UI | Blazor WASM + MudBlazor 9 | ✅ Active | `components/prototypes/auth-server/` | `components/specs/auth-server/` |
| `manager-portal` | HouseLeaf Manager Portal | Blazor WASM + MudBlazor 9 | ✅ Active | `components/prototypes/manager-portal/` | `components/specs/manager-portal/` |
| `tenant-portal` | HouseLeaf Tenant Portal | TBD (web) | 🔮 Planned | `components/prototypes/tenant-portal/` | `components/specs/tenant-portal/` |
| `admin-panel` | HouseLeaf Admin Panel | TBD | 🔮 Planned | `components/prototypes/admin-panel/` | `components/specs/admin-panel/` |
| `mobile` | HouseLeaf Mobile | React Native / Flutter | 🔮 Planned | `components/prototypes/mobile/` | `components/specs/mobile/` |

---

## Screen Ownership

### `auth-server` — Authentication & Identity

| Screen ID | Display name (VI) | File / component | Status |
|-----------|-------------------|-----------------|--------|
| `login` | Đăng nhập | `auth-server/App.jsx` → `LoginScreen` | ✅ Prototype done |
| `register` | Đăng ký tài khoản | `auth-server/App.jsx` → `RegisterScreen` | ✅ Prototype done |
| `forgot-password` | Quên mật khẩu | `auth-server/App.jsx` → `ForgotScreen` | ✅ Prototype done |
| `reset-password` | Đặt lại mật khẩu | — | ❌ Missing |
| `verify-email` | Xác thực email | — | ❌ Missing |
| `oauth-consent` | Ủy quyền OAuth | `auth-server/App.jsx` → `ConsentScreen` | ✅ Prototype done |
| `account-locked` | Tài khoản bị khóa | — | ❌ Missing |
| `change-password` | Đổi mật khẩu | — | ❌ Missing |

**Rule**: Any screen whose primary purpose is authentication, authorization, or identity
management belongs in `auth-server`, regardless of which app the user came from.

---

### `manager-portal` — Property Manager Workspace

| Screen ID | Display name (VI) | File / component | Status |
|-----------|-------------------|-----------------|--------|
| `dashboard` | Tổng quan | `manager-portal/screens.jsx` → `DashboardScreen` | ✅ Prototype done |
| `rooms-list` | Danh sách phòng | `manager-portal/screens.jsx` → `RoomsScreen` | ✅ Prototype done |
| `room-detail` | Chi tiết phòng | `manager-portal/screens.jsx` → `RoomDetailScreen` | ✅ Prototype done |
| `room-create` | Thêm phòng mới | — | ❌ Missing |
| `tenants-list` | Danh sách khách thuê | `manager-portal/screens.jsx` → `TenantsScreen` | ✅ Prototype done |
| `tenant-detail` | Chi tiết khách thuê | — | ❌ Missing |
| `contracts-list` | Hợp đồng | `manager-portal/screens.jsx` → `ContractsScreen` | ✅ Prototype done |
| `contract-detail` | Chi tiết hợp đồng | — | ❌ Missing |
| `contract-create` | Tạo hợp đồng | — | ❌ Missing |
| `payments-list` | Thu chi | `manager-portal/screens.jsx` → `PaymentsScreen` | ✅ Prototype done |
| `invoices-list` | Hóa đơn | `manager-portal/App.jsx` → `PlaceholderScreen` | ⚠️ Placeholder |
| `maintenance-list` | Bảo trì | `manager-portal/App.jsx` → `PlaceholderScreen` | ⚠️ Placeholder |
| `settings` | Cài đặt | `manager-portal/App.jsx` → `PlaceholderScreen` | ⚠️ Placeholder |
| `notifications` | Thông báo | — | ❌ Missing |
| `reports` | Báo cáo / Thống kê | — | ❌ Missing |

**Rule**: Any screen operated by the **landlord/property manager** belongs here.
Tenants do not log into this portal.

---

### `tenant-portal` — Tenant Self-Service *(Planned)*

| Screen ID | Display name (VI) | Status |
|-----------|-------------------|--------|
| `my-room` | Phòng của tôi | ❌ Not started |
| `my-contract` | Hợp đồng của tôi | ❌ Not started |
| `payment-history` | Lịch sử thanh toán | ❌ Not started |
| `maintenance-request` | Yêu cầu sửa chữa | ❌ Not started |
| `profile` | Hồ sơ cá nhân | ❌ Not started |

---

## Shared / Design System Assets

These assets do **not** belong to a single app — they are owned by the design system itself.

| Asset | Path | Notes |
|-------|------|-------|
| Design tokens | `tokens/tokens.json` | Source of truth — edit only here |
| Shared atoms JSX | `components/prototypes/shared/atoms.jsx` | Unified UI primitives for all prototypes |
| Shared atoms CSS | `components/prototypes/shared/atoms.css` | Shared component styles for all prototypes |
| Brand fonts | `components/prototypes/fonts/` | Inter Tight family (self-hosted) |
| Logo mark | `components/prototypes/assets/logo-mark.png` | Used in all apps |
| Favicon | `components/prototypes/assets/favicon.png` | Used in all prototypes |
| Generated token CSS | `generated/prototype/base.css` | Auto-generated — never edit |
| Generated web CSS | `generated/web/tokens.css` | Auto-generated — never edit |
| Generated C# theme | `generated/blazor/RoomRentalTheme.cs` | Auto-generated — never edit |
| Generated mobile JSON | `generated/mobile/tokens.json` | Auto-generated — never edit |

---

## Component Ownership

Atoms (field, button, checkbox, alert, divider) are **shared** — they live in
`components/specs/atoms/` and `components/prototypes/shared/atoms.jsx`.
App-specific compositions (AuthShell, AppShell/chrome) live in their app's folder.

| Component | Category | Location | Status |
|-----------|----------|----------|--------|
| `Logo` | Brand / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Icon` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Btn` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 (unified API) |
| `IconBtn` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Field` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Checkbox` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Alert` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `DividerOr` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Chip` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Avatar` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Card` | Atom / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `Money`, `DateVN`, `Phone`, `formatVND` | Formatter / Shared | `shared/atoms.jsx` | ✅ Phase 2 |
| `AuthShell` | Layout / auth-server | `auth-server/App.jsx` | ✅ Correct location |
| `SsoButton`, `SsoBlock` | Feature / auth-server | `auth-server/App.jsx` | ✅ Correct location |
| `AppShell` | Layout / manager-portal | `manager-portal/chrome.jsx` | ✅ Correct location |
| `Kpi` | Portal-specific | `manager-portal/atoms.jsx` | ✅ Correct location |
| `PageHeader` | Portal-specific | `manager-portal/atoms.jsx` | ✅ Correct location |
| `FilterChip` | Portal-specific | `manager-portal/atoms.jsx` | ✅ Correct location |

---

## Token Version Alignment

Track alignment between the canonical token source and each consumer:

| File | Declared version | Primary color | Alignment |
|------|-----------------|---------------|-----------|
| `tokens/tokens.json` | **2.2.0** | `#67C090` Green | ← source |
| `generated/prototype/base.css` | 2.2.0 | `#67C090` Green | ✅ Generated — always in sync |
| `generated/web/tokens.css` | 2.2.0 | `#67C090` Green | ✅ Generated — always in sync |
| `generated/blazor/RoomRentalTheme.cs` | 2.2.0 | `#67C090` Green | ✅ Generated — always in sync |
| `generated/mobile/tokens.json` | 2.2.0 | `#67C090` Green | ✅ Generated — always in sync |

> **Phase 1 complete (2026-05-21)**: `colors_and_type.css` (manually maintained, v1.3.0)
> has been deleted. All prototype CSS is now generated from `tokens.json` via
> `node scripts/generate-tokens.js`. Drift is structurally impossible.
>
> **Phase 2 complete (2026-05-21)**: All reusable UI atoms (`Btn`, `Field`, `Checkbox`,
> `Alert`, `DividerOr`, `Chip`, `Avatar`, `Card`, `Icon`, `IconBtn`, `Logo`, formatters)
> now live exclusively in `shared/atoms.jsx` + `shared/atoms.css`.
> Both prototype apps load shared files before their own JSX.
> The `Btn` component has a unified API merging both previous definitions.
> Audit check ⑤ (Shared Atoms Integrity) enforces no duplication.
