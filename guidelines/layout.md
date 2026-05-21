# Layout Guidelines — Room Rental Design System

> Token source: `tokens/tokens.json` — spacing, breakpoints, elevation, z-index.

---

## Page Templates

The system has two canonical page-level templates. Every screen in every app maps to one of them.

### Template A — Auth Card (auth-server)

Used for: login, register, forgot password, OAuth consent, password reset, email verification.

```
┌─────────────────────────────────────┐
│            page background          │
│                                     │
│    ┌──────────────────────────┐     │
│    │        auth-card         │     │
│    │  ┌────────────────────┐  │     │
│    │  │    logo + title     │  │     │
│    │  └────────────────────┘  │     │
│    │  form fields              │     │
│    │  CTA button              │     │
│    │  SSO block               │     │
│    │  footer link             │     │
│    └──────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

**Rules**:
- Card `max-width: 420px`, centered horizontally and vertically
- Card background: `var(--color-surface)` (white), `border-radius: var(--radius-lg)`, `box-shadow: var(--elev-4)`
- Page background: `var(--color-bg)` (mint-tinted off-white)
- Vertical padding: `48px` top and bottom (prevents card from touching viewport edge on short screens)
- Card internal padding: `32px 32px 28px`
- All auth screens use the `<AuthShell>` layout component

### Template B — Portal Shell (manager-portal, tenant-portal, admin-panel)

Used for: all authenticated workspace screens with persistent navigation.

```
┌──────────────────────────────────────────────────────┐
│                      APPBAR (64px)                    │
├─────────────────┬────────────────────────────────────┤
│                 │                                     │
│   DRAWER        │   CONTENT AREA                      │
│   (240px)       │   padding: 24px 32px 40px          │
│                 │                                     │
│   nav items     │   ┌─ PageHeader ──────────────┐    │
│                 │   │  breadcrumbs / title / CTA │    │
│                 │   └────────────────────────────┘    │
│                 │                                     │
│                 │   page body (grid/list/table)       │
│                 │                                     │
└─────────────────┴────────────────────────────────────┘
```

**Rules**:
- Overall: CSS Grid `grid-template-columns: 240px 1fr; grid-template-rows: 64px 1fr; height: 100vh`
- Appbar spans full width (`grid-column: 1 / span 2`)
- Appbar height: `64px`, background: `var(--color-secondary)` (navy)
- Drawer width: `240px`, background: `var(--color-secondary)` (navy), z-index: `var(--z-drawer)`
- Content padding: `24px 32px 40px` (top / sides / bottom)
- Content overflows vertically with `overflow-y: auto`

---

## Spacing System

Based on a **4px grid**. Every margin, padding, and gap must be a multiple of 4px.

| Token | Value | Prototype var | Common use |
|-------|-------|--------------|------------|
| `spacing.1` | 4px | `--sp-1` | Icon gap, tight inline spacing |
| `spacing.2` | 8px | `--sp-2` | Chip gap, small stack gap |
| `spacing.3` | 12px | `--sp-3` | Label-to-input gap, tight card padding |
| `spacing.4` | 16px | `--sp-4` | Default padding, button horizontal, grid gap (small) |
| `spacing.5` | 20px | `--sp-5` | Card padding, medium gap |
| `spacing.6` | 24px | `--sp-6` | Section gap, content top padding |
| `spacing.8` | 32px | `--sp-8` | Card horizontal padding, large stack gap |
| `spacing.10` | 40px | `--sp-10` | Content bottom padding |
| `spacing.12` | 48px | `--sp-12` | Page section spacing, auth page padding |
| `spacing.16` | 64px | `--sp-16` | Appbar height, hero spacing |

**Rules**:
- Never use odd spacing values (e.g. 6px, 10px, 14px) — round to nearest multiple of 4
- Use `gap` for flex/grid layouts, not margin hacks
- Horizontal and vertical padding on the same element can differ (e.g. `20px 22px` for cards)
- Minimum touch target: **44×44px** (per WCAG 2.5.5 AAA, enforced for all interactive elements)

---

## Grid System

No external grid library is used. Use CSS Grid directly with these standard column patterns:

| Class | Columns | Use |
|-------|---------|-----|
| `.grid-4` | `repeat(4, 1fr)` | KPI dashboard row |
| `.grid-3` | `repeat(3, 1fr)` | 3-column card layout |
| `.grid-2-1` | `2fr 1fr` | Main content + sidebar |

**Gap**: Always `var(--sp-4)` (16px) for `.grid-4` and `.grid-3`; `var(--sp-5)` (20px) for `.grid-2-1`.

**Rules**:
- Use grid only for page-level layout — within a card, use flexbox
- Never nest a grid inside another grid more than 1 level deep
- Responsive grid collapse: at `< 960px` (`--bp-md`), reduce to single column

---

## Content Width

| Context | Max width | Rationale |
|---------|-----------|-----------|
| Auth card | `420px` | Form readability |
| OAuth consent card | `460px` | Slightly wider for scope list |
| Portal content column | No max | Fills the grid cell |
| Appbar global search | `420px` | Avoids excessive width on ultra-wide displays |
| Body text blocks | `640px` | Optimal reading line length |

---

## Border Radius

| Token | Value | Prototype var | Use |
|-------|-------|--------------|-----|
| `border.radius.xs` | 2px | `--radius-xs` | Inline badge, tiny pill |
| `border.radius.sm` | 4px | `--radius-sm` | Checkbox, small tag |
| `border.radius.md` | 8px | `--radius-md` | Inputs, buttons, chips, tooltips |
| `border.radius.lg` | 12px | `--radius-lg` | Cards, auth card, drawers, modals |
| `border.radius.xl` | 16px | `--radius-xl` | Large overlay panels |
| `border.radius.full` | 9999px | `--radius-full` | Pills, avatars, icon buttons |

**Rules**:
- Buttons always use `--radius-md`
- Cards and panels always use `--radius-lg`
- Avatars and icon buttons always use `--radius-full`
- Never mix radii within the same component family

---

## Elevation

Used to create the sense of depth. Higher elevation = more prominent surface.

| Token | Prototype var | Use |
|-------|--------------|-----|
| `elevation.0` | `--elev-0` | Flat / inline element, no shadow |
| `elevation.1` | `--elev-1` | Default card, table, drawer |
| `elevation.2` | `--elev-2` | Appbar |
| `elevation.4` | `--elev-4` | Auth card, focused element |
| `elevation.8` | `--elev-8` | Dropdown menu, tooltip |
| `elevation.16` | `--elev-16` | Modal, dialog |

**Rule**: Don't invent elevation values outside this scale. Two surfaces at the same level use the same elevation.

---

## Z-index Layers

| Token | Prototype var | Value | Layer |
|-------|--------------|-------|-------|
| `z-index.appbar` | `--z-appbar` | 1100 | Top navigation bar |
| `z-index.drawer` | `--z-drawer` | 1200 | Side navigation drawer |
| `z-index.modal` | `--z-modal` | 1300 | Dialog / modal overlay |
| `z-index.snackbar` | `--z-snackbar` | 1400 | Toast notifications |
| `z-index.tooltip` | `--z-tooltip` | 1500 | Tooltips (always on top) |

**Rule**: Never use a hardcoded z-index number — always reference a token. If a new layer is needed, add a token.

---

## Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `breakpoint.xs` | 0px | Mobile (auth-server is the only app targeting mobile) |
| `breakpoint.sm` | 600px | Tablet |
| `breakpoint.md` | 960px | Desktop small — manager portal minimum supported |
| `breakpoint.lg` | 1280px | Desktop — primary target for manager portal |
| `breakpoint.xl` | 1920px | Wide display |

**Rules**:
- Manager Portal is **desktop-first** (`min-width: 1280px` viewport in index.html) — no mobile layout needed
- Auth-server is **responsive** — auth card must work from 320px and up
- Tenant Portal (planned) will be **mobile-first**

---

## Page Header Pattern

Every portal screen uses a consistent `PageHeader` at the top of its content area:

```
┌──────────────────────────────────────────────────┐
│  breadcrumbs: Phòng trọ › 101A                   │
│  ┌───────────────────────┐  ┌──────────────────┐ │
│  │  h1: Chi tiết phòng   │  │  [+ Thêm hợp đồng│ │
│  └───────────────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────┘
```

- `h1`: `font-family: var(--font-display)`, `font-size: 28px`, `font-weight: 300`, `color: var(--color-secondary)`
- Breadcrumbs: `font-size: 12px`, `color: var(--fg-2)`, `margin-bottom: 4px`
- Action area: right-aligned, contains primary CTA button

---

## Card Layout Pattern

Standard information grouping within content area:

```
┌──────────────────────────────────────────┐
│  (optional) section title with icon      │
│                                          │
│  content: dl / table / list / form       │
│                                          │
└──────────────────────────────────────────┘
```

- Background: `var(--color-surface)`, radius: `var(--radius-lg)`, shadow: `var(--elev-1)`
- Default padding: `20px 22px`, dense: `16px 18px`
- Section titles: `14px`, `font-weight: 600`, `color: var(--color-secondary)`, `margin-bottom: 10px`

---

## MudBlazor Layout Usage

```razor
@* Portal shell *@
<MudLayout>
    <MudAppBar Color="Color.Secondary" Elevation="2" Fixed="true">
        <!-- brand + search + right actions -->
    </MudAppBar>
    <MudDrawer Open="true" Variant="DrawerVariant.Persistent" Color="Color.Secondary">
        <MudNavMenu>
            <MudNavLink Href="/rooms" Icon="@Icons.Material.Outlined.BedroomParent">
                Danh sách phòng
            </MudNavLink>
        </MudNavMenu>
    </MudDrawer>
    <MudMainContent>
        <!-- 24px 32px 40px padding applied via MudContainer or CSS class -->
        @Body
    </MudMainContent>
</MudLayout>
```
