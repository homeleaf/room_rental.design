# Room Rental — Design System

Single source of truth for UI/UX standards across all applications in the Room Rental Management System.

## What's Here

```
tokens/tokens.json              ← Design tokens (W3C format) — edit here, generate everywhere
generated/web/tokens.css        ← CSS custom properties for all web apps
generated/blazor/RoomRentalTheme.cs  ← MudBlazor 9.x theme for Blazor WASM
generated/mobile/tokens.json    ← Flat tokens for React Native / Flutter
components/specs/               ← Component specifications (markdown)
components/prototypes/          ← Claude Design exports (HTML prototypes)
guidelines/typography.md        ← Typography rules and scale
guidelines/iconography.md       ← Icon library and usage
guidelines/writing-style.md     ← Copy, tone, date/number formats
scripts/generate-tokens.js      ← Token generator (Node.js, no dependencies)
```

## Quick Start

### Modify design tokens

1. Edit `tokens/tokens.json`
2. Run the generator:
   ```bash
   node scripts/generate-tokens.js
   ```
3. Commit all changes (tokens + generated files together)

### Integrate into a Blazor WASM app

Copy `generated/blazor/RoomRentalTheme.cs` into your project, or reference via git submodule.

In `Program.cs`:
```csharp
builder.Services.AddMudServices(config =>
{
    config.SnackbarConfiguration.PositionClass = Defaults.Classes.Position.BottomRight;
});

// Apply theme in App.razor or MainLayout.razor:
// <MudThemeProvider Theme="RoomRentalTheme.Create()" />
```

In `App.razor` or `MainLayout.razor`:
```razor
<MudThemeProvider Theme="@_theme" />
@code {
    private MudTheme _theme = RoomRentalTheme.Create();
}
```

### Integrate into a web app (React / Angular / Vue)

Add to your global CSS entry point:
```css
@import url('https://raw.githubusercontent.com/tuongdevs/room_rental.design/main/generated/web/tokens.css');
```

Or copy `generated/web/tokens.css` into your project and import locally.

Use tokens in CSS:
```css
.primary-button {
  background-color: var(--color-primary-DEFAULT);
  color: var(--color-primary-on);
  border-radius: var(--border-radius-md);
}
```

### Integrate into a mobile app

Copy `generated/mobile/tokens.json` and import in your theme provider.

React Native example:
```js
import tokens from './tokens.json';

const theme = {
  colors: {
    primary: tokens.colorPrimaryDEFAULT,
    background: tokens.colorSurfaceBackground,
  },
};
```

## Versioning

This repo uses semantic versioning. Update `$metadata.version` in `tokens.json` with every release.

| Change type | Version bump |
|-------------|-------------|
| New token added | Minor (1.1.0) |
| Token value changed (color, size) | Minor (1.1.0) |
| Token renamed or removed | Major (2.0.0) |
| Generated file format changed | Major (2.0.0) |

## Contributing

1. Branch from `main`
2. Edit `tokens/tokens.json` or add files to `components/specs/` or `guidelines/`
3. Run `node scripts/generate-tokens.js` if tokens changed
4. Open a PR — changes to `tokens.json` require review before merge
5. After merge, notify all app teams to update their references

## Applications Using This Design System

| App | Stack | Consumes |
|-----|-------|---------|
| AuthServer.UI | Blazor WASM + MudBlazor 9 | `RoomRentalTheme.cs` |
| *(future)* Admin Portal | TBD | `tokens.css` |
| *(future)* Tenant Mobile | TBD | `tokens.json` |
| *(future)* Landlord App | TBD | `tokens.css` / `tokens.json` |
