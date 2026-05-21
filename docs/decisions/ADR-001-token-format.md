# ADR-001 — Design Token Format: W3C Design Tokens

| | |
|---|---|
| **Date** | 2026-05-20 |
| **Status** | Accepted |
| **Deciders** | Design system lead |

---

## Context

The Room Rental system spans five apps (auth-server, manager-portal, tenant-portal, admin-panel, mobile) on three platforms (Blazor WASM, web React/Angular, React Native / Flutter). Every app needs to share the same colors, spacing, typography, and border radii.

We needed a format for storing design tokens that:
1. Can be consumed by a code generator targeting all three platforms
2. Is human-readable and maintainable by a single person
3. Does not require a design tool subscription (Figma Tokens, Style Dictionary plugin, etc.)
4. Is future-proof — doesn't lock us into a proprietary format

---

## Decision

Use **W3C Design Tokens Community Group format** (`tokens.json`) as the canonical source of truth.

Structure:
```json
{
  "color": {
    "primary": {
      "DEFAULT": { "$value": "#67C090", "$type": "color" }
    }
  }
}
```

A local Node.js generator (`scripts/generate-tokens.js`, zero external deps) reads this file and produces:
- `generated/web/tokens.css` — CSS custom properties for web apps
- `generated/prototype/base.css` — simplified CSS vars for prototype development
- `generated/blazor/RoomRentalTheme.cs` — MudBlazor 9.x `MudTheme` C# class
- `generated/mobile/tokens.json` — flat camelCase key-value for React Native / Flutter

---

## Alternatives Considered

| Alternative | Rejected because |
|---|---|
| **Style Dictionary** (Amzn) | External dependency, Node-version sensitivity, config overhead |
| **Figma Tokens / Tokens Studio** | Requires Figma Pro, tokens live outside the repo |
| **CSS-only variables file** | No multi-platform output; drift inevitable |
| **JSON with custom schema** | Same power as W3C format but non-standard — no tooling interop |

---

## Consequences

**Good**:
- Single file (`tokens.json`) to edit for any design value change
- Multi-platform output from one command (`node scripts/generate-tokens.js`)
- Version-controlled, diffable, no external service dependency
- W3C format is increasingly supported by tools (Figma, Storybook, Theo)

**Accepted trade-offs**:
- Manual generator maintenance required when adding new token categories
- No visual token preview (would require a design tool integration)
- `$type` values for custom categories (like `motion.easing`) are non-standard — use `custom-*` prefix

---

## Related

- `tokens/tokens.json` — the token file
- `scripts/generate-tokens.js` — the generator
- `CLAUDE.md` — "Never edit files under generated/"
