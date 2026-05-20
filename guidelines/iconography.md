# Iconography Guidelines — Room Rental Design System

## Icon Library

**Primary**: Material Icons (Material Symbols Outlined)
All apps use the same icon set for visual consistency across platforms.

Load for web:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

For MudBlazor — icons are built in via `MudBlazor.Icons.Material`.

---

## Icon Sizes

| Context | Size | Touch target |
|---------|------|-------------|
| Inline with body text | 18px | — |
| Button icon | 20px | 44×44px min |
| Navigation icon | 24px | 44×44px min |
| Feature / empty state | 48px | — |
| Hero illustration | 96px+ | — |

---

## Usage Rules

- Never use an icon as the sole indicator of meaning — always pair with a text label or tooltip
- Action icons (edit, delete, add) must have an `aria-label` or visible label
- Use **Outlined** style as default; **Filled** only for active/selected states
- Icon color must meet 3:1 contrast against its background (WCAG AA for UI components)
- Do not mix icon styles (Outlined + Rounded) within the same screen

---

## Common Icons (Room Rental context)

| Action | Icon | MudBlazor reference |
|--------|------|---------------------|
| Add room | `add_home` | `Icons.Material.Outlined.AddHome` |
| View room | `bedroom_parent` | `Icons.Material.Outlined.BedroomParent` |
| Tenant | `person` | `Icons.Material.Outlined.Person` |
| Contract | `description` | `Icons.Material.Outlined.Description` |
| Payment | `payments` | `Icons.Material.Outlined.Payments` |
| Invoice | `receipt_long` | `Icons.Material.Outlined.ReceiptLong` |
| Maintenance | `build` | `Icons.Material.Outlined.Build` |
| Notification | `notifications` | `Icons.Material.Outlined.Notifications` |
| Settings | `settings` | `Icons.Material.Outlined.Settings` |
| Logout | `logout` | `Icons.Material.Outlined.Logout` |
| Search | `search` | `Icons.Material.Outlined.Search` |
| Filter | `filter_list` | `Icons.Material.Outlined.FilterList` |
| Edit | `edit` | `Icons.Material.Outlined.Edit` |
| Delete | `delete` | `Icons.Material.Outlined.Delete` |
| Dashboard | `dashboard` | `Icons.Material.Outlined.Dashboard` |

---

## MudBlazor Usage

```razor
<MudIconButton Icon="@Icons.Material.Outlined.Edit"
               Size="Size.Medium"
               aria-label="Edit room"
               data-testid="edit-room-button" />

<MudIcon Icon="@Icons.Material.Outlined.BedroomParent"
         Size="Size.Large"
         Color="Color.Primary" />
```
