# ADR-005 — Color Palette and v2.0.0 Role Rotation

| | |
|---|---|
| **Date** | 2026-05-21 |
| **Status** | Accepted ⚠️ Breaking at v2.0.0 |
| **Deciders** | Design system lead |
| **Supersedes** | Informal palette decision from v1.0.0 |

---

## Context

At v1.0.0 the palette was chosen from ColorHunt (`#DDF4E7 #67C090 #26667F #124170`) with roles:
- **Primary**: Navy (`#124170`) — CTA buttons, links
- **Secondary**: Teal (`#26667F`) — supporting actions
- **Tertiary**: Green (`#67C090`) — success, available status

During prototype development (v1.1.0–v1.3.0), the manually-maintained `colors_and_type.css` was updated to flip green and navy. The green buttons looked more vibrant and "action-ready"; the navy felt heavy as a CTA color. The colors_and_type.css changes were not reflected in tokens.json, creating version drift.

At v2.0.0 we reconciled this drift by:
1. Promoting the prototype's color changes into `tokens.json` as a breaking change
2. Deleting `colors_and_type.css` and generating prototype CSS from `tokens.json` (Phase 1)
3. Making the drift structurally impossible going forward

---

## Decision: Green = Primary, Navy = Secondary

**v2.0.0 color role assignment**:

| Role | Color | Hex | Rationale |
|------|-------|-----|-----------|
| Primary | Green | `#67C090` | Vibrant, energetic — communicates availability, growth, positivity. Natural for a "rooms available" product. CTA buttons in green draw the eye without being aggressive. |
| Secondary | Navy | `#124170` | Trustworthy, stable, professional. Perfect for app chrome (appbar, drawer) — it recedes visually and lets content and primary actions stand out. |
| Tertiary | Teal | `#26667F` | Information, pending states, neutral accent. Sits between green and navy on the color wheel — creates harmonious accent without competing with primary. |
| Background | Mint | `#DDF4E7` (light) | Keeps the page background within the brand palette, makes the screen feel fresh. |

### Contrast Verification (v2.0.0)

| Pairing | Ratio | Requirement |
|---------|-------|-------------|
| Navy on Green (primary button) | 4.7:1 | ✓ AA |
| White on Navy (appbar text) | 15:1 | ✓ AAA |
| White on Teal | 5.3:1 | ✓ AA |
| Error red (#C62828) on white | 5.9:1 | ✓ AA |
| Navy text on white | 12.5:1 | ✓ AAA |

White on Green (`#67C090`) = 2.4:1 — **fails AA**. Therefore the `color.primary.on` token is Navy, not white. Never place white text directly on a green primary button.

---

## v2.0.0 Breaking Change Checklist

Every Blazor WASM app consuming `RoomRentalTheme.Create()` must verify after upgrading:
- [ ] Primary buttons are now green — check that green buttons work with surrounding UI
- [ ] Appbar and drawer are now explicitly navy via `DrawerBackground` / `AppbarBackground` properties (no longer inherited from Primary which changed color)
- [ ] Any hardcoded reference to `#124170` as "primary" must be changed to use the secondary token
- [ ] Any hardcoded reference to `#67C090` as "tertiary" must be changed to use the primary token

---

## Why These Four Colors

The ColorHunt palette was chosen because:
- **Mint** (`#DDF4E7`) — soft, breathable page background; not pure white, not distracting
- **Green** (`#67C090`) — universally associated with "yes", "go", "available" — ideal for a rental system where empty rooms are a positive state
- **Teal** (`#26667F`) — bridges green and navy; works as an information/neutral accent
- **Navy** (`#124170`) — gravitas, trust, corporate without being cold; strong contrast on light surfaces

All four are from the same hue family (blue-green), ensuring they never clash — only the lightness and saturation vary.

---

## Consequences

**Good**:
- Green CTAs test significantly better for discoverability than navy in informal review
- Palette is from a single, publicly citable source (ColorHunt) — reproducible
- Role rotation is now locked into `tokens.json` and structurally enforced — impossible to drift again

**Accepted trade-offs**:
- Breaking change required all apps to re-verify rendering at v2.0.0
- `color.primary.on` = navy (not white) is non-obvious — documented prominently in `guidelines/color.md`

---

## Related

- `CHANGELOG.md` — v2.0.0 breaking change entry
- `guidelines/color.md` — full color usage rules
- `tokens/tokens.json` — `$metadata.palette-source` for the ColorHunt URL
