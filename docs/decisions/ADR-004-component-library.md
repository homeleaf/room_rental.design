# ADR-004 — Component Library: MudBlazor 9.x for Blazor Apps

| | |
|---|---|
| **Date** | 2026-05-20 |
| **Status** | Accepted |
| **Deciders** | Engineering lead, design system lead |

---

## Context

The production apps (`room_rental.auth` — Blazor WASM) need a component library that provides:
- Form controls (text field, select, date picker, checkbox)
- Data tables with sorting/filtering
- Navigation (appbar, drawer, nav items)
- Feedback (snackbar, dialog, alert)
- Theming via design tokens

The stack is **Blazor WASM** with .NET 8/9. All apps are compiled to WebAssembly; there is no server-side rendering.

---

## Decision

Use **MudBlazor 9.x** as the sole component library for all Blazor WASM apps.

The design system generates a `RoomRentalTheme.cs` file (`generated/blazor/RoomRentalTheme.cs`) that instantiates a `MudTheme` with all design token values baked in. Apps consume it in `Program.cs`:

```csharp
builder.Services.AddMudServices(c => c.Theme = RoomRentalTheme.Create());
```

All app-level components then use standard MudBlazor components — no custom wrappers needed for common controls.

---

## Why MudBlazor 9.x (not 6.x / 7.x)

MudBlazor 9 introduced:
- Complete Material Design 3 palette (Primary, Secondary, Tertiary, …)
- `DrawerBackground` + `AppbarBackground` palette properties (needed to set navy chrome independently from primary green)
- Improved `Button.FontWeight` theming
- Better dark mode palette support

Without v9's three-color palette (Primary / Secondary / Tertiary), the v2.0.0 token role rotation (green = primary, navy = secondary) would not be expressible in the theme.

---

## Alternatives Considered

| Alternative | Rejected because |
|---|---|
| **Radzen Blazor** | Weaker theming system; fewer community resources |
| **Blazorise** | Requires external CSS framework (Bootstrap/Tailwind); adds a layer of abstraction |
| **Ant Design Blazor** | Primarily an Enterprise-China flavor; less suited to Vietnamese SMB product |
| **Custom component library** | Engineering cost is too high for a small team |
| **React (instead of Blazor)** | The existing auth server is Blazor WASM — not switching platforms |

---

## Token Mapping

The token generator maps design tokens to MudBlazor `PaletteLight` properties:

| Token | MudBlazor property |
|---|---|
| `color.primary.DEFAULT` | `Primary` |
| `color.secondary.DEFAULT` | `Secondary`, `DrawerBackground`, `AppbarBackground` |
| `color.tertiary.DEFAULT` | `Tertiary` |
| `color.semantic.error` | `Error` |
| `color.semantic.warning` | `Warning` |
| `color.surface.background` | `Background` |
| `color.surface.surface` | `Surface` |
| `typography.font-weight.semibold` | `Button.FontWeight` |

Motion tokens (`motion.duration.*`, `motion.easing.*`) have **no direct Blazor theme equivalent** — they are applied as CSS custom properties in `wwwroot/app.css` if needed.

---

## Consequences

**Good**:
- Large, active open-source community; good documentation
- v9 palette system aligns well with our 3-role color architecture
- Theme is fully generated — no manual theme maintenance
- Dark mode supported via `PaletteDark`

**Accepted trade-offs**:
- MudBlazor major version upgrades may require regenerating the C# theme template
- Some MudBlazor component behaviors (transition durations, animation styles) are not exposed as theme properties
- WebAssembly bundle size is large (~2MB baseline) — not a concern for landlord portal, acceptable for tenant portal

---

## Related

- `generated/blazor/RoomRentalTheme.cs` — the generated theme (never edit manually)
- `tokens/tokens.json` — source of all palette values
- `scripts/generate-tokens.js` → `generateCSharp()` function
