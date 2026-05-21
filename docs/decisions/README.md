# Architecture Decision Records (ADRs)

Significant design and architecture decisions are documented here.
Each ADR explains the context, the decision made, alternatives rejected, and trade-offs accepted.

ADRs are **immutable once accepted** — to reverse a decision, create a new ADR that supersedes the old one.

---

| ID | Title | Status | Date |
|----|-------|--------|------|
| [ADR-001](ADR-001-token-format.md) | Design Token Format: W3C Design Tokens | Accepted | 2026-05-20 |
| [ADR-002](ADR-002-ui-language.md) | UI Language: Vietnamese for Users, English for Code | Accepted | 2026-05-20 |
| [ADR-003](ADR-003-prototype-approach.md) | Prototype Approach: Babel Standalone, No Build Step | Accepted | 2026-05-20 |
| [ADR-004](ADR-004-component-library.md) | Component Library: MudBlazor 9.x for Blazor Apps | Accepted | 2026-05-20 |
| [ADR-005](ADR-005-color-palette.md) | Color Palette and v2.0.0 Role Rotation | Accepted ⚠️ Breaking | 2026-05-21 |

---

## How to Add a New ADR

1. Copy the template below into a new file: `ADR-NNN-short-title.md`
2. Fill in Context, Decision, Alternatives, Consequences
3. Add a row to this README table
4. If the ADR supersedes an existing one, add `Supersedes: ADR-XXX` in the header table

```markdown
# ADR-NNN — Title

| | |
|---|---|
| **Date** | YYYY-MM-DD |
| **Status** | Draft / Accepted / Deprecated / Superseded |
| **Deciders** | Names or roles |

## Context
## Decision
## Alternatives Considered
## Consequences
## Related
```
