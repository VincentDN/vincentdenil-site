# vTinyShell — local static file server with a built-in comment API
# Lives in tools/, but serves the repo root at http://localhost:8000/ over
# a real http:// origin instead of file://, and saves comments straight to
# feedback/ on disk. Run via tools/vTinyShell.bat (double-click that instead
# of this file).
#
# This is the same tool used in the vdn-roadmap repo (there it powers
# comments on the Ops Wiki). The select-text-and-comment widget itself is
# assets/tinyshell-comments.js, wired up to every page under /docs/. See
# the printed guide below.

param(
    # vTinyShell.bat passes this explicitly (the repo root, one level up from
    # tools/) so serving doesn't depend on how $PSScriptRoot gets resolved
    # under whatever invoked this script. Falls back to that auto-detection
    # only if run some other way (e.g. right-click > Run with PowerShell).
    [string]$Root
)
if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$Root = [System.IO.Path]::GetFullPath($Root)

$Port = 8000
$FeedbackDir = Join-Path $Root "feedback"
$ImagesDir = Join-Path $FeedbackDir "images"
$CommentsJsonPath = Join-Path $FeedbackDir "comments.json"
$CommentsMdPath = Join-Path $FeedbackDir "comments.md"
$AllowedImageExt = @(".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp")
$MaxImageBytes = 15MB

New-Item -ItemType Directory -Force -Path $FeedbackDir | Out-Null

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")

try {
    $Listener.Start()
} catch {
    Write-Host "Could not start server on port $Port. Is it already running? ($_)"
    Read-Host "Press Enter to close"
    exit 1
}

$RootFull = $Root
$StartUrl = "http://localhost:$Port/projects/"
$ProjectsIndexPath = Join-Path $Root "projects\index.html"

Write-Host ""
Write-Host "===================================================================="
Write-Host " vTinyShell -- local server + comment API for vincentdenil-site"
Write-Host "===================================================================="
Write-Host " Serving from: $Root"
if (-not (Test-Path $ProjectsIndexPath -PathType Leaf)) {
    Write-Host ""
    Write-Host " *** WARNING: $ProjectsIndexPath does not exist. ***"
    Write-Host " vTinyShell thinks the repo root is the folder above, but that"
    Write-Host " folder doesn't contain projects\index.html, so every page"
    Write-Host " request will 404. This usually means tools\ isn't sitting"
    Write-Host " directly inside the vincentdenil-site repo, or vTinyShell.bat"
    Write-Host " and vTinyShell.ps1 got separated. Close this window and check"
    Write-Host " that tools\vTinyShell.bat lives at <repo root>\tools\vTinyShell.bat."
    Write-Host ""
}
Write-Host " Serving this folder now: $StartUrl"
Write-Host ""
Write-Host " WHAT THIS IS"
Write-Host "   A local static file server so any page in this repo can be opened"
Write-Host "   over a real http:// origin instead of file://. It also runs a"
Write-Host "   small /api/comments endpoint that writes straight to disk, the"
Write-Host "   same backend used by the Ops Wiki's comment feature in vdn-roadmap."
Write-Host ""
Write-Host " USING IT FOR COMMENTS"
Write-Host "   The backend (GET/POST /api/comments, POST /api/upload-image, POST"
Write-Host "   /api/reveal) is wired up on every page under /docs/ via"
Write-Host "   assets/tinyshell-comments.js. Select any text on one of those"
Write-Host "   pages to leave a comment. Add the same <script> tag to another"
Write-Host "   page to make it commentable too -- it talks to this same API"
Write-Host "   automatically."
Write-Host ""
Write-Host " HOW IT SAVES (once a page uses the API)"
Write-Host "   Comments are written straight to disk, automatically:"
Write-Host "     feedback\comments.json   (structured)"
Write-Host "     feedback\comments.md     (plain text, readable)"
Write-Host "     feedback\images\         (attached images)"
Write-Host "   comments.json/.md are overwritten in full each time a comment is"
Write-Host "   added, edited, or deleted."
Write-Host ""
Write-Host " WHEN YOU'RE DONE"
Write-Host "   Leave this window open while you're using the site -- closing it"
Write-Host "   (or Ctrl+C) stops the server. Nothing is sent anywhere; it all"
Write-Host "   stays on this machine."
Write-Host "===================================================================="
Write-Host ""

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"; ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css"; ".js" = "application/javascript"; ".json" = "application/json"
    ".png"  = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"; ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"
    ".webp" = "image/webp"; ".bmp" = "image/bmp"
    ".pdf"  = "application/pdf"; ".txt" = "text/plain"
    ".woff" = "font/woff"; ".woff2" = "font/woff2"; ".ttf" = "font/ttf"
}

# PowerShell 5.1's ConvertTo-Json collapses 0- and 1-item arrays unless guarded.
function ConvertTo-JsonArraySafe($Items) {
    $Arr = @($Items)
    if ($Arr.Count -eq 0) { return "[]" }
    if ($Arr.Count -eq 1) { return "[" + ($Arr[0] | ConvertTo-Json -Depth 20) + "]" }
    return ($Arr | ConvertTo-Json -Depth 20)
}

function Write-JsonResponse($Response, $Text, $StatusCode = 200) {
    $Response.StatusCode = $StatusCode
    $Response.ContentType = "application/json; charset=utf-8"
    $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $Response.ContentLength64 = $Bytes.Length
    $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
}

while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response
    try {
        $UrlPath = [System.Uri]::UnescapeDataString($Request.Url.AbsolutePath)

        if ($UrlPath -eq "/api/comments" -and $Request.HttpMethod -eq "GET") {
            if (Test-Path $CommentsJsonPath -PathType Leaf) {
                Write-JsonResponse $Response ([System.IO.File]::ReadAllText($CommentsJsonPath))
            } else {
                Write-JsonResponse $Response "[]"
            }
            $Response.Close()
            continue
        }

        if ($UrlPath -eq "/api/comments" -and $Request.HttpMethod -eq "POST") {
            $Reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
            $BodyText = $Reader.ReadToEnd()
            $Reader.Close()
            $Body = $BodyText | ConvertFrom-Json

            $Json = ConvertTo-JsonArraySafe $Body.comments
            New-Item -ItemType Directory -Force -Path $FeedbackDir | Out-Null
            [System.IO.File]::WriteAllText($CommentsJsonPath, $Json, [System.Text.Encoding]::UTF8)
            [System.IO.File]::WriteAllText($CommentsMdPath, [string]$Body.exportText, [System.Text.Encoding]::UTF8)

            $Count = @($Body.comments).Count
            Write-Host " [$(Get-Date -Format 'HH:mm:ss')] Saved -- $Count comment(s) on disk (feedback\comments.json)"

            Write-JsonResponse $Response '{"ok":true}'
            $Response.Close()
            continue
        }

        if ($UrlPath -eq "/api/upload-image" -and $Request.HttpMethod -eq "POST") {
            $Reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
            $BodyText = $Reader.ReadToEnd()
            $Reader.Close()
            try {
                $Body = $BodyText | ConvertFrom-Json
                $Bytes = [System.Convert]::FromBase64String([string]$Body.dataBase64)
            } catch {
                Write-JsonResponse $Response '{"ok":false,"error":"bad payload"}' 400
                $Response.Close()
                continue
            }
            if ($Bytes.Length -gt $MaxImageBytes) {
                Write-JsonResponse $Response '{"ok":false,"error":"too large"}' 413
                $Response.Close()
                continue
            }
            New-Item -ItemType Directory -Force -Path $ImagesDir | Out-Null
            $OrigName = [System.IO.Path]::GetFileName([string]$Body.filename)
            $Ext = [System.IO.Path]::GetExtension($OrigName).ToLower()
            if ($AllowedImageExt -notcontains $Ext) { $Ext = ".png" }
            $Stem = [System.IO.Path]::GetFileNameWithoutExtension($OrigName) -replace '[^A-Za-z0-9_-]+', '-'
            $Stem = $Stem.Trim('-')
            if (-not $Stem) { $Stem = "image" }
            $Name = "{0}-{1}{2}" -f [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds(), $Stem, $Ext
            $Dest = Join-Path $ImagesDir $Name
            [System.IO.File]::WriteAllBytes($Dest, $Bytes)
            $RelUrl = "/feedback/images/$Name"
            Write-JsonResponse $Response (@{ ok = $true; url = $RelUrl } | ConvertTo-Json -Compress)
            $Response.Close()
            continue
        }

        if ($UrlPath -eq "/api/reveal" -and $Request.HttpMethod -eq "POST") {
            New-Item -ItemType Directory -Force -Path $FeedbackDir | Out-Null
            try {
                Start-Process explorer.exe -ArgumentList $FeedbackDir
                Write-JsonResponse $Response '{"ok":true}'
            } catch {
                Write-JsonResponse $Response '{"ok":false,"error":"failed to open"}' 500
            }
            $Response.Close()
            continue
        }

        if ($UrlPath -eq "/") { $UrlPath = "/index.html" }
        $RelativePath = $UrlPath.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar
        $FullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $RelativePath))

        # Never serve anything outside this folder
        if (-not $FullPath.StartsWith($RootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $Response.StatusCode = 403
            $Response.Close()
            continue
        }

        if (Test-Path $FullPath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FullPath).ToLower()
            $ContentType = $MimeTypes[$Ext]
            if (-not $ContentType) { $ContentType = "application/octet-stream" }
            $Bytes = [System.IO.File]::ReadAllBytes($FullPath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            $Response.StatusCode = 404
            $Msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $UrlPath")
            $Response.OutputStream.Write($Msg, 0, $Msg.Length)
        }
    } catch {
        try { $Response.StatusCode = 500 } catch {}
    } finally {
        try { $Response.Close() } catch {}
    }
}
