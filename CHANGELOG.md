# Changelog

All notable changes to the Room Rental Design System are documented here.

Format: `[version] — YYYY-MM-DD`
Types: `Added` | `Changed` | `Deprecated` | `Removed` | `Fixed`

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
