Diagnose and fix a broken HouseLeaf prototype by delegating to the
`prototype-doctor` subagent.

## Arguments

$ARGUMENTS

## Input format

The command accepts a single `desc:` key with a quoted description:

```
/fix-prototype desc: "trang manager-portal bị blank"
/fix-prototype desc: "auth-server console báo ReferenceError: useTweaks is not defined"
/fix-prototype desc: "style bị vỡ, màu sắc không đúng"
```

`desc:` is case-insensitive. The quotes are optional but recommended for
descriptions that contain spaces or punctuation.

## Steps

1. **Parse `$ARGUMENTS`**:
   - Extract the value after `desc:` (strip surrounding quotes if present).
   - If `$ARGUMENTS` is empty or has no `desc:` key, print the usage block
     above and stop — do NOT proceed without a description.

2. **Identify the prototype** from the description (if determinable):
   - Mentions "auth", "login", "register", "forgot", "consent", "OAuth"
     → `auth-server`
   - Mentions "manager", "portal", "dashboard", "room", "tenant", "invoice"
     → `manager-portal`
   - Ambiguous → pass it as-is; prototype-doctor will ask if needed.

3. **Spawn the `prototype-doctor` subagent** with this prompt:

   ```
   Fix the following prototype issue:

   <description from desc: argument>

   Prototype: <auth-server | manager-portal | unknown>

   Repo root: <absolute path of current working directory>

   Follow your diagnostic checklist in order. Read every relevant file before
   making any change. Apply the minimal fix. Report what was wrong, what was
   changed, and how to re-open the prototype.
   ```

4. **Relay the subagent's findings** to the user verbatim. Do not summarise
   or reinterpret — the user needs the exact diagnosis and changed lines.

5. **After a successful fix**, remind the user to re-open the prototype:
   - `/prototype auth-server`
   - `/prototype manager-portal`
