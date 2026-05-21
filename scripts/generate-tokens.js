#!/usr/bin/env node
/**
 * Design Token Generator — Room Rental Design System
 *
 * Reads tokens/tokens.json and generates:
 *   generated/web/tokens.css              — CSS custom properties (verbose, W3C-faithful)
 *   generated/prototype/base.css          — CSS for prototypes (simplified names + type styles)
 *   generated/blazor/RoomRentalTheme.cs   — MudBlazor 9.x MudTheme (Blazor WASM)
 *   generated/mobile/tokens.json          — flat key-value (React Native / Flutter)
 *
 * Usage: node scripts/generate-tokens.js
 * No external dependencies required.
 */

const fs   = require("fs");
const path = require("path");

// ── Paths ──────────────────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, "..");
const TOKENS      = path.join(ROOT, "tokens", "tokens.json");
const OUT_WEB     = path.join(ROOT, "generated", "web",       "tokens.css");
const OUT_PROTO   = path.join(ROOT, "generated", "prototype", "base.css");
const OUT_BLAZOR  = path.join(ROOT, "generated", "blazor",    "RoomRentalTheme.cs");
const OUT_MOBILE  = path.join(ROOT, "generated", "mobile",    "tokens.json");

// ── Helpers ────────────────────────────────────────────────────────────────────
function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/** Flatten nested token object into "group-key: value" pairs, skipping $meta keys. */
function flattenTokens(obj, prefix = "") {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const segment = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === "object" && "$value" in val) {
      result[segment] = String(val.$value);
    } else if (val && typeof val === "object") {
      Object.assign(result, flattenTokens(val, segment));
    }
  }
  return result;
}

// ── Load tokens ────────────────────────────────────────────────────────────────
const raw    = fs.readFileSync(TOKENS, "utf-8");
const tokens = JSON.parse(raw);
const flat   = flattenTokens(tokens);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Web CSS — verbose W3C-faithful naming (--color-primary-DEFAULT)
// ─────────────────────────────────────────────────────────────────────────────
function generateWebCss(flat) {
  const lines = [
    "/* Auto-generated — do not edit manually. Run: node scripts/generate-tokens.js */",
    `/* Room Rental Design System — v${tokens.$metadata?.version ?? "?"} — ${tokens.$metadata?.updatedAt ?? ""} */`,
    "",
    ":root {",
  ];

  for (const [key, value] of Object.entries(flat)) {
    lines.push(`  --${key}: ${value};`);
  }
  lines.push("}");
  lines.push("");

  // Dark mode overrides
  const darkMap = {
    "color-dark-surface-background": "color-surface-background",
    "color-dark-surface-card":       "color-surface-surface",
    "color-dark-surface-drawer":     "color-surface-surface-dim",
    "color-dark-primary":            "color-primary-DEFAULT",
    "color-dark-primary-on":         "color-primary-on",
    "color-dark-secondary":          "color-secondary-DEFAULT",
    "color-dark-secondary-on":       "color-secondary-on",
    "color-dark-tertiary":           "color-tertiary-DEFAULT",
    "color-dark-tertiary-on":        "color-tertiary-on",
    "color-dark-text-primary":       "color-text-primary",
    "color-dark-text-secondary":     "color-text-secondary",
    "color-dark-text-disabled":      "color-text-disabled",
    "color-dark-divider":            "color-divider-DEFAULT",
    "color-dark-success":            "color-semantic-success",
    "color-dark-success-on":         "color-semantic-success-on",
    "color-dark-info":               "color-semantic-info",
    "color-dark-info-on":            "color-semantic-info-on",
  };
  const darkEntries = Object.entries(darkMap).filter(([k]) => flat[k] !== undefined);
  if (darkEntries.length) {
    lines.push("@media (prefers-color-scheme: dark) {");
    lines.push("  :root {");
    for (const [darkKey, lightVar] of darkEntries) {
      lines.push(`    --${lightVar}: ${flat[darkKey]};`);
    }
    lines.push("  }");
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

ensureDir(OUT_WEB);
fs.writeFileSync(OUT_WEB, generateWebCss(flat), "utf-8");
console.log(`✔  ${path.relative(ROOT, OUT_WEB)}`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Prototype CSS — simplified names for prototype development
//    Replaces the manually-maintained colors_and_type.css.
//    Consumed by: components/prototypes/*/index.html
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps flat token keys → simplified CSS variable names used in prototypes.
 * This is the canonical mapping — update here when adding tokens.
 */
const PROTOTYPE_ALIAS = {
  // ── Color: Primary ──────────────────────────────────────────────────────
  "color-primary-DEFAULT":        "--color-primary",
  "color-primary-dark":           "--color-primary-dark",
  "color-primary-container":      "--color-primary-container",
  "color-primary-on":             "--color-primary-on",
  "color-primary-on-container":   "--color-primary-on-container",
  // ── Color: Secondary ────────────────────────────────────────────────────
  "color-secondary-DEFAULT":      "--color-secondary",
  "color-secondary-dark":         "--color-secondary-dark",
  "color-secondary-container":    "--color-secondary-container",
  "color-secondary-on":           "--color-secondary-on",
  "color-secondary-on-dim":       "--color-secondary-on-dim",
  "color-secondary-on-container": "--color-secondary-on-container",
  // ── Color: Tertiary ─────────────────────────────────────────────────────
  "color-tertiary-DEFAULT":       "--color-tertiary",
  "color-tertiary-dark":          "--color-tertiary-dark",
  "color-tertiary-container":     "--color-tertiary-container",
  "color-tertiary-on":            "--color-tertiary-on",
  "color-tertiary-on-container":  "--color-tertiary-on-container",
  // ── Color: Semantic ─────────────────────────────────────────────────────
  "color-semantic-success":       "--color-success",
  "color-semantic-success-on":    "--color-success-on",
  "color-semantic-error":         "--color-error",
  "color-semantic-error-on":      "--color-error-on",
  "color-semantic-warning":       "--color-warning",
  "color-semantic-warning-on":    "--color-warning-on",
  "color-semantic-info":          "--color-info",
  "color-semantic-info-on":       "--color-info-on",
  // ── Color: Surface ──────────────────────────────────────────────────────
  "color-surface-background":     "--color-bg",
  "color-surface-surface":        "--color-surface",
  "color-surface-surface-dim":    "--color-surface-dim",
  // ── Color: Text ─────────────────────────────────────────────────────────
  "color-text-primary":           "--fg-1",
  "color-text-secondary":         "--fg-2",
  "color-text-disabled":          "--fg-disabled",
  "color-text-hint":              "--fg-hint",
  // ── Color: Divider ──────────────────────────────────────────────────────
  "color-divider-DEFAULT":        "--divider",
  "color-divider-strong":         "--divider-strong",
  // ── Typography: Font families ───────────────────────────────────────────
  "typography-font-family-base":    "--font-base",
  "typography-font-family-display": "--font-display",
  "typography-font-family-mono":    "--font-mono",
  "typography-font-family-icon":    "--font-icon",
  // ── Typography: Font sizes ──────────────────────────────────────────────
  "typography-font-size-h1":        "--fs-h1",
  "typography-font-size-h2":        "--fs-h2",
  "typography-font-size-h3":        "--fs-h3",
  "typography-font-size-h4":        "--fs-h4",
  "typography-font-size-h5":        "--fs-h5",
  "typography-font-size-h6":        "--fs-h6",
  "typography-font-size-body1":     "--fs-body1",
  "typography-font-size-body2":     "--fs-body2",
  "typography-font-size-subtitle1": "--fs-subtitle1",
  "typography-font-size-subtitle2": "--fs-subtitle2",
  "typography-font-size-caption":   "--fs-caption",
  "typography-font-size-overline":  "--fs-overline",
  "typography-font-size-button":    "--fs-button",
  // ── Typography: Weights ─────────────────────────────────────────────────
  "typography-font-weight-regular":  "--fw-regular",
  "typography-font-weight-medium":   "--fw-medium",
  "typography-font-weight-semibold": "--fw-semibold",
  "typography-font-weight-bold":     "--fw-bold",
  // ── Typography: Line heights ────────────────────────────────────────────
  "typography-line-height-tight":   "--lh-tight",
  "typography-line-height-normal":  "--lh-normal",
  "typography-line-height-relaxed": "--lh-relaxed",
  // ── Spacing ─────────────────────────────────────────────────────────────
  "spacing-1":  "--sp-1",
  "spacing-2":  "--sp-2",
  "spacing-3":  "--sp-3",
  "spacing-4":  "--sp-4",
  "spacing-5":  "--sp-5",
  "spacing-6":  "--sp-6",
  "spacing-8":  "--sp-8",
  "spacing-10": "--sp-10",
  "spacing-12": "--sp-12",
  "spacing-16": "--sp-16",
  // ── Border: Radius ──────────────────────────────────────────────────────
  "border-radius-xs":   "--radius-xs",
  "border-radius-sm":   "--radius-sm",
  "border-radius-md":   "--radius-md",
  "border-radius-lg":   "--radius-lg",
  "border-radius-xl":   "--radius-xl",
  "border-radius-full": "--radius-full",
  // ── Border: Width ───────────────────────────────────────────────────────
  "border-width-thin":   "--border-thin",
  "border-width-medium": "--border-medium",
  // ── Elevation ───────────────────────────────────────────────────────────
  "elevation-0":  "--elev-0",
  "elevation-1":  "--elev-1",
  "elevation-2":  "--elev-2",
  "elevation-4":  "--elev-4",
  "elevation-8":  "--elev-8",
  "elevation-16": "--elev-16",
  // ── Breakpoints ─────────────────────────────────────────────────────────
  "breakpoint-xs": "--bp-xs",
  "breakpoint-sm": "--bp-sm",
  "breakpoint-md": "--bp-md",
  "breakpoint-lg": "--bp-lg",
  "breakpoint-xl": "--bp-xl",
  // ── Z-index ─────────────────────────────────────────────────────────────
  "z-index-drawer":   "--z-drawer",
  "z-index-appbar":   "--z-appbar",
  "z-index-modal":    "--z-modal",
  "z-index-snackbar": "--z-snackbar",
  "z-index-tooltip":  "--z-tooltip",
  // ── Motion: Duration ────────────────────────────────────────────────────
  "motion-duration-instant":    "--duration-instant",
  "motion-duration-fast":       "--duration-fast",
  "motion-duration-normal":     "--duration-normal",
  "motion-duration-slow":       "--duration-slow",
  "motion-duration-deliberate": "--duration-deliberate",
  // ── Motion: Easing ──────────────────────────────────────────────────────
  "motion-easing-standard":     "--easing-standard",
  "motion-easing-decelerate":   "--easing-decelerate",
  "motion-easing-accelerate":   "--easing-accelerate",
  "motion-easing-sharp":        "--easing-sharp",
};

function generatePrototypeCss(flat, tokens) {
  const version  = tokens.$metadata?.version  ?? "?";
  const date     = tokens.$metadata?.updatedAt ?? "";
  const palette  = tokens.$metadata?.palette  ?? {};

  // Relative path from generated/prototype/ back to the fonts folder
  const FONT_PATH = "../../components/prototypes/fonts";

  const lines = [];

  // ── Header ──
  lines.push(`/* =============================================================`);
  lines.push(`   Auto-generated — do not edit manually.`);
  lines.push(`   Run: node scripts/generate-tokens.js`);
  lines.push(`   Room Rental Design System — v${version} — ${date}`);
  lines.push(`   Palette: ${tokens.$metadata?.["palette-source"] ?? ""}`);
  lines.push(`   ============================================================= */`);
  lines.push(``);

  // ── Google Fonts ──
  lines.push(`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`);
  lines.push(`@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');`);
  lines.push(``);

  // ── Inter Tight @font-face (self-hosted, display face) ──
  lines.push(`/* Inter Tight — brand display face (self-hosted).`);
  lines.push(`   Weights available: Light(300) Bold(700) Black(900).`);
  lines.push(`   Regular(400) and Medium(500) are MISSING — h1/h2 use weight 300; body falls through to Inter. */`);
  for (const [weight, file, style] of [
    [300, "InterTight-Light",       "normal"],
    [700, "InterTight-Bold",        "normal"],
    [900, "InterTight-Black",       "normal"],
    [900, "InterTight-BlackItalic", "italic"],
  ]) {
    lines.push(`@font-face {`);
    lines.push(`  font-family: 'Inter Tight';`);
    lines.push(`  font-style: ${style};`);
    lines.push(`  font-weight: ${weight};`);
    lines.push(`  font-display: swap;`);
    lines.push(`  src: url('${FONT_PATH}/${file}.ttf') format('truetype');`);
    lines.push(`}`);
  }
  lines.push(``);

  // ── :root — palette raw vars ──
  lines.push(`:root {`);
  lines.push(`  /* ── Raw palette (4 brand colors) ── */`);
  const paletteOrder = [["mint", "--rr-mint"], ["green", "--rr-green"], ["teal", "--rr-teal"], ["navy", "--rr-navy"]];
  for (const [key, cssVar] of paletteOrder) {
    if (palette[key]) lines.push(`  ${cssVar}: ${palette[key]};`);
  }
  lines.push(``);

  // ── :root — token vars with simplified names ──
  const groups = [
    ["Color — Primary",    ["color-primary-DEFAULT","color-primary-dark","color-primary-container","color-primary-on","color-primary-on-container"]],
    ["Color — Secondary",  ["color-secondary-DEFAULT","color-secondary-dark","color-secondary-container","color-secondary-on","color-secondary-on-dim","color-secondary-on-container"]],
    ["Color — Tertiary",   ["color-tertiary-DEFAULT","color-tertiary-dark","color-tertiary-container","color-tertiary-on","color-tertiary-on-container"]],
    ["Color — Semantic",   ["color-semantic-success","color-semantic-success-on","color-semantic-error","color-semantic-error-on","color-semantic-warning","color-semantic-warning-on","color-semantic-info","color-semantic-info-on"]],
    ["Color — Surface",    ["color-surface-background","color-surface-surface","color-surface-surface-dim"]],
    ["Color — Text",       ["color-text-primary","color-text-secondary","color-text-disabled","color-text-hint"]],
    ["Color — Divider",    ["color-divider-DEFAULT","color-divider-strong"]],
    ["Typography — Fonts", ["typography-font-family-base","typography-font-family-display","typography-font-family-mono","typography-font-family-icon"]],
    ["Typography — Sizes", ["typography-font-size-h1","typography-font-size-h2","typography-font-size-h3","typography-font-size-h4","typography-font-size-h5","typography-font-size-h6","typography-font-size-body1","typography-font-size-body2","typography-font-size-subtitle1","typography-font-size-subtitle2","typography-font-size-caption","typography-font-size-overline","typography-font-size-button"]],
    ["Typography — Weights",      ["typography-font-weight-regular","typography-font-weight-medium","typography-font-weight-semibold","typography-font-weight-bold"]],
    ["Typography — Line heights", ["typography-line-height-tight","typography-line-height-normal","typography-line-height-relaxed"]],
    ["Spacing",    ["spacing-1","spacing-2","spacing-3","spacing-4","spacing-5","spacing-6","spacing-8","spacing-10","spacing-12","spacing-16"]],
    ["Border — Radius", ["border-radius-xs","border-radius-sm","border-radius-md","border-radius-lg","border-radius-xl","border-radius-full"]],
    ["Border — Width",  ["border-width-thin","border-width-medium"]],
    ["Elevation",  ["elevation-0","elevation-1","elevation-2","elevation-4","elevation-8","elevation-16"]],
    ["Breakpoints",["breakpoint-xs","breakpoint-sm","breakpoint-md","breakpoint-lg","breakpoint-xl"]],
    ["Z-index",    ["z-index-drawer","z-index-appbar","z-index-modal","z-index-snackbar","z-index-tooltip"]],
    ["Motion — Duration", ["motion-duration-instant","motion-duration-fast","motion-duration-normal","motion-duration-slow","motion-duration-deliberate"]],
    ["Motion — Easing",   ["motion-easing-standard","motion-easing-decelerate","motion-easing-accelerate","motion-easing-sharp"]],
  ];

  for (const [groupLabel, keys] of groups) {
    lines.push(`  /* ── ${groupLabel} ── */`);
    for (const key of keys) {
      const cssVar = PROTOTYPE_ALIAS[key];
      const value  = flat[key];
      if (cssVar && value !== undefined) {
        lines.push(`  ${cssVar}: ${value};`);
      }
    }
    lines.push(``);
  }

  // ── :root — derived/alias vars ──
  lines.push(`  /* ── Derived aliases (semantic shortcuts for prototypes) ── */`);
  lines.push(`  --color-appbar:  var(--color-secondary);     /* navy — appbar + drawer chrome */`);
  lines.push(`  --fg-on-navy:    var(--color-secondary-on);  /* white on navy */`);
  lines.push(`  --fg-on-navy-2:  var(--color-secondary-on-dim); /* white 72% on navy — supporting text */`);
  lines.push(`}`);
  lines.push(``);

  // ── Semantic type styles ──────────────────────────────────────────────────
  lines.push(`/* =============================================================`);
  lines.push(`   Semantic type styles`);
  lines.push(`   ============================================================= */`);
  lines.push(``);
  lines.push(`html, body {`);
  lines.push(`  font-family: var(--font-base);`);
  lines.push(`  font-size: var(--fs-body1);`);
  lines.push(`  line-height: var(--lh-normal);`);
  lines.push(`  color: var(--fg-1);`);
  lines.push(`  background: var(--color-bg);`);
  lines.push(`  -webkit-font-smoothing: antialiased;`);
  lines.push(`  text-rendering: optimizeLegibility;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`h1, .h1 {`);
  lines.push(`  font-family: var(--font-display);`);
  lines.push(`  font-size: var(--fs-h1);`);
  lines.push(`  font-weight: 300;            /* Inter Tight Light — brand display weight */`);
  lines.push(`  line-height: var(--lh-tight);`);
  lines.push(`  margin: 0 0 var(--sp-4);`);
  lines.push(`  letter-spacing: -0.015em;`);
  lines.push(`}`);
  lines.push(`h2, .h2 {`);
  lines.push(`  font-family: var(--font-display);`);
  lines.push(`  font-size: var(--fs-h2);`);
  lines.push(`  font-weight: 300;`);
  lines.push(`  line-height: var(--lh-tight);`);
  lines.push(`  margin: 0 0 var(--sp-3);`);
  lines.push(`  letter-spacing: -0.01em;`);
  lines.push(`}`);
  lines.push(`h3, .h3 { font-size: var(--fs-h3); font-weight: var(--fw-regular); line-height: var(--lh-tight); margin: 0 0 var(--sp-3); }`);
  lines.push(`h4, .h4 { font-size: var(--fs-h4); font-weight: var(--fw-medium);  line-height: var(--lh-tight); margin: 0 0 var(--sp-2); }`);
  lines.push(`h5, .h5 { font-size: var(--fs-h5); font-weight: var(--fw-medium);  line-height: var(--lh-tight); margin: 0 0 var(--sp-2); }`);
  lines.push(`h6, .h6 { font-size: var(--fs-h6); font-weight: var(--fw-medium);  line-height: var(--lh-tight); margin: 0 0 var(--sp-2); }`);
  lines.push(``);
  lines.push(`p, .body1  { font-size: var(--fs-body1); line-height: var(--lh-normal); margin: 0 0 var(--sp-3); }`);
  lines.push(`.body2, small { font-size: var(--fs-body2); line-height: var(--lh-normal); }`);
  lines.push(`.subtitle1 { font-size: var(--fs-subtitle1); font-weight: var(--fw-regular); line-height: var(--lh-normal); }`);
  lines.push(`.subtitle2 { font-size: var(--fs-subtitle2); font-weight: var(--fw-medium);  line-height: var(--lh-normal); }`);
  lines.push(`.caption   { font-size: var(--fs-caption);   font-weight: var(--fw-regular); color: var(--fg-2); }`);
  lines.push(`.overline  {`);
  lines.push(`  font-size: var(--fs-overline);`);
  lines.push(`  font-weight: var(--fw-medium);`);
  lines.push(`  line-height: 1;`);
  lines.push(`  text-transform: uppercase;`);
  lines.push(`  letter-spacing: 0.08em;`);
  lines.push(`  color: var(--fg-2);`);
  lines.push(`}`);
  lines.push(`code, kbd, samp, .mono { font-family: var(--font-mono); font-size: 0.92em; }`);
  lines.push(``);

  // ── Material Symbols helper ──
  lines.push(`/* Material Symbols Outlined helper */`);
  lines.push(`.material-symbols-outlined {`);
  lines.push(`  font-family: var(--font-icon);`);
  lines.push(`  font-weight: 400;`);
  lines.push(`  font-style: normal;`);
  lines.push(`  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`);
  lines.push(`  display: inline-block;`);
  lines.push(`  line-height: 1;`);
  lines.push(`  letter-spacing: normal;`);
  lines.push(`  text-transform: none;`);
  lines.push(`  white-space: nowrap;`);
  lines.push(`  word-wrap: normal;`);
  lines.push(`  direction: ltr;`);
  lines.push(`  -webkit-font-feature-settings: 'liga';`);
  lines.push(`  -webkit-font-smoothing: antialiased;`);
  lines.push(`  user-select: none;`);
  lines.push(`  vertical-align: middle;`);
  lines.push(`}`);
  lines.push(`.material-symbols-outlined.filled { font-variation-settings: 'FILL' 1; }`);
  lines.push(``);

  return lines.join("\n");
}

ensureDir(OUT_PROTO);
fs.writeFileSync(OUT_PROTO, generatePrototypeCss(flat, tokens), "utf-8");
console.log(`✔  ${path.relative(ROOT, OUT_PROTO)}`);

// ─────────────────────────────────────────────────────────────────────────────
// 3. MudBlazor 9.x Theme (C#)
// ─────────────────────────────────────────────────────────────────────────────
function t(key, fallback = "#000000") {
  return flat[key] ?? fallback;
}

/** Convert font-family string → C# array literal */
function fontFamilyCSharp(key) {
  const raw = flat[key] ?? "sans-serif";
  const items = raw.split(",").map(s => `"${s.trim()}"`).join(", ");
  return `[${items}]`;
}

function generateCSharp() {
  const version = tokens.$metadata?.version ?? "0.0.0";
  const date    = tokens.$metadata?.updatedAt ?? "";

  return `// Auto-generated — do not edit manually. Run: node scripts/generate-tokens.js
// Room Rental Design System — v${version} — ${date}
// MudBlazor 9.x

using MudBlazor;

namespace RoomRental.Design;

/// <summary>
/// Central MudBlazor theme for all Blazor WASM applications in the Room Rental system.
/// Usage in Program.cs: builder.Services.AddMudServices(c => c.Theme = RoomRentalTheme.Create());
/// </summary>
public static class RoomRentalTheme
{
    public static MudTheme Create() => new()
    {
        PaletteLight = new PaletteLight
        {
            Primary            = "${t("color-primary-DEFAULT")}",
            PrimaryContrastText= "${t("color-primary-on")}",
            PrimaryDarken      = "${t("color-primary-dark")}",
            PrimaryLighten     = "${t("color-primary-container")}",

            Secondary            = "${t("color-secondary-DEFAULT")}",
            SecondaryContrastText= "${t("color-secondary-on")}",
            SecondaryDarken      = "${t("color-secondary-dark")}",
            SecondaryLighten     = "${t("color-secondary-container")}",

            Tertiary            = "${t("color-tertiary-DEFAULT")}",
            TertiaryContrastText= "${t("color-tertiary-on")}",
            TertiaryLighten     = "${t("color-tertiary-container")}",

            Success = "${t("color-semantic-success")}",
            Error   = "${t("color-semantic-error")}",
            Warning = "${t("color-semantic-warning")}",
            Info    = "${t("color-semantic-info")}",

            Background       = "${t("color-surface-background")}",
            Surface          = "${t("color-surface-surface")}",
            DrawerBackground = "${t("color-secondary-DEFAULT")}",
            AppbarBackground = "${t("color-secondary-DEFAULT")}",
            AppbarText       = "${t("color-secondary-on")}",

            TextPrimary   = "${t("color-text-primary")}",
            TextSecondary = "${t("color-text-secondary")}",
            TextDisabled  = "${t("color-text-disabled")}",

            Divider      = "${t("color-divider-DEFAULT")}",
            DividerLight = "${t("color-divider-strong")}",

            OverlayDark  = "rgba(0,0,0,0.5)",
            OverlayLight = "rgba(255,255,255,0.7)",

            Black = "#000000",
            White = "#FFFFFF",
        },

        PaletteDark = new PaletteDark
        {
            Primary            = "${t("color-dark-primary")}",
            PrimaryContrastText= "${t("color-dark-primary-on")}",
            PrimaryDarken      = "${t("color-primary-dark")}",
            PrimaryLighten     = "${t("color-primary-container")}",

            Secondary            = "${t("color-dark-secondary")}",
            SecondaryContrastText= "${t("color-dark-secondary-on")}",
            SecondaryDarken      = "${t("color-secondary-dark")}",

            Tertiary            = "${t("color-dark-tertiary")}",
            TertiaryContrastText= "${t("color-dark-tertiary-on")}",

            Success = "${t("color-dark-success")}",
            Error   = "#EF5350",
            Warning = "#FFA726",
            Info    = "${t("color-dark-info")}",

            Background       = "${t("color-dark-surface-background")}",
            Surface          = "${t("color-dark-surface-card")}",
            DrawerBackground = "${t("color-dark-surface-drawer")}",
            AppbarBackground = "${t("color-dark-surface-drawer")}",
            AppbarText       = "${t("color-dark-text-primary")}",

            TextPrimary   = "${t("color-dark-text-primary")}",
            TextSecondary = "${t("color-dark-text-secondary")}",
            TextDisabled  = "${t("color-dark-text-disabled")}",

            Divider      = "${t("color-dark-divider")}",
            DividerLight = "rgba(221,244,231,0.06)",

            OverlayDark  = "rgba(0,0,0,0.7)",
            OverlayLight = "rgba(221,244,231,0.08)",

            Black = "#000000",
            White = "#FFFFFF",
        },

        Typography = new Typography
        {
            Default = new Default
            {
                FontFamily = ${fontFamilyCSharp("typography-font-family-base")},
                FontSize   = "${t("typography-font-size-body1")}",
                FontWeight = ${t("typography-font-weight-regular")},
                LineHeight = ${t("typography-line-height-normal")},
            },
            H1 = new H1 { FontSize = "${t("typography-font-size-h1")}", FontWeight = ${t("typography-font-weight-regular")} },
            H2 = new H2 { FontSize = "${t("typography-font-size-h2")}", FontWeight = ${t("typography-font-weight-regular")} },
            H3 = new H3 { FontSize = "${t("typography-font-size-h3")}", FontWeight = ${t("typography-font-weight-regular")} },
            H4 = new H4 { FontSize = "${t("typography-font-size-h4")}", FontWeight = ${t("typography-font-weight-medium")} },
            H5 = new H5 { FontSize = "${t("typography-font-size-h5")}", FontWeight = ${t("typography-font-weight-medium")} },
            H6 = new H6 { FontSize = "${t("typography-font-size-h6")}", FontWeight = ${t("typography-font-weight-medium")} },
            Subtitle1 = new Subtitle1 { FontSize = "${t("typography-font-size-subtitle1")}", FontWeight = ${t("typography-font-weight-regular")} },
            Subtitle2 = new Subtitle2 { FontSize = "${t("typography-font-size-subtitle2")}", FontWeight = ${t("typography-font-weight-medium")} },
            Body1   = new Body1   { FontSize = "${t("typography-font-size-body1")}",  FontWeight = ${t("typography-font-weight-regular")} },
            Body2   = new Body2   { FontSize = "${t("typography-font-size-body2")}",  FontWeight = ${t("typography-font-weight-regular")} },
            Caption = new Caption { FontSize = "${t("typography-font-size-caption")}", FontWeight = ${t("typography-font-weight-regular")} },
            Button  = new Button  { FontSize = "${t("typography-font-size-button")}",  FontWeight = ${t("typography-font-weight-semibold")}, TextTransform = "uppercase" },
            Overline= new Overline{ FontSize = "${t("typography-font-size-overline")}", FontWeight = ${t("typography-font-weight-regular")}, TextTransform = "uppercase" },
        },

        LayoutProperties = new LayoutProperties
        {
            DefaultBorderRadius = "${t("border-radius-md")}",
            DrawerWidthLeft     = "260px",
            DrawerWidthRight    = "300px",
            DrawerMiniWidthLeft = "56px",
            AppbarHeight        = "64px",
        },
    };
}
`;
}

ensureDir(OUT_BLAZOR);
fs.writeFileSync(OUT_BLAZOR, generateCSharp(), "utf-8");
console.log(`✔  ${path.relative(ROOT, OUT_BLAZOR)}`);

// ─────────────────────────────────────────────────────────────────────────────
// 4. Mobile tokens — flat camelCase JSON (React Native / Flutter)
// ─────────────────────────────────────────────────────────────────────────────
function generateMobile(flat) {
  const out = {
    _generated: `Room Rental Design System v${tokens.$metadata?.version ?? "?"}`,
    _date: tokens.$metadata?.updatedAt ?? "",
  };
  for (const [key, value] of Object.entries(flat)) {
    const camel = key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    out[camel] = value;
  }
  return JSON.stringify(out, null, 2);
}

ensureDir(OUT_MOBILE);
fs.writeFileSync(OUT_MOBILE, generateMobile(flat), "utf-8");
console.log(`✔  ${path.relative(ROOT, OUT_MOBILE)}`);

console.log("\nAll tokens generated successfully.");
