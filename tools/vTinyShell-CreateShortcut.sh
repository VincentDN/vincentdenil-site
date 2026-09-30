#!/usr/bin/env bash
# vTinyShell — run this once (Linux desktops only) to add a "vTinyShell"
# launcher to your Desktop, so you don't need to dig into this tools/
# folder every time. macOS/Windows: use vTinyShell.bat's own shortcut
# creator, or just launch vTinyShell.sh/.bat directly.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DESKTOP="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
mkdir -p "$DESKTOP"

cat > "$DESKTOP/vTinyShell.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=vTinyShell
Comment=Local server + comment API
Exec="$SCRIPT_DIR/vTinyShell.sh"
Terminal=true
Categories=Development;
EOF
chmod +x "$DESKTOP/vTinyShell.desktop"

echo "Desktop shortcut created: $DESKTOP/vTinyShell.desktop"
echo "You may need to right-click it and choose 'Allow Launching' the first time."
