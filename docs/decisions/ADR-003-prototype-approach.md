# ADR-003 — Prototype Approach: Babel Standalone, No Build Step

| | |
|---|---|
| **Date** | 2026-05-20 |
| **Status** | Accepted |
| **Deciders** | Design system lead |

---

## Context

The design system needs interactive HTML prototypes that:
1. Preview UI components and screens without any backend
2. Are editable by an AI agent (Claude Design) in single-file-per-concern chunks
3. Open directly in a browser by double-clicking `index.html`
4. Use the React component model (JSX, hooks, props)
5. Have zero setup friction for the person reviewing the prototype

The system has multiple prototype apps (`auth-server`, `manager-portal`, …) each needing a handful of JSX files that share atoms.

---

## Decision

Use **React 18 + Babel standalone + CDN UMD bundles, no build step.**

```html
<!-- index.html — the entire "build system" is these three lines -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

<!-- JSX files compiled at runtime in the browser -->
<script type="text/babel" src="../shared/atoms.jsx"></script>
<script type="text/babel" src="App.jsx"></script>
```

### Multi-file scope without a bundler

Babel standalone compiles JSX at runtime but has no module system. Components are shared between files by publishing to `window`:

```js
// shared/atoms.jsx — last line
Object.assign(window, { Btn, Field, Chip, ... });

// App.jsx — uses Btn directly (no import needed; it's on window)
function LoginScreen() {
  return <Btn variant="primary" full>Đăng nhập</Btn>;
}
```

Load order in `index.html` defines dependency order: shared atoms first, then app-specific files.

### Tweaks panel

A `TweaksPanel` + `useTweaks` hook (in `tweaks-panel.jsx`) lets reviewers toggle design variants (SSO layout, button styles, feature flags) in the browser without touching code. This is prototype-only infrastructure.

---

## Alternatives Considered

| Alternative | Rejected because |
|---|---|
| **Vite + React** | Requires Node.js install, `npm install`, dev server — too much friction for design review |
| **Next.js / CRA** | Same Node.js friction; overkill for static prototypes |
| **Storybook** | Complex setup; MDX overhead; stories ≠ real screens |
| **Vanilla JS (no JSX)** | More verbose; harder to maintain component hierarchy |
| **Vue / Svelte CDN** | Team is already Blazor-proficient; React is a closer mental model to component thinking |

---

## Constraints of This Approach

- **No TypeScript** in prototypes — Babel standalone supports JSX but not `.tsx` type-checking
- **No tree-shaking** — all atoms load even if a screen uses only 2 of them (acceptable for prototypes)
- **No HMR** — full page refresh required to see changes (acceptable; use browser LiveServer extension)
- **CDN dependency** — `unpkg.com` must be reachable; pin exact versions with SRI hashes to prevent supply-chain drift
- **`window` pollution** — every exported atom becomes a global; name collisions must be avoided manually

---

## Consequences

**Good**:
- Any reviewer can open `index.html` in a browser — zero setup
- Claude Design can generate/modify prototype files with no knowledge of npm or bundlers
- SRI hashes on CDN scripts prevent the prototype from silently breaking if unpkg serves a different version

**Accepted trade-offs**:
- Runtime Babel compilation adds ~200ms first-load overhead (invisible in practice)
- No TypeScript means no in-editor type checking in prototype files
- If a prototype app grows beyond ~10 JSX files, consider graduating it to a real Vite app

---

## Related

- `components/prototypes/shared/atoms.jsx` — shared atom publication pattern
- `components/prototypes/auth-server/index.html` — canonical example of load order
- `CLAUDE.md` — section "Claude Design"
