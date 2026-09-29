# vincentdenil-site
Simple static portfolio site I made for my homepage http://vincentdenil.com/

## Internal contribution rules

See [AGENTS.md](AGENTS.md) for the repository's project and experiment rules. Every project must be linked from its most fitting index and remain link-only, with `seo_hidden` set to `true` and a robots `noindex` tag. Index entries, destinations, and listing counts must stay in sync with page changes.

## TinyShell 🐚 (local dev server)

`tools/TinyShell.bat` (Windows) / `tools/TinyShell.sh` (Mac/Linux, needs python3) starts a local static file server at `http://localhost:8000/` with a small built-in comment API (`/api/comments`, `/api/upload-image`, `/api/reveal`) — comments save to `feedback/` on disk. It's the same tool that powers comments on the Ops Wiki in the `vdn-roadmap` repo; this copy's backend works the same way, but no page here has the select-text-and-comment widget wired up to it yet. Run `tools/TinyShell.py` directly, or double-click the `.bat`/`.sh` launcher for your platform — it starts the server and opens the site. Run `tools/TinyShell-CreateShortcut.bat` (Windows) or `.sh` (Linux) once to add a desktop shortcut with the 🐚 icon.
