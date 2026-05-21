# Changelog

All notable changes to the Room Rental Design System are documented here.

Format: `[version] — YYYY-MM-DD`
Types: `Added` | `Changed` | `Deprecated` | `Removed` | `Fixed`

---

## [2.2.0] — 2026-05-21 (Phase 4 patch)

### Added — Phase 4: Component Specs + Repo Hardening

**Atom specs** (`components/specs/atoms/`):
- `button.md` — `Btn` + `IconBtn`: full API, 5 variants with token refs, size/state/layout/a11y rules, MudBlazor examples
- `form-controls.md` — `Field` + `Checkbox`: API, anatomy ASCII, token reference, validation state rules, MudBlazor examples
- `data-display.md` — `Chip` (7 statuses with all token colors), `Avatar` (initials algorithm, sizes), `Card`, `Icon`, `Alert`, `DividerOr`, `formatVND` / `Money` / `DateVN` / `Phone`

**Auth-server screen specs** (`components/specs/auth-server/`):
- `login.md` — Login screen: AuthShell tokens, fields with `autoComplete`, SSO block (DividerOr + stacked/inline layouts), tweaks panel, a11y
- `register.md` — Register screen: 5 fields with types + validation rules + error messages, terms checkbox, disabled CTA behavior
- `forgot-password.md` — Forgot password (✅ done) + Reset password (❌ Missing): token validation, expired-token error, success state
- `oauth-consent.md` — Consent screen: logo-pair header, app avatar, scope list, revocation notice, action buttons, security notes

**Manager-portal screen specs** (`components/specs/manager-portal/`):
- `app-shell.md` — AppBar, Drawer, AppShell, PageHeader: CSS Grid structure, nav active states, group labels, MudBlazor layout example
- `dashboard.md` — KPI grid (4 cards), CSS conic-gradient donut chart spec, expiring contracts card, activity row pattern
- `rooms.md` — Rooms list (toolbar + filter chips + table), Room detail (grid-2-1, photo tile, tenant card), Room create (❌ Missing — planned fields)
- `tenants.md` — Tenants list with person-row pattern, balance highlight, Tenant detail (❌ Missing — planned layout)
- `contracts.md` — Contracts list, Contract detail (❌ Missing — Kết thúc HĐ danger action + dialog), Contract create (❌ Missing — 3-section form)
- `payments.md` — Payments list (month navigator + summary + table), Invoices placeholder, Reports (❌ Missing — 4 planned sections + export)
- `missing-screens.md` — Forward specs for: Notifications, Settings (5 sections), Maintenance list, plus all 4 missing auth-server screens

### Fixed — Phase 4 Gap Analysis

- **`shared/atoms.css`** — added `@media (prefers-reduced-motion: reduce)` block (was documented in `guidelines/motion.md` but not implemented)
- **`manager-portal/styles.css`** — toolbar `.search:focus-within` focus ring corrected from navy-tinted `rgba(18,65,112,.18)` to green-tinted `rgba(103,192,144,.25)` (matches v2.0.0 primary green role)
- **`specs/manager-portal/app-shell.md`** — moved from incorrect location `specs/atoms/app-shell.md` (AppShell/AppBar/Drawer are portal-specific layout, not shared atoms)
- **`docs/app-ownership.md`** — Token Version Alignment table updated from v2.0.0 → v2.2.0
- **`.claude/agents/design-sync.md`** — fully rewritten: removed stale references to deleted `colors_and_type.css`, updated prototype load order to Phase 2 pattern, replaced 5 resolved "known issues" with accurate backlog, updated audit workflow to reflect 6 checks
- **`README.md`** — fully rewritten: current repo structure (shared/atoms, all guidelines, docs/decisions), platform integration examples (Blazor/web/React Native), token naming table, color roles table with WCAG warning, all 5 apps with prototype/spec status, versioning rules, contributing guide

> Phase 4 adds no new tokens — version remains **2.2.0**.

---

## [2.2.0] — 2026-05-21

### Added — Phase 3: Guidelines + Docs

- **`guidelines/color.md`** — full color role guide: brand palette, semantic roles, WCAG contrast table, usage rules, MudBlazor + prototype CSS usage examples.
- **`guidelines/layout.md`** — layout guide: two canonical page templates (Auth Card + Portal Shell), spacing system (4px grid), grid patterns (`.grid-4`, `.grid-3`, `.grid-2-1`), border radius, elevation, z-index, breakpoints, PageHeader and Card patterns.
- **`guidelines/motion.md`** — motion guide: duration and easing token usage, per-component animation patterns, `prefers-reduced-motion` requirement, anti-patterns.
- **`docs/decisions/`** — Architecture Decision Records:
  - ADR-001: W3C Design Tokens format choice
  - ADR-002: Vietnamese UI / English code language split
  - ADR-003: Babel standalone prototype approach
  - ADR-004: MudBlazor 9.x component library
  - ADR-005: Color palette selection and v2.0.0 role rotation rationale
- **Motion tokens** in `tokens.json`:
  - `motion.duration.*` — `instant` (0ms), `fast` (100ms), `normal` (150ms), `slow` (200ms), `deliberate` (300ms)
  - `motion.easing.*` — `standard`, `decelerate`, `accelerate`, `sharp` (Material Design 3 easing curves)
  - Prototype CSS vars: `--duration-*`, `--easing-*` (added to `PROTOTYPE_ALIAS` + generated `base.css`)

### Changed
- `scripts/generate-tokens.js` — extended `PROTOTYPE_ALIAS` and `groups` array to include motion tokens.
- Version bumped `2.1.0 → 2.2.0` in `tokens.json` (additive: motion tokens added).

---

## [2.1.0] — 2026-05-21

### Added
- **`components/prototypes/shared/atoms.jsx`** — unified UI primitives for all prototype apps:
  `Logo`, `Icon`, `Btn` (unified API), `IconBtn`, `Field`, `Checkbox`, `Alert`, `DividerOr`,
  `Chip`, `Avatar`, `Card`, `formatVND`, `Money`, `DateVN`, `Phone`.
  All published to `window` for Babel multi-file scope.
- **`components/prototypes/shared/atoms.css`** — shared component styles extracted from both
  app stylesheets: `.btn` (all variants + `.sm`, `.full`, `.danger`, `:disabled`, `:focus-visible`),
  `.icon-btn`, `.field`, `.checkbox`, `.divider-or`, `.alert`, `.chip` (7 status variants),
  `.avatar`, `.card`.
- Audit check **⑤ Shared Atoms Integrity** — verifies shared files exist and detects any atom
  selector re-declared in an app's own stylesheet.

### Changed
- `auth-server/index.html`, `manager-portal/index.html` — load `shared/atoms.css` +
  `shared/atoms.jsx` before app-specific files.
- `auth-server/App.jsx` — removed `Logo`, `Field`, `Btn`, `Checkbox`, `Alert`, `DividerOr`
  (now consumed from `shared/atoms.jsx` via `window`).
- `auth-server/styles.css` — removed `.btn`, `.field`, `.checkbox`, `.divider-or`, `.alert`
  (now in `shared/atoms.css`). Fixed field focus ring from navy-tinted to green-tinted (`rgba(103,192,144,.25)`) for v2.0.0 token roles.
- `manager-portal/atoms.jsx` — removed `formatVND`, `Money`, `DateVN`, `Phone`, `Icon`, `Btn`,
  `IconBtn`, `Chip`, `Card`, `Avatar` (now consumed from `shared/atoms.jsx` via `window`).
  Retains portal-specific: `Kpi`, `PageHeader`, `FilterChip`.
- `manager-portal/styles.css` — removed `.btn`, `.icon-btn`, `.chip`, `.card`, `.avatar`
  (now in `shared/atoms.css`).
- **`Btn` component** — unified API: `{ variant, full, size, children, onClick, type, disabled, icon }`.
  `icon` prop renders via `<Icon name={icon} />` (Material Symbols). `size="sm"` sets compact padding.

---

## [2.0.0] — 2026-05-21  ⚠️ BREAKING

### Breaking changes
- **Color role rotation** — green, navy, and teal have swapped semantic roles:
  | Token | v1.x value | v2.0 value |
  |-------|-----------|------------|
  | `color.primary.DEFAULT` | `#124170` Navy | `#67C090` **Green** |
  | `color.secondary.DEFAULT` | `#26667F` Teal | `#124170` **Navy** |
  | `color.tertiary.DEFAULT` | `#67C090` Green | `#26667F` **Teal** |
  - All consumers of `color.primary.*`, `color.secondary.*`, `color.tertiary.*` tokens must test rendering after upgrade.
  - Blazor: `RoomRentalTheme.Create()` — `Primary` button is now green; appbar/drawer stays navy via `Secondary`.
- **Blazor appbar/drawer** now uses `color.secondary.DEFAULT` (navy) instead of `color.primary.DEFAULT`. The generated C# theme `DrawerBackground` and `AppbarBackground` have been corrected.

### Added
- `color.secondary.on-dim` — `rgba(255,255,255,0.72)` — dimmed white for secondary text on navy chrome
- `color.divider.strong` — `rgba(18,65,112,0.24)` — stronger divider for field borders and card outlines
- `typography.font-family.display` — `'Inter Tight', 'Inter', …` — brand display face token
- `typography.font-family.icon` — `'Material Symbols Outlined'` — icon font token
- `typography.font-weight.semibold` — `600` — between medium and bold
- **`generated/prototype/base.css`** — new generated output with simplified CSS variable names for prototype development. Replaces the manually-maintained `colors_and_type.css`.

### Changed
- `generate-tokens.js` now outputs `generated/prototype/base.css` (simplified names: `--color-primary`, `--sp-4`, `--radius-md`, …).
- Prototype `index.html` files updated to import `generated/prototype/base.css` instead of `colors_and_type.css`.

### Removed
- `components/prototypes/colors_and_type.css` — **deleted**. Was manually maintained and caused version drift. Replaced by the generated `generated/prototype/base.css`.

### Fixed
- Blazor theme generator: `Button.FontWeight` updated to use `typography.font-weight.semibold` (was `medium`).
- `DividerLight` in Blazor theme now maps to `color.divider.strong` (was a hardcoded literal).

---

## [1.2.0] — 2026-05-20

### Changed
- **Font family**: Roboto → **Inter** (primary), JetBrains Mono (monospace)
- **Body1** (normal): 16px → **14px** (0.875rem)
- **Body2** (small): 14px → **12px** (0.75rem)
- Subtitle1/Subtitle2 scaled down proportionally (14px / 12px)
- H1 adjusted: 34px → 32px for tighter visual hierarchy with 14px base
- Overline: 12px → 11px (0.6875rem) to distinguish from Caption

---

## [1.1.0] — 2026-05-20

### Changed
- **Full palette replaced** with ColorHunt #ddf4e767c09026667f124170:
  - `#DDF4E7` Mint — page background (light) / primary text & accent (dark)
  - `#67C090` Seafoam Green — tertiary, success, primary in dark mode
  - `#26667F` Ocean Teal — secondary, info
  - `#124170` Deep Navy — primary, appbar/drawer, card surface in dark mode
- Dark theme fully redesigned — all 4 palette colors have explicit dark-mode roles
- Text colors shifted to navy-tinted (`#0F1E2D`) for brand coherence in light theme
- Divider colors now navy-tinted (light) and mint-tinted (dark)
- All WCAG AA contrast ratios verified for new palette

---

## [1.0.0] — 2026-05-20

### Added
- Initial design token set (`tokens/tokens.json`):
  - Color: primary (blue), secondary (amber), tertiary (teal), semantic, surface, text, divider, dark mode
  - Typography: font family, size scale (H1–Overline), weight, line-height
  - Spacing: 4px base grid (1–16 steps)
  - Border radius: xs → full
  - Border width: thin, medium
  - Elevation: 0, 1, 2, 4, 8, 16
  - Breakpoints: xs, sm, md, lg, xl
  - Z-index: drawer, appbar, modal, snackbar, tooltip
- Token generator (`scripts/generate-tokens.js`) — produces CSS, Blazor theme, mobile JSON
- Generated outputs:
  - `generated/web/tokens.css` — CSS custom properties
  - `generated/blazor/RoomRentalTheme.cs` — MudBlazor 9.4.x theme
  - `generated/mobile/tokens.json` — flat camelCase tokens
- Guidelines: typography, iconography, writing style
- `README.md` — integration instructions for all stacks
- `CLAUDE.md` — context for AI agents working in this repo
