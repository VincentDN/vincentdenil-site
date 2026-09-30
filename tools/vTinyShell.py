#!/usr/bin/env python3
"""vTinyShell — local static file server with a built-in comment API.

Lives in tools/, but serves the repo root at http://localhost:8000/ over a
real http:// origin (some browser features, including this comment API,
don't work reliably over file://), and saves comments straight to
feedback/ on disk via a small /api/comments endpoint. Double-click this
file (if .py is set to open with Python), or run tools/vTinyShell.sh /
`python3 tools/vTinyShell.py`.

This is the same tool used in the vdn-roadmap repo (there it powers
comments on the Ops Wiki). The select-text-and-comment widget itself is
assets/tinyshell-comments.js, wired up to every page under /docs/. See
the printed guide below.
"""
import base64
import json
import re
import subprocess
import sys
import time
import http.server
import socketserver
import threading
import webbrowser
from pathlib import Path

PORT = 8000
ROOT = Path(__file__).resolve().parent.parent
FEEDBACK_DIR = ROOT / "feedback"
IMAGES_DIR = FEEDBACK_DIR / "images"
COMMENTS_JSON = FEEDBACK_DIR / "comments.json"
COMMENTS_MD = FEEDBACK_DIR / "comments.md"
START_URL = f"http://localhost:{PORT}/projects/"

ALLOWED_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"}
MAX_IMAGE_BYTES = 15 * 1024 * 1024


def safe_image_name(original):
    """Turn a client-supplied filename into a safe, collision-free name inside IMAGES_DIR."""
    original = (original or "image").replace("\\", "/").rsplit("/", 1)[-1]
    stem, dot, ext = original.rpartition(".")
    ext = ("." + ext.lower()) if dot else ""
    if ext not in ALLOWED_IMAGE_EXTS:
        ext = ".png"
    stem = re.sub(r"[^A-Za-z0-9_-]+", "-", stem or "image").strip("-") or "image"
    return f"{int(time.time() * 1000)}-{stem}{ext}"


def open_in_file_manager(path):
    if sys.platform == "darwin":
        subprocess.Popen(["open", str(path)])
    elif sys.platform.startswith("win"):
        subprocess.Popen(["explorer", str(path)])
    else:
        subprocess.Popen(["xdg-open", str(path)])

GUIDE = f"""
════════════════════════════════════════════════════════════════
 vTinyShell — local server + comment API for vincentdenil-site
════════════════════════════════════════════════════════════════
 Serving this folder now: {START_URL}

 WHAT THIS IS
   A local static file server so any page in this repo can be opened
   over a real http:// origin instead of file://. It also runs a small
   /api/comments endpoint that writes straight to disk, the same
   backend used by the Ops Wiki's comment feature in vdn-roadmap.

 USING IT FOR COMMENTS
   The backend (GET/POST /api/comments, POST /api/upload-image, POST
   /api/reveal) is wired up on every page under /docs/ via
   assets/tinyshell-comments.js. Select any text on one of those pages
   to leave a comment. Add the same <script> tag to another page to
   make it commentable too — it talks to this same API automatically.

 HOW IT SAVES (once a page uses the API)
   Comments are written straight to disk, automatically:
     {COMMENTS_JSON.relative_to(ROOT)}   (structured)
     {COMMENTS_MD.relative_to(ROOT)}      (plain text, readable)
     {IMAGES_DIR.relative_to(ROOT)}/           (attached images)
   comments.json/.md are overwritten in full each time a comment is
   added, edited, or deleted.

 WHEN YOU'RE DONE
   Leave this window open while you're using the site - closing it
   (or Ctrl+C) stops the server. Nothing is sent anywhere; it all
   stays on this machine.
════════════════════════════════════════════════════════════════
"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        # keep default stdout logging, just quieter for static assets
        if self.path.startswith("/api/"):
            super().log_message(fmt, *args)

    def _send_json(self, text, status=200):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/comments":
            if COMMENTS_JSON.is_file():
                self._send_json(COMMENTS_JSON.read_text(encoding="utf-8"))
            else:
                self._send_json("[]")
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/comments":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8")
            try:
                body = json.loads(raw)
            except json.JSONDecodeError:
                self._send_json('{"ok":false,"error":"bad json"}', status=400)
                return
            FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
            COMMENTS_JSON.write_text(
                json.dumps(body.get("comments", []), indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            COMMENTS_MD.write_text(body.get("exportText", ""), encoding="utf-8")
            count = len(body.get("comments", []))
            print(f"[{time.strftime('%H:%M:%S')}] Saved -- {count} comment(s) on disk "
                  f"({COMMENTS_JSON.relative_to(ROOT)})")
            self._send_json('{"ok":true}')
            return

        if self.path == "/api/upload-image":
            length = int(self.headers.get("Content-Length", 0))
            if length > MAX_IMAGE_BYTES * 4 // 3 + 4096:
                self._send_json('{"ok":false,"error":"too large"}', status=413)
                return
            raw = self.rfile.read(length).decode("utf-8")
            try:
                body = json.loads(raw)
                data = base64.b64decode(body["dataBase64"], validate=True)
            except Exception:
                self._send_json('{"ok":false,"error":"bad payload"}', status=400)
                return
            if len(data) > MAX_IMAGE_BYTES:
                self._send_json('{"ok":false,"error":"too large"}', status=413)
                return
            IMAGES_DIR.mkdir(parents=True, exist_ok=True)
            name = safe_image_name(body.get("filename"))
            dest = (IMAGES_DIR / name).resolve()
            if IMAGES_DIR.resolve() not in dest.parents:
                self._send_json('{"ok":false,"error":"bad name"}', status=400)
                return
            dest.write_bytes(data)
            url = "/" + dest.relative_to(ROOT).as_posix()
            self._send_json(json.dumps({"ok": True, "url": url}))
            return

        if self.path == "/api/reveal":
            FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
            try:
                open_in_file_manager(FEEDBACK_DIR)
                self._send_json('{"ok":true}')
            except Exception as e:
                self._send_json(json.dumps({"ok": False, "error": str(e)}), status=500)
            return

        self.send_response(404)
        self.end_headers()


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


if __name__ == "__main__":
    FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
    with ThreadingServer(("127.0.0.1", PORT), Handler) as httpd:
        print(GUIDE)
        # give the server a moment to be ready before the browser requests it
        threading.Timer(0.8, lambda: webbrowser.open(START_URL)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
