#!/usr/bin/env node
/**
 * Design System Audit — Room Rental
 *
 * Kiểm tra tự động các vấn đề trong design system:
 *   1. Token drift  — so sánh tokens.json vs colors_and_type.css vs generated/
 *   2. CSS variable usage — tìm var() trong prototypes không có trong colors_and_type.css
 *   3. Generated file freshness — generated/ có sync với tokens.json không?
 *   4. Screen inventory — đếm screens và trạng thái theo app
 *   5. Version consistency — kiểm tra version string nhất quán không?
 *
 * Usage:
 *   node scripts/audit-design.js            # full audit, human-readable
 *   node scripts/audit-design.js --json     # JSON output (for agents)
 *   node scripts/audit-design.js --fix      # auto-fix: regenerate generated/ files
 *
 * No external dependencies.
 */

const fs   = require("fs");
const path = require("path");

const ROOT        = path.resolve(__dirname, "..");
const JSON_OUTPUT = process.argv.includes("--json");
const AUTO_FIX    = process.argv.includes("--fix");

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function readFile(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function mtime(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return 0;
  return fs.statSync(p).mtimeMs;
}

// Flatten nested token object → { "color-primary-DEFAULT": "#124170", ... }
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

// Extract CSS custom property declarations from a CSS string
// Returns { "--var-name": "value", ... }
function extractCssVars(css) {
  const vars = {};
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    vars["--" + m[1]] = m[2].trim();
  }
  return vars;
}

// Extract all var() references from a CSS/JSX string
// Returns Set of "--var-name" strings
function extractVarRefs(content) {
  const refs = new Set();
  const re = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    refs.add(m[1]);
  }
  return refs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit checks
// ─────────────────────────────────────────────────────────────────────────────

const issues   = [];   // { severity: "error"|"warn"|"info", category, message, detail? }
const findings = {};   // arbitrary data for JSON output

function issue(severity, category, message, detail) {
  issues.push({ severity, category, message, detail });
}

// ── 1. Token drift ────────────────────────────────────────────────────────────

function checkTokenDrift() {
  const tokensSrc = readFile("tokens/tokens.json");
  const cssSrc    = readFile("components/prototypes/colors_and_type.css");

  if (!tokensSrc) { issue("error", "token-drift", "tokens/tokens.json not found"); return; }
  if (!cssSrc)    { issue("error", "token-drift", "components/prototypes/colors_and_type.css not found"); return; }

  const tokens   = JSON.parse(tokensSrc);
  const flat     = flattenTokens(tokens);
  const cssVars  = extractCssVars(cssSrc);

  const tokenVersion = tokens.$metadata?.version ?? "?";
  // Detect version comment in CSS (looks for "v1.2.0" pattern)
  const cssVersionMatch = cssSrc.match(/v(\d+\.\d+\.\d+)/);
  const cssVersion = cssVersionMatch ? cssVersionMatch[1] : "?";

  findings.tokenVersion  = tokenVersion;
  findings.cssVersion    = cssVersion;

  if (tokenVersion !== cssVersion) {
    issue("warn", "token-drift",
      `Version mismatch: tokens.json=${tokenVersion}, colors_and_type.css=${cssVersion}`,
      "colors_and_type.css may have unreleased changes not yet in tokens.json"
    );
  }

  // Build a mapping from tokens.json flat keys → canonical CSS var names used in colors_and_type.css
  // tokens.json:  color-primary-DEFAULT → CSS: --color-primary (simplified name in colors_and_type.css)
  // We check only the known mappings where both sides declare a color value

  // The CSS uses a different (simplified) naming convention vs the generated tokens.css
  // We track specific known divergent values
  const knownMappings = {
    "--color-primary":            flat["color-primary-DEFAULT"],
    "--color-secondary":          flat["color-secondary-DEFAULT"],
    "--color-tertiary":           flat["color-tertiary-DEFAULT"],
    "--color-success":            flat["color-semantic-success"],
    "--color-error":              flat["color-semantic-error"],
    "--color-warning":            flat["color-semantic-warning"],
    "--color-info":               flat["color-semantic-info"],
    "--color-bg":                 flat["color-surface-background"],
    "--color-surface":            flat["color-surface-surface"],
    "--color-surface-dim":        flat["color-surface-surface-dim"],
  };

  const drifts = [];
  for (const [cssVar, tokenValue] of Object.entries(knownMappings)) {
    if (!cssVars[cssVar]) continue;  // not present in CSS — skip
    if (tokenValue === undefined) continue;
    const cssValue = cssVars[cssVar];
    if (cssValue.toLowerCase() !== tokenValue.toLowerCase()) {
      drifts.push({ cssVar, inTokensJson: tokenValue, inColorsCss: cssValue });
    }
  }

  findings.tokenDrifts = drifts;

  if (drifts.length === 0) {
    issue("info", "token-drift", "No color value drifts detected between tokens.json and colors_and_type.css");
  } else {
    for (const d of drifts) {
      issue("warn", "token-drift",
        `Drift on ${d.cssVar}: tokens.json="${d.inTokensJson}"  colors_and_type.css="${d.inColorsCss}"`,
        "Decide which is canonical, then update the other and bump version"
      );
    }
  }
}

// ── 2. CSS variable usage in prototypes ───────────────────────────────────────

function checkVarUsage() {
  const globalCss = readFile("components/prototypes/colors_and_type.css");
  if (!globalCss) return;

  // Build set of all declared CSS vars — global + each app's own stylesheet
  // (app-scoped vars like --rented, --avail are legit when declared in that app's CSS)
  const appStylesheets = [
    "components/prototypes/auth-server/styles.css",
    "components/prototypes/manager-portal/styles.css",
  ];
  const allDeclared = new Set(Object.keys(extractCssVars(globalCss)));
  for (const rel of appStylesheets) {
    const content = readFile(rel);
    if (content) {
      for (const v of Object.keys(extractCssVars(content))) allDeclared.add(v);
    }
  }

  // Files to scan for var() references (JSX + CSS, excluding stylesheets already scanned above)
  const protoFiles = [
    "components/prototypes/auth-server/App.jsx",
    "components/prototypes/manager-portal/atoms.jsx",
    "components/prototypes/manager-portal/chrome.jsx",
    "components/prototypes/manager-portal/screens.jsx",
  ];

  const undeclared = new Set();
  for (const rel of protoFiles) {
    const content = readFile(rel);
    if (!content) continue;
    for (const ref of extractVarRefs(content)) {
      if (!allDeclared.has(ref)) undeclared.add(`${ref} (in ${path.basename(rel)})`);
    }
  }

  findings.undeclaredVars = [...undeclared];

  if (undeclared.size === 0) {
    issue("info", "var-usage", "All var() references in prototypes are declared (global or app-scoped)");
  } else {
    for (const v of undeclared) {
      issue("warn", "var-usage", `Undeclared CSS variable: ${v}`,
        "Add to colors_and_type.css (global) or the app's styles.css (app-scoped)");
    }
  }
}

// ── 3. Generated files freshness ──────────────────────────────────────────────

function checkGeneratedFreshness() {
  const tokenMtime = mtime("tokens/tokens.json");
  const generatedFiles = [
    "generated/web/tokens.css",
    "generated/blazor/RoomRentalTheme.cs",
    "generated/mobile/tokens.json",
  ];

  const stale = [];
  for (const rel of generatedFiles) {
    if (!fileExists(rel)) {
      stale.push({ file: rel, reason: "missing" });
      continue;
    }
    const gMtime = mtime(rel);
    if (gMtime < tokenMtime) {
      stale.push({ file: rel, reason: "older than tokens.json" });
    }
  }

  findings.staleGenerated = stale;

  if (stale.length === 0) {
    issue("info", "generated-freshness", "All generated files are up-to-date");
  } else {
    for (const s of stale) {
      issue("warn", "generated-freshness",
        `Generated file may be stale: ${s.file} (${s.reason})`,
        "Run: node scripts/generate-tokens.js"
      );
    }
    if (AUTO_FIX) {
      console.log("\n🔧 --fix: regenerating generated files...");
      require("./generate-tokens.js");
    }
  }
}

// ── 4. Screen inventory ───────────────────────────────────────────────────────

function checkScreenInventory() {
  const authApp    = readFile("components/prototypes/auth-server/App.jsx") ?? "";
  const managerApp = readFile("components/prototypes/manager-portal/App.jsx") ?? "";
  const managerScreens = readFile("components/prototypes/manager-portal/screens.jsx") ?? "";

  // Auth server: parse the tabs array specifically
  // Pattern: [["login", "..."], ["register", "..."]] — only the 2-element sub-arrays
  // inside the auth-tabs .map() call, to avoid matching TweakRadio options arrays
  const authScreens = [];
  const authTabsBlockMatch = authApp.match(/auth-tabs[\s\S]{0,200}\[(\[.*?\](?:\s*,\s*\[.*?\])*)\]\.map/);
  let m;
  if (authTabsBlockMatch) {
    const tabsBlock = authTabsBlockMatch[1];
    const tabRe = /\[\s*["'](\w+)["']\s*,\s*["'][^"']+["']\s*\]/g;
    while ((m = tabRe.exec(tabsBlock)) !== null) authScreens.push(m[1]);
  }
  // Fallback: use function declarations if tab parsing failed
  const authScreensFinal = authScreens.length > 0 ? authScreens : [];

  // Also detect via function declarations: function LoginScreen, RegisterScreen …
  const authFuncRe = /function\s+(\w+Screen)\b/g;
  const authFuncNames = [];
  while ((m = authFuncRe.exec(authApp)) !== null) authFuncNames.push(m[1]);

  // Manager portal: case "xxx":
  const managerScreensList = [];
  const caseRe = /case\s+"(\w+)"\s*:/g;
  while ((m = caseRe.exec(managerApp)) !== null) managerScreensList.push(m[1]);

  // Placeholder screens
  const placeholders = [];
  const phRe = /<PlaceholderScreen[^>]+title="([^"]+)"/g;
  while ((m = phRe.exec(managerApp + managerScreens)) !== null) placeholders.push(m[1]);

  // Real implemented screen functions in manager portal
  const managerFuncRe = /function\s+(\w+Screen)\b/g;
  const managerFuncNames = [];
  while ((m = managerFuncRe.exec(managerScreens)) !== null) managerFuncNames.push(m[1]);

  // Use function names as canonical screen count for auth-server (more reliable)
  const authScreenDisplay = authFuncNames.map(f => f.replace("Screen", "").toLowerCase());

  findings.screenInventory = {
    "auth-server": {
      screens: authScreenDisplay,
      implementations: authFuncNames,
    },
    "manager-portal": {
      routerKeys: managerScreensList,
      implementations: managerFuncNames,
      placeholders: [...new Set(placeholders)],
    },
  };

  issue("info", "screen-inventory",
    `auth-server: ${authFuncNames.length} screens [${authScreenDisplay.join(", ")}]`
  );
  issue("info", "screen-inventory",
    `manager-portal: ${managerScreensList.length} routes  |  ${managerFuncNames.length} fully implemented  |  ${[...new Set(placeholders)].length} placeholder`
  );
  if (placeholders.length > 0) {
    issue("warn", "screen-inventory",
      `${placeholders.length} placeholder screen(s) in manager-portal: [${[...new Set(placeholders)].join(", ")}]`,
      "These screens need real prototypes"
    );
  }
}

// ── 5. Version consistency ────────────────────────────────────────────────────

function checkVersionConsistency() {
  const tokensSrc = readFile("tokens/tokens.json");
  if (!tokensSrc) return;

  const tokens  = JSON.parse(tokensSrc);
  const version = tokens.$metadata?.version ?? "?";

  const versionRefs = {
    "tokens/tokens.json":                         version,
    "generated/web/tokens.css":                   extractVersionFromComment(readFile("generated/web/tokens.css")),
    "generated/blazor/RoomRentalTheme.cs":        extractVersionFromComment(readFile("generated/blazor/RoomRentalTheme.cs")),
    "generated/mobile/tokens.json":               extractVersionFromJson(readFile("generated/mobile/tokens.json")),
    "components/prototypes/colors_and_type.css":  extractVersionFromComment(readFile("components/prototypes/colors_and_type.css")),
    "CHANGELOG.md":                               extractVersionFromChangelog(readFile("CHANGELOG.md")),
  };

  findings.versionRefs = versionRefs;

  const mismatches = Object.entries(versionRefs)
    .filter(([, v]) => v && v !== version && v !== "?");

  if (mismatches.length === 0) {
    issue("info", "version-consistency", `All files reference version ${version}`);
  } else {
    for (const [file, v] of mismatches) {
      issue("warn", "version-consistency",
        `Version mismatch in ${file}: found "${v}", tokens.json says "${version}"`
      );
    }
  }
}

function extractVersionFromComment(content) {
  if (!content) return null;
  const m = content.match(/v(\d+\.\d+\.\d+)/);
  return m ? m[1] : "?";
}

function extractVersionFromJson(content) {
  if (!content) return null;
  try {
    const j = JSON.parse(content);
    const m = String(j._generated ?? "").match(/v(\d+\.\d+\.\d+)/);
    return m ? m[1] : "?";
  } catch { return "?"; }
}

function extractVersionFromChangelog(content) {
  if (!content) return null;
  const m = content.match(/##\s+\[(\d+\.\d+\.\d+)\]/);
  return m ? m[1] : "?";
}

// ── 6. Spec vs prototype gap ──────────────────────────────────────────────────

function checkSpecGap() {
  const specDirs = [
    "components/specs/auth-server",
    "components/specs/manager-portal",
  ];
  const protoDirs = [
    "components/prototypes/auth-server",
    "components/prototypes/manager-portal",
  ];

  const specsExist = specDirs.map(d => ({ dir: d, exists: fileExists(d) }));
  const noSpecs = specsExist.filter(x => !x.exists);

  findings.specGap = { missingSpecDirs: noSpecs.map(x => x.dir) };

  if (noSpecs.length > 0) {
    issue("warn", "spec-gap",
      `Spec directory does not exist: ${noSpecs.map(x => x.dir).join(", ")}`,
      "Component specs (markdown) should be created by Claude Design and committed here"
    );
  } else {
    issue("info", "spec-gap", "Spec directories exist for all active apps");
  }

  // Check if specs exist as individual files (if spec dir exists)
  for (const d of specDirs) {
    if (!fileExists(d)) continue;
    const specFiles = fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith(".md"));
    if (specFiles.length === 0) {
      issue("warn", "spec-gap", `Spec directory ${d} is empty — no component specs written yet`);
    } else {
      issue("info", "spec-gap", `${d}: ${specFiles.length} spec file(s) — [${specFiles.join(", ")}]`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────

checkTokenDrift();
checkVarUsage();
checkGeneratedFreshness();
checkScreenInventory();
checkVersionConsistency();
checkSpecGap();

// ─────────────────────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────────────────────

if (JSON_OUTPUT) {
  console.log(JSON.stringify({ issues, findings }, null, 2));
  process.exit(0);
}

// Human-readable output
const ICONS = { error: "❌", warn: "⚠️ ", info: "ℹ️ " };
const COLORS = { error: "\x1b[31m", warn: "\x1b[33m", info: "\x1b[36m", reset: "\x1b[0m" };

const categories = [...new Set(issues.map(i => i.category))];
let errorCount = 0, warnCount = 0;

console.log(`\n${"═".repeat(64)}`);
console.log(`  Room Rental — Design System Audit`);
console.log(`  ${new Date().toISOString().slice(0,10)}`);
console.log(`${"═".repeat(64)}\n`);

for (const cat of categories) {
  const catIssues = issues.filter(i => i.category === cat);
  const catLabel = {
    "token-drift":          "① Token Drift",
    "var-usage":            "② CSS Variable Usage",
    "generated-freshness":  "③ Generated Files",
    "screen-inventory":     "④ Screen Inventory",
    "version-consistency":  "⑤ Version Consistency",
    "spec-gap":             "⑥ Spec Coverage",
  }[cat] ?? cat;

  console.log(`  ${catLabel}`);
  console.log(`  ${"─".repeat(52)}`);
  for (const i of catIssues) {
    if (i.severity === "error") errorCount++;
    if (i.severity === "warn")  warnCount++;
    const icon = ICONS[i.severity] ?? "  ";
    const color = COLORS[i.severity] ?? "";
    console.log(`  ${color}${icon}  ${i.message}${COLORS.reset}`);
    if (i.detail) console.log(`        ${COLORS.info}↳ ${i.detail}${COLORS.reset}`);
  }
  console.log();
}

console.log(`${"─".repeat(64)}`);
const status = errorCount > 0 ? "FAIL" : warnCount > 0 ? "WARN" : "PASS";
const statusColor = errorCount > 0 ? COLORS.error : warnCount > 0 ? COLORS.warn : "\x1b[32m";
console.log(`  ${statusColor}${status}${COLORS.reset}  ${errorCount} error(s)  ${warnCount} warning(s)`);
if (errorCount > 0 || warnCount > 0) {
  console.log(`\n  Run with --fix to auto-regenerate generated/ files.`);
  console.log(`  See docs/app-ownership.md for the ownership manifest.\n`);
}
console.log();

process.exit(errorCount > 0 ? 1 : 0);
