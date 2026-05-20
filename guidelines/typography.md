# Typography Guidelines — Room Rental Design System

## Font Family

**Primary**: Inter (Google Fonts) — clean, modern, optimized for UI readability
**Monospace**: JetBrains Mono (code, timestamps, IDs)

Load via HTML `<head>` in all web apps:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
```

For Blazor WASM — add to `wwwroot/index.html`.

---

## Type Scale

| Token | Size | rem | Weight | Line height | Use case |
|-------|------|-----|--------|-------------|----------|
| H1 | 32px | 2rem | 400 | 1.25 | Page hero, onboarding titles |
| H2 | 24px | 1.5rem | 400 | 1.25 | Section titles |
| H3 | 20px | 1.25rem | 400 | 1.25 | Card titles, modal headers |
| H4 | 18px | 1.125rem | 500 | 1.25 | Sub-section headers |
| H5 | 16px | 1rem | 500 | 1.25 | List group headers |
| H6 | **14px** | 0.875rem | 500 | 1.25 | Small headings, table headers |
| Subtitle1 | **14px** | 0.875rem | 400 | 1.5 | Supporting text below headings |
| Subtitle2 | **12px** | 0.75rem | 500 | 1.5 | Secondary supporting text |
| Body1 | **14px** ★ | 0.875rem | 400 | 1.5 | **Default body text (normal)** |
| Body2 | **12px** ★ | 0.75rem | 400 | 1.5 | **Small text, descriptions** |
| Button | 14px | 0.875rem | 500 | — | Button labels (uppercase) |
| Caption | 12px | 0.75rem | 400 | 1.5 | Timestamps, metadata, helper text |
| Overline | 11px | 0.6875rem | 400 | — | Category labels (uppercase, spaced) |

★ = base sizes: normal = 14px, small = 12px

---

## Rules

- Never use font sizes smaller than 12px (Caption/Overline minimum)
- Body text line-height must be ≥ 1.5 for readability
- Heading line-height must be ≥ 1.25
- Do not apply bold (700) to body text — use Subtitle2 or H6 instead
- Avoid more than 3 type sizes on a single screen
- Contrast: text on colored backgrounds must meet WCAG AA (4.5:1 for body, 3:1 for large text ≥ 18px bold or ≥ 24px regular)

---

## MudBlazor Usage

```razor
<MudText Typo="Typo.h4">Page Title</MudText>
<MudText Typo="Typo.body1">Body content</MudText>
<MudText Typo="Typo.caption" Color="Color.TextSecondary">Timestamp</MudText>
```
