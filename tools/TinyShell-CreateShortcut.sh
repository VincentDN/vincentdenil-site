#!/usr/bin/env bash
# TinyShell 🐚 — run this once (Linux desktops only) to add a "TinyShell"
# launcher to your Desktop, with the shell-emoji icon, so you don't need to
# dig into this tools/ folder every time. macOS/Windows: use TinyShell.bat's
# own shortcut creator, or just launch TinyShell.sh/.bat directly.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DESKTOP="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
mkdir -p "$DESKTOP"

cat > "$DESKTOP/TinyShell.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=TinyShell 🐚
Comment=Local server + comment API
Exec="$SCRIPT_DIR/TinyShell.sh"
Icon=$SCRIPT_DIR/TinyShell.png
Terminal=true
Categories=Development;
EOF
chmod +x "$DESKTOP/TinyShell.desktop"

echo "Desktop shortcut created: $DESKTOP/TinyShell.desktop"
echo "You may need to right-click it and choose 'Allow Launching' the first time."
