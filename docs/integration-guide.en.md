# Design System — Integration Guide

> For developers on each app team who need to consume the design system.
> Prototypes run locally and serve as a **visual reference while coding** — no separate deployment needed.

---

## Overview

```
room_rental.design/          ← this repo (design system)
  tokens/tokens.json         ← single source of truth — only file humans edit
  generated/
    web/tokens.css           → Vue 3, React, Angular
    blazor/RoomRentalTheme.cs → Blazor WASM + MudBlazor 9
    mobile/tokens.json       → React Native / Flutter
    prototype/base.css       → prototype HTML only (never import in production)
  components/
    prototypes/              → run locally as visual reference while coding
    specs/                   → markdown component specs per screen
```

---

## Step 1 — Add the design system to your app repo (git submodule)

Run once from the **root of each app repo**:

```bash
git submodule add https://github.com/<org>/room_rental.design design
git submodule update --init
```

This creates a `design/` folder and adds to `.gitmodules`:

```ini
[submodule "design"]
    path = design
    url = https://github.com/<org>/room_rental.design
```

**First clone on a new machine:**

```bash
git clone --recurse-submodules <app-repo-url>
# or if already cloned:
git submodule update --init --recursive
```

**When a new version of the design system is released:**

```bash
cd design
git pull origin main
cd ..
git add design
git commit -m "chore: bump design system to vX.X.X"
```

---

## Step 2 — Consume tokens per stack

### Blazor WASM + MudBlazor 9 (`room_rental.auth`)

**File:** `design/generated/blazor/RoomRentalTheme.cs`

Copy into your project or reference directly from the submodule:

```csharp
// Program.cs
builder.Services.AddMudServices();
builder.RootComponents.Add<App>("#app");

var theme = RoomRentalTheme.Create();
```

```razor
<!-- MainLayout.razor -->
<MudThemeProvider Theme="@_theme" />

@code {
    private MudTheme _theme = RoomRentalTheme.Create();
}
```

Sync after a design system update:

```bash
# From app repo root
cd design && git pull && cd ..
cp design/generated/blazor/RoomRentalTheme.cs src/Shared/RoomRentalTheme.cs
git add -A && git commit -m "chore: sync design tokens v$(cat design/tokens/tokens.json | jq -r '.\"$metadata\".version')"
```

---

### Vue 3

**File:** `design/generated/web/tokens.css`

**Option A — Import directly from submodule (recommended)**

```js
// src/main.js
import '../design/generated/web/tokens.css'
import './assets/main.css'
```

No Vite config changes needed — Vite resolves the path automatically.

**Option B — Copy into src/assets (without submodule)**

```bash
cp design/generated/web/tokens.css src/assets/tokens.css
```

```js
// src/main.js
import './assets/tokens.css'
```

**Using tokens in a component:**

```vue
<template>
  <button class="btn-primary">Save</button>
</template>

<style scoped>
.btn-primary {
  background: var(--color-primary-DEFAULT);     /* #67C090 green */
  color: var(--color-primary-on);               /* navy text on green bg */
  border-radius: var(--border-radius-md);       /* 8px */
  padding: var(--spacing-3) var(--spacing-6);   /* 12px 24px */
  font-weight: var(--font-weight-medium);       /* 500 */
}
</style>
```

> ⚠️ Prototypes use short names like `--color-primary`.
> Production code **always uses the verbose names** from `generated/web/tokens.css`
> such as `--color-primary-DEFAULT`.

**Sync after a design update:**

```bash
cd design && git pull && cd ..
# If using Option B (manual copy):
cp design/generated/web/tokens.css src/assets/tokens.css
```

---

### React / Next.js

**File:** `design/generated/web/tokens.css`

```js
// src/index.js  or  app/layout.tsx (Next.js App Router)
import '../design/generated/web/tokens.css'
// or if copied into the app:
import './styles/tokens.css'
```

**Using tokens with CSS Modules:**

```css
/* Button.module.css */
.primary {
  background: var(--color-primary-DEFAULT);
  color: var(--color-primary-on);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3) var(--spacing-6);
}
```

**Using tokens with Tailwind CSS:**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary-DEFAULT)',
        secondary: 'var(--color-secondary-DEFAULT)',
        error:     'var(--color-semantic-error)',
        success:   'var(--color-semantic-success)',
      },
      borderRadius: {
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
      },
    },
  },
}
```

---

## Step 3 — Run prototypes as a visual reference

Prototypes run locally over HTTP. Use them as a living reference while implementing a screen.

**Requirement:** Node.js installed. Clone `room_rental.design` locally (or use the `design/` submodule).

```bash
# From the root of room_rental.design (or the design/ subfolder in your app repo):
/prototype auth-server      # opens Auth UI at http://localhost:3131
/prototype manager-portal   # opens Manager Portal
```

The prototype server starts automatically and stays running as a background process.
No build step, no `npm install` needed.

**Typical workflow for implementing a screen:**

1. Open the prototype: `/prototype manager-portal`
2. Read the spec: `components/specs/manager-portal/rooms.md`
3. Implement the component in your app, using the prototype to match colours, layout, and interaction states
4. Use CSS variables from `generated/web/tokens.css` — never hardcode hex values or pixel sizes

---

## Quick Token Reference

| Concept | CSS variable (production) | Value |
|---------|--------------------------|-------|
| Primary CTA (green) | `--color-primary-DEFAULT` | `#67C090` |
| App bar / Navy | `--color-secondary-DEFAULT` | `#124170` |
| Error / Overdue | `--color-semantic-error` | `#C62828` |
| Warning / Expiring | `--color-semantic-warning` | `#E65100` |
| Primary text | `--color-text-primary` | `#0F1E2D` |
| Secondary text | `--color-text-secondary` | `#3D5970` |
| Page background | `--color-surface-background` | `#DDF4E7` |
| Card / Surface | `--color-surface-surface` | `#FFFFFF` |
| Spacing unit (4) | `--spacing-4` | `16px` |
| Standard radius | `--border-radius-md` | `8px` |

Full list in `generated/web/tokens.css`.

---

## Handling breaking changes

A breaking change is any major version bump (e.g. `2.x.x` → `3.0.0`).

1. Read `CHANGELOG.md` to find which tokens were renamed or removed
2. Search your app repo: `grep -r "color-primary" src/`
3. Update each usage to the new token name
4. Rebuild and test

> Minor and patch releases are always backwards-compatible — only major bumps require migration.
