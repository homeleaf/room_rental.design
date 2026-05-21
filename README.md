# Room Rental — Design System

**v2.2.0** · Single source of truth for UI/UX across all Room Rental applications.

---

## Repository Structure

```
tokens/tokens.json                   ← W3C Design Tokens — the ONLY file humans edit
scripts/
  generate-tokens.js                 ← Multi-target token generator (Node.js, zero deps)
  audit-design.js                    ← Design system health check (6 checks)

generated/                           ← AUTO-GENERATED — never edit manually
  prototype/base.css                 ← Simplified CSS vars for prototypes (--color-primary)
  web/tokens.css                     ← Verbose CSS vars for production web (--color-primary-DEFAULT)
  blazor/RoomRentalTheme.cs          ← MudBlazor 9.x MudTheme
  mobile/tokens.json                 ← Flat camelCase for React Native / Flutter

components/
  prototypes/
    shared/atoms.jsx                 ← Unified UI atoms (Btn, Field, Chip, Avatar…) — all apps
    shared/atoms.css                 ← Shared component styles — all apps
    auth-server/                     ← Login, register, forgot, OAuth screens
    manager-portal/                  ← Landlord workspace (dashboard, rooms, tenants…)
  specs/
    atoms/                           ← Atom component specs (button, form-controls, data-display)
    auth-server/                     ← Auth screen specs (login, register, forgot, consent)
    manager-portal/                  ← Portal screen specs (dashboard, rooms, tenants, contracts…)

guidelines/
  color.md                           ← Color roles, palette, WCAG contrast table
  typography.md                      ← Type scale, font families
  layout.md                          ← Page templates, spacing grid, grid patterns
  motion.md                          ← Duration + easing tokens, animation rules
  iconography.md                     ← Material Symbols usage
  writing-style.md                   ← Vietnamese copy, tone, date/number formats

docs/
  app-ownership.md                   ← Ownership manifest: every screen → which app
  decisions/                         ← Architecture Decision Records (ADR-001 … ADR-005)

.claude/
  agents/design-sync.md             ← Design governance subagent
  commands/do.md                    ← /do slash command for design tasks
```

---

## Quick Start

### Modify design tokens

```bash
# 1. Edit tokens (colors, spacing, motion, etc.)
#    → tokens/tokens.json

# 2. Regenerate all outputs
node scripts/generate-tokens.js

# 3. Verify health
node scripts/audit-design.js

# 4. Commit tokens.json + all generated/ files together
```

### Open a prototype in the browser

```
components/prototypes/auth-server/index.html   ← auth screens
components/prototypes/manager-portal/index.html ← portal screens
```

Open directly in any browser — no server or build step needed.

---

## Integration by Platform

### Blazor WASM (MudBlazor 9.x)

Copy `generated/blazor/RoomRentalTheme.cs` into your project.

**Program.cs**:
```csharp
builder.Services.AddMudServices();
```

**App.razor** or **MainLayout.razor**:
```razor
<MudThemeProvider Theme="@_theme" />
@code {
    private MudTheme _theme = RoomRentalTheme.Create();
}
```

### Web App (React / Angular / Vue)

Import `generated/web/tokens.css` in your global stylesheet:

```css
/* global.css */
@import './tokens.css';   /* verbose names: --color-primary-DEFAULT */

.primary-button {
  background-color: var(--color-primary-DEFAULT);
  color: var(--color-primary-on);
  border-radius: var(--border-radius-md);
}
```

### Mobile (React Native / Flutter)

```js
// React Native
import tokens from './generated/mobile/tokens.json';

const theme = {
  colors: {
    primary:    tokens.colorPrimaryDEFAULT,
    secondary:  tokens.colorSecondaryDEFAULT,
    background: tokens.colorSurfaceBackground,
  },
  spacing: { sm: tokens.spacing2, md: tokens.spacing4, lg: tokens.spacing6 },
};
```

---

## Token Naming Convention

| tokens.json | Production web CSS | Prototype CSS | C# MudBlazor |
|-------------|-------------------|---------------|--------------|
| `color.primary.DEFAULT` | `--color-primary-DEFAULT` | `--color-primary` | `Primary = "..."` |
| `color.secondary.DEFAULT` | `--color-secondary-DEFAULT` | `--color-secondary` | `Secondary = "..."` |
| `spacing.4` | `--spacing-4` | `--sp-4` | `16px` |
| `border.radius.md` | `--border-radius-md` | `--radius-md` | `DefaultBorderRadius` |
| `motion.duration.normal` | `--motion-duration-normal` | `--duration-normal` | (CSS only) |

---

## Color Roles (v2.0.0+)

| Role | Token | Hex | Used for |
|------|-------|-----|---------|
| Primary | `color.primary.DEFAULT` | `#67C090` Green | CTA buttons, links, active states |
| Secondary | `color.secondary.DEFAULT` | `#124170` Navy | Appbar, drawer, secondary CTAs |
| Tertiary | `color.tertiary.DEFAULT` | `#26667F` Teal | Info, accent, pending status |

> ⚠️ White text on `#67C090` fails WCAG AA (2.4:1). Use `color.primary.on` (navy) instead.
> See `guidelines/color.md` for full WCAG contrast table.

---

## Applications

| App | Stack | Prototype | Spec |
|-----|-------|-----------|------|
| AuthServer.UI (`auth-server`) | Blazor WASM + MudBlazor 9 | ✅ `prototypes/auth-server/` | ✅ `specs/auth-server/` |
| Manager Portal (`manager-portal`) | Blazor WASM + MudBlazor 9 | ✅ `prototypes/manager-portal/` | ✅ `specs/manager-portal/` |
| Tenant Portal (`tenant-portal`) | TBD (web) | 🔮 Planned | 🔮 Planned |
| Admin Panel (`admin-panel`) | TBD | 🔮 Planned | 🔮 Planned |
| Mobile (`mobile`) | React Native / Flutter | 🔮 Planned | 🔮 Planned |

---

## Versioning

```
Major (X.0.0) → token renamed, removed, or semantic role changed (breaking)
Minor (x.Y.0) → new token added, prototype or guideline added
Patch (x.y.Z) → value tweaked, typo fixed, documentation update
```

Edit `$metadata.version` in `tokens.json`, run the generator, and add a `CHANGELOG.md` entry.
The audit script (`node scripts/audit-design.js`) verifies all generated files reference the same version.

---

## Contributing

1. Branch from `main`
2. For **token changes**: edit `tokens/tokens.json` only, then run `node scripts/generate-tokens.js`
3. For **prototype changes**: edit files in `components/prototypes/` — never touch `generated/`
4. For **spec changes**: edit or add markdown files in `components/specs/`
5. Run `node scripts/audit-design.js` — fix all errors before opening a PR
6. Add a `CHANGELOG.md` entry
7. After merge, notify all app teams to update their token references

---

## Further Reading

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | AI agent context — token naming, workflow, rules |
| [docs/app-ownership.md](docs/app-ownership.md) | Every screen and component mapped to its owning app |
| [docs/decisions/](docs/decisions/) | Architecture Decision Records (why we made each choice) |
| [guidelines/color.md](guidelines/color.md) | Color roles, WCAG, usage rules |
| [guidelines/layout.md](guidelines/layout.md) | Page templates, spacing system, grid |
| [guidelines/motion.md](guidelines/motion.md) | Animation tokens and rules |
