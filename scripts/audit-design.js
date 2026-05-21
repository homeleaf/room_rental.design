#!/usr/bin/env node
/**
 * Design System Audit — Room Rental
 *
 * Kiểm tra tự động các vấn đề trong design system:
 *   1. Generated file freshness — generated/ có sync với tokens.json không?
 *   2. CSS variable usage — tìm var() trong prototypes không có trong generated/prototype/base.css
 *   3. Screen inventory — đếm screens và trạng thái theo app
 *   4. Version consistency — kiểm tra version string nhất quán không?
 *   5. Spec coverage — components/specs/ có files không?
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

function extractCssVars(css) {
  const vars = {};
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    vars["--" + m[1]] = m[2].trim();
  }
  return vars;
}

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
// Audit state
// ─────────────────────────────────────────────────────────────────────────────

const issues   = [];
const findings = {};

function issue(severity, category, message, detail) {
  issues.push({ severity, category, message, detail });
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 1 — Generated file freshness
//   All generated/ files must be newer than tokens/tokens.json.
//   If not, they need regeneration with: node scripts/generate-tokens.js
// ─────────────────────────────────────────────────────────────────────────────
function checkGeneratedFreshness() {
  const tokenMtime = mtime("tokens/tokens.json");
  const generatedFiles = [
    { rel: "generated/web/tokens.css",            label: "Web CSS" },
    { rel: "generated/prototype/base.css",         label: "Prototype CSS" },
    { rel: "generated/blazor/RoomRentalTheme.cs",  label: "Blazor theme" },
    { rel: "generated/mobile/tokens.json",         label: "Mobile JSON" },
  ];

  const stale   = [];
  const missing = [];

  for (const { rel, label } of generatedFiles) {
    if (!fileExists(rel)) {
      missing.push({ rel, label });
    } else if (mtime(rel) < tokenMtime) {
      stale.push({ rel, label });
    }
  }

  findings.generatedFiles = {
    stale:   stale.map(x => x.rel),
    missing: missing.map(x => x.rel),
  };

  if (missing.length > 0) {
    for (const { rel, label } of missing) {
      issue("error", "freshness", `Missing generated file: ${rel} (${label})`,
        "Run: node scripts/generate-tokens.js");
    }
  }
  if (stale.length > 0) {
    for (const { rel, label } of stale) {
      issue("warn", "freshness", `Stale generated file: ${rel} (${label})`,
        "Run: node scripts/generate-tokens.js");
    }
  }
  if (missing.length === 0 && stale.length === 0) {
    issue("info", "freshness", "All generated files are up-to-date with tokens.json");
  }

  if (AUTO_FIX && (stale.length > 0 || missing.length > 0)) {
    console.log("\n🔧 --fix: regenerating...");
    require("./generate-tokens.js");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 2 — CSS variable usage in prototypes
//   Every var(--x) in prototype JSX and app-scoped CSS must be declared in:
//   - generated/prototype/base.css  (global tokens)
//   - the app's own styles.css      (app-scoped vars)
// ─────────────────────────────────────────────────────────────────────────────
function checkVarUsage() {
  const protoCss = readFile("generated/prototype/base.css");
  if (!protoCss) {
    issue("error", "var-usage",
      "generated/prototype/base.css not found — run: node scripts/generate-tokens.js");
    return;
  }

  // All vars declared globally
  const globalDeclared = new Set(Object.keys(extractCssVars(protoCss)));

  // All vars declared in app-scoped stylesheets
  const appStylesheets = [
    "components/prototypes/auth-server/styles.css",
    "components/prototypes/manager-portal/styles.css",
  ];
  const allDeclared = new Set(globalDeclared);
  for (const rel of appStylesheets) {
    const content = readFile(rel);
    if (content) {
      for (const v of Object.keys(extractCssVars(content))) allDeclared.add(v);
    }
  }

  // Scan prototype JSX for var() references (excluding stylesheets already scanned)
  const scanFiles = [
    "components/prototypes/auth-server/App.jsx",
    "components/prototypes/manager-portal/atoms.jsx",
    "components/prototypes/manager-portal/chrome.jsx",
    "components/prototypes/manager-portal/screens.jsx",
  ];

  const undeclared = new Set();
  for (const rel of scanFiles) {
    const content = readFile(rel);
    if (!content) continue;
    for (const ref of extractVarRefs(content)) {
      if (!allDeclared.has(ref)) undeclared.add(`${ref}  (${path.basename(rel)})`);
    }
  }

  findings.undeclaredVars = [...undeclared];

  if (undeclared.size === 0) {
    issue("info", "var-usage",
      `All var() references in prototypes are declared (${globalDeclared.size} global, app-scoped vars included)`);
  } else {
    for (const v of undeclared) {
      issue("warn", "var-usage", `Undeclared CSS variable: ${v}`,
        "Add to tokens.json → regenerate, or add to the app's styles.css for app-scoped vars");
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 3 — Screen inventory
// ─────────────────────────────────────────────────────────────────────────────
function checkScreenInventory() {
  const authApp        = readFile("components/prototypes/auth-server/App.jsx") ?? "";
  const managerApp     = readFile("components/prototypes/manager-portal/App.jsx") ?? "";
  const managerScreens = readFile("components/prototypes/manager-portal/screens.jsx") ?? "";

  // Auth server: use function declarations as the canonical screen count
  const authFuncRe = /function\s+(\w+Screen)\b/g;
  const authFuncNames = [];
  let m;
  while ((m = authFuncRe.exec(authApp)) !== null) authFuncNames.push(m[1]);
  const authScreenDisplay = authFuncNames.map(f => f.replace("Screen", "").toLowerCase());

  // Manager portal: case statements in router
  const managerKeys = [];
  const caseRe = /case\s+"(\w+)"\s*:/g;
  while ((m = caseRe.exec(managerApp)) !== null) managerKeys.push(m[1]);

  // Implemented screen functions in manager
  const managerFuncRe = /function\s+(\w+Screen)\b/g;
  const managerFuncNames = [];
  while ((m = managerFuncRe.exec(managerScreens)) !== null) managerFuncNames.push(m[1]);

  // Placeholder screens in manager
  const placeholders = [];
  const phRe = /<PlaceholderScreen[^>]+title="([^"]+)"/g;
  while ((m = phRe.exec(managerApp + managerScreens)) !== null) placeholders.push(m[1]);

  findings.screenInventory = {
    "auth-server":    { screens: authScreenDisplay, implementations: authFuncNames },
    "manager-portal": { routes: managerKeys, implementations: managerFuncNames.map(f => f.replace("Screen","")), placeholders: [...new Set(placeholders)] },
  };

  issue("info", "screen-inventory",
    `auth-server: ${authFuncNames.length} screens — [${authScreenDisplay.join(", ")}]`
  );
  issue("info", "screen-inventory",
    `manager-portal: ${managerKeys.length} routes  |  ${managerFuncNames.length} implemented  |  ${[...new Set(placeholders)].length} placeholder`
  );

  if (placeholders.length > 0) {
    issue("warn", "screen-inventory",
      `${[...new Set(placeholders)].length} placeholder screen(s): [${[...new Set(placeholders)].join(", ")}]`,
      "These screens need real prototypes (Phase 3 or later)"
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 4 — Version consistency
// ─────────────────────────────────────────────────────────────────────────────
function extractVersionFromComment(content) {
  if (!content) return null;
  const m = content.match(/v(\d+\.\d+\.\d+)/);
  return m ? m[1] : "?";
}
function extractVersionFromJson(content) {
  if (!content) return null;
  try {
    const j = JSON.parse(content);
    const m = String(j._generated ?? j.$metadata?.version ?? "").match(/v?(\d+\.\d+\.\d+)/);
    return m ? m[1] : "?";
  } catch { return "?"; }
}
function extractVersionFromChangelog(content) {
  if (!content) return null;
  const m = content.match(/##\s+\[(\d+\.\d+\.\d+)\]/);
  return m ? m[1] : "?";
}

function checkVersionConsistency() {
  const tokensSrc = readFile("tokens/tokens.json");
  if (!tokensSrc) return;
  const tokens  = JSON.parse(tokensSrc);
  const version = tokens.$metadata?.version ?? "?";

  const versionRefs = {
    "tokens/tokens.json":                        version,
    "generated/web/tokens.css":                  extractVersionFromComment(readFile("generated/web/tokens.css")),
    "generated/prototype/base.css":              extractVersionFromComment(readFile("generated/prototype/base.css")),
    "generated/blazor/RoomRentalTheme.cs":       extractVersionFromComment(readFile("generated/blazor/RoomRentalTheme.cs")),
    "generated/mobile/tokens.json":              extractVersionFromJson(readFile("generated/mobile/tokens.json")),
    "CHANGELOG.md":                              extractVersionFromChangelog(readFile("CHANGELOG.md")),
  };

  findings.versionRefs = versionRefs;

  const mismatches = Object.entries(versionRefs)
    .filter(([, v]) => v && v !== "?" && v !== version);

  if (mismatches.length === 0) {
    issue("info", "version-consistency",
      `All files reference version ${version}`);
  } else {
    for (const [file, v] of mismatches) {
      issue("warn", "version-consistency",
        `Version mismatch in ${file}: found "${v}", tokens.json says "${version}"`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 5 — Spec coverage
// ─────────────────────────────────────────────────────────────────────────────
function checkSpecCoverage() {
  const specDirs = {
    "components/specs/auth-server":    "auth-server",
    "components/specs/manager-portal": "manager-portal",
    "components/specs/atoms":          "shared atoms",
  };

  const results = [];
  for (const [dir, label] of Object.entries(specDirs)) {
    if (!fileExists(dir)) {
      results.push({ dir, label, status: "missing-dir" });
    } else {
      const files = fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(".md"));
      results.push({ dir, label, status: "exists", count: files.length, files });
    }
  }

  findings.specCoverage = results;

  for (const r of results) {
    if (r.status === "missing-dir") {
      issue("warn", "spec-coverage",
        `Spec directory missing: ${r.dir}  (${r.label})`,
        "Claude Design should create component specs here");
    } else if (r.count === 0) {
      issue("warn", "spec-coverage",
        `Spec directory empty: ${r.dir}  (${r.label})`);
    } else {
      issue("info", "spec-coverage",
        `${r.dir}: ${r.count} spec(s) — [${r.files.join(", ")}]`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────
checkGeneratedFreshness();
checkVarUsage();
checkScreenInventory();
checkVersionConsistency();
checkSpecCoverage();

// ─────────────────────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────────────────────
if (JSON_OUTPUT) {
  console.log(JSON.stringify({ issues, findings }, null, 2));
  process.exit(0);
}

const ICONS  = { error: "❌", warn: "⚠️ ", info: "ℹ️ " };
const COLORS = { error: "\x1b[31m", warn: "\x1b[33m", info: "\x1b[36m", reset: "\x1b[0m" };

const catLabels = {
  "freshness":         "① Generated File Freshness",
  "var-usage":         "② CSS Variable Usage",
  "screen-inventory":  "③ Screen Inventory",
  "version-consistency":"④ Version Consistency",
  "spec-coverage":     "⑤ Spec Coverage",
};

const categories = [...new Set(issues.map(i => i.category))];
let errorCount = 0, warnCount = 0;

console.log(`\n${"═".repeat(64)}`);
console.log(`  Room Rental — Design System Audit`);
console.log(`  ${new Date().toISOString().slice(0, 10)}`);
console.log(`${"═".repeat(64)}\n`);

for (const cat of categories) {
  const catIssues = issues.filter(i => i.category === cat);
  console.log(`  ${catLabels[cat] ?? cat}`);
  console.log(`  ${"─".repeat(52)}`);
  for (const i of catIssues) {
    if (i.severity === "error") errorCount++;
    if (i.severity === "warn")  warnCount++;
    const icon  = ICONS[i.severity]  ?? "  ";
    const color = COLORS[i.severity] ?? "";
    console.log(`  ${color}${icon}  ${i.message}${COLORS.reset}`);
    if (i.detail) console.log(`        ${COLORS.info}↳ ${i.detail}${COLORS.reset}`);
  }
  console.log();
}

console.log(`${"─".repeat(64)}`);
const status      = errorCount > 0 ? "FAIL" : warnCount > 0 ? "WARN" : "PASS";
const statusColor = errorCount > 0 ? COLORS.error : warnCount > 0 ? COLORS.warn : "\x1b[32m";
console.log(`  ${statusColor}${status}${COLORS.reset}  ${errorCount} error(s)  ${warnCount} warning(s)`);
if (errorCount > 0 || warnCount > 0) {
  console.log(`\n  To regenerate: node scripts/generate-tokens.js`);
  console.log(`  Ownership manifest: docs/app-ownership.md\n`);
}
console.log();

process.exit(errorCount > 0 ? 1 : 0);
