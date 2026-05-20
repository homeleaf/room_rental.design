#!/usr/bin/env node
/**
 * Design Token Generator — Room Rental Design System
 *
 * Reads tokens/tokens.json and generates:
 *   generated/web/tokens.css       — CSS custom properties (all web apps)
 *   generated/blazor/RoomRentalTheme.cs — MudBlazor 9.x MudTheme (Blazor WASM)
 *   generated/mobile/tokens.json   — flat key-value (React Native / Flutter)
 *
 * Usage: node scripts/generate-tokens.js
 * No external dependencies required.
 */

const fs   = require("fs");
const path = require("path");

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT      = path.resolve(__dirname, "..");
const TOKENS    = path.join(ROOT, "tokens", "tokens.json");
const OUT_WEB   = path.join(ROOT, "generated", "web",    "tokens.css");
const OUT_BLAZOR= path.join(ROOT, "generated", "blazor", "RoomRentalTheme.cs");
const OUT_MOBILE= path.join(ROOT, "generated", "mobile", "tokens.json");

// ── Helpers ────────────────────────────────────────────────────────────────
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
      result[segment] = val.$value;
    } else if (val && typeof val === "object") {
      Object.assign(result, flattenTokens(val, segment));
    }
  }
  return result;
}

// ── Load tokens ────────────────────────────────────────────────────────────
const raw    = fs.readFileSync(TOKENS, "utf-8");
const tokens = JSON.parse(raw);
const flat   = flattenTokens(tokens);

// ─────────────────────────────────────────────────────────────────────────────
// 1. CSS Custom Properties
// ─────────────────────────────────────────────────────────────────────────────
function generateCss(flat) {
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

  // Dark mode overrides — map dark.* tokens to their light-mode counterparts
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
fs.writeFileSync(OUT_WEB, generateCss(flat), "utf-8");
console.log(`✔  ${path.relative(ROOT, OUT_WEB)}`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. MudBlazor 9.x Theme (C#)
// ─────────────────────────────────────────────────────────────────────────────
function t(key, fallback = "#000000") {
  return flat[key] ?? fallback;
}

/** Convert "Inter, -apple-system, 'Segoe UI'" → ["Inter", "-apple-system", "'Segoe UI'"] as C# array literal */
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
/// Reference this from Program.cs: builder.Services.AddMudServices(c => c.Theme = RoomRentalTheme.Create());
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
            DrawerBackground = "${t("color-primary-DEFAULT")}",
            AppbarBackground = "${t("color-primary-DEFAULT")}",
            AppbarText       = "${t("color-primary-on")}",

            TextPrimary   = "${t("color-text-primary")}",
            TextSecondary = "${t("color-text-secondary")}",
            TextDisabled  = "${t("color-text-disabled")}",

            Divider      = "${t("color-divider-DEFAULT")}",
            DividerLight = "rgba(18,65,112,0.06)",

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
            Button  = new Button  { FontSize = "${t("typography-font-size-button")}",  FontWeight = ${t("typography-font-weight-medium")}, TextTransform = "uppercase" },
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
// 3. Mobile tokens (flat JSON — React Native / Flutter)
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
