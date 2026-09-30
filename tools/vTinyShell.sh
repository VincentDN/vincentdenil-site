#!/usr/bin/env bash
# vTinyShell — local static file server (Mac/Linux; use vTinyShell.bat on Windows).
# Lives in tools/, but serves the repo root at http://localhost:8000/ over a
# real http:// origin instead of file://, and saves comments straight to
# feedback/ on disk.
set -e
cd "$(dirname "$0")"

PYTHON=$(command -v python3 || command -v python || true)
if [ -z "$PYTHON" ]; then
  echo "Python 3 is required (not found on PATH). Install it, or ask Claude for a non-Python version."
  exit 1
fi

# The Python script itself opens the browser and prints the how-to guide.
exec "$PYTHON" "vTinyShell.py"
