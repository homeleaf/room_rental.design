# Spec — App Shell (`AppBar`, `Drawer`, `AppShell`)

**Category**: Layout / manager-portal
**Location**: `components/prototypes/manager-portal/chrome.jsx`
**Blazor**: `<MudLayout>`, `<MudAppBar>`, `<MudDrawer>`

The shell is the persistent chrome that wraps every portal screen. It is **not** a shared atom — it belongs to manager-portal. Tenant-portal and admin-panel will have their own shell variants.

---

## AppShell

Top-level layout grid.

```
CSS Grid:
  columns: 240px 1fr
  rows:    64px  1fr
  height:  100vh
```

- Appbar: `grid-column: 1 / span 2` (full width)
- Drawer: `grid-row: 2`, `grid-column: 1`
- Content: `grid-row: 2`, `grid-column: 2`

---

## AppBar

### Layout

```
[ Logo + Brand ]  [ Search (flex-grow) ]  [ ··· right actions ]
```

| Element | Spec |
|---------|------|
| Height | `64px` |
| Background | `color.secondary.DEFAULT` (`#124170` navy) = `--color-appbar` |
| Text color | `color.secondary.on` (`#fff`) |
| Shadow | `elevation.2` |
| z-index | `z-index.appbar` (`1100`) |
| Side padding | `0 20px 0 16px` |

### Brand area

- Logo mark: `32×32px` PNG
- Brand name: `"HouseLeaf"` — `15px`, `600`, `--fg-on-navy`
- Subtitle: `"Simple Rental Management"` — `10px`, `0.12em` letter spacing, uppercase, `--fg-on-navy-2`

### Search bar

- `flex: 1`, `max-width: 420px`
- Background: `rgba(255,255,255,.10)` → `rgba(255,255,255,.18)` on `:focus-within`
- Input text: `#fff`, placeholder: `rgba(255,255,255,.6)`
- Search icon: `rgba(255,255,255,.78)`, 20px

### Right actions

Three icon buttons (Help, Notifications, Settings) + avatar. Notification button has a red badge (`color.semantic.error`) for unread count.

Appbar buttons:
- `40×40px`, `border-radius: var(--radius-full)`
- Hover: `rgba(255,255,255,.12)` background

---

## Drawer (left nav)

### Layout

- Width: `240px`
- Background: `var(--color-appbar)` (navy, same as appbar)
- Padding: `18px 12px`
- z-index: `z-index.drawer` (`1200`)
- Vertical overflow scroll

### Navigation items

```
[ GROUP LABEL ]      ← 10px uppercase, --fg-on-navy-2
[ icon  Nav item ]   ← 14px, --fg-on-navy-2, 9px 12px pad, radius-md
[ icon  Active item ]← green tint, --rr-mint text, filled icon
```

**Group labels**: `10px`, `0.14em` letter-spacing, uppercase, `rgba(255,255,255,.45)`

**Nav item**:
- Icon: 22px (18px for indented sub-items)
- Padding: `9px 12px`
- Border-radius: `var(--radius-md)`
- Default: `color: --fg-on-navy-2`
- Hover: `rgba(255,255,255,.08)` bg, `--fg-on-navy` text

**Active nav item**:
- Background: `rgba(221,244,231,.14)` (mint at 14%)
- Text: `var(--rr-mint)` (#DDF4E7)
- Icon: filled variation, `var(--rr-green)` (#67C090)

### Navigation groups (v1)

| Group | Items |
|-------|-------|
| Hoạt động | Tổng quan, Quản lý phòng, Người thuê, Hợp đồng |
| Tài chính | Thanh toán, Hóa đơn |
| Khác | Bảo trì, Cài đặt |

### Drawer footer

Logout action, pinned to bottom (`margin-top: auto`), separated by `1px rgba(221,244,231,.10)` border.
- Icon: `logout`, 18px
- Text: "Đăng xuất", 12px, `--fg-on-navy-2`

---

## Content area

- `padding: 24px 32px 40px`
- `overflow-y: auto`
- Background: `var(--color-bg)` (page background)

The content area receives `{children}` from the router — each screen renders its own `<PageHeader>` and body.

---

## PageHeader (portal pattern)

Used at the top of every portal screen content area.

```
breadcrumbs     ← .crumbs — 12px, --fg-2
h1 Page title   ← 28px / weight 300 / Inter Tight / --color-secondary
                            [ right-aligned action button(s) ]
```

| Part | Spec |
|------|------|
| `h1` | `font-family: var(--font-display)`, `28px`, `300`, `--color-secondary` (navy), `letter-spacing: -0.015em` |
| Breadcrumbs | `12px`, `--fg-2`, links use `color: inherit` |
| Layout | `display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px` |

---

## Blazor Implementation

```razor
<MudLayout>
    <MudAppBar Color="Color.Secondary" Elevation="2" Fixed="true" Dense="false">
        <MudImage Src="logo-mark.png" Width="32" Height="32" />
        <!-- brand text, search, right icons -->
    </MudAppBar>

    <MudDrawer Open="true"
               Variant="DrawerVariant.Persistent"
               Color="Color.Secondary"
               Elevation="0"
               Width="240px">
        <MudNavMenu>
            <MudText Typo="Typo.overline" Class="group-label">Hoạt động</MudText>
            <MudNavLink Icon="@Icons.Material.Outlined.Dashboard"
                        Match="NavLinkMatch.All"
                        Href="/dashboard">
                Tổng quan
            </MudNavLink>
            <!-- ... -->
        </MudNavMenu>
    </MudDrawer>

    <MudMainContent>
        <MudContainer MaxWidth="MaxWidth.False" Class="pa-6">
            @Body
        </MudContainer>
    </MudMainContent>
</MudLayout>
```
