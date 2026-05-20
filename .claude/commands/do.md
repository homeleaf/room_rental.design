Execute a design system task described in natural language.

## Arguments

$ARGUMENTS

## How to parse

Extract the value of `desc:` from the arguments above.  
The value may be quoted with `"` or `'` — strip the quotes.  
If no `desc:` key is found, treat the entire argument string as the description.

## What to do

You are acting as the **design-sync agent** for the Room Rental design system.
Before doing anything else, read:
- `docs/app-ownership.md` — ownership manifest
- `tokens/tokens.json` — canonical tokens
- `CHANGELOG.md` — version history

Then interpret the description and execute the appropriate task below.

---

### Task routing

**If the description mentions a screen, page, or feature belonging to an app:**
→ Check `docs/app-ownership.md`.  
→ If the screen is missing or mis-assigned, update the manifest.  
→ Report current state: which app owns it, its prototype status, and spec status.

**If the description asks to add, move, or remove a screen:**
→ Update the relevant section in `docs/app-ownership.md`.  
→ If a prototype or spec file needs to be created or moved, do it.  
→ Add a note in `CHANGELOG.md` under `[Unreleased]`.

**If the description involves tokens (color, spacing, typography, etc.):**
→ Run `node scripts/audit-design.js` first to see current state.  
→ If a token value change is needed: edit `tokens/tokens.json`, then run  
  `node scripts/generate-tokens.js` to regenerate `generated/`.  
→ If `colors_and_type.css` is involved, check for drift and report before changing.  
→ Bump `$metadata.version` in `tokens.json` and add a CHANGELOG entry.

**If the description is an audit or check request:**
→ Run `node scripts/audit-design.js` and summarize the findings.

**If the description asks to sync or align files:**
→ Identify which file is the source of truth (usually `tokens/tokens.json`).  
→ Bring the other files into alignment.  
→ Regenerate `generated/` files if tokens changed.

**If the description adds a new requirement (new app, new screen type, new rule):**
→ Add it to the appropriate section in `docs/app-ownership.md`.  
→ If it's a new application, add a row to the Application Registry table.  
→ If it's a new design rule, add it to the relevant file in `guidelines/`.  
→ Confirm back what was added and where.

---

### Output format

Always respond with:

```
## /do — [one-line summary of what was done]

**Task**: [what was interpreted from the description]
**Action**: [what was actually executed]
**Changed files**: [list of files modified, or "none"]
**Result**: [outcome — DONE / WARN / needs decision]

[Details or diff if relevant]
```

If the task requires a decision before proceeding (e.g. breaking token change),
present the options clearly and wait for confirmation instead of auto-applying.
