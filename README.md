# vincentdenil-site
Simple static portfolio site I made for my homepage http://vincentdenil.com/

## Internal contribution rules

See [AGENTS.md](AGENTS.md) for the repository's project and experiment rules. Every project must be linked from its most fitting index and remain link-only, with `seo_hidden` set to `true` and a robots `noindex` tag. Index entries, destinations, and listing counts must stay in sync with page changes.

## TinyShell 🐚 (local dev server + commenting)

`tools/TinyShell.bat` (Windows) / `tools/TinyShell.sh` (Mac/Linux, needs python3) starts a local static file server at `http://localhost:8000/` (opens `/projects/`) with a small built-in comment API (`/api/comments`, `/api/upload-image`, `/api/reveal`) — comments save to `feedback/` on disk. It's the same tool that powers comments on the Ops Wiki in the `vdn-roadmap` repo. Run `tools/TinyShell.py` directly, or double-click the `.bat`/`.sh` launcher for your platform. Run `tools/TinyShell-CreateShortcut.bat` (Windows) or `.sh` (Linux) once to add a desktop shortcut with the 🐚 icon.

`assets/tinyshell-comments.js` is the select-text-and-comment widget (highlight, note, edit, image attachments, export) — a generalized, drop-in port of the same feature from `ops-wiki/FMP_VA_Wiki.html` in `vdn-roadmap`. It's wired up to all 32 pages under `/docs/` (the Walking Through Google Search series): each page tags its own comments with its URL, so one shared `feedback/comments.json` holds comments from every page while each page only shows and highlights its own. Add `<script src="/assets/tinyshell-comments.js" defer></script>` before `</body>` to enable it on any other page.
