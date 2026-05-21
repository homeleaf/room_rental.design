Open a Room Rental prototype in the default browser.

## Arguments

$ARGUMENTS

## Available prototypes

| Key | Path |
|-----|------|
| `auth-server` | `components/prototypes/auth-server/index.html` |
| `manager-portal` | `components/prototypes/manager-portal/index.html` |

## Why HTTP is required

Babel Standalone loads external `<script type="text/babel" src="...">` files via XHR.
Chromium blocks all XHR from `null` origin (`file://` protocol) → CORS errors → blank page.
The prototype **must** be served over HTTP, not opened directly from the filesystem.

## Steps

1. Parse `$ARGUMENTS`:
   - Contains `auth` or `auth-server` → target = `auth-server`
   - Contains `manager` or `portal` or `manager-portal` → target = `manager-portal`
   - Empty / `list` / unrecognised → print the table above and stop (do not open anything)

2. Resolve the repo root (the working directory for this project).

3. Pick a free port (default **3131**). Start a Node.js HTTP static server from the **repo root**
   so all relative paths (`../../../generated/prototype/base.css`, `../shared/atoms.jsx`, etc.)
   resolve correctly.

   **Check first — reuse if already running:**

   ```powershell
   $already = Get-NetTCPConnection -LocalPort 3131 -State Listen -ErrorAction SilentlyContinue
   if (-not $already) {
     # Write a self-contained server script to a temp file so it survives after this session ends
     $srv = "$env:TEMP\hl-prototype-srv.js"
     Set-Content $srv @'
const http = require('http'), fs = require('fs'), path = require('path');
const root = 'C:/Workspace/temps/room_rental.design';
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript',
              '.jsx':'application/javascript','.json':'application/json',
              '.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  const fp = path.join(root, req.url.split('?')[0]);
  fs.readFile(fp,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(fp)]||'text/plain',
                       'Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(3131,()=>{});
'@
     # Spawn node as a fully detached OS process — survives after the PowerShell session exits
     Start-Process -FilePath "node" -ArgumentList $srv -WindowStyle Hidden
     Start-Sleep -Milliseconds 800

     # Liveness check — wait up to 3 more seconds for the port to appear
     $ok = $false
     for ($i = 0; $i -lt 6; $i++) {
       $conn = Get-NetTCPConnection -LocalPort 3131 -State Listen -ErrorAction SilentlyContinue
       if ($conn) { $ok = $true; break }
       Start-Sleep -Milliseconds 500
     }
     if (-not $ok) { Write-Host "ERROR: server did not start on port 3131"; exit 1 }
   }
   ```

   Replace `C:/Workspace/temps/room_rental.design` with the actual resolved repo root if different.

4. Open the prototype URL in the default browser:

   ```powershell
   Start-Process "http://localhost:3131/components/prototypes/<target>/index.html"
   ```

5. Reply with:

```
## /prototype — <target>

Served via local HTTP on port 3131 (Babel XHR requires HTTP — file:// is blocked by CORS)
   http://localhost:3131/components/prototypes/<target>/index.html

The background server stays alive as a detached OS process. Re-running /prototype reuses it.
```

If the file does not exist at the resolved path, report the error and suggest running
`node scripts/generate-tokens.js` in case generated assets are missing.

If port 3131 is permanently occupied, try 3132, 3133, etc. and update the URL accordingly.
